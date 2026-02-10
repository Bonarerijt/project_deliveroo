# Production URLs Configuration

## Deployed URLs
- **Frontend**: https://project-deliveroo-taupe.vercel.app/
- **Backend**: https://project-deliveroo.onrender.com/

## Configuration Applied

### Frontend (.env.production)
```
REACT_APP_API_URL=https://project-deliveroo.onrender.com
```

### Backend (Render Environment Variables)
Set in Render Dashboard:
```
FRONTEND_URL=https://project-deliveroo-taupe.vercel.app
ENVIRONMENT=production
```

## Vercel Environment Variable
In Vercel Dashboard → Settings → Environment Variables:
```
REACT_APP_API_URL=https://project-deliveroo.onrender.com
```

## Deploy Commands

### Redeploy Frontend
```bash
cd frontend
vercel --prod
```

### Redeploy Backend
```bash
git add .
git commit -m "Update CORS for production frontend"
git push origin main
```
Or in Render Dashboard: Manual Deploy

## Update Render Environment

Go to Render Dashboard → Your Service → Environment:

1. Update `FRONTEND_URL`:
```
FRONTEND_URL=https://project-deliveroo-taupe.vercel.app
```

2. Ensure these are set:
```
DATABASE_URL=<your-postgres-url>
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
```

3. Save (triggers automatic redeploy)

## Test Deployment

1. Backend health: https://project-deliveroo.onrender.com/health
2. Backend API docs: https://project-deliveroo.onrender.com/docs
3. Frontend: https://project-deliveroo-taupe.vercel.app/

## Demo Accounts
- Admin: admin@deliveroo.com / admin123
- User: user@deliveroo.com / user123
