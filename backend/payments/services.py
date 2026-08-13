import base64
from datetime import datetime

import requests

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
            "Authorization": f"Basic {auth}",
        }

        response = requests.get(
            f"{cls.BASE_URL}/oauth/v1/generate?grant_type=client_credentials",
            headers=headers,
            timeout=30,
        )

        response.raise_for_status()

        return response.json()["access_token"]

    @classmethod
    def generate_timestamp(cls):
        return datetime.now().strftime("%Y%m%d%H%M%S")

    @classmethod
    def generate_password(cls, timestamp):
        password = (
            settings.DARAJA_SHORTCODE
            + settings.DARAJA_PASSKEY
            + timestamp
        )

        return base64.b64encode(
            password.encode()
        ).decode()

    @classmethod
    def initiate_stk_push(
        cls,
        phone_number,
        amount,
        account_reference,
        transaction_desc,
    ):
        access_token = cls.get_access_token()

        timestamp = cls.generate_timestamp()

        password = cls.generate_password(timestamp)

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        payload = {
            "BusinessShortCode": settings.DARAJA_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": settings.DARAJA_SHORTCODE,
            "PhoneNumber": phone_number,
            "CallBackURL": settings.DARAJA_CALLBACK_URL,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc,
        }

        response = requests.post(
            f"{cls.BASE_URL}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers,
            timeout=30,
        )

        print("\n========== DARAJA RESPONSE ==========")
        print("Status Code:", response.status_code)
        print("Response Body:", response.text)
        print("=====================================\n")

        try:
            return response.json()
        except Exception:
            return {
                "status_code": response.status_code,
                "response": response.text,
            }