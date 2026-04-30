# ✅ Swadistchai Setup Checklist

Complete this checklist step-by-step to get your platform running.

## 🌍 Phase 1: MongoDB Setup (30 minutes)

- [ ] **Sign up for MongoDB Atlas**
  - Go to https://www.mongodb.com/cloud/atlas
  - Create account with Google or email
  - Verify email

- [ ] **Create a Cluster**
  - Click "Create a cluster"
  - Choose free tier (M0)
  - Select AWS, us-east-1 region
  - Click "Create"
  - Wait 10-15 minutes for provisioning

- [ ] **Create Database User**
  - Go to Database Access (left menu)
  - Click "Add New Database User"
  - Username: `tealeaf_user` (or your choice)
  - Password: Generate secure password
  - Database User Privileges: Read and write to any database
  - Click "Add User"

- [ ] **Network Access**
  - Go to Network Access (left menu)
  - Click "Add IP Address"
  - Enter `0.0.0.0/0` (for development)
  - Click "Confirm"
  - ⚠️ Note: For production, add specific IP addresses

- [ ] **Get Connection String**
  - Go to Clusters
  - Click "Connect"
  - Choose "Connect using MongoDB Compass"
  - Copy the connection string
  - Save it for later (looks like: `mongodb+srv://tealeaf_user:password@cluster.mongodb.net/`)

## 💻 Phase 2: Backend Setup (30 minutes)

- [ ] **Create .env File**
  - Go to `backend/` folder
  - Create new file called `.env`
  - Copy content from `.env.example`
  - Fill in your MongoDB connection string
  - Generate random JWT_SECRET (use: https://www.uuidgenerator.net/)

- [ ] **Sample .env Content**
  ```
  MONGODB_URI=mongodb+srv://tealeaf_user:YOUR_PASSWORD@cluster0.mongodb.net/tealeaf_luxe?retryWrites=true&w=majority
  JWT_SECRET=your_random_secret_key_here_12345abcde
  PORT=5000
  CLOUDINARY_NAME=skip_for_now
  CLOUDINARY_API_KEY=skip_for_now
  CLOUDINARY_API_SECRET=skip_for_now
  FRONTEND_URL=http://localhost:5173
  ```

- [ ] **Install Dependencies**
  ```bash
  cd backend
  npm install
  ```
  - Wait for installation to complete
  - Should see "up to date" message

- [ ] **Test MongoDB Connection**
  ```bash
  npm run dev
  ```
  - Should see: `✅ MongoDB connected`
  - Should see: `🚀 Server running on http://localhost:5000`
  - Press Ctrl+C to stop

- [ ] **Create Admin User**
  ```bash
  node scripts/createAdmin.js
  ```
  - Should see success message
  - Admin email: `admin@tealeaf.com`
  - Admin password: `admin123`

## 🎨 Phase 3: Frontend Setup (20 minutes)

- [ ] **Check Node.js Version**
  ```bash
  node --version
  ```
  - Should be 16+

- [ ] **Install Frontend Dependencies**
  ```bash
  cd frontend
  npm install --legacy-peer-deps
  ```

- [ ] **Verify Files Exist**
  - [ ] `src/context/AuthContext.jsx`
  - [ ] `src/pages/Login.jsx`
  - [ ] `src/pages/Signup.jsx`
  - [ ] `src/pages/Wishlist.jsx`
  - [ ] `src/pages/admin/Dashboard.jsx`

## 🚀 Phase 4: Running the Application (10 minutes)

- [ ] **Start Backend**
  ```bash
  cd backend
  npm run dev
  ```
  - Should see MongoDB connected and server running
  - Keep this terminal open

- [ ] **Open New Terminal and Start Frontend**
  ```bash
  cd frontend
  npm run dev
  ```
  - Should see Vite dev server running
  - Browser should open to http://localhost:5173

## 🧪 Phase 5: Testing (20 minutes)

- [ ] **Test Homepage**
  - [ ] Homepage loads
  - [ ] Search bar visible in navbar
  - [ ] Cart icon visible
  - [ ] Navigation works

- [ ] **Test Search**
  - [ ] Click search bar
  - [ ] Type "I" (for Imperial)
  - [ ] Product suggestions appear
  - [ ] Click a product → navigates to shop
  - [ ] Full search works

- [ ] **Test Login**
  - [ ] Click login in navbar or go to `/login`
  - [ ] Enter admin credentials:
    - Email: `admin@tealeaf.com`
    - Password: `admin123`
  - [ ] Successfully logged in
  - [ ] Redirected to `/admin/dashboard`
  - [ ] Can see admin panel

- [ ] **Test Admin Dashboard**
  - [ ] Product table loads
  - [ ] Can see existing products
  - [ ] Click "Add New Product"
  - [ ] Fill in form:
    - Name: "Test Tea"
    - Description: "A test product"
    - Price: 999
    - Category: "Green Tea"
    - Image URL: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&q=80&auto=format&fit=crop`
    - Stock: 50
  - [ ] Click "Add Product"
  - [ ] Product appears in table
  - [ ] Success message shows

- [ ] **Test Edit Product**
  - [ ] Click edit icon on a product
  - [ ] Modal opens with form
  - [ ] Change price
  - [ ] Click "Update Product"
  - [ ] Sees success message
  - [ ] Price updated in table

- [ ] **Test Delete Product**
  - [ ] Click trash icon
  - [ ] Confirm deletion
  - [ ] Product disappears from table
  - [ ] Success message shows

- [ ] **Test Logout**
  - [ ] Click logout button
  - [ ] Logged out
  - [ ] Redirected to home

- [ ] **Test Signup**
  - [ ] Go to `/signup`
  - [ ] Create new account:
    - Name: "Test User"
    - Email: "test@example.com"
    - Password: "test123"
    - Confirm: "test123"
  - [ ] Successfully created
  - [ ] Redirected to shop

- [ ] **Test Wishlist**
  - [ ] Go to `/wishlist`
  - [ ] Should be empty initially
  - [ ] Go to `/shop`
  - [ ] Add product to wishlist (hover over product)
  - [ ] Go back to `/wishlist`
  - [ ] Product appears
  - [ ] Can remove from wishlist

## 📚 Phase 6: Documentation (10 minutes)

- [ ] **Read Documentation**
  - [ ] Read `SETUP.md` for detailed guide
  - [ ] Read `PROJECT_SUMMARY.md` for overview
  - [ ] Read `FILE_STRUCTURE.md` for file organization
  - [ ] Read `FRONTEND_INTEGRATION.md` for code integration

- [ ] **Reference Files**
  - [ ] `backend/README.md` - API documentation
  - [ ] `.env.example` - Environment template

## 🎓 Phase 7: Understanding the Code (Optional)

- [ ] **Read AuthContext**
  - Understand how login/signup works
  - See how token is stored
  - Review useAuth hook usage

- [ ] **Review API Routes**
  - Understand auth endpoints
  - Review product endpoints
  - Check wishlist endpoints

- [ ] **Study Models**
  - User schema structure
  - Product schema structure
  - Database relationships

## 🚨 Troubleshooting

### MongoDB Connection Error
```
❌ MongoServerError: Server error
```
- [ ] Check MONGODB_URI in .env
- [ ] Verify username and password
- [ ] Check IP whitelist (should be 0.0.0.0/0)
- [ ] Ensure database user exists in MongoDB Atlas

### CORS Error
```
❌ Access to XMLHttpRequest blocked by CORS
```
- [ ] Check FRONTEND_URL in backend .env
- [ ] Should be `http://localhost:5173`
- [ ] Restart backend server

### Port Already in Use
```
❌ Error: listen EADDRINUSE
```
- [ ] Change PORT in .env
- [ ] Or kill process using port:
  - Windows: `netstat -ano | findstr :5000`
  - Mac/Linux: `lsof -i :5000`

### Dependencies Installation Failed
```
❌ npm ERR! code ERESOLVE
```
- [ ] Use `npm install --legacy-peer-deps`
- [ ] Clear cache: `npm cache clean --force`

### Frontend Won't Start
```
❌ Error: ENOENT: no such file or directory
```
- [ ] Check you're in frontend folder
- [ ] Run `npm install --legacy-peer-deps` again
- [ ] Delete `node_modules` and reinstall

## 📊 Success Indicators

Your setup is complete when:
- ✅ Backend starts without errors
- ✅ Frontend loads in browser
- ✅ Can login with admin credentials
- ✅ Can add/edit/delete products
- ✅ Can search for products
- ✅ Can add to wishlist
- ✅ Can signup and login as user

## 🎉 You're Done!

Your Swadistchai e-commerce platform is fully set up and running!

### Next Steps:
1. Explore the admin dashboard
2. Create sample products
3. Test all features
4. Read the documentation
5. Customize as needed
6. Deploy to production

### Quick Links:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:5173/admin/dashboard
- Login: http://localhost:5173/login
- Signup: http://localhost:5173/signup

### Support Resources:
- Google MongoDB setup issues
- Check React Router documentation
- Review backend/README.md for API help
- Use browser console for debugging

---

**Happy Coding! 🚀**

If you need help, refer back to the comprehensive documentation provided.
