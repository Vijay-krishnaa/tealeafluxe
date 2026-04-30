#!/bin/bash
# Quick Start Guide for Swadistchai

echo "🍵 Swadistchai - Quick Start"
echo "=============================="
echo ""

# Check if backend exists
if [ -d "backend" ]; then
    echo "✅ Backend folder found"
else
    echo "❌ Backend folder not found"
    exit 1
fi

# Check if frontend exists
if [ -d "frontend" ]; then
    echo "✅ Frontend folder found"
else
    echo "❌ Frontend folder not found"
    exit 1
fi

echo ""
echo "📝 Next Steps:"
echo "1. Create .env file in backend/ with MongoDB URI"
echo "2. Run: cd backend && npm install"
echo "3. Run: npm run dev (backend will start on port 5000)"
echo "4. In another terminal: cd frontend && npm run dev"
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "🔑 Default Admin Credentials:"
echo "   Email: admin@tealeaf.com"
echo "   Password: admin123"
echo ""
echo "📚 Documentation:"
echo "   Backend API: backend/README.md"
echo "   Full Setup: SETUP.md"
echo "   Project Summary: PROJECT_SUMMARY.md"
echo ""
echo "🚀 You're all set! Happy coding!"
