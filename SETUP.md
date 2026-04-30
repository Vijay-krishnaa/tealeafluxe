# Swadistchai - Complete Setup Guide

## Project Structure

```
ecommerce/
├── frontend/          # React/Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx        # User/Admin login
│   │   │   ├── Signup.jsx       # User registration
│   │   │   ├── Wishlist.jsx     # User wishlist
│   │   │   └── admin/
│   │   │       └── Dashboard.jsx # Admin dashboard
│   │   └── context/
│   │       └── AuthContext.jsx  # Auth state management
│   └── package.json
│
└── backend/           # Node.js/Express API
    ├── models/
    │   ├── User.js    # User schema with wishlist
    │   └── Product.js # Product schema
    ├── routes/
    │   ├── auth.js    # Auth endpoints
    │   ├── products.js # Product CRUD
    │   └── wishlist.js # Wishlist endpoints
    ├── server.js      # Express app
    ├── package.json
    ├── .env.example   # Environment variables template
    └── README.md      # Backend documentation
```

## Backend Setup (MongoDB + Express)

### Step 1: MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (AWS, us-east-1, free tier)
4. Create a database user:
   - Username: `tealeaf_user`
   - Password: Generate a strong password
5. Add IP to whitelist: `0.0.0.0/0` (for development)
6. Get connection string and copy it

### Step 2: Backend Installation
```bash
cd backend
npm install
```

### Step 3: Environment Setup
Create `.env` file in backend folder:
```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=tealeaf_luxe_secret_key_2024
PORT=5000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start Backend
```bash
npm run dev
```
You should see: `✅ MongoDB connected` and `🚀 Server running on http://localhost:5000`

## Frontend Setup (React + Vite)

### Step 1: Update Frontend Environment
Edit `frontend/env.json`:
```json
{
  "VITE_API_URL": "http://localhost:5000/api"
}
```

### Step 2: Start Frontend
```bash
cd frontend
npm install --legacy-peer-deps  # If not already done
npm run dev
```
Frontend runs on: `http://localhost:5173`

## Features Overview

### 1. User Authentication
- **Signup**: `/signup` - Create new account
- **Login**: `/login` - Sign in with credentials
- **Logout**: Button in navbar/user menu

Demo Admin Account:
- Email: `admin@tealeaf.com`
- Password: `admin123` (change after first login!)

### 2. User Features
- ❤️ **Wishlist**: Save favorite products
- 🛒 **Shopping Cart**: Add products to cart
- 🔍 **Search Bar**: Real-time product search with autocomplete
- 📱 **Responsive Design**: Works on all devices

### 3. Admin Features (requires admin account)
- Access admin dashboard at `/admin/dashboard`
- **Add Products**: Create new tea products
- **Edit Products**: Update product details
- **Delete Products**: Remove products
- **Manage Stock**: Track inventory
- **Featured Products**: Mark products as featured

### 4. Product Management
Can add/edit:
- Product name and description
- Price and stock
- Category (Green Tea, Black Tea, Matcha, etc.)
- Main image and hover image URLs
- Health benefits
- Mark as featured

## API Testing

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "confirmPassword": "test123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tealeaf.com",
    "password": "admin123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Check connection string in .env
- Verify IP whitelist includes your IP
- Ensure username and password are URL-encoded if they contain special characters

### Issue: CORS Error
**Solution:**
- Verify FRONTEND_URL in backend .env matches your frontend URL
- Check both frontend and backend are running
- Ensure ports are correct (5173 for frontend, 5000 for backend)

### Issue: Auth Token Expired
**Solution:**
- Tokens expire after 7 days
- Users need to login again
- Token stored in localStorage

### Issue: Admin Dashboard Not Accessible
**Solution:**
- Ensure you're logged in as admin user
- Check user role in MongoDB
- Navigate directly to `/admin/dashboard`

## Database Queries (MongoDB)

### Create Admin User
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@tealeaf.com",
  password: "$2a$10$...",  // bcrypt hash of "admin123"
  role: "admin",
  wishlist: [],
  orders: [],
  createdAt: new Date()
})
```

### Update User to Admin
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### View All Products
```javascript
db.products.find({})
```

## Deployment Checklist

- [ ] Set strong JWT_SECRET in production
- [ ] Enable HTTPS
- [ ] Use environment variables (not hardcoded values)
- [ ] Set FRONTEND_URL to production domain
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable CORS only for your domain
- [ ] Add error logging and monitoring
- [ ] Back up MongoDB regularly
- [ ] Test all API endpoints

## Next Steps

1. ✅ Backend running with MongoDB
2. ✅ Frontend running with Vite
3. 📝 Create admin account and test login
4. 🏠 Test product management in admin dashboard
5. ❤️ Test wishlist feature
6. 🔍 Test search functionality
7. 🚀 Deploy when ready

## Support Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **Vite Docs**: https://vitejs.dev/
- **React Router**: https://tanstack.com/router/latest

## Project Statistics

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT (7-day expiration)
- **Database**: MongoDB Atlas (free tier)
- **Image Hosting**: URL-based (Cloudinary ready)
- **UI Components**: Shadcn/ui + Lucide icons
- **Animations**: Framer Motion

---

**Happy Tea Shopping! 🍵**
