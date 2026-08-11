from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ValidationError

from .models import Booking
from .serializers import BookingSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        event = serializer.validated_data["event"]
        quantity = serializer.validated_data["quantity"]

        # Validate ticket availability
        if quantity > event.capacity:
            raise ValidationError(
                {
                    "quantity": (
                        f"Only {event.capacity} tickets are available."
                    )
                }
            )

        # Calculate total booking amount
        total_amount = event.ticket_price * quantity

        serializer.save(
            customer=self.request.user,
            total_amount=total_amount,
        )


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]