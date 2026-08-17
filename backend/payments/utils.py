import base64
import requests
from datetime import datetime

from django.conf import settings


class DarajaService:

    BASE_URL = "https://sandbox.safaricom.co.ke"

    @classmethod
    def get_access_token(cls):

        consumer_key = settings.DARAJA_CONSUMER_KEY
        consumer_secret = settings.DARAJA_CONSUMER_SECRET

        auth = base64.b64encode(
            f"{consumer_key}:{consumer_secret}".encode()
        ).decode()

        headers = {
            "Authorization": f"Basic {auth}"
        }

        response = requests.get(
            f"{cls.BASE_URL}/oauth/v1/generate?grant_type=client_credentials",
            headers=headers,
        )

        data = response.json()

        return data["access_token"]