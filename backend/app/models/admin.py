from app import db
from datetime import datetime, timezone


class AdminUser(db.Model):
    __tablename__ = 'admin_users'

    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(120), nullable=False, default='Administrator')
    email        = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role         = db.Column(db.String(50), nullable=False, default='ADMIN')
    is_active    = db.Column(db.Boolean, default=True, nullable=False)
    created_at   = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at   = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                             onupdate=lambda: datetime.now(timezone.utc))
    last_login_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id':    self.id,
            'name':  self.name,
            'email': self.email,
            'role':  self.role,
        }

    def __repr__(self):
        return f'<AdminUser {self.email}>'
