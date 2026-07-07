import os
import requests
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.image_history import ImageHistory

images_bp = Blueprint("images", __name__, url_prefix="/api/images")


@images_bp.route("/generate", methods=["POST"])
@jwt_required()
def generate_image():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # Using Pollinations.ai - Free, no API key required
        # Generate image URL directly
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

    try:
        user_id = int(get_jwt_identity())
        history_entry = ImageHistory(
            user_id=user_id,
            prompt=prompt,
            image_url=image_url,
        )
        db.session.add(history_entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to save to history: {str(e)}"}), 500

    return jsonify({
        "message": "Image generated successfully",
        "image": {"prompt": prompt, "image_url": image_url},
    }), 200


@images_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 12, type=int)

    pagination = (
        ImageHistory.query
        .filter_by(user_id=user_id)
        .order_by(ImageHistory.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify({
        "images": [img.to_dict() for img in pagination.items],
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "pages": pagination.pages,
    }), 200


@images_bp.route("/history/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_history(image_id):
    user_id = int(get_jwt_identity())

    image = ImageHistory.query.filter_by(id=image_id, user_id=user_id).first()
    if not image:
        return jsonify({"error": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Image deleted successfully"}), 200
