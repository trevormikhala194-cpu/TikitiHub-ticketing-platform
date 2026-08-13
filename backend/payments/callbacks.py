import json

from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from tickets.models import Ticket
from .models import Payment


class DarajaCallbackView(APIView):
    """
    Receives M-Pesa STK Push callback from Safaricom.
    Updates payment, confirms booking, and generates tickets.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        callback = request.data

        print("=" * 60)
        print("DARAJA CALLBACK RECEIVED")
        print(json.dumps(callback, indent=4))
        print("=" * 60)

        try:
            stk_callback = callback["Body"]["stkCallback"]

            checkout_request_id = stk_callback["CheckoutRequestID"]
            result_code = stk_callback["ResultCode"]

            payment = Payment.objects.get(
                checkout_request_id=checkout_request_id
            )

            if result_code == 0:

                # ----------------------------
                # Update Payment
                # ----------------------------
                payment.status = Payment.Status.COMPLETED
                payment.paid_at = timezone.now()

                metadata = stk_callback.get(
                    "CallbackMetadata",
                    {}
                ).get(
                    "Item",
                    []
                )

                for item in metadata:
                    if item.get("Name") == "MpesaReceiptNumber":
                        payment.mpesa_receipt_number = item.get("Value")

                payment.save()

                # ----------------------------
                # Confirm Booking
                # ----------------------------
                booking = payment.booking
                booking.status = Booking.Status.CONFIRMED
                booking.save()

                # ----------------------------
                # Generate Tickets
                # ----------------------------
                existing_tickets = Ticket.objects.filter(
                    booking=booking
                ).count()

                if existing_tickets == 0:
                    for _ in range(booking.quantity):
                        Ticket.objects.create(
                            owner=booking.customer,
                            event=booking.event,
                            booking=booking,
                        )

                    print(
                        f"Generated {booking.quantity} ticket(s) "
                        f"for Booking {booking.id}"
                    )
                else:
                    print(
                        f"Booking {booking.id} already has "
                        f"{existing_tickets} ticket(s)."
                    )

                print("========== PAYMENT UPDATED ==========")
                print(f"Payment ID: {payment.id}")
                print(f"Status: {payment.status}")
                print(f"Receipt: {payment.mpesa_receipt_number}")
                print(f"Paid At: {payment.paid_at}")
                print(f"Booking Status: {booking.status}")
                print("=====================================")

            else:

                payment.status = Payment.Status.FAILED
                payment.save()

                print("========== PAYMENT FAILED ==========")
                print(f"Payment ID: {payment.id}")
                print(f"Result Code: {result_code}")
                print(f"Reason: {stk_callback['ResultDesc']}")
                print("====================================")

        except Payment.DoesNotExist:

            print(
                f"Payment not found for CheckoutRequestID: "
                f"{checkout_request_id}"
            )

        except Exception as e:

            print("Callback Error:", str(e))

        return Response(
            {
                "ResultCode": 0,
                "ResultDesc": "Accepted",
            },
            status=status.HTTP_200_OK,
        )