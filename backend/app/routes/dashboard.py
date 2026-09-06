from flask import Blueprint, jsonify
from app import db
from app.models.enquiry import Enquiry
from app.models.event_image import EventImage
from app.models.category import EventCategory
from app.utils.decorators import admin_required

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/stats')
@admin_required
def stats():
    total_images      = EventImage.query.count()
    total_categories  = EventCategory.query.count()
    active_categories = EventCategory.query.filter_by(is_active=True).count()
    total_enquiries   = Enquiry.query.count()
    new_enquiries     = Enquiry.query.filter_by(status='NEW').count()

    return jsonify({
        'success': True,
        'stats': {
            'total_images':       total_images,
            'total_categories':   total_categories,
            'active_categories':  active_categories,
            'total_enquiries':    total_enquiries,
            'new_enquiries':      new_enquiries,
        }
    })
