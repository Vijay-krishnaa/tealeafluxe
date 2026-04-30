# Swadistchai Backend API

## Overview
Node.js/Express backend for Swadistchai e-commerce platform with MongoDB integration, JWT authentication, and product management.

## Prerequisites
- Node.js 16+
- MongoDB Atlas account (free tier available)
- Cloudinary account (for image uploads)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tealeaf_luxe?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=5000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

### 3. MongoDB Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Get your connection string
5. Replace `username:password` in MONGODB_URI

### 4. Create Demo Admin Account
Run this script to create the admin account:

```bash
node scripts/createAdmin.js
```

Or create one via signup and then update the role in MongoDB:

```javascript
// In MongoDB Compass or Atlas UI
db.users.updateOne(
  { email: "admin@tealeaf.com" },
  { $set: { role: "admin" } }
)
```

## Running the Server

### Development Mode
```bash
npm run dev
```
Server will run on `http://localhost:5000`

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add/:productId` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

## Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## Database Schema

### User Model
- name (String)
- email (String, unique)
- password (String, hashed)
- role (enum: 'user', 'admin')
- phone, address, city, state, pincode (optional)
- wishlist (Array of Product IDs)
- orders (Array of Order IDs)

### Product Model
- name, description, price
- category (enum: Green Tea, Black Tea, Matcha, etc.)
- image, hoverImage, images array
- healthBenefits (Array)
- rating, reviewCount
- featured, inStock, stock
- createdBy (Admin user ID)

## Demo Credentials
```
Email: admin@tealeaf.com
Password: admin123
Role: Admin
```

## Troubleshooting

### MongoDB Connection Error
- Verify connection string in .env
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure database credentials are correct

### JWT Errors
- Token may be expired (7-day expiration)
- Check JWT_SECRET matches between generation and verification
- Ensure Authorization header format is correct

### CORS Issues
- FRONTEND_URL env variable must match your frontend URL
- Default: `http://localhost:5173`

## Security Notes
- Change JWT_SECRET in production
- Never commit .env file
- Use environment variables for all sensitive data
- Implement rate limiting in production
- Add HTTPS in production

## Future Enhancements
- Image upload to Cloudinary integration
- Email notifications
- Order management
- Payment processing (Stripe/Razorpay)
- Advanced product filtering
- User reviews and ratings system
