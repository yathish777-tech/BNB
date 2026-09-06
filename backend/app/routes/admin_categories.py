from flask import Blueprint, request, jsonify
from app import db
from app.models.category import EventCategory
from app.utils.decorators import admin_required
from app.utils.validators import validate_parallax_direction

admin_categories_bp = Blueprint('admin_categories', __name__)


@admin_categories_bp.route('', methods=['GET'])
@admin_required
def list_categories():
    cats = EventCategory.query.order_by(EventCategory.display_order).all()
    return jsonify({'success': True, 'categories': [c.to_dict() for c in cats]})


@admin_categories_bp.route('', methods=['POST'])
@admin_required
def create_category():
    data = request.get_json(silent=True) or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'name is required.'}), 422

    direction = data.get('parallax_direction', 'ltr')
    if not validate_parallax_direction(direction):
        return jsonify({'success': False, 'message': 'parallax_direction must be ltr or rtl.'}), 422

    slug = EventCategory.make_slug(name)
    if EventCategory.query.filter_by(slug=slug).first():
        return jsonify({'success': False, 'message': 'A category with this name already exists.'}), 409

    cat = EventCategory(
        name               = name,
        slug               = slug,
        description        = data.get('description', '').strip() or None,
        display_order      = data.get('display_order', 0),
        parallax_direction = direction,
        is_active          = data.get('is_active', True),
    )
    db.session.add(cat)
    db.session.commit()
    return jsonify({'success': True, 'category': cat.to_dict()}), 201


@admin_categories_bp.route('/<int:cat_id>', methods=['GET'])
@admin_required
def get_category(cat_id):
    cat = db.session.get(EventCategory, cat_id)
    if not cat:
        return jsonify({'success': False, 'message': 'Category not found.'}), 404
    return jsonify({'success': True, 'category': cat.to_dict()})


@admin_categories_bp.route('/<int:cat_id>', methods=['PUT'])
@admin_required
def update_category(cat_id):
    cat = db.session.get(EventCategory, cat_id)
    if not cat:
        return jsonify({'success': False, 'message': 'Category not found.'}), 404

    data = request.get_json(silent=True) or {}

    if 'name' in data and data['name'].strip():
        cat.name = data['name'].strip()
        cat.slug = EventCategory.make_slug(cat.name)
    if 'description' in data:
        cat.description = data['description']
    if 'display_order' in data:
        cat.display_order = int(data['display_order'])
    if 'parallax_direction' in data:
        if not validate_parallax_direction(data['parallax_direction']):
            return jsonify({'success': False, 'message': 'parallax_direction must be ltr or rtl.'}), 422
        cat.parallax_direction = data['parallax_direction']
    if 'is_active' in data:
        cat.is_active = bool(data['is_active'])

    db.session.commit()
    return jsonify({'success': True, 'category': cat.to_dict()})


@admin_categories_bp.route('/<int:cat_id>', methods=['DELETE'])
@admin_required
def delete_category(cat_id):
    cat = db.session.get(EventCategory, cat_id)
    if not cat:
        return jsonify({'success': False, 'message': 'Category not found.'}), 404

    # Cascade deletes images via SQLAlchemy relationship
    db.session.delete(cat)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Category deleted.'})
