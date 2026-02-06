# Homereps Connect - Setup Guide for Collaborators

## Overview
Homereps Connect is a full-stack courier service platform built with FastAPI (backend) and React (frontend). This guide will help you get the application running on your local machine.

## Prerequisites
Before starting, ensure you have the following installed:
- **Python 3.8+** (check with `python --version`)
- **Node.js 16+** (check with `node --version`)
- **PostgreSQL** (or use SQLite for development)
- **Git**

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone git@github.com:Kimutaijeremy/Homereps-Connect.git
cd Homereps-Connect
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Virtual Environment
```bash
python -m venv venv
```

#### 2.3 Activate Virtual Environment
**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

#### 2.4 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 2.5 Set Up Environment Variables
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/homereps_connect
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

**For Quick Development (SQLite):**
```env
DATABASE_URL=sqlite:///./homereps_connect.db
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

#### 2.6 Initialize Database
```bash
python init_database.py
```

#### 2.7 Start Backend Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 3. Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install  # This will auto-generate package-lock.json
```

#### 3.3 Set Up Environment Variables
```bash
cp .env.example .env
```

Edit the `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### 3.4 Start Frontend Development Server
```bash
npm start
```

The frontend will be available at: http://localhost:3000

## Demo Accounts

### Admin Account
- **Email:** `admin@deliveroo.com`
- **Password:** `admin123`
- **Access:** Full admin dashboard, can manage all parcels

### User Account
- **Email:** `user@deliveroo.com`
- **Password:** `user123`
- **Access:** Create and manage own parcels

## Application Features

### User Features
1. **Registration & Login** - Secure JWT-based authentication
2. **Dashboard** - Overview of deliveries with charts and statistics
3. **Create Parcel** - Multi-step form with quote calculation
4. **Parcel Management** - View, edit destination, cancel parcels
5. **Real-time Tracking** - Status updates and location tracking

### Admin Features
1. **Admin Dashboard** - Manage all system parcels
2. **Status Management** - Update parcel status and location
3. **User Management** - View all users and their parcels
4. **Email Notifications** - Automatic notifications on status changes

## Development Workflow

### Running Tests

**Backend Tests:**
```bash
cd backend
pytest tests/ -v
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

### Making Changes

1. **Create a new branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

3. **Test your changes:**
```bash
# Backend
cd backend && pytest

# Frontend  
cd frontend && npm test
```

4. **Commit and push:**
```bash
git add .
git commit -m "Add your feature description"
git push origin feature/your-feature-name
```

5. **Create a Pull Request** on GitHub

## Troubleshooting

### Common Issues

#### Backend Won't Start
- **Check PostgreSQL is running:** `pg_ctl status`
- **Verify DATABASE_URL in .env**
- **Run database initialization:** `python init_database.py`

#### Frontend Can't Connect to Backend
- **Ensure backend is running on port 8000**
- **Check REACT_APP_API_URL in frontend .env**
- **Verify CORS settings in backend**

#### Authentication Issues
- **Clear browser localStorage:** Open DevTools → Application → Local Storage → Clear
- **Check JWT token expiration**
- **Verify SECRET_KEY is set in backend .env**

#### Database Connection Errors
- **Verify PostgreSQL credentials**
- **Check database exists**
- **For SQLite:** Ensure write permissions in backend directory

### Getting Help

1. **Check the logs:**
   - Backend: Terminal where uvicorn is running
   - Frontend: Browser DevTools Console

2. **API Documentation:** http://localhost:8000/docs

3. **Create an issue** on GitHub with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Python version, Node version)

## Project Structure

```
Homereps-Connect/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models/         # Database models
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Security middleware
│   ├── tests/              # Backend tests
│   ├── requirements.txt    # Python dependencies
│   └── init_database.py    # Database setup
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
│   ├── public/             # Static files
│   └── package.json        # Node dependencies
└── README.md              # Project documentation
```

## Next Steps

1. **Explore the codebase** - Start with `backend/app/main.py` and `frontend/src/App.tsx`
2. **Try the demo accounts** - Login and test the features
3. **Read the API documentation** - Visit http://localhost:8000/docs
4. **Make your first change** - Start with a small feature or bug fix
5. **Run the tests** - Ensure everything works before making changes

## Additional Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **React Documentation:** https://reactjs.org/docs/
- **Material-UI Documentation:** https://mui.com/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/

Welcome to the team!