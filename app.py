from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import hashlib
import uuid

# For serverless, we'll use in-memory storage (not persistent)
# For production, use Vercel Postgres or external database

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-dev-secret-key-change-in-production')

# CORS configuration - allow all origins and methods
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
jwt = JWTManager(app)

# In-memory user storage (not persistent across deployments)
users_db = {}

@app.route("/")
def index():
    return jsonify({"status": "ok", "message": "AI Image Generator API is running"})

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "message": "AI Image Generator API is running"})

# Authentication endpoints
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400
    
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    # Check if user already exists
    for user_id, user in users_db.items():
        if user["username"] == username:
            return jsonify({"error": "Username already exists"}), 409
        if user["email"] == email:
            return jsonify({"error": "Email already exists"}), 409
    
    # Create new user
    user_id = str(uuid.uuid4())
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    users_db[user_id] = {
        "id": user_id,
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "created_at": str(datetime.datetime.now())
    }
    
    # Generate token
    access_token = create_access_token(identity=user_id)
    
    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": user_id,
            "username": username,
            "email": email
        },
        "access_token": access_token,
    }), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Find user by email
    user = None
    for user_id, u in users_db.items():
        if u["email"] == email:
            user = u
            break
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Verify password
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if user["password_hash"] != password_hash:
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Generate token
    access_token = create_access_token(identity=user["id"])
    
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"]
        },
        "access_token": access_token,
    }), 200

# Image generation endpoint
@app.route("/api/images/generate", methods=["POST"])
def generate_image():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    try:
        # Using Pollinations.ai - Free, no API key required
        encoded_prompt = requests.utils.quote(prompt)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&seed={hash(prompt) % 1000}&nologo=true"
        
        # Fetch the actual image data to avoid CORS issues
        image_response = requests.get(image_url, timeout=30)
        if image_response.status_code != 200:
            return jsonify({"error": "Failed to generate image"}), 500
        
        # Convert to base64 for direct embedding
        import base64
        import io
        from PIL import Image
        
        img = Image.open(io.BytesIO(image_response.content))
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Save to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Encode to base64
        base64_image = base64.b64encode(img_byte_arr).decode('utf-8')
        image_url = f"data:image/jpeg;base64,{base64_image}"
            
    except Exception as e:
        return jsonify({"error": f"Image generation failed: {str(e)}"}), 500

    return jsonify({
        "message": "Image generated successfully",
        "image": {"prompt": prompt, "image_url": image_url},
    }), 200

# History endpoints (in-memory, not persistent)
@app.route("/api/images/history", methods=["GET"])
@jwt_required()
def get_history():
    return jsonify({
        "images": [],
        "pages": 1,
        "current_page": 1
    }), 200

@app.route("/api/images/history/<image_id>", methods=["DELETE"])
@jwt_required()
def delete_image(image_id):
    return jsonify({"message": "Image deleted successfully"}), 200

import datetime
import requests

if __name__ == "__main__":
    app.run(debug=True, port=5000)
