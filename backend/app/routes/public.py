from flask import Blueprint, jsonify, request, send_from_directory, current_app
from app.models.category import EventCategory
from app.models.event_image import EventImage
from app.models.enquiry import Enquiry
from app.utils.validators import validate_enquiry
from app import db
from datetime import date

public_bp = Blueprint('public', __name__)


# ── Health check ──────────────────────────────────────────────────────────────

@public_bp.route('/health')
def health():
    return jsonify({'success': True, 'message': 'B&B Event Planners API is running'})


# ── Serve uploaded files ──────────────────────────────────────────────────────

@public_bp.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)


# ── Public categories ─────────────────────────────────────────────────────────

@public_bp.route('/categories')
def get_categories():
    cats = (EventCategory.query
            .filter_by(is_active=True)
            .order_by(EventCategory.display_order)
            .all())
    return jsonify({'success': True, 'categories': [c.to_public_dict() for c in cats]})


# ── Featured image for a category ────────────────────────────────────────────

@public_bp.route('/categories/<slug>/featured')
def get_featured_image(slug):
    cat = EventCategory.query.filter_by(slug=slug, is_active=True).first()
    if not cat:
        return jsonify({'success': False, 'message': 'Category not found.'}), 404

    # Try explicitly featured first
    img = (EventImage.query
           .filter_by(category_id=cat.id, is_featured=True, is_active=True)
           .first())

    # Fall back to first active image by display_order
    if not img:
        img = (EventImage.query
               .filter_by(category_id=cat.id, is_active=True)
               .order_by(EventImage.display_order)
               .first())

    if not img:
        return jsonify({'success': False, 'message': 'No image found for this category.'}), 404

    return jsonify({
        'success':  True,
        'category': cat.to_public_dict(),
        'image':    img.to_public_dict(),
    })


# ── Full gallery for a category ───────────────────────────────────────────────

@public_bp.route('/categories/<slug>/images')
def get_category_images(slug):
    cat = EventCategory.query.filter_by(slug=slug, is_active=True).first()
    if not cat:
        return jsonify({'success': False, 'message': 'Category not found.'}), 404

    images = (EventImage.query
              .filter_by(category_id=cat.id, is_active=True)
              .order_by(EventImage.display_order)
              .all())

    return jsonify({
        'success':  True,
        'category': cat.to_public_dict(),
        'images':   [i.to_public_dict() for i in images],
    })


# ── Submit enquiry ────────────────────────────────────────────────────────────

@public_bp.route('/enquiries', methods=['POST'])
def submit_enquiry():
    data = request.get_json(silent=True) or {}
    errors = validate_enquiry(data)
    if errors:
        return jsonify({'success': False, 'message': errors[0], 'errors': errors}), 422

    # Parse optional date
    event_date = None
    raw_date = data.get('event_date', '').strip()
    if raw_date:
        try:
            event_date = date.fromisoformat(raw_date)
        except ValueError:
            pass

    enquiry = Enquiry(
        name        = data['name'].strip(),
        phone       = data['phone'].strip(),
        email       = data.get('email', '').strip() or None,
        event_type  = data['event_type'].strip(),
        event_date  = event_date,
        location    = data.get('location', '').strip() or None,
        guest_count = data.get('guest_count') or None,
        message     = data['message'].strip(),
        status      = 'NEW',
    )
    db.session.add(enquiry)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Thank you. Your enquiry has been received. Our team will contact you shortly.',
        'id':      enquiry.id,
    }), 201
