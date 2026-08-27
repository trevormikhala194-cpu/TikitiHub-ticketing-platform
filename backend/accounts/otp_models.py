from django.db import models


class OTPVerification(models.Model):

    class Purpose(models.TextChoices):
        REGISTRATION = "REGISTRATION", "Registration"
        LOGIN = "LOGIN", "Login"

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="otp_verifications",
    )

    identifier = models.CharField(
        max_length=255,
    )

    otp_code = models.CharField(
        max_length=128,
    )

    purpose = models.CharField(
        max_length=20,
        choices=Purpose.choices,
    )

    expires_at = models.DateTimeField()

    attempts = models.PositiveIntegerField(
        default=0,
    )

    is_used = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.identifier} - {self.purpose}"