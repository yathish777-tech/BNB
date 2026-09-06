from flask import Blueprint, jsonify
from app.services.instagram_service import get_latest_instagram_media

instagram_bp = Blueprint('instagram', __name__)


@instagram_bp.route('/latest', methods=['GET'])
def get_latest_posts():
    """
    Returns the latest 10 Instagram media items for @bnbeventplanners in FIFO order (newest first).
    """
    try:
        media_items = get_latest_instagram_media(limit=10)
        
        if not media_items:
            return jsonify({
                'success': False,
                'message': 'Instagram updates are temporarily unavailable.',
                'data': []
            }), 200

        return jsonify({
            'success': True,
            'data': media_items,
            'count': len(media_items),
        }), 200
    except Exception as e:
        print(f"[Instagram Route Error]: {e}")
        return jsonify({
            'success': False,
            'message': 'Instagram updates are temporarily unavailable.',
            'error': str(e),
            'data': [],
        }), 500

