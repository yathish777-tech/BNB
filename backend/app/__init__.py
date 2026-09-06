import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env from backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # ── Configuration ───────────────────────────────────────────────────────
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-change-me')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # Upload folder lives at project root: BNB/uploads (not backend/uploads)
    app.config['UPLOAD_FOLDER'] = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        os.getenv('UPLOAD_FOLDER', 'uploads')
    )
    app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB

    # ── CORS ────────────────────────────────────────────────────────────────
    import re
    from flask import request, make_response

    CORS(
        app,
        resources={r'/api/*': {'origins': '*'}},
        supports_credentials=True,
    )

    @app.before_request
    def handle_preflight():
        if request.method == 'OPTIONS':
            res = make_response()
            origin = request.headers.get('Origin') or '*'
            res.headers['Access-Control-Allow-Origin'] = origin
            res.headers['Access-Control-Allow-Credentials'] = 'true'
            res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
            res.headers['Access-Control-Allow-Headers'] = request.headers.get(
                'Access-Control-Request-Headers', 'Content-Type, Authorization, X-Requested-With'
            )
            res.headers['Access-Control-Allow-Private-Network'] = 'true'
            return res, 200

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        if origin:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
            response.headers['Access-Control-Allow-Private-Network'] = 'true'
        return response

    # ── Extensions ──────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)

    # ── Ensure upload directory exists ──────────────────────────────────────
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # ── Register blueprints ─────────────────────────────────────────────────
    from app.routes.public import public_bp
    from app.routes.auth import auth_bp
    from app.routes.admin_images import admin_images_bp
    from app.routes.admin_categories import admin_categories_bp
    from app.routes.admin_enquiries import admin_enquiries_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.instagram import instagram_bp

    app.register_blueprint(public_bp,           url_prefix='/api')
    app.register_blueprint(instagram_bp,        url_prefix='/api/instagram')
    app.register_blueprint(auth_bp,             url_prefix='/api/admin/auth')
    app.register_blueprint(admin_images_bp,     url_prefix='/api/admin/images')
    app.register_blueprint(admin_categories_bp, url_prefix='/api/admin/categories')
    app.register_blueprint(admin_enquiries_bp,  url_prefix='/api/admin/enquiries')
    app.register_blueprint(dashboard_bp,        url_prefix='/api/admin/dashboard')

    # ── Import models so Alembic/Migrate sees them ─────────────────────────
    from app.models import admin, category, event_image, enquiry  # noqa: F401

    return app
