from flask import Blueprint, request, jsonify
from app.services.auth_service import (
    verify_password, login_admin, logout_admin, get_current_admin
)
from app.models.admin import AdminUser
from app.utils.decorators import admin_required

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email    = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required.'}), 400

    admin = AdminUser.query.filter_by(email=email).first()
    if not admin or not verify_password(password, admin.password_hash):
        return jsonify({'success': False, 'message': 'Invalid email or password.'}), 401

    if not admin.is_active:
        return jsonify({'success': False, 'message': 'Account is disabled.'}), 403

    login_admin(admin)
    return jsonify({'success': True, 'admin': admin.to_dict()})


@auth_bp.route('/me')
@admin_required
def me():
    admin = get_current_admin()
    return jsonify({'success': True, 'authenticated': True, 'admin': admin.to_dict()})


@auth_bp.route('/logout', methods=['POST'])
@admin_required
def logout():
    logout_admin()
    return jsonify({'success': True, 'message': 'Logged out successfully.'})
