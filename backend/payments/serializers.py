from rest_framework import serializers

from .models import Payment


class STKPushSerializer(serializers.Serializer):
    booking = serializers.IntegerField()
    phone_number = serializers.CharField(max_length=15)


class PaymentSerializer(serializers.ModelSerializer):

    booking_id = serializers.IntegerField(
        source="booking.id",
        read_only=True,
    )

    event = serializers.CharField(
        source="booking.event.title",
        read_only=True,
    )

    customer = serializers.StringRelatedField(
        source="booking.customer",
        read_only=True,
    )

    class Meta:
        model = Payment
        fields = (
            "id",
            "booking",
            "booking_id",
            "customer",
            "event",
            "phone_number",
            "amount",
            "checkout_request_id",
            "merchant_request_id",
            "mpesa_receipt_number",
            "status",
            "paid_at",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "amount",
            "checkout_request_id",
            "merchant_request_id",
            "mpesa_receipt_number",
            "status",
            "paid_at",
            "created_at",
            "updated_at",
        )