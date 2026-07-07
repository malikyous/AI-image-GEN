from datetime import datetime
from database import db


class ImageHistory(db.Model):
    __tablename__ = "image_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "prompt": self.prompt,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat(),
        }
