"""
seed_admin.py
─────────────
Creates the admin account and seeds all 16 event categories (with
parallax directions) if they do not already exist.

Run from the backend/ directory:
    python seed_admin.py
"""

import os
import sys
from dotenv import load_dotenv

# Load .env from the backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

from app import create_app, db
from app.services.auth_service import seed_admin, hash_password
from app.models.category import EventCategory

CATEGORIES = [
    ("Engagement",               "ltr",  1,  "Elegant engagement decoration and stage designs crafted around your love story."),
    ("Reception",                "rtl",  2,  "Grand reception venues transformed into unforgettable celebrations."),
    ("Wedding",                  "ltr",  3,  "Timeless wedding setups that capture every precious emotion."),
    ("Birthday",                 "rtl",  4,  "Vibrant birthday setups that make every year feel extraordinary."),
    ("Baby Shower",              "ltr",  5,  "Warm and beautiful décor to welcome the newest addition to your family."),
    ("Naming Ceremony",          "rtl",  6,  "Sacred and elegant setups to celebrate a child's first milestone."),
    ("Garlands",                 "ltr",  7,  "Exquisite floral garlands handcrafted for every auspicious occasion."),
    ("Photography & Videography","rtl",  8,  "Professional photography and cinematography to preserve your memories forever."),
    ("LED Walls",                "ltr",  9,  "High-definition LED wall installations that elevate any event's visual experience."),
    ("Haldi",                    "rtl", 10,  "Vibrant and joyful Haldi ceremony setups filled with colour and tradition."),
    ("Games",                    "ltr", 11,  "Creative entertainment setups and curated games to keep guests engaged."),
    ("Celebrity Bookings",       "rtl", 12,  "Exclusive celebrity appearances and performances for elite events."),
    ("House Warming Ceremony",   "ltr", 13,  "Beautiful and traditional setups to bless your new home with warmth."),
    ("Opening Ceremonies",       "rtl", 14,  "Impactful grand openings and ribbon-cutting ceremonies that make a statement."),
    ("Corporate Events",         "ltr", 15,  "Sophisticated corporate event setups that reflect your brand's prestige."),
    ("Other Services",           "rtl", 16,  "Custom event solutions tailored to any unique celebration or occasion."),
]


def seed_categories(app):
    with app.app_context():
        created = 0
        for (name, direction, order, desc) in CATEGORIES:
            slug = EventCategory.make_slug(name)
            existing = EventCategory.query.filter_by(slug=slug).first()
            if existing:
                print(f'  [skip] Category already exists: {name}')
                continue
            cat = EventCategory(
                name               = name,
                slug               = slug,
                description        = desc,
                display_order      = order,
                parallax_direction = direction,
                is_active          = True,
            )
            db.session.add(cat)
            created += 1
            print(f'  [+] Category: {name} ({direction})')
        db.session.commit()
        print(f'[seed] {created} categories created.')


def main():
    app = create_app()
    with app.app_context():
        # Create all tables if they don't exist yet (safe, non-destructive)
        db.create_all()
        print('[seed] Tables ensured.')

        # Seed admin
        seed_admin()

        # Seed categories
        seed_categories(app)

    print('[seed] Done.')


if __name__ == '__main__':
    main()
