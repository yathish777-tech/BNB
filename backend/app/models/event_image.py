from app import db
from datetime import datetime, timezone


class EventImage(db.Model):
    __tablename__ = 'event_images'

    id            = db.Column(db.Integer, primary_key=True)
    category_id   = db.Column(db.Integer, db.ForeignKey('event_categories.id',
                               ondelete='CASCADE'), nullable=False, index=True)
    image_url     = db.Column(db.String(500), nullable=False)
    thumbnail_url = db.Column(db.String(500), nullable=True)
    title         = db.Column(db.String(200), nullable=True)
    description   = db.Column(db.Text, nullable=True)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    is_featured   = db.Column(db.Boolean, default=False, nullable=False)
    is_active     = db.Column(db.Boolean, default=True, nullable=False)
    created_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                              onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id':            self.id,
            'category_id':   self.category_id,
            'image_url':     self.image_url,
            'thumbnail_url': self.thumbnail_url or self.image_url,
            'title':         self.title,
            'description':   self.description,
            'display_order': self.display_order,
            'is_featured':   self.is_featured,
            'is_active':     self.is_active,
        }

    def to_public_dict(self):
        return {
            'id':            self.id,
            'image_url':     self.image_url,
            'thumbnail_url': self.thumbnail_url or self.image_url,
            'title':         self.title,
            'description':   self.description,
            'display_order': self.display_order,
            'is_featured':   self.is_featured,
        }

    def __repr__(self):
        return f'<EventImage {self.id} cat={self.category_id}>'
