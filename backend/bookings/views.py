from django.db import transaction
from django.db.models import Sum
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Booking
from .serializers import BookingSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(customer=self.request.user)
            .select_related("event")
        )

    @transaction.atomic
    def perform_create(self, serializer):
        event = serializer.validated_data["event"]
        quantity = serializer.validated_data["quantity"]

        if event.status != "PUBLISHED":
            raise ValidationError(
                {
                    "event": (
                        "Tickets cannot be booked for an "
                        "unpublished event."
                    )
                }
            )

        booked_quantity = (
            Booking.objects
            .filter(
                event=event,
                status__in=[
                    Booking.Status.PENDING,
                    Booking.Status.CONFIRMED,
                ],
            )
            .aggregate(
                total=Sum("quantity")
            )
            .get("total")
            or 0
        )

        remaining_tickets = event.capacity - booked_quantity

        if quantity > remaining_tickets:
            raise ValidationError(
                {
                    "quantity": (
                        f"Only {remaining_tickets} tickets "
                        "are available."
                    )
                }
            )

        total_amount = event.ticket_price * quantity

        serializer.save(
            customer=self.request.user,
            total_amount=total_amount,
        )


class BookingDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(customer=self.request.user)
            .select_related("event")
        )