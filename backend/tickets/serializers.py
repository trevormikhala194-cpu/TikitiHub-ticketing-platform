from rest_framework import serializers

from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):

    owner = serializers.StringRelatedField(read_only=True)

    event_title = serializers.CharField(
        source="event.title",
        read_only=True,
    )

    class Meta:
        model = Ticket
        fields = (
            "id",
            "ticket_number",
            "qr_code",
            "owner",
            "event",
            "event_title",
            "status",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "ticket_number",
            "qr_code",
            "owner",
            "created_at",
            "updated_at",
        )