# Render Deployment Guide

## Quick Fix for Current Error

The error is caused by Python 3.13 incompatibility with psycopg2-binary. Fixed by:
1. ✅ Updated psycopg2-binary to 2.9.10
2. ✅ Added runtime.txt to force Python 3.11.9
3. ✅ Fixed DATABASE_URL format (postgres:// → postgresql://)
4. ✅ Created build.sh script
5. ✅ Created render.yaml configuration

## Deploy to Render

### Option 1: Using Render Dashboard (Recommended)

#### Step 1: Create PostgreSQL Database
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Name: `deliveroo-db`
4. Database: `deliveroo`
5. User: `deliveroo`
6. Region: Oregon (or closest to you)
7. Plan: Free
8. Click "Create Database"
9. **Copy the Internal Database URL** (starts with postgres://)

#### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository
4. Configure:
   - **Name**: `deliveroo-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `./build.sh`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   PYTHON_VERSION=3.11.9
   DATABASE_URL=<paste-internal-database-url>
   SECRET_KEY=<generate-random-32-char-string>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ENVIRONMENT=production
   FRONTEND_URL=http://localhost:3000
   ```

6. Click "Create Web Service"

#### Step 3: Wait for Deployment
- First deploy takes 5-10 minutes
- Watch logs for any errors
- Once deployed, note your backend URL: `https://deliveroo-backend.onrender.com`

#### Step 4: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Import your repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://deliveroo-backend.onrender.com
   ```

5. Deploy

#### Step 5: Update Backend FRONTEND_URL
1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel URL: `https://your-app.vercel.app`
5. Save (this will trigger a redeploy)

### Option 2: Using render.yaml (Blueprint)

1. Push code to GitHub with render.yaml
2. Go to Render Dashboard
3. Click "New +" → "Blueprint"
4. Connect repository
5. Render will auto-detect render.yaml and create all services
6. Update FRONTEND_URL after frontend deployment

## Initialize Database with Demo Data

After backend is deployed, run locally:

```bash
# Set DATABASE_URL to your Render database
export DATABASE_URL="<your-render-database-url>"

# Run initialization
cd backend
python init_database.py
```

Or use Render Shell:
1. Go to your web service in Render
2. Click "Shell" tab
3. Run: `python init_database.py`

## Test Deployment

1. Visit backend health: `https://your-backend.onrender.com/health`
2. Visit API docs: `https://your-backend.onrender.com/docs`
3. Visit frontend: `https://your-frontend.vercel.app`
4. Login with:
   - Admin: admin@deliveroo.com / admin123
   - User: user@deliveroo.com / user123

## Troubleshooting

### Port Binding Error
- Ensure start command uses `--port 10000`
- Render expects port 10000 for free tier

### Database Connection Error
- Verify DATABASE_URL is set correctly
- Use **Internal Database URL** from Render
- Check database is in same region as web service

### Python Version Error
- Ensure runtime.txt exists with `python-3.11.9`
- Don't use Python 3.13 (psycopg2 incompatible)

### CORS Error
- Update FRONTEND_URL in backend environment variables
- Redeploy backend after updating

### Build Fails
- Check build.sh is executable: `chmod +x build.sh`
- Verify all dependencies in requirements.txt
- Check logs in Render dashboard

## Environment Variables Reference

### Backend (Render)
```
PYTHON_VERSION=3.11.9
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=min-32-random-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
FRONTEND_URL=https://your-frontend.vercel.app
GOOGLE_MAPS_API_KEY=optional
SENDGRID_API_KEY=optional
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_GOOGLE_MAPS_API_KEY=optional
```

## Important Notes

- **Free tier sleeps after 15 min inactivity** - first request takes 30-60s
- Database has 90-day expiry on free tier
- Backend URL: `https://your-service.onrender.com`
- Frontend URL: `https://your-app.vercel.app`
- Update FRONTEND_URL in backend after frontend deployment
- Use Internal Database URL for better performance

## Commands Summary

```bash
# Make build script executable
chmod +x backend/build.sh

# Test locally with Render database
export DATABASE_URL="your-render-db-url"
cd backend
python init_database.py
uvicorn main:app --reload --port 10000

# Deploy frontend
cd frontend
vercel --prod
```
