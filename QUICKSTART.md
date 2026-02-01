# Quick Start Guide ⚡

Get the Admin Dashboard up and running in 5 minutes!

## Prerequisites Check

```bash
# Verify Node.js version (need 16+)
node --version

# Verify npm version (need 7+)
npm --version

# Verify backend is running
curl http://localhost:8000/api/admin/users 2>/dev/null || echo "Backend not running"
```

## 1️⃣ Installation (1 minute)

```bash
# Navigate to dashboard directory
cd admin-dashboard

# Install dependencies
npm install
```

## 2️⃣ Configuration (1 minute)

```bash
# Create environment file
cp .env.example .env

# Edit .env if needed (usually works as-is)
# VITE_API_URL=http://localhost:8000
```

## 3️⃣ Start Development (1 minute)

```bash
# Start the dev server
npm run dev

# Dashboard opens at: http://localhost:5174
```

## 4️⃣ Login (1 minute)

**Credentials:**
```
Email: admin@islamic-global.com
Password: [your admin password]
```

## 5️⃣ Explore (1 minute)

✅ Dashboard - View statistics
✅ Users - Manage user accounts
✅ Analytics - View platform metrics
✅ Settings - Configure platform

---

## 🎯 Common Tasks

### View Dashboard Stats
1. Navigate to `/dashboard`
2. See total users, active users, paid users
3. Quick stats and system health

### Manage Users
1. Go to Users section
2. Search by name/email/phone
3. Click user to open details modal
4. Update status, block, or manage payment

### Update User Progress
1. Open user modal
2. Click "Progress" tab
3. Enter course name and percentage
4. Click "Update Progress"

### View Analytics
1. Go to Analytics section
2. See user distribution
3. View course statistics
4. Check growth trends

---

## 🚀 Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview

# Output is in /dist directory
```

---

## 🔧 Troubleshooting

### "Cannot reach backend"
```bash
# Check backend is running
curl http://localhost:8000/api/admin/users

# Update VITE_API_URL in .env if needed
```

### "Login fails"
```bash
# Check admin exists in database
# Verify password is correct
# Check backend logs for errors
```

### "Styles not loading"
```bash
# Restart dev server
npm run dev -- --force

# Or clear cache
rm -rf node_modules/.vite
npm run dev
```

### "RTK Query errors"
```bash
# Clear localStorage
# Open browser DevTools Console
localStorage.clear()

# Refresh page
```

---

## 📱 Test Responsive Design

1. Open DevTools (F12)
2. Click device toolbar icon
3. Select device (iPhone, iPad, etc.)
4. Verify layout adjusts correctly

**Key Breakpoints to Test:**
- Mobile: 375px
- Tablet: 768px
- Desktop: 1920px

---

## 🔐 Security Notes

Never commit `.env` file with sensitive data!

```bash
# Good - excluded in .gitignore
# Bad - committed in git
```

---

## 📊 API Testing

### Quick API Test

```bash
# Get access token
RESPONSE=$(curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@islamic-global.com","password":"password"}')

TOKEN=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# Test API with token
curl -X GET http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main routing |
| `src/pages/Dashboard.jsx` | Dashboard page |
| `src/pages/Users.jsx` | Users management |
| `src/store/api/adminApi.js` | API configuration |
| `.env` | Environment variables |
| `tailwind.config.js` | Styles configuration |

---

## 📚 Documentation

- **Full Setup**: SETUP_GUIDE.md
- **API Reference**: API_DOCUMENTATION.md
- **Component Guide**: PROJECT_INDEX.md
- **Main README**: README.md

---

## ✅ Verification Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Admin account created
- [ ] `npm install` completed successfully
- [ ] `.env` file created with API_URL
- [ ] `npm run dev` started successfully
- [ ] Dashboard accessible at http://localhost:5174
- [ ] Can login with admin credentials
- [ ] Dashboard shows statistics
- [ ] Users page loads and displays users

---

## 🎉 Ready to Go!

Your admin dashboard is now running! 

**Next Steps:**
1. Explore the dashboard
2. Manage users
3. Check analytics
4. Configure settings
5. Deploy when ready

---

## 💡 Pro Tips

- Use browser DevTools Network tab to debug API calls
- Check Redux DevTools Extension for state debugging
- Use Tailwind CSS intelligence plugin in VS Code
- Hot reload works automatically - just save and refresh

---

## 📞 Need Help?

Check these files in order:
1. QUICKSTART.md (this file)
2. SETUP_GUIDE.md
3. API_DOCUMENTATION.md
4. PROJECT_INDEX.md

---

**Happy Admin! 🚀**
