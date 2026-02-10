from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.database.database import engine, Base, SessionLocal
from app.models.user import User
from app.routers import auth, parcels, admin
from app.middleware.security import SecurityHeadersMiddleware, RateLimitMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Deliveroo API",
    description="Courier Service Delivery System",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None,
)


# Add security middleware
# app.add_middleware(SecurityHeadersMiddleware)
# app.add_middleware(RateLimitMiddleware, calls=100, period=60)
# app.add_middleware(
#     TrustedHostMiddleware,
#     allowed_hosts=["localhost", "127.0.0.1", "*.deliveroo.com"]
# )

# Configure CORS with environment variable
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    frontend_url,
    "http://localhost:3000",
    "http://localhost:5173",
    "https://project-deliveroo-two.vercel.app",
    "https://project-deliveroo-taupe.vercel.app",
]

# Allow all Vercel preview deployments
if os.getenv("ENVIRONMENT") == "production":
    allowed_origins.append("https://*.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(parcels.router)
app.include_router(admin.router)


@app.on_event("startup")
def ensure_admin_user_role():
    """Ensure the default admin account keeps admin permissions."""
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == "admin@deliveroo.com").first()
        if admin_user and (not admin_user.is_admin or not admin_user.is_active):
            admin_user.is_admin = True
            admin_user.is_active = True
            db.commit()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Deliveroo API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}