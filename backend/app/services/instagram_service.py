import os
import json
import time
import urllib.request
import urllib.error
import logging

# ── In-Memory Cache (TTL: 5 minutes) ──────────────────────────────────────────
_cache = {
    'timestamp': 0,
    'data': None,
}
CACHE_TTL = 300  # 5 minutes in seconds


def fetch_instagram_media_from_api():
    """
    Calls the Meta Graph API or Instagram Basic Display API to fetch the latest posts.
    Returns a list of parsed media items, or None on failure.
    """
    token = os.getenv('INSTAGRAM_ACCESS_TOKEN', '').strip()
    account_id = os.getenv('INSTAGRAM_ACCOUNT_ID', '').strip()

    if not token:
        logging.error("[Instagram Service Error]: Missing INSTAGRAM_ACCESS_TOKEN environment variable.")
        return None

    # Determine endpoint based on provided credentials
    fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}'
    if account_id:
        url = f'https://graph.facebook.com/v19.0/{account_id}/media?fields={fields}&access_token={token}&limit=20'
    else:
        url = f'https://graph.instagram.com/me/media?fields={fields}&access_token={token}&limit=20'

    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'BnBEventPlanners-Backend/1.0',
            'Accept': 'application/json',
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                raw_data = response.read().decode('utf-8')
                parsed = json.loads(raw_data)
                items = parsed.get('data', [])
                
                result = []
                for item in items:
                    media_type = item.get('media_type', 'IMAGE')
                    media_url = item.get('media_url', '')
                    thumbnail_url = item.get('thumbnail_url') or media_url

                    # For carousel albums, try getting first child URL if media_url is empty
                    if media_type == 'CAROUSEL_ALBUM' and not media_url:
                        children = item.get('children', {}).get('data', [])
                        if children:
                            media_url = children[0].get('media_url', '')
                            thumbnail_url = children[0].get('thumbnail_url') or media_url

                    if not media_url:
                        logging.warning(f"[Instagram Service Warning]: Missing media_url for item {item.get('id')}. Skipping.")
                        continue

                    result.append({
                        'id': item.get('id', ''),
                        'media_type': media_type,
                        'media_url': media_url,
                        'thumbnail_url': thumbnail_url,
                        'caption': item.get('caption', ''),
                        'permalink': item.get('permalink', 'https://www.instagram.com/bnbeventplanners/'),
                        'timestamp': item.get('timestamp', ''),
                    })
                return result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
        logging.error(f"[Instagram Service Error]: HTTPError {e.code}: {error_body}")
        return None
    except Exception as e:
        logging.error(f"[Instagram Service Error]: {str(e)}")
        return None


def get_latest_instagram_media(limit=10):
    """
    Returns the latest `limit` (default 10) Instagram media items sorted descending by timestamp (FIFO).
    Uses 5-minute memory caching. Returns empty list if API fails.
    """
    global _cache
    now = time.time()

    # Return cached data if fresh
    if _cache['data'] is not None and (now - _cache['timestamp'] < CACHE_TTL):
        return _cache['data']

    # Fetch live media from Meta API
    live_items = fetch_instagram_media_from_api()

    if live_items and len(live_items) > 0:
        # Strict FIFO sorting: newest first, slice top `limit`
        sorted_items = sorted(
            live_items,
            key=lambda x: x.get('timestamp', ''),
            reverse=True
        )[:limit]
        _cache['timestamp'] = now
        _cache['data'] = sorted_items
        return sorted_items

    # Return empty list on failure so the route returns success: false
    return []

