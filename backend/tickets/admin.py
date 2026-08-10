from django.contrib import admin

from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):

    list_display = (
        "ticket_number",
        "owner",
        "event",
        "status",
        "created_at",
    )

    search_fields = (
        "ticket_number",
        "owner__email",
        "owner__username",
        "event__title",
    )

    list_filter = (
        "status",
        "event",
    )

    ordering = (
        "-created_at",
    )