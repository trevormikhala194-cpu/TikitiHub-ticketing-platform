import random
import string
import uuid
from io import BytesIO

import qrcode

from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models


class Ticket(models.Model):

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        USED = "USED", "Used"
        CANCELLED = "CANCELLED", "Cancelled"
        EXPIRED = "EXPIRED", "Expired"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tickets",
    )

    event = models.ForeignKey(
        "events.Event",
        on_delete=models.CASCADE,
        related_name="tickets",
    )

    booking = models.ForeignKey(
        "bookings.Booking",
        on_delete=models.CASCADE,
        related_name="tickets",
    )

    ticket_number = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
    )

    qr_code = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    qr_image = models.ImageField(
        upload_to="qr_codes/",
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            while True:
                ticket_number = "TKT-" + "".join(
                    random.choices(
                        string.ascii_uppercase + string.digits,
                        k=8,
                    )
                )

                if not Ticket.objects.filter(
                    ticket_number=ticket_number
                ).exists():
                    self.ticket_number = ticket_number
                    break

        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new and not self.qr_image:
            qr = qrcode.QRCode(
                version=1,
                box_size=10,
                border=4,
            )

            qr.add_data(str(self.qr_code))
            qr.make(fit=True)

            qr_image = qr.make_image()

            buffer = BytesIO()
            qr_image.save(buffer, format="PNG")

            self.qr_image.save(
                f"{self.ticket_number}.png",
                ContentFile(buffer.getvalue()),
                save=True,
            )

    def __str__(self):
        return self.ticket_number
