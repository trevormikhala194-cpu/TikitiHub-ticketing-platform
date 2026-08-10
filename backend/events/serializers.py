from rest_framework import serializers
from django.utils import timezone

from .models import Category, Venue, Event


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = (
            "id",
            "organizer",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        start = attrs.get("start_datetime")
        end = attrs.get("end_datetime")

        if start and start < timezone.now():
            raise serializers.ValidationError(
                "Event cannot start in the past."
            )

        if start and end <= start:
            raise serializers.ValidationError(
                "End time must be after the start time."
            )

        return attrs

    def validate_capacity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Capacity must be greater than zero."
            )
        return value

    def validate_ticket_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Ticket price cannot be negative."
            )
        return value