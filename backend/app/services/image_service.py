import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image as PILImage
import io
from flask import current_app

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
MAX_BYTES = 10 * 1024 * 1024  # 10 MB


def _allowed_file(filename: str) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_image(file_storage, category_slug: str) -> dict:
    """
    Validate and save an uploaded image.
    Returns {'image_url': ..., 'thumbnail_url': ...} or raises ValueError.
    """
    if not file_storage or file_storage.filename == '':
        raise ValueError('No file provided.')

    if not _allowed_file(file_storage.filename):
        raise ValueError('File type not allowed. Use JPG, JPEG, PNG, or WEBP.')

    # Read content for size + integrity check
    content = file_storage.read()
    if len(content) > MAX_BYTES:
        raise ValueError('File exceeds 10 MB limit.')

    # Verify it is actually an image
    try:
        img = PILImage.open(io.BytesIO(content))
        img.verify()
    except Exception:
        raise ValueError('Invalid image file.')

    # Safe unique filename
    ext = file_storage.filename.rsplit('.', 1)[1].lower()
    filename = f'{uuid.uuid4().hex}.{ext}'

    # Category subfolder (slugified)
    upload_root = current_app.config['UPLOAD_FOLDER']
    cat_folder  = os.path.join(upload_root, category_slug)
    os.makedirs(cat_folder, exist_ok=True)

    # Save original
    filepath = os.path.join(cat_folder, filename)
    with open(filepath, 'wb') as f:
        f.write(content)

    # Save thumbnail (400px wide)
    thumb_name = f'thumb_{filename}'
    thumb_path = os.path.join(cat_folder, thumb_name)
    try:
        thumb_img = PILImage.open(io.BytesIO(content))
        thumb_img.thumbnail((400, 400))
        thumb_img.save(thumb_path)
    except Exception:
        thumb_name = filename  # fall back to original

    image_url     = f'/uploads/{category_slug}/{filename}'
    thumbnail_url = f'/uploads/{category_slug}/{thumb_name}'

    return {'image_url': image_url, 'thumbnail_url': thumbnail_url}


def delete_image_file(image_url: str) -> None:
    """Remove file from disk, ignoring errors."""
    if not image_url:
        return
    try:
        upload_root = current_app.config['UPLOAD_FOLDER']
        # image_url is like /uploads/engagement/abc.jpg
        rel = image_url.lstrip('/').replace('/', os.sep)
        # strip the "uploads/" prefix since UPLOAD_FOLDER already points there
        parts = rel.split(os.sep, 1)
        if len(parts) == 2:
            filepath = os.path.join(upload_root, parts[1])
        else:
            filepath = os.path.join(upload_root, rel)
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception:
        pass
