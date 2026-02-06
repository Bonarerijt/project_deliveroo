# Vercel Deployment Guide

This document provides step-by-step instructions for deploying the Deliveroo frontend to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com)
2. Your backend API deployed and accessible (e.g., on Render, Railway, Fly.io, etc.)
3. Google Maps API key (optional, for maps functionality)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `Bonarerijt/Project_Deliveroo`
4. Vercel should automatically detect the frontend directory

### 2. Configure Project Settings

In the Vercel project configuration:

- **Framework Preset**: Create React App (automatically detected)
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 3. Set Environment Variables

Go to Settings → Environment Variables and add:

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_API_URL` | Your backend API URL (e.g., `https://your-backend-api.onrender.com`) | Production, Preview, Development |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Your Google Maps API key | Production, Preview, Development |

**Note**: In `vercel.json`, these are referenced as `@api_url` and `@google_maps_api_key` as Vercel environment variable references.

### 4. Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. You'll receive a URL like: `https://your-project.vercel.app`

## Backend API Requirements

For the frontend to work properly, your backend API must:

1. Be deployed and accessible via HTTPS
2. Support CORS for your Vercel domain
3. Have the following endpoints (based on the frontend code):

### Required API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/parcels` | GET | List user's parcels |
| `/api/parcels` | POST | Create new parcel |
| `/api/parcels/:id` | GET | Get parcel details |
| `/api/parcels/:id` | PUT | Update parcel |
| `/api/admin/stats` | GET | Admin dashboard stats |
| `/api/admin/parcels` | GET | Admin parcel list |
| `/api/admin/parcels/:id` | PUT | Admin update parcel |

### CORS Configuration

Your backend must allow requests from your Vercel domain. Example CORS configuration for FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Local Development with Vercel Environment

To test locally with production environment variables:

1. Create a `.env.local` file in the `frontend` directory:
   ```
   REACT_APP_API_URL=https://your-production-backend-url.com
   REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key
   ```

2. Run: `npm start`

## Troubleshooting

### API Calls Failing

1. Check browser console for CORS errors
2. Verify `REACT_APP_API_URL` is set correctly in Vercel
3. Ensure your backend is running and accessible

### 404 Errors on Page Refresh

The `vercel.json` file includes rewrites for SPA routing. If you're seeing 404s, ensure:
- The rewrites configuration is correct
- You're not using a custom `vercel.json` that overrides the default

### Build Failures

1. Check Vercel build logs for errors
2. Ensure all dependencies in `package.json` are compatible
3. Verify environment variables are set before build

## Deploying the Backend

The frontend expects a backend API. Recommended platforms for backend deployment:

- [Render](https://render.com) - Easy setup with PostgreSQL
- [Railway](https://railway.app) - Modern deployment
- [Fly.io](https://fly.io) - Edge deployment
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) - Enterprise option

See `backend/.env.production.template` for backend environment variables.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
