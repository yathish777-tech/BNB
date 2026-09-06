import os
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session
from app import db
from app.models.admin import AdminUser


# ── Password helpers ──────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    return generate_password_hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return check_password_hash(hashed, plain)


# ── Session-based auth ────────────────────────────────────────────────────────

SESSION_KEY = 'admin_id'


def login_admin(admin: AdminUser) -> None:
    """Store admin id in server-side session."""
    session.permanent = True
    session[SESSION_KEY] = admin.id
    admin.last_login_at = datetime.now(timezone.utc)
    db.session.commit()


def logout_admin() -> None:
    session.pop(SESSION_KEY, None)


def get_current_admin() -> AdminUser | None:
    admin_id = session.get(SESSION_KEY)
    if not admin_id:
        return None
    return db.session.get(AdminUser, admin_id)


# ── Seed admin account ────────────────────────────────────────────────────────

def seed_admin() -> None:
    """Create the admin account from env vars if it does not already exist."""
    email    = os.getenv('ADMIN_EMAIL', 'adminbnb@gmail.com')
    password = os.getenv('ADMIN_PASSWORD', 'adminbnb@321')

    existing = AdminUser.query.filter_by(email=email).first()
    if existing:
        print(f'[seed] Admin already exists: {email}')
        return

    admin = AdminUser(
        name          = 'B&B Admin',
        email         = email,
        password_hash = hash_password(password),
        role          = 'ADMIN',
        is_active     = True,
    )
    db.session.add(admin)
    db.session.commit()
    print(f'[seed] Admin created: {email}')
