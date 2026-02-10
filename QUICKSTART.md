# Quick Start Guide

## ✅ Frontend .env Created
Location: `frontend/.env`
Content: `REACT_APP_API_URL=http://localhost:8000`

## Local Development

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
python3 init_database.py
python3 -m uvicorn main:app --reload --port 8000
```

### 2. Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm start
```

### 3. Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Production Deployment

### Backend (Render)
1. Push to GitHub:
```bash
git add .
git commit -m "Fix: Use psycopg3 for Python 3.13"
git push origin main
```

2. In Render Dashboard:
   - Clear build cache & deploy
   - Verify environment variables are set

3. Note your backend URL: `https://your-app.onrender.com`

### Frontend (Vercel)
1. Set environment variable in Vercel:
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

2. Deploy:
```bash
cd frontend
vercel --prod
```

3. Note your frontend URL: `https://your-app.vercel.app`

### Update Backend CORS
In Render, update:
```
FRONTEND_URL=https://your-app.vercel.app
```

## Demo Accounts
- Admin: admin@deliveroo.com / admin123
- User: user@deliveroo.com / user123

## Troubleshooting

### Frontend shows "placeholder-api.example.com"
✅ FIXED: Created `frontend/.env` with `REACT_APP_API_URL=http://localhost:8000`
- Restart frontend: `npm start`

### Backend won't start locally
```bash
cd backend
pip install -r requirements.txt
```

### Render deployment fails
- Ensure psycopg[binary]==3.2.3 in requirements.txt
- Clear build cache in Render
- Check DATABASE_URL is set
