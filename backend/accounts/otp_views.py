from datetime import timedelta
import secrets

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .otp_models import OTPVerification


def generate_otp():
    return f"{secrets.randbelow(1_000_000):06d}"


class RequestOTPView(APIView):
    """
    Request an OTP using an email address or phone number.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
        purpose = request.data.get(
            "purpose",
            OTPVerification.Purpose.LOGIN,
        )

        if not identifier:
            return Response(
                {
                    "identifier": (
                        "Email or phone number is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        identifier = identifier.strip()

        if purpose not in [
            OTPVerification.Purpose.REGISTRATION,
            OTPVerification.Purpose.LOGIN,
        ]:
            return Response(
                {
                    "purpose": "Invalid OTP purpose."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find user by email or phone number
        if "@" in identifier:
            user = User.objects.filter(
                email__iexact=identifier
            ).first()
        else:
            user = User.objects.filter(
                phone_number=identifier
            ).first()

        # LOGIN requires an existing account
        if (
            purpose == OTPVerification.Purpose.LOGIN
            and not user
        ):
            return Response(
                {
                    "identifier": "Account not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # REGISTRATION requires a new account
        if (
            purpose == OTPVerification.Purpose.REGISTRATION
            and user
        ):
            return Response(
                {
                    "identifier": (
                        "An account already exists."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create temporary user for registration
        if not user:
            username = f"user_{secrets.token_hex(6)}"

            if "@" in identifier:
                user = User.objects.create_user(
                    username=username,
                    email=identifier,
                    is_active=False,
                )
            else:
                user = User.objects.create_user(
                    username=username,
                    phone_number=identifier,
                    is_active=False,
                )

        # Invalidate previous unused OTPs
        OTPVerification.objects.filter(
            user=user,
            purpose=purpose,
            is_used=False,
        ).update(
            is_used=True
        )

        otp = generate_otp()

        OTPVerification.objects.create(
            user=user,
            identifier=identifier,
            otp_code=otp,
            purpose=purpose,
            expires_at=(
                timezone.now()
                + timedelta(minutes=5)
            ),
        )

        # DEVELOPMENT ONLY
        return Response(
            {
                "message": (
                    "OTP generated successfully."
                ),
                "identifier": identifier,
                "expires_in": 300,
                "development_otp": otp,
            },
            status=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):
    """
    Verify an OTP sent to an email address or phone number.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
        otp_code = request.data.get("otp_code")
        purpose = request.data.get(
            "purpose",
            OTPVerification.Purpose.LOGIN,
        )

        if not identifier or not otp_code:
            return Response(
                {
                    "detail": (
                        "Identifier and OTP code "
                        "are required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        identifier = identifier.strip()
        otp_code = str(otp_code).strip()

        verification = (
            OTPVerification.objects
            .filter(
                identifier=identifier,
                purpose=purpose,
                is_used=False,
            )
            .select_related("user")
            .first()
        )

        if not verification:
            return Response(
                {
                    "detail": (
                        "Invalid or expired OTP."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check expiration
        if verification.expires_at < timezone.now():
            return Response(
                {
                    "detail": "OTP has expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Maximum attempts
        if verification.attempts >= 5:
            return Response(
                {
                    "detail": (
                        "Too many OTP attempts."
                    )
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        verification.attempts += 1

        # Incorrect OTP
        if verification.otp_code != otp_code:
            verification.save(
                update_fields=["attempts"]
            )

            return Response(
                {
                    "detail": "Incorrect OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # OTP is correct
        verification.is_used = True

        verification.save(
            update_fields=[
                "attempts",
                "is_used",
            ]
        )

        user = verification.user

        user.is_verified = True
        user.is_active = True

        user.save(
            update_fields=[
                "is_verified",
                "is_active",
            ]
        )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "OTP verified successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "role": user.role,
                    "is_verified": user.is_verified,
                },
            },
            status=status.HTTP_200_OK,
        )