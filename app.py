from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# CORS configuration
CORS(app, origins=["*"])

@app.route("/")
def index():
    return jsonify({"status": "ok", "message": "AI Image Generator API is running"})

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "message": "AI Image Generator API is running"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
