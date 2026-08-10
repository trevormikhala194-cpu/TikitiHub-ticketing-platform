from rest_framework import serializers
from django.utils import timezone

from .models import Category, Venue, Event


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = (
            "id",
            "organizer",
            "available_tickets",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        start = attrs.get("start_date")
        end = attrs.get("end_date")

        if start and start < timezone.now():
            raise serializers.ValidationError(
                "Event cannot start in the past."
            )

        if start and end and end <= start:
            raise serializers.ValidationError(
                "End date must be after the start date."
            )

        return attrs

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Price cannot be negative."
            )
        return value

    def validate_total_tickets(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Total tickets must be greater than zero."
            )
        return value

    def create(self, validated_data):
        validated_data["organizer"] = self.context["request"].user
        validated_data["available_tickets"] = validated_data["total_tickets"]

        return Event.objects.create(**validated_data)