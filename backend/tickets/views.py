from django.db import transaction

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ticket
from .serializers import TicketSerializer


class TicketListView(generics.ListAPIView):
    """
    Returns tickets belonging to the authenticated user.
    """

    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Ticket.objects
            .filter(owner=self.request.user)
            .select_related(
                "event",
                "booking",
                "owner",
            )
        )


class TicketDetailView(generics.RetrieveAPIView):
    """
    Returns one ticket belonging to the authenticated user.
    """

    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Ticket.objects
            .filter(owner=self.request.user)
            .select_related(
                "event",
                "booking",
                "owner",
            )
        )


class TicketValidationView(APIView):
    """
    Validates a ticket using its QR code UUID.

    An ACTIVE ticket is marked as USED after successful validation.
    A ticket that has already been USED, CANCELLED, or EXPIRED is rejected.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):

        qr_code = request.data.get("qr_code")

        if not qr_code:
            return Response(
                {
                    "success": False,
                    "message": "qr_code is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():

                ticket = (
                    Ticket.objects
                    .select_for_update()
                    .select_related(
                        "owner",
                        "event",
                        "booking",
                    )
                    .get(qr_code=qr_code)
                )

                if ticket.status != Ticket.Status.ACTIVE:
                    return Response(
                        {
                            "success": False,
                            "message": (
                                f"Ticket is not valid. "
                                f"Current status: {ticket.status}."
                            ),
                            "ticket": TicketSerializer(ticket).data,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                ticket.status = Ticket.Status.USED
                ticket.save(update_fields=["status", "updated_at"])

                return Response(
                    {
                        "success": True,
                        "message": "Ticket validated successfully.",
                        "ticket": TicketSerializer(ticket).data,
                    },
                    status=status.HTTP_200_OK,
                )

        except Ticket.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Ticket not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )