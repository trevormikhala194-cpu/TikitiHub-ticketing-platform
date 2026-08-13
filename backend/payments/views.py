from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
)

from bookings.models import Booking
from .models import Payment
from .serializers import (
    PaymentSerializer,
    STKPushSerializer,
)
from .services import DarajaService


class STKPushView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=STKPushSerializer,
        responses={
            200: PaymentSerializer,
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="Booking Not Found"),
        },
    )
    @transaction.atomic
    def post(self, request):

        booking_id = request.data.get("booking")
        phone_number = request.data.get("phone_number")

        if not booking_id or not phone_number:
            return Response(
                {
                    "error": "booking and phone_number are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            booking = Booking.objects.get(
                id=booking_id,
                customer=request.user,
            )

        except Booking.DoesNotExist:
            return Response(
                {
                    "error": "Booking not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if hasattr(booking, "payment"):

            if booking.payment.status == Payment.Status.COMPLETED:
                return Response(
                    {
                        "error": "This booking has already been paid."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            payment = booking.payment

        else:

            payment = Payment.objects.create(
                booking=booking,
                phone_number=phone_number,
                amount=booking.total_amount,
            )

        response = DarajaService.initiate_stk_push(
            phone_number=phone_number,
            amount=payment.amount,
            account_reference=f"Booking-{booking.id}",
            transaction_desc="TikitiHub Ticket Payment",
        )

        if response.get("ResponseCode") == "0":

            payment.checkout_request_id = response["CheckoutRequestID"]
            payment.merchant_request_id = response["MerchantRequestID"]
            payment.save()

            serializer = PaymentSerializer(payment)

            return Response(
                {
                    "message": "STK Push sent successfully.",
                    "payment": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            response,
            status=status.HTTP_400_BAD_REQUEST,
        )