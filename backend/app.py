from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from database import db
from routes.auth import auth_bp
from routes.images import images_bp
from models import User, ImageHistory
import os

app = Flask(__name__, instance_relative_config=True)
app.config.from_object(Config)

# Ensure instance folder exists (only for local development)
if not os.getenv("VERCEL"):
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except:
        pass

# CORS configuration
CORS(app, origins=["*"])
db.init_app(app)
jwt = JWTManager(app)
app.register_blueprint(auth_bp)
app.register_blueprint(images_bp)

@app.route("/")
def index():
    return jsonify({"status": "ok", "message": "AI Image Generator API is running"})

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "message": "AI Image Generator API is running"})

# Create tables (only for local development)
if not os.getenv("VERCEL"):
    try:
        with app.app_context():
            db.create_all()
    except Exception as e:
        print(f"Warning: Could not create database tables: {e}")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
