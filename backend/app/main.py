from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from app.database.database import engine, Base
from app.routers import auth, parcels, admin

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Deliveroo API",
    description="Courier Service Delivery System",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None,
)

# Configure CORS with environment variable
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(parcels.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

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
