import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

def get_db():
    if not firebase_admin._apps:
        firebase_config = json.loads(
            os.environ["FIREBASE_CREDENTIALS_JSON"]
        )

        cred = credentials.Certificate(firebase_config)

        firebase_admin.initialize_app(cred)

    return firestore.client()

db = get_db()