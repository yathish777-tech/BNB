# models package — import all models so SQLAlchemy / Alembic can discover them
from app.models.admin import AdminUser          # noqa: F401
from app.models.category import EventCategory  # noqa: F401
from app.models.event_image import EventImage  # noqa: F401
from app.models.enquiry import Enquiry         # noqa: F401
