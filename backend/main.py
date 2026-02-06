# Entry point for Render deployment
# This file re-exports the FastAPI app from app/main.py

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
