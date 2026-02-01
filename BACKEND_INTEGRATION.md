# Backend Integration Guide 🔌

Instructions for integrating the Admin Dashboard with your Islamic Global backend.

## 📋 Prerequisites

Your backend should have:
- Express.js server running
- MongoDB database configured
- User model with admin role support
- JWT authentication implemented
- CORS properly configured
- All required API endpoints

## 🔧 Backend Setup Checklist

### 1. Database User Model Update

Ensure your User model includes:

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  password: String (hashed),
  phone: String,
  status: String, // active, inactive, pending, blocked
  paymentStatus: String, // paid, unpaid, pending
  isBlocked: Boolean,
  enrolledCourses: [String],
  completedCourses: [String],
  role: String, // user, admin
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Progress Model Update

Create a Progress model:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to User),
  courseName: String,
  completedCourses: Number,
  percentageCompleted: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. CORS Configuration

Update your Express app.js:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',              // Frontend dev
  'http://localhost:5174',              // Admin dashboard dev
  'https://your-frontend.vercel.app',   // Production frontend
  'https://your-admin.vercel.app'       // Production admin
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### 4. Add Admin Routes

In your backend `src/routes/admin.routes.js`:

```javascript
import express from 'express';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';
import {
  adminLogin,
  adminLogout,
  listAllUsers,
  getUserDetails,
  updateUserStatus,
  updateBlockStatus,
  updatePaymentStatus,
  getUserProgress,
  createProgressReport,
  getAdminAnalytics,
  getDashboardStats
} from '../controllers/admin.controller.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes - require admin role
router.use(verifyJWT, isAdmin);

router.post('/logout', adminLogout);

// User management
router.get('/users', listAllUsers);
router.get('/users/:userId', getUserDetails);
router.patch('/users/:userId/status', updateUserStatus);
router.patch('/users/:userId/block', updateBlockStatus);
router.patch('/users/:userId/payment', updatePaymentStatus);

// Progress management
router.get('/users/:userId/progress', getUserProgress);
router.post('/users/:userId/progress', createProgressReport);

// Analytics
router.get('/analytics', getAdminAnalytics);
router.get('/dashboard/stats', getDashboardStats);

export default router;
```

In your main `app.js`:

```javascript
import adminRouter from './routes/admin.routes.js';

// ... other routes ...

app.use('/api/admin', adminRouter);
```

### 5. Create Admin Controller

File: `src/controllers/admin.controller.js`

```javascript
import { User } from '../models/user.model.js';
import { Progress } from '../models/progress.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password required' 
      });
    }

    const admin = await User.findOne({ email, role: 'admin' });

    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const accessToken = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: admin._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// List All Users
export const listAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;

    let query = { role: { $ne: 'admin' } };

    // Search filter
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    res.status(200).json({
      success: true,
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update User Status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'pending', 'blocked'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      user
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update Block Status
export const updateBlockStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: isBlocked ? 'User blocked' : 'User unblocked',
      user
    });
  } catch (error) {
    console.error('Update block error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update Payment Status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { paymentStatus } = req.body;

    if (!['paid', 'unpaid', 'pending'].includes(paymentStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment status' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { paymentStatus },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      user
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get User Progress
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: {
          userId,
          completedCourses: 0,
          percentageCompleted: 0
        }
      });
    }

    res.status(200).json({ success: true, progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Create Progress Report
export const createProgressReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseName, completedCourses, percentageCompleted, notes } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { userId },
      { courseName, completedCourses, percentageCompleted, notes },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Progress updated',
      progress
    });
  } catch (error) {
    console.error('Create progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get Admin Analytics
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ 
      role: 'user', 
      status: 'active' 
    });
    const paidUsers = await User.countDocuments({ 
      role: 'user', 
      paymentStatus: 'paid' 
    });
    const totalEnrollments = await User.countDocuments({ 
      enrolledCourses: { $exists: true, $ne: [] } 
    });

    const progressRecords = await Progress.find({});
    const courseCompletionRate = progressRecords.length > 0
      ? Math.round(
          progressRecords.reduce((sum, p) => sum + p.percentageCompleted, 0) /
          progressRecords.length
        )
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        activeUsers,
        paidUsers,
        totalEnrollments,
        courseCompletionRate,
        averageProgress: courseCompletionRate,
        blockedUsers: await User.countDocuments({ isBlocked: true })
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ 
      role: 'user', 
      status: 'active' 
    });
    const paidUsers = await User.countDocuments({ 
      role: 'user', 
      paymentStatus: 'paid' 
    });

    const progressRecords = await Progress.find({});
    const courseProgress = progressRecords.length > 0
      ? Math.round(
          progressRecords.reduce((sum, p) => sum + p.percentageCompleted, 0) /
          progressRecords.length
        )
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        paidUsers,
        courseProgress
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Admin Logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
```

### 6. Add Middleware

File: `src/middlewares/admin.middleware.js`

```javascript
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
```

## ✅ Verification Steps

1. **Start Backend**:
```bash
npm run dev
# Should run on http://localhost:8000
```

2. **Test Login Endpoint**:
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@islamic-global.com","password":"password"}'
```

3. **Create Admin User** (if not exists):
```javascript
// In MongoDB:
db.users.insertOne({
  fullName: "Admin User",
  email: "admin@islamic-global.com",
  password: "hashed_password", // Use bcryptjs to hash
  role: "admin",
  status: "active",
  isBlocked: false,
  createdAt: new Date()
})
```

4. **Test Protected Endpoint**:
```bash
# Use token from login response
curl -X GET http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Common Issues & Solutions

### CORS Error
**Solution**: Check backend CORS configuration includes admin dashboard URL

### 401 Unauthorized
**Solution**: 
- Verify admin account exists
- Check JWT token is valid
- Check Authorization header format

### 404 Not Found
**Solution**: 
- Verify route paths match exactly
- Check admin routes are imported in app.js
- Verify MongoDB collections exist

### 500 Server Error
**Solution**:
- Check backend logs
- Verify MongoDB connection
- Check required fields in request body

## 📦 Environment Variables

Backend `.env` should include:

```
PORT=8000
MONGODB_URI=mongodb+srv://...
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=http://localhost:5174,https://your-admin-domain.com
NODE_ENV=development
```

## 🔐 Security Considerations

1. Always hash passwords with bcryptjs
2. Use HTTPS in production
3. Set secure JWT secrets
4. Implement rate limiting on login
5. Validate all inputs on backend
6. Use httpOnly cookies for refresh tokens
7. Implement proper CORS rules
8. Add request logging and monitoring

## 🚀 Production Deployment

1. Update CORS origins for production domains
2. Set NODE_ENV=production
3. Use environment variables for secrets
4. Enable HTTPS
5. Set up database backups
6. Configure monitoring and logging
7. Implement rate limiting
8. Set up API documentation

---

**Backend Integration Complete! ✅**
