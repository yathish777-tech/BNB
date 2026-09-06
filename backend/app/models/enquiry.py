from app import db
from datetime import datetime, timezone


class Enquiry(db.Model):
    __tablename__ = 'enquiries'

    STATUSES = ('NEW', 'CONTACTED', 'CLOSED')

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(200), nullable=False)
    phone       = db.Column(db.String(30), nullable=False)
    email       = db.Column(db.String(255), nullable=True)
    event_type  = db.Column(db.String(120), nullable=False)
    event_date  = db.Column(db.Date, nullable=True)
    location    = db.Column(db.String(300), nullable=True)
    guest_count = db.Column(db.Integer, nullable=True)
    message     = db.Column(db.Text, nullable=False)
    status      = db.Column(db.String(20), nullable=False, default='NEW')
    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                            onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id':          self.id,
            'name':        self.name,
            'phone':       self.phone,
            'email':       self.email,
            'event_type':  self.event_type,
            'event_date':  self.event_date.isoformat() if self.event_date else None,
            'location':    self.location,
            'guest_count': self.guest_count,
            'message':     self.message,
            'status':      self.status,
            'created_at':  self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Enquiry {self.id} {self.name}>'
