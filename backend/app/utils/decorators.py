from functools import wraps
from flask import jsonify
from app.services.auth_service import get_current_admin


def admin_required(f):
    """Decorator: requires a valid admin session. Returns 401 if not authenticated."""
    @wraps(f)
    def decorated(*args, **kwargs):
        admin = get_current_admin()
        if not admin:
            return jsonify({'success': False, 'message': 'Authentication required.'}), 401
        if not admin.is_active:
            return jsonify({'success': False, 'message': 'Account is disabled.'}), 403
        return f(*args, **kwargs)
    return decorated
