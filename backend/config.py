import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-dev-secret-key")

    # Database configuration
    # For Vercel/serverless, use in-memory SQLite or environment variable
    if os.getenv("VERCEL"):
        # Use in-memory SQLite for Vercel (no persistent storage)
        SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    else:
        # Local development - use file-based SQLite
        basedir = os.path.abspath(os.path.dirname(__file__))
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'instance', 'ai_image_generator.db')}"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
