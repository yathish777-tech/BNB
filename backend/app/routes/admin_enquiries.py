from flask import Blueprint, request, jsonify
from app import db
from app.models.enquiry import Enquiry
from app.utils.decorators import admin_required

admin_enquiries_bp = Blueprint('admin_enquiries', __name__)


@admin_enquiries_bp.route('', methods=['GET'])
@admin_required
def list_enquiries():
    status = request.args.get('status')
    q = Enquiry.query
    if status and status in Enquiry.STATUSES:
        q = q.filter_by(status=status)
    enquiries = q.order_by(Enquiry.created_at.desc()).all()
    return jsonify({'success': True, 'enquiries': [e.to_dict() for e in enquiries]})


@admin_enquiries_bp.route('/<int:enquiry_id>', methods=['GET'])
@admin_required
def get_enquiry(enquiry_id):
    e = db.session.get(Enquiry, enquiry_id)
    if not e:
        return jsonify({'success': False, 'message': 'Enquiry not found.'}), 404
    return jsonify({'success': True, 'enquiry': e.to_dict()})


@admin_enquiries_bp.route('/<int:enquiry_id>/status', methods=['PUT'])
@admin_required
def update_status(enquiry_id):
    e = db.session.get(Enquiry, enquiry_id)
    if not e:
        return jsonify({'success': False, 'message': 'Enquiry not found.'}), 404

    data   = request.get_json(silent=True) or {}
    status = (data.get('status') or '').upper()

    if status not in Enquiry.STATUSES:
        return jsonify({
            'success': False,
            'message': f'Invalid status. Allowed: {", ".join(Enquiry.STATUSES)}'
        }), 422

    e.status = status
    db.session.commit()
    return jsonify({'success': True, 'enquiry': e.to_dict()})
