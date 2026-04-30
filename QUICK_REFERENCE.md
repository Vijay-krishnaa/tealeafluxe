# 🎯 Local Image Storage - Quick Reference

## Admin Dashboard - Local Image Upload Only

### 🏪 Storage Location
```
c:\Users\mihir\Desktop\ecommerce\backend\uploads\
```

### 📷 Image Upload Limits
| Property | Value |
|----------|-------|
| **Max File Size** | 5MB per image |
| **Formats** | JPG, PNG, WebP, GIF |
| **Total per Product** | 10 images max (2 main + 8 additional) |
| **Storage** | Local server only |
| **Third-party URLs** | ❌ Not allowed |

### 🔐 Admin Login
```
Email: admin@tealeaf.com
Password: admin123
URL: http://localhost:5173/admin
```

### 📁 Upload Interface

#### Main Image
- Upload button: "Upload Main Image"
- Preview: Square box with delete (X)
- After upload: Shows preview + "Change Image" button

#### Hover Image  
- Upload button: "Upload Hover Image"
- Preview: Square box with delete (X)
- Use: Shows when hovering over product card

#### Additional Images (0-8)
- Grid layout: 4 columns
- Upload: Click any box to upload
- Delete: Hover + click X button
- Total: Main + Hover + 8 Additional = 10 max

### 🔄 Upload Process
1. Click upload button
2. Select local file (jpg/png/webp/gif, max 5MB)
3. See preview immediately
4. Click submit/update product
5. Image saved to `/backend/uploads/`

### ✅ Features
- ✓ Real-time preview
- ✓ Delete button for each image
- ✓ Upload status indicator
- ✓ Local storage info banner
- ✓ No URL paste allowed
- ✓ File validation
- ✓ Responsive grid layout

### 🌐 How Images Are Served
```
Backend saves to: c:\Users\mihir\Desktop\ecommerce\backend\uploads\
Accessible at: http://localhost:5000/uploads/{filename}
Database stores: /uploads/{filename}
Frontend displays: http://localhost:5000/uploads/{filename}
```

### 📊 Image Array in Database
```javascript
images: [
  { url: "/uploads/image-main.jpg", alt: "Main image" },
  { url: "/uploads/image-hover.jpg", alt: "Hover image" },
  { url: "/uploads/image-3.jpg", alt: "Product image 3" },
  // ... up to 10 total
]
```

### 🚀 Performance Benefits
- **Fast:** Local files = instant loading
- **Reliable:** No third-party downtime
- **Secure:** Admin-controlled storage
- **Efficient:** No external network requests

### ⚠️ Important Rules
1. **Only local files** - No third-party URLs
2. **Admin only** - Requires authentication
3. **File validation** - Images only
4. **Size limit** - 5MB per file
5. **Format check** - jpg/png/webp/gif only

### 🧪 Quick Test
```bash
# 1. Start backend
cd backend
npm start

# 2. Start frontend
cd frontend
npm run dev

# 3. Login to admin: http://localhost:5173/admin
# 4. Add product with images
# 5. Check folder: c:\Users\mihir\Desktop\ecommerce\backend\uploads\
# 6. View product to see images
```

---

## Command Reference

### Start Backend
```bash
cd c:\Users\mihir\Desktop\ecommerce\backend
npm start
```

### Start Frontend
```bash
cd c:\Users\mihir\Desktop\ecommerce\frontend
npm run dev
```

### View Uploaded Images
```
Folder: c:\Users\mihir\Desktop\ecommerce\backend\uploads\
```

### API Test (Manual Upload)
```bash
curl -X POST http://localhost:5000/api/products/upload/image \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/image.jpg"
```

---

## Troubleshooting

### Images not showing
- [ ] Check backend running (port 5000)
- [ ] Check /uploads folder exists
- [ ] Check files in /backend/uploads/
- [ ] Check browser console for errors

### Upload fails
- [ ] File size < 5MB?
- [ ] File format (jpg/png/webp/gif)?
- [ ] Admin authenticated?
- [ ] Network connected?

### Folder missing
- [ ] Create: `c:\Users\mihir\Desktop\ecommerce\backend\uploads`
- [ ] Or restart backend (auto-creates)

---

## File Locations

| File | Path |
|------|------|
| Admin Panel | `frontend/src/pages/admin/Dashboard.jsx` |
| Upload API | `backend/routes/products.js` |
| Server Config | `backend/server.js` |
| Product Model | `backend/models/Product.js` |
| Uploaded Images | `backend/uploads/` |

---

## Key Points

✅ **Local Only** - All images stored locally  
✅ **No URLs** - Can't paste third-party URLs  
✅ **Fast** - Local file serving  
✅ **Secure** - Admin-controlled  
✅ **Reliable** - No external dependencies  
✅ **Easy** - Simple upload interface  

---

*Generated: April 19, 2026*
