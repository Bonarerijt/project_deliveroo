# Deliveroo - Courier Service Platform

A full-stack courier service application built with FastAPI (backend) and React (frontend).

## Features Implemented

### MVP Features ✅
- ✅ Users can create an account and log in
- ✅ Users can create a parcel delivery order
- ✅ Users can change the destination of a parcel delivery order
- ✅ Users can cancel a parcel delivery order
- ✅ Users can see the details of a delivery order
- ✅ Admin can change the status and present location of a parcel delivery order
- 🚧 Google Maps integration (basic structure ready, needs API key)

### Optional Features ✅
- ✅ Real-time email notifications when Admin changes parcel status
- ✅ Real-time email notifications when Admin changes parcel location

### Business Rules ✅
- ✅ Users can only cancel/change destination when status is not 'delivered'
- ✅ Only the user who created the parcel can cancel it
- ✅ Admin role-based access control

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **SendGrid** - Email notifications
- **Google Maps API** - Distance/route calculations

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Framer Motion** - Animations

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd deliveroo
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
python init_database.py

# Start backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Demo Accounts

### Admin Account
- Email: `admin@deliveroo.com`
- Password: `admin123`
- Access: Full admin dashboard, can manage all parcels

### User Account
- Email: `user@deliveroo.com`
- Password: `user123`
- Access: Create and manage own parcels

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/deliveroo
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Parcels
- `GET /parcels/` - Get user's parcels
- `POST /parcels/` - Create new parcel
- `GET /parcels/{id}` - Get parcel details
- `PUT /parcels/{id}/destination` - Update destination
- `PUT /parcels/{id}/cancel` - Cancel parcel
- `GET /parcels/{id}/route` - Get route information

### Admin
- `GET /parcels/all` - Get all parcels (admin only)
- `PUT /parcels/{id}/admin` - Update parcel status/location (admin only)

## Database Schema

### Users Table
- id, email, full_name, hashed_password, is_admin, is_active, created_at

### Parcels Table
- id, user_id, pickup_address, destination_address, weight_category, quote_amount, status, present_location, distance_km, duration_mins, created_at, updated_at

## Features Overview

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
4. **System Analytics** - Overview of platform performance

### Security Features
1. **Password Hashing** - bcrypt for secure password storage
2. **JWT Authentication** - Stateless authentication
3. **Role-based Access** - Admin vs User permissions
4. **Input Validation** - Pydantic schemas for API validation
5. **Security Headers** - CORS, rate limiting, trusted hosts

## Development Notes

### Google Maps Integration
- Basic structure implemented
- Requires valid Google Maps API key
- Currently uses mock data for development
- Ready for production with proper API key

### Email Notifications
- SendGrid integration implemented
- Falls back to console logging without API key
- Sends notifications on status/location changes

### Database
- PostgreSQL with proper relationships
- Includes demo data for testing
- Migration-ready structure

## Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Run `python init_database.py`

2. **Frontend can't connect to backend**
   - Ensure backend is running on port 8000
   - Check REACT_APP_API_URL in frontend .env

3. **Authentication issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify SECRET_KEY is set

4. **Database connection errors**
   - Verify PostgreSQL credentials
   - Check database exists
   - Run database initialization script

## Production Deployment

### Backend
1. Set ENVIRONMENT=production
2. Use production database
3. Set proper SECRET_KEY
4. Configure CORS for production domain
5. Use production WSGI server (gunicorn)

### Frontend
1. Build production bundle: `npm run build`
2. Serve static files
3. Configure production API URL
4. Set up proper domain/SSL

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

MIT License - see LICENSE file for details