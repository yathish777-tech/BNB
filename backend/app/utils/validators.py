import re


def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    # Accept 7–15 digits, optional + prefix
    cleaned = re.sub(r'[\s\-()]', '', phone)
    return bool(re.match(r'^\+?\d{7,15}$', cleaned))


def validate_enquiry(data: dict) -> list[str]:
    """Return list of error strings. Empty list = valid."""
    errors = []
    if not (data.get('name') or '').strip():
        errors.append('Name is required.')
    if not (data.get('phone') or '').strip():
        errors.append('Phone number is required.')
    elif not validate_phone(data['phone']):
        errors.append('Phone number is invalid.')
    if not (data.get('event_type') or '').strip():
        errors.append('Event type is required.')
    if not (data.get('message') or '').strip():
        errors.append('Message is required.')
    email = data.get('email', '').strip()
    if email and not validate_email(email):
        errors.append('Email address is invalid.')
    return errors


def validate_parallax_direction(direction: str) -> bool:
    return direction in ('ltr', 'rtl')
