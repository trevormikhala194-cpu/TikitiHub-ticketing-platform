from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "customer",
        "event",
        "quantity",
        "total_amount",
        "status",
        "booked_at",
    )

    search_fields = (
        "customer__username",
        "customer__email",
        "event__title",
    )

    list_filter = (
        "status",
        "event",
    )

    ordering = (
        "-booked_at",
    )