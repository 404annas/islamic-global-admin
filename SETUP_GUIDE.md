# Admin Dashboard Setup Guide 📚

Complete step-by-step guide to set up and deploy the Islamic Global Admin Dashboard.

## Prerequisites

- **Node.js**: v16 or higher
- **npm**: v7 or higher (or yarn)
- **Backend Server**: Running on http://localhost:8000
- **MongoDB**: Connected to backend
- **Git**: For version control

## 🎯 Setup Instructions

### Step 1: Project Setup

```bash
# Navigate to admin dashboard directory
cd admin-dashboard

# Install all dependencies
npm install

# Or if using yarn
yarn install
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp .env.example .env
```

**Edit `.env` file with your configuration:**
```
# Backend API Configuration
VITE_API_URL=http://localhost:8000

# Application Info (Optional)
VITE_APP_NAME=Islamic Global Admin Dashboard
VITE_APP_VERSION=1.0.0
```

### Step 3: Backend API Setup

Ensure your backend has these routes configured:

**Admin Authentication**:
```
POST /api/admin/login
POST /api/admin/logout
```

**User Management**:
```
GET /api/admin/users
GET /api/admin/users/:userId
PATCH /api/admin/users/:userId/status
PATCH /api/admin/users/:userId/block
PATCH /api/admin/users/:userId/payment
```

**Progress Tracking**:
```
GET /api/admin/users/:userId/progress
POST /api/admin/users/:userId/progress
```

**Analytics**:
```
GET /api/admin/analytics
GET /api/admin/dashboard/stats
```

### Step 4: Backend CORS Configuration

Update your Express backend `app.js` to include admin dashboard:

```javascript
const allowedOrigins = [
  'http://localhost:5173',      // Frontend
  'http://localhost:5174',      // Admin Dashboard
  'https://your-frontend-domain.com',
  'https://your-admin-domain.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

### Step 5: Admin User Creation

Create an admin account in your MongoDB database:

```javascript
// In your backend
const adminUser = {
  email: "admin@islamic-global.com",
  password: "hashedPassword", // Use bcryptjs to hash
  role: "admin",
  fullName: "Admin User",
  createdAt: new Date()
};

// Save to User collection
```

Or use your backend's registration endpoint with admin role.

### Step 6: Start Development Server

```bash
# From admin-dashboard directory
npm run dev

# Or with yarn
yarn dev
```

Visit: `http://localhost:5174`

**You should see:**
- Login page with Islamic Global branding
- Email and password fields
- Admin portal heading

## 🔐 Admin Login Credentials

Use the admin account created in Step 5:

```
Email: admin@islamic-global.com
Password: [Your secure password]
```

## 🚀 Development Workflow

### Running the Dashboard

```bash
# Start dev server
npm run dev

# The app will open at http://localhost:5174
# Hot module replacement enabled - changes auto-reflect
```

### Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview

# Output will be in /dist directory
```

## 📱 Testing Responsive Design

Use your browser's developer tools:

1. **Mobile** (375px): iPhone SE
2. **Tablet** (768px): iPad
3. **Desktop** (1920px): Full screen

Key responsive breakpoints:
- Sidebar: Hidden on mobile, visible on md+ (768px)
- Mobile menu: Shows hamburger icon on mobile
- Table: Horizontal scroll on small screens

## 🔗 API Integration Testing

### Test Login Endpoint

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@islamic-global.com","password":"password"}'
```

Expected response:
```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "email": "admin@islamic-global.com",
  "role": "admin"
}
```

### Test Users Endpoint

```bash
curl -X GET http://localhost:8000/api/admin/users?page=1&limit=10 \
  -H "Authorization: Bearer jwt_token_here"
```

Expected response:
```json
{
  "users": [
    {
      "_id": "user_id",
      "fullName": "User Name",
      "email": "user@example.com",
      "status": "active",
      "paymentStatus": "paid",
      "isBlocked": false,
      "createdAt": "2024-01-31T00:00:00Z"
    }
  ],
  "total": 100,
  "totalPages": 10,
  "currentPage": 1
}
```

## 🎨 Customization

### Change Color Scheme

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      secondary: '#YOUR_COLOR',
      accent: '#YOUR_COLOR',
      // ...
    }
  },
}
```

### Add New Menu Items

Edit `src/components/Sidebar.jsx`:

```javascript
const menuItems = [
  // ... existing items
  {
    id: 'new-page',
    label: 'New Page',
    icon: YourIcon,
    path: '/dashboard/new-page'
  }
];
```

Create new page in `src/pages/NewPage.jsx` and add route in `src/App.jsx`.

### Customize Dashboard Layout

Edit `src/components/DashboardLayout.jsx` to adjust sidebar width percentage:

```javascript
{/* Sidebar - Change md:w-1/4 to your desired width */}
<div className="hidden md:block md:w-1/4 bg-white">
  <Sidebar />
</div>

{/* Main Content - Adjust flex-1 accordingly */}
<div className="flex-1 flex flex-col overflow-hidden">
  {/* ... */}
</div>
```

## 🐛 Common Issues & Solutions

### Issue: API Connection Failed

**Solution:**
```bash
# 1. Verify backend is running
# 2. Check .env file has correct API_URL
# 3. Check CORS configuration in backend
# 4. Check network tab in DevTools for errors
```

### Issue: Login Not Working

**Solution:**
```bash
# 1. Verify admin credentials are correct
# 2. Check backend /api/admin/login endpoint
# 3. Verify JWT tokens are being returned
# 4. Check browser console for errors
```

### Issue: Styles Not Loading

**Solution:**
```bash
# 1. Rebuild Tailwind CSS cache
npm run dev -- --force

# 2. Clear node_modules and reinstall
rm -rf node_modules
npm install

# 3. Restart dev server
npm run dev
```

### Issue: RTK Query Cache Issues

**Solution:**
```bash
# In browser DevTools console:
localStorage.clear();
// Then refresh the page
```

## 📦 Deployment Guide

### Deploy to Vercel

1. **Connect GitHub Repository**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Configure Vercel**:
   - Go to vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Set environment variables (VITE_API_URL)
   - Click "Deploy"

3. **Update Backend CORS**:
```javascript
// Add your Vercel domain to allowed origins
const allowedOrigins = [
  // ...
  'https://your-admin-dashboard.vercel.app'
];
```

### Deploy to Other Platforms

The build output in `/dist` can be deployed to:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Heroku
- Any static hosting service

```bash
# Build for production
npm run build

# Contents of /dist can be deployed anywhere
```

## 🔄 Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Or update specific package
npm install package-name@latest
```

## 📊 Performance Optimization

The dashboard includes several optimizations:

- **RTK Query Caching**: Automatic cache management
- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Responsive images
- **CSS Purging**: Unused Tailwind classes removed in production
- **Tree Shaking**: Dead code elimination

Build size: ~150KB (gzipped)

## 🔒 Security Considerations

1. **Never expose API keys** in version control
2. **Use environment variables** for sensitive data
3. **Implement rate limiting** on backend
4. **Validate all user inputs** on backend
5. **Use HTTPS** in production
6. **Rotate JWT secrets** regularly
7. **Implement CSRF protection**

## 📝 Logging & Monitoring

Add logging to track issues:

```javascript
// In src/store/api/adminApi.js
console.log('[RTK Query] Fetching:', url);
console.log('[RTK Query] Response:', data);
console.log('[RTK Query] Error:', error);
```

## 🤝 Team Collaboration

1. **Clone repository**:
```bash
git clone your-repo-url
cd admin-dashboard
npm install
```

2. **Create feature branch**:
```bash
git checkout -b feature/your-feature-name
```

3. **Make changes and commit**:
```bash
git add .
git commit -m "Add new feature"
git push origin feature/your-feature-name
```

4. **Create Pull Request** on GitHub

## 📞 Support & Troubleshooting

For issues:
1. Check console for error messages
2. Verify backend API endpoints
3. Check network requests in DevTools
4. Review logs in console
5. Contact development team

## ✅ Pre-Launch Checklist

- [ ] All API endpoints tested and working
- [ ] Admin credentials created
- [ ] Environment variables configured
- [ ] CORS properly set up
- [ ] SSL certificates installed (production)
- [ ] Database backups configured
- [ ] Monitoring/logging enabled
- [ ] Documentation updated
- [ ] User roles tested
- [ ] Responsive design verified on all devices

---

**Dashboard Ready for Production! 🎉**
