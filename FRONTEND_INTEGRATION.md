# Frontend Integration Guide

## AuthProvider Setup

The authentication system requires wrapping your app with AuthProvider. Follow these steps:

### Step 1: Update App.jsx/App.tsx

Find your main `App.jsx` or `App.tsx` file and wrap the routes with AuthProvider:

```jsx
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      {/* Your existing routes and components */}
    </AuthProvider>
  );
}
```

### Step 2: Add Routes for Auth Pages

Make sure these routes exist in your routing configuration:

```jsx
{
  path: "/login",
  component: () => import("./pages/Login"),
  lazy: () => import("./pages/Login"),
},
{
  path: "/signup", 
  component: () => import("./pages/Signup"),
  lazy: () => import("./pages/Signup"),
},
{
  path: "/wishlist",
  component: () => import("./pages/Wishlist"),
  lazy: () => import("./pages/Wishlist"),
},
{
  path: "/admin/dashboard",
  component: () => import("./pages/admin/Dashboard"),
  lazy: () => import("./pages/admin/Dashboard"),
},
```

### Step 3: Update Navbar

The navbar already has search functionality integrated. Just ensure it imports from the correct paths.

### Step 4: Add Wishlist Icon to Navbar (Optional)

To add a wishlist button in the navbar next to cart:

```jsx
import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";

// In your navbar actions section:
<Link
  to="/wishlist"
  className="relative w-9 h-9 flex items-center justify-center rounded-full text-foreground/60 hover:text-primary hover:bg-primary/8 transition-smooth"
  aria-label="Wishlist"
>
  <Heart size={18} />
</Link>
```

## Using Auth Context in Components

### Access Auth State

```jsx
import { useAuth } from "../context/AuthContext";

export default function MyComponent() {
  const { user, token, isAuthenticated, isAdmin, loading } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login first</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {isAdmin && <div>Admin Panel</div>}
    </div>
  );
}
```

### Login a User

```jsx
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  
  const handleSubmit = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      // User logged in
    } else {
      // Error: result.error
    }
  };
  
  return <>...</>;
}
```

### Make API Calls with Auth

```jsx
// Use the token from useAuth for authenticated requests
const { token } = useAuth();

const response = await fetch("http://localhost:5000/api/wishlist", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Protecting Routes

If using TanStack Router, you can protect routes:

```jsx
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) return <div>Loading...</div>;
  
  return <div>Protected Content</div>;
}
```

## Common Integration Patterns

### Show Different Content Based on Auth

```jsx
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  
  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

### Add to Wishlist

```jsx
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const { token, isAuthenticated } = useAuth();
  
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    
    const response = await fetch(
      `http://localhost:5000/api/wishlist/add/${product._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (response.ok) {
      console.log("Added to wishlist!");
    }
  };
  
  return (
    <button onClick={handleAddToWishlist}>
      ♡ Add to Wishlist
    </button>
  );
}
```

## Troubleshooting

### Token Not Working
- Clear localStorage: `localStorage.removeItem("token")`
- Check token expiry (7 days)
- Verify Authorization header format: `Bearer <token>`

### Auth Context not Available
- Ensure AuthProvider wraps your routes
- Check the import path is correct
- Verify you're using useAuth inside AuthProvider children

### Login/Signup Page Blank
- Check console for errors
- Verify backend is running on http://localhost:5000
- Check CORS is enabled in backend

### Admin Dashboard Not Accessible
- Verify user role is "admin" in MongoDB
- Check user is logged in
- Inspect network tab for auth errors

## Environment Variables

Create or update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then use in code:

```jsx
const API_URL = import.meta.env.VITE_API_URL;
```

## Next Steps

1. ✅ Set up AuthProvider in App.jsx
2. ✅ Add routes for auth pages
3. ✅ Test login/signup
4. ✅ Test admin dashboard
5. ✅ Add wishlist to product cards
6. ✅ Test API calls with auth token
7. ✅ Deploy!

## File Checklist

Make sure these files are created:

- ✅ `src/context/AuthContext.jsx` - Auth state management
- ✅ `src/pages/Login.jsx` - Login page
- ✅ `src/pages/Signup.jsx` - Signup page
- ✅ `src/pages/Wishlist.jsx` - Wishlist page
- ✅ `src/pages/admin/Dashboard.jsx` - Admin dashboard
- ✅ `backend/models/User.js` - User model
- ✅ `backend/models/Product.js` - Product model
- ✅ `backend/routes/auth.js` - Auth endpoints
- ✅ `backend/routes/products.js` - Product endpoints
- ✅ `backend/routes/wishlist.js` - Wishlist endpoints

---

For more help, check:
- `backend/README.md` - Backend API docs
- `SETUP.md` - Complete setup guide
- `PROJECT_SUMMARY.md` - Project overview
