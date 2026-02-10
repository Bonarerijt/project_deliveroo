# RENDER DEPLOYMENT FIX - Python 3.13 Issue

## Problem
Render is using Python 3.13 which is incompatible with psycopg2-binary.

## Solution Applied
Replaced `psycopg2-binary` with `psycopg` (version 3) which supports Python 3.13.

## Changes Made

### 1. requirements.txt
```diff
- psycopg2-binary==2.9.10
+ psycopg[binary]==3.2.3
```

### 2. database.py
Added psycopg driver specification:
```python
if DATABASE_URL and "postgresql://" in DATABASE_URL and "psycopg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://")
```

### 3. Version Files
- `runtime.txt` → `python-3.11.9`
- `.python-version` → `3.11.9`

## Deploy Steps

1. **Commit changes:**
```bash
git add .
git commit -m "Fix: Use psycopg3 for Python 3.13 compatibility"
git push origin main
```

2. **Clear Render cache (in Render Dashboard):**
   - Go to your web service
   - Settings → "Clear build cache & deploy"
   - OR manually redeploy

3. **Verify environment variables are set:**
   - DATABASE_URL
   - SECRET_KEY
   - FRONTEND_URL
   - ENVIRONMENT=production

## Alternative: Force Python 3.11

If you want to use Python 3.11 instead, in Render Dashboard:
1. Go to Environment
2. Add: `PYTHON_VERSION=3.11.9`
3. Clear cache and redeploy

## Why This Works

- **psycopg** (v3) is the modern PostgreSQL adapter
- Fully compatible with Python 3.13
- SQLAlchemy 2.0+ supports it natively
- No C extension compatibility issues

## Test After Deploy

```bash
# Check health endpoint
curl https://your-backend.onrender.com/health

# Check API docs
curl https://your-backend.onrender.com/docs
```

## Rollback Plan

If issues occur, revert to:
```
psycopg2-binary==2.9.9
```
And force Python 3.11 via environment variable.
