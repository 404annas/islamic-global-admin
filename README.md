# Islamic Global Admin Dashboard 🎯

A professional, modern, and fully responsive admin dashboard built with React, Vite, Redux Toolkit, and RTK Query for managing the Islamic Global Institute platform.

## ✨ Features

### Dashboard Management
- **Real-time Analytics**: Track user metrics, course progress, and platform statistics
- **User Management**: Complete CRUD operations for users with advanced filtering
- **Progress Tracking**: Monitor and update individual user course progress
- **Quick Stats**: Display active users, enrollments, and system health status

### User Management
- List all users with pagination and search functionality
- Filter users by status (active, inactive, blocked)
- View detailed user information in modal
- Update user status (active/inactive/pending)
- Block/Unblock users
- Manage payment status
- Track user progress and learning history

### Admin Features
- Secure authentication with JWT tokens
- Protected routes and session management
- Responsive design (mobile, tablet, desktop)
- Real-time data synchronization with backend
- Professional UI with lucide-react icons
- Dark/Light theme ready
- Advanced RTK Query caching

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 7.3.1
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS v3.4.14
- **HTTP Client**: Axios (via RTK Query)
- **Routing**: React Router v6.27.0
- **Icons**: Lucide React v0.563.0
- **Date Formatting**: date-fns v4.1.0

## 📋 Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.jsx      # Main layout wrapper
│   │   ├── Sidebar.jsx              # Navigation sidebar
│   │   ├── TopBar.jsx               # Top navigation bar
│   │   ├── StatsCard.jsx            # Statistics card component
│   │   ├── LoadingSpinner.jsx       # Loading indicator
│   │   ├── UserTable.jsx            # Users table display
│   │   ├── UserModal.jsx            # User detail modal
│   │   └── ProtectedRoute.jsx       # Route protection wrapper
│   ├── pages/
│   │   ├── Login.jsx                # Admin login page
│   │   ├── Dashboard.jsx            # Main dashboard overview
│   │   ├── Users.jsx                # User management page
│   │   ├── Analytics.jsx            # Analytics dashboard
│   │   └── Settings.jsx             # Platform settings
│   ├── store/
│   │   ├── api/
│   │   │   └── adminApi.js          # RTK Query API endpoints
│   │   ├── slices/
│   │   │   └── authSlice.js         # Authentication state
│   │   └── store.js                 # Redux store configuration
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
└── package.json                     # Dependencies

```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend server running (default: http://localhost:8000)

### Installation

1. **Clone or navigate to the admin dashboard directory**:
```bash
cd admin-dashboard
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`**:
```
VITE_API_URL=http://localhost:8000
```

5. **Start the development server**:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:5174`

## 📡 API Integration

### Backend API Endpoints

The dashboard communicates with the following backend endpoints:

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

#### User Management
- `GET /api/admin/users` - List all users (with pagination, search, filters)
- `GET /api/admin/users/:userId` - Get user details
- `PATCH /api/admin/users/:userId/status` - Update user status
- `PATCH /api/admin/users/:userId/block` - Block/unblock user
- `PATCH /api/admin/users/:userId/payment` - Update payment status

#### Progress Tracking
- `GET /api/admin/users/:userId/progress` - Get user progress
- `POST /api/admin/users/:userId/progress` - Create/update progress report

#### Analytics
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### RTK Query Setup

The dashboard uses RTK Query for efficient data fetching, caching, and synchronization. All API calls are configured in `/src/store/api/adminApi.js`.

**Key Features**:
- Automatic caching and invalidation
- Real-time refetching capabilities
- Loading and error states
- Request deduplication
- Background refetching

## 🎨 Design & Customization

### Color Scheme
The dashboard follows a professional color palette:
- **Primary**: `#1F4A3D` (Dark Teal)
- **Secondary**: `#2D6A52` (Forest Green)
- **Accent**: `#E8B887` (Warm Gold)
- **Light**: `#F5F5F5` (Off White)
- **Dark**: `#1A1A1A` (Near Black)

### Tailwind CSS v3
All styling uses Tailwind CSS utility classes with custom theme configuration. Customize colors in `tailwind.config.js`.

### Responsive Design
- **Mobile** (< 768px): Single column, mobile-optimized layout
- **Tablet** (768px - 1024px): Two-column layout
- **Desktop** (> 1024px): Full 25-75 sidebar-content split

## 🔐 Authentication

### Login Flow
1. Admin enters email and password
2. Credentials sent to backend via `POST /api/admin/login`
3. Backend returns access token and refresh token
4. Tokens stored in localStorage
5. Protected routes check authentication status
6. Automatic token refresh on expiry

### Token Management
- Access token: Stored in localStorage with key `adminAccessToken`
- Refresh token: Stored in localStorage with key `adminRefreshToken`
- Automatic token injection in API request headers

## 🔄 Data Flow

```
User Action
    ↓
React Component State Update
    ↓
Redux Action Dispatch
    ↓
RTK Query API Call
    ↓
Backend API Request
    ↓
Response Received
    ↓
Redux Store Update + Cache
    ↓
Component Re-render
```

## 🚢 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1024px
- **Desktop**: 1025px+

The 25-75 layout is implemented as:
- Desktop: Sidebar 25% (fixed) + Content 75% (flexible)
- Tablet: Full width with mobile menu
- Mobile: Full width with hamburger menu

## ✅ Key Features Implementation

### Dashboard Overview
- Real-time statistics cards
- Quick stats summary
- System health indicators
- User growth visualization

### User Management
- Pagination with dynamic page navigation
- Real-time search filtering
- Status and payment filtering
- Bulk operations support
- User modal with detailed information

### User Modal Actions
- View full user profile
- Update user status
- Block/Unblock functionality
- Payment status management
- Update user progress
- Add progress notes

### Analytics Dashboard
- User distribution charts
- Course completion rates
- Enrollment statistics
- Growth trends visualization

### Settings Page
- General platform configuration
- Email settings management
- User registration controls
- Maintenance mode toggle
- System information display

## 🐛 Error Handling

- Network error messages displayed to users
- Validation errors from backend shown in modals
- Automatic error clearing after 3 seconds
- Loading states prevent duplicate submissions
- Failed API calls cached for retry

## 🔒 Security Best Practices

- JWT token-based authentication
- Protected routes with auth check
- Credentials included in requests (`credentials: 'include'`)
- XSS protection via React auto-escaping
- CSRF token handling via backend
- Secure logout with token removal

## 📦 Dependencies Overview

| Package | Purpose |
|---------|---------|
| react | UI library |
| react-dom | React rendering |
| react-router-dom | Client-side routing |
| @reduxjs/toolkit | State management |
| @reduxjs/toolkit/query/react | Data fetching & caching |
| react-redux | Redux bindings |
| lucide-react | Icon library |
| date-fns | Date formatting |
| axios | HTTP client (via RTK Query) |
| tailwindcss | Utility-first CSS |
| vite | Build tool & dev server |

## 🤝 Integration with Backend

This admin dashboard works seamlessly with the Islamic Global Institute backend. Ensure:

1. Backend is running on configured API_URL
2. CORS is properly configured to allow admin dashboard requests
3. Admin user exists in backend database
4. API endpoints match the documented routes
5. JWT tokens are properly signed and validated

## 📞 Support & Contribution

For issues, feature requests, or contributions, please contact the development team.

## 📄 License

This project is part of the Islamic Global Institute platform.

---

**Built with ❤️ for Islamic Global Institute**
