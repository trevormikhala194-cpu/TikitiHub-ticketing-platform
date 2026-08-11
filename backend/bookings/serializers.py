from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    customer = serializers.StringRelatedField(
        read_only=True,
    )

    event_title = serializers.CharField(
        source="event.title",
        read_only=True,
    )

    class Meta:
        model = Booking
        fields = (
            "id",
            "customer",
            "event",
            "event_title",
            "quantity",
            "total_amount",
            "status",
            "booked_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "customer",
            "total_amount",
            "status",
            "booked_at",
            "updated_at",
        )

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than zero."
            )
        return value