from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Venue(models.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    county = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Event(models.Model):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        CANCELLED = "CANCELLED", "Cancelled"
        COMPLETED = "COMPLETED", "Completed"

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="events",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="events",
    )

    venue = models.ForeignKey(
        Venue,
        on_delete=models.PROTECT,
        related_name="events",
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    banner_image = models.ImageField(
        upload_to="events/",
        blank=True,
        null=True,
    )

    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    ticket_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    capacity = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_datetime"]

    def __str__(self):
        return self.title