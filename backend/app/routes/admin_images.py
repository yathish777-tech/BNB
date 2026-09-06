from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.event_image import EventImage
from app.models.category import EventCategory
from app.utils.decorators import admin_required
from app.services.image_service import save_image, delete_image_file

admin_images_bp = Blueprint('admin_images', __name__)


@admin_images_bp.route('', methods=['GET'])
@admin_required
def list_images():
    cat_id = request.args.get('category_id', type=int)
    q = EventImage.query
    if cat_id:
        q = q.filter_by(category_id=cat_id)
    images = q.order_by(EventImage.category_id, EventImage.display_order).all()
    return jsonify({'success': True, 'images': [i.to_dict() for i in images]})


@admin_images_bp.route('', methods=['POST'])
@admin_required
def upload_image():
    # Expect multipart/form-data
    category_id   = request.form.get('category_id', type=int)
    title         = request.form.get('title', '').strip() or None
    description   = request.form.get('description', '').strip() or None
    display_order = request.form.get('display_order', 0, type=int)
    is_featured   = request.form.get('is_featured', 'false').lower() == 'true'

    if not category_id:
        return jsonify({'success': False, 'message': 'category_id is required.'}), 422

    cat = db.session.get(EventCategory, category_id)
    if not cat:
        return jsonify({'success': False, 'message': 'Category not found.'}), 404

    file = request.files.get('image')
    if not file:
        return jsonify({'success': False, 'message': 'Image file is required.'}), 422

    try:
        paths = save_image(file, cat.slug)
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 422

    # If marking as featured, unfeature all others in the same category
    if is_featured:
        EventImage.query.filter_by(category_id=cat.id, is_featured=True).update({'is_featured': False})

    img = EventImage(
        category_id   = cat.id,
        image_url     = paths['image_url'],
        thumbnail_url = paths['thumbnail_url'],
        title         = title,
        description   = description,
        display_order = display_order,
        is_featured   = is_featured,
        is_active     = True,
    )
    db.session.add(img)
    db.session.commit()
    return jsonify({'success': True, 'image': img.to_dict()}), 201


@admin_images_bp.route('/<int:image_id>', methods=['GET'])
@admin_required
def get_image(image_id):
    img = db.session.get(EventImage, image_id)
    if not img:
        return jsonify({'success': False, 'message': 'Image not found.'}), 404
    return jsonify({'success': True, 'image': img.to_dict()})


@admin_images_bp.route('/<int:image_id>', methods=['PUT'])
@admin_required
def update_image(image_id):
    img = db.session.get(EventImage, image_id)
    if not img:
        return jsonify({'success': False, 'message': 'Image not found.'}), 404

    data = request.get_json(silent=True) or {}

    if 'title' in data:
        img.title = data['title']
    if 'description' in data:
        img.description = data['description']
    if 'display_order' in data:
        img.display_order = int(data['display_order'])
    if 'is_active' in data:
        img.is_active = bool(data['is_active'])
    if 'is_featured' in data:
        new_featured = bool(data['is_featured'])
        if new_featured and not img.is_featured:
            # Unfeature others in the same category
            EventImage.query.filter(
                EventImage.category_id == img.category_id,
                EventImage.id != img.id,
                EventImage.is_featured == True
            ).update({'is_featured': False})
        img.is_featured = new_featured

    # Optional category move
    if 'category_id' in data:
        new_cat = db.session.get(EventCategory, int(data['category_id']))
        if not new_cat:
            return jsonify({'success': False, 'message': 'Category not found.'}), 404
        img.category_id = new_cat.id

    db.session.commit()
    return jsonify({'success': True, 'image': img.to_dict()})


@admin_images_bp.route('/<int:image_id>', methods=['DELETE'])
@admin_required
def delete_image(image_id):
    img = db.session.get(EventImage, image_id)
    if not img:
        return jsonify({'success': False, 'message': 'Image not found.'}), 404

    delete_image_file(img.image_url)
    delete_image_file(img.thumbnail_url)

    db.session.delete(img)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Image deleted.'})


@admin_images_bp.route('/<int:image_id>/replace', methods=['POST'])
@admin_required
def replace_image(image_id):
    img = db.session.get(EventImage, image_id)
    if not img:
        return jsonify({'success': False, 'message': 'Image not found.'}), 404

    cat = db.session.get(EventCategory, img.category_id)
    file = request.files.get('image')
    if not file:
        return jsonify({'success': False, 'message': 'Image file is required.'}), 422

    try:
        paths = save_image(file, cat.slug)
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 422

    # Remove old files
    delete_image_file(img.image_url)
    delete_image_file(img.thumbnail_url)

    img.image_url     = paths['image_url']
    img.thumbnail_url = paths['thumbnail_url']
    db.session.commit()
    return jsonify({'success': True, 'image': img.to_dict()})
