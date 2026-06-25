import os
from datetime import datetime, timezone
from atproto import Client
from dotenv import load_dotenv

load_dotenv()

# Initialize once at module level
client = Client()

try:
    client.login(os.getenv("BLUESKY_HANDLE"), os.getenv("BLUESKY_APP_PASSWORD"))
    client.request.timeout = 30.0
    print("✅ Successfully authenticated with Bluesky AT Protocol.")
except Exception as e:
    print(f"❌ Failed to authenticate with Bluesky: {e}")


def fetch_bluesky_posts(topic, limit=200):
    print(f"=== DEBUG: Searching Bluesky for topic: '{topic}' ===")
    posts = []
    cursor = None

    while len(posts) < limit:
        current_limit = min(100, limit - len(posts))
        params = {'q': str(topic), 'limit': current_limit}

        if cursor:
            params['cursor'] = cursor

        try:
            response = client.app.bsky.feed.search_posts(params)
            if not response.posts:
                break

            for post in response.posts:
                if not post.record or not hasattr(post.record, 'text') or post.record.text is None:
                    continue

                posts.append({
                    "id": str(post.uri.split("/")[-1]),
                    "text": str(post.record.text),
                    "created_utc": str(post.record.created_at if hasattr(post.record, 'created_at') else datetime.now(timezone.utc).isoformat())
                })

            cursor = response.cursor
            if not cursor:
                break

        except Exception as e:
            print(f"Error during Bluesky fetch: {e}")
            if not posts:
                raise
            break

    return posts