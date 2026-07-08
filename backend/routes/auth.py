from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from database import db
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not username or not email or not password:
            return jsonify({"error": "Username, email, and password are required"}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 409

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 409

        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "message": "User registered successfully",
            "user": user.to_dict(),
            "access_token": access_token,
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found with this email"}), 401

        if not user.check_password(password):
            return jsonify({"error": "Invalid password"}), 401

        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "access_token": access_token,
        }), 200
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500


@auth_bp.route("/debug/users", methods=["GET"])
def debug_users():
    """Debug endpoint to list all users in database"""
    try:
        users = User.query.all()
        return jsonify({
            "total_users": len(users),
            "users": [{"id": u.id, "username": u.username, "email": u.email, "created_at": u.created_at.isoformat()} for u in users]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/debug/db-info", methods=["GET"])
def debug_db_info():
    """Debug endpoint to check database connection and tables"""
    try:
        from database import db
        from sqlalchemy import inspect
        
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        
        user_count = User.query.count()
        
        return jsonify({
            "database_uri": str(db.engine.url),
            "tables": tables,
            "user_count": user_count,
            "tables_info": {
                table: {
                    "columns": [col["name"] for col in inspector.get_columns(table)]
                } for table in tables
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
