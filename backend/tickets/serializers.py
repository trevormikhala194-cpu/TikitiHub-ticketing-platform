from rest_framework import serializers

from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):

    owner = serializers.StringRelatedField(read_only=True)

    event_title = serializers.CharField(
        source="event.title",
        read_only=True,
    )

    booking_id = serializers.IntegerField(
        source="booking.id",
        read_only=True,
    )

    class Meta:
        model = Ticket
        fields = (
            "id",
            "ticket_number",
            "qr_code",
            "qr_image",
            "owner",
            "event",
            "event_title",
            "booking_id",
            "status",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "ticket_number",
            "qr_code",
            "qr_image",
            "owner",
            "event",
            "booking_id",
            "status",
            "created_at",
            "updated_at",
        )