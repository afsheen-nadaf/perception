import os
from datetime import datetime, timezone
from atproto import Client
from dotenv import load_dotenv

load_dotenv()

BLUESKY_HANDLE = os.getenv("BLUESKY_HANDLE")
BLUESKY_APP_PASSWORD = os.getenv("BLUESKY_APP_PASSWORD")

print(f"DEBUG: BLUESKY_HANDLE = {BLUESKY_HANDLE}")  # add this temporarily
print(f"DEBUG: BLUESKY_APP_PASSWORD = {'SET' if BLUESKY_APP_PASSWORD else 'NOT SET'}")

if not BLUESKY_HANDLE or not BLUESKY_APP_PASSWORD:
    raise RuntimeError("BLUESKY_HANDLE or BLUESKY_APP_PASSWORD env vars are not set!")

client = Client()
try:
    client.login(BLUESKY_HANDLE, BLUESKY_APP_PASSWORD)
    client.request.timeout = 30.0
    print("✅ Successfully authenticated with Bluesky AT Protocol.")
except Exception as e:
    print(f"❌ Failed to authenticate with Bluesky: {e}")
    raise