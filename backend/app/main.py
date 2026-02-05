from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.database.database import engine, Base
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(parcels.router)
app.include_router(admin.router)

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