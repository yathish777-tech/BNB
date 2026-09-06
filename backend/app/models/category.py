from app import db
from datetime import datetime, timezone
import re


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text


class EventCategory(db.Model):
    __tablename__ = 'event_categories'

    id                  = db.Column(db.Integer, primary_key=True)
    name                = db.Column(db.String(120), nullable=False)
    slug                = db.Column(db.String(120), unique=True, nullable=False, index=True)
    description         = db.Column(db.Text, nullable=True)
    display_order       = db.Column(db.Integer, default=0, nullable=False)
    parallax_direction  = db.Column(db.String(10), nullable=False, default='ltr')  # 'ltr' or 'rtl'
    is_active           = db.Column(db.Boolean, default=True, nullable=False)
    created_at          = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at          = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                                   onupdate=lambda: datetime.now(timezone.utc))

    # Relationship
    images = db.relationship('EventImage', backref='category',
                             lazy='dynamic', cascade='all, delete-orphan')

    @staticmethod
    def make_slug(name: str) -> str:
        return _slugify(name)

    def to_dict(self):
        return {
            'id':                 self.id,
            'name':               self.name,
            'slug':               self.slug,
            'description':        self.description,
            'parallax_direction': self.parallax_direction,
            'display_order':      self.display_order,
            'is_active':          self.is_active,
        }

    def to_public_dict(self):
        """Minimal dict for the public API."""
        return {
            'id':                 self.id,
            'name':               self.name,
            'slug':               self.slug,
            'description':        self.description,
            'parallax_direction': self.parallax_direction,
            'display_order':      self.display_order,
        }

    def __repr__(self):
        return f'<EventCategory {self.name}>'
