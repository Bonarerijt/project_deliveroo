# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (use Vercel Postgres, Neon, or Supabase)
- Vercel CLI: `npm install -g vercel`

## Step 1: Deploy Backend

### 1.1 Navigate to backend directory
```bash
cd backend
```

### 1.2 Login to Vercel
```bash
vercel login
```

### 1.3 Deploy backend
```bash
vercel --prod
```

### 1.4 Set environment variables in Vercel Dashboard
Go to your backend project settings and add:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=https://your-frontend.vercel.app
ENVIRONMENT=production
GOOGLE_MAPS_API_KEY=your-key (optional)
SENDGRID_API_KEY=your-key (optional)
```

### 1.5 Redeploy after setting env vars
```bash
vercel --prod
```

### 1.6 Note your backend URL
Example: `https://your-backend.vercel.app`

## Step 2: Deploy Frontend

### 2.1 Navigate to frontend directory
```bash
cd ../frontend
```

### 2.2 Set environment variable
In Vercel Dashboard for frontend project, add:
```
REACT_APP_API_URL=https://your-backend.vercel.app
```

### 2.3 Deploy frontend
```bash
vercel --prod
```

## Step 3: Update Backend CORS

### 3.1 Update FRONTEND_URL in backend
In backend Vercel Dashboard, update:
```
FRONTEND_URL=https://your-actual-frontend.vercel.app
```

### 3.2 Redeploy backend
```bash
cd backend
vercel --prod
```

## Step 4: Initialize Database

### 4.1 Run database initialization
```bash
cd backend
python init_database.py
```

Or connect to your database and run the SQL schema manually.

## Step 5: Test Deployment

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Try logging in with demo accounts:
   - Admin: admin@deliveroo.com / admin123
   - User: user@deliveroo.com / user123
3. Test creating a parcel
4. Check API health: `https://your-backend.vercel.app/health`

## Quick Deploy Commands

### Deploy both (from project root)
```bash
# Backend
cd backend && vercel --prod && cd ..

# Frontend
cd frontend && vercel --prod && cd ..
```

## Troubleshooting

### CORS Errors
- Ensure FRONTEND_URL in backend matches your frontend domain
- Check backend logs in Vercel Dashboard

### Database Connection
- Verify DATABASE_URL is correct
- Ensure database allows connections from Vercel IPs
- Check database is initialized with tables

### API Not Found
- Verify REACT_APP_API_URL in frontend settings
- Check backend deployment is successful
- Test backend health endpoint

### Authentication Issues
- Ensure SECRET_KEY is set in backend
- Clear browser localStorage and try again

## Environment Variables Summary

### Backend (.env or Vercel Dashboard)
```
DATABASE_URL=postgresql://...
SECRET_KEY=...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=https://your-frontend.vercel.app
ENVIRONMENT=production
```

### Frontend (Vercel Dashboard)
```
REACT_APP_API_URL=https://your-backend.vercel.app
```

## Notes

- Backend and frontend are deployed as separate Vercel projects
- Update FRONTEND_URL in backend after frontend deployment
- Database must be accessible from Vercel (use Vercel Postgres, Neon, or Supabase)
- Free tier has limitations on execution time and bandwidth
