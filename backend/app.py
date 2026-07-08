from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db
from routes.auth import auth_bp
from routes.images import images_bp
from models import User, ImageHistory


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)
    
    # Ensure instance folder exists
    import os
    os.makedirs(app.instance_path, exist_ok=True)
    
    CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])
    db.init_app(app)
    JWTManager(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(images_bp)
    
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "message": "AI Image Generator API is running"})

    with app.app_context():
        db.create_all()

    return app
  
   


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
