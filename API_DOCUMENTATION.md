# Admin Dashboard API Documentation 📡

Complete API endpoint reference and integration guide for the Islamic Global Admin Dashboard.

## Base URL

```
Development: http://localhost:8000
Production: https://your-backend-domain.com
```

## Authentication

All endpoints (except login) require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

Token is stored in localStorage as `adminAccessToken`.

---

## Authentication Endpoints

### Admin Login

**Endpoint**: `POST /api/admin/login`

**Description**: Authenticate admin and receive tokens

**Request Body**:
```json
{
  "email": "admin@islamic-global.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@islamic-global.com",
  "role": "admin",
  "message": "Login successful"
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Admin Logout

**Endpoint**: `POST /api/admin/logout`

**Description**: Logout admin and invalidate tokens

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Management Endpoints

### List All Users

**Endpoint**: `GET /api/admin/users`

**Description**: Retrieve paginated list of all users with optional filters

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Search by name, email, or phone |
| status | string | No | Filter by status: active, inactive, blocked, pending |

**Example Request**:
```
GET /api/admin/users?page=1&limit=10&search=john&status=active
```

**Response** (200 OK):
```json
{
  "success": true,
  "users": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "active",
      "paymentStatus": "paid",
      "isBlocked": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-31T15:45:00Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+0987654321",
      "status": "active",
      "paymentStatus": "unpaid",
      "isBlocked": false,
      "createdAt": "2024-01-20T12:00:00Z",
      "updatedAt": "2024-01-30T08:20:00Z"
    }
  ],
  "total": 150,
  "totalPages": 15,
  "currentPage": 1
}
```

**Error Response** (401/500):
```json
{
  "success": false,
  "message": "Unauthorized or Server error"
}
```

---

### Get User Details

**Endpoint**: `GET /api/admin/users/:userId`

**Description**: Get detailed information about a specific user

**Path Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| userId | string | Yes |

**Example Request**:
```
GET /api/admin/users/65a1b2c3d4e5f6g7h8i9j0k1
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "status": "active",
    "paymentStatus": "paid",
    "isBlocked": false,
    "enrolledCourses": [
      "Quran Basics",
      "Arabic Grammar"
    ],
    "completedCourses": [
      "Islamic History"
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-31T15:45:00Z"
  }
}
```

---

### Update User Status

**Endpoint**: `PATCH /api/admin/users/:userId/status`

**Description**: Update user's account status

**Path Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| userId | string | Yes |

**Request Body**:
```json
{
  "status": "active"
}
```

**Status Values**: `active`, `inactive`, `pending`, `blocked`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User status updated to active",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "status": "active"
  }
}
```

---

### Update Block Status

**Endpoint**: `PATCH /api/admin/users/:userId/block`

**Description**: Block or unblock a user

**Path Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| userId | string | Yes |

**Request Body**:
```json
{
  "isBlocked": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User blocked successfully",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "isBlocked": true
  }
}
```

---

### Update Payment Status

**Endpoint**: `PATCH /api/admin/users/:userId/payment`

**Description**: Update user's payment status

**Path Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| userId | string | Yes |

**Request Body**:
```json
{
  "paymentStatus": "paid"
}
```

**Payment Status Values**: `paid`, `unpaid`, `pending`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment status updated to paid",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "paymentStatus": "paid"
  }
}
```

---

## User Progress Endpoints

### Get User Progress

**Endpoint**: `GET /api/admin/users/:userId/progress`

**Description**: Get learning progress for a specific user

**Path Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| userId | string | Yes |

**Response** (200 OK):
```json
{
  "success": true,
  "progress": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "completedCourses": 2,
    "percentageCompleted": 45,
    "courseName": "Quran Basics",
    "notes": "Progressing well, needs help with tajweed",
    "lastUpdated": "2024-01-31T14:20:00Z",
    "courses": [
      {
        "name": "Islamic History",
        "completedAt": "2024-01-20T00:00:00Z",
        "progress": 100
      },
      {
        "name": "Quran Basics",
        "progress": 45,
        "startedAt": "2024-01-15T00:00:00Z"
      }
    ]
  }
}
```

---

### Create/Update Progress Report

**Endpoint**: `POST /api/admin/users/:userId/progress`

**Description**: Create or update user's progress report

**Path Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| userId | string | Yes |

**Request Body**:
```json
{
  "courseName": "Quran Basics",
  "completedCourses": 2,
  "percentageCompleted": 50,
  "notes": "Student is making good progress"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "progress": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "courseName": "Quran Basics",
    "completedCourses": 2,
    "percentageCompleted": 50,
    "notes": "Student is making good progress",
    "createdAt": "2024-01-31T15:50:00Z"
  }
}
```

---

## Analytics Endpoints

### Get Admin Analytics

**Endpoint**: `GET /api/admin/analytics`

**Description**: Get comprehensive platform analytics

**Response** (200 OK):
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 250,
    "activeUsers": 180,
    "blockedUsers": 5,
    "totalEnrollments": 450,
    "courseCompletionRate": 65,
    "averageProgress": 52,
    "totalCourses": 12,
    "newUsersThisMonth": 32,
    "paidUsers": 150,
    "unpaidUsers": 100
  }
}
```

---

### Get Dashboard Stats

**Endpoint**: `GET /api/admin/dashboard/stats`

**Description**: Get quick dashboard statistics

**Response** (200 OK):
```json
{
  "success": true,
  "stats": {
    "totalUsers": 250,
    "activeUsers": 180,
    "paidUsers": 150,
    "courseProgress": 52,
    "newUsersToday": 5,
    "completionsToday": 2
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error or missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error occurred"
}
```

---

## RTK Query Integration

All endpoints are integrated via RTK Query hooks. Usage examples:

### Query Hooks

```javascript
// Get all users
const { data, isLoading, error } = useListAllUsersQuery({ 
  page: 1, 
  limit: 10 
});

// Get specific user
const { data: user } = useGetUserDetailsQuery(userId);

// Get user progress
const { data: progress } = useGetUserProgressQuery(userId);

// Get analytics
const { data: analytics } = useGetAnalyticsQuery();
```

### Mutation Hooks

```javascript
// Update status
const [updateStatus] = useUpdateUserStatusMutation();
await updateStatus({ userId, status: 'active' });

// Block user
const [updateBlock] = useUpdateBlockStatusMutation();
await updateBlock({ userId, isBlocked: true });

// Update payment
const [updatePayment] = useUpdatePaymentStatusMutation();
await updatePayment({ userId, paymentStatus: 'paid' });

// Create progress
const [createProgress] = useCreateProgressReportMutation();
await createProgress({ userId, progressData: {...} });

// Logout
const [adminLogout] = useAdminLogoutMutation();
await adminLogout();
```

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Auth Endpoint**: 5 failed attempts per 15 minutes triggers lockout

---

## Pagination

Standard pagination response format:

```json
{
  "data": [...],
  "total": 250,
  "totalPages": 25,
  "currentPage": 1,
  "pageSize": 10
}
```

---

## Data Formats

### Date Format
All dates use ISO 8601 format: `2024-01-31T15:50:00Z`

### Status Values
- User Status: `active`, `inactive`, `pending`, `blocked`
- Payment Status: `paid`, `unpaid`, `pending`

### User Object
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "status": "active",
  "paymentStatus": "paid",
  "isBlocked": false,
  "enrolledCourses": ["course1", "course2"],
  "completedCourses": ["course3"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-31T15:45:00Z"
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@islamic-global.com","password":"password"}'
```

### Get Users
```bash
curl -X GET "http://localhost:8000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update User Status
```bash
curl -X PATCH http://localhost:8000/api/admin/users/USER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

---

## Support & Documentation

For more information, refer to:
- Backend API repository
- RTK Query documentation: https://redux-toolkit.js.org/rtk-query
- React documentation: https://react.dev

---

**Last Updated**: January 31, 2024
