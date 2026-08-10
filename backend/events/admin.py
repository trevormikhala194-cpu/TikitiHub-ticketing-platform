from django.contrib import admin

from .models import Category, Venue, Event


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "created_at",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "county",
        "capacity",
    )

    search_fields = (
        "name",
        "county",
    )

    list_filter = (
        "county",
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "category",
        "venue",
        "organizer",
        "start_datetime",
        "status",
    )

    search_fields = (
        "title",
        "description",
    )

    list_filter = (
        "status",
        "category",
        "venue",
    )

    ordering = (
        "-start_datetime",
    )