from django.urls import path

from .views import (
    TicketListView,
    TicketDetailView,
    TicketValidationView,
)


urlpatterns = [
    path(
        "",
        TicketListView.as_view(),
        name="ticket-list",
    ),

    path(
        "<int:pk>/",
        TicketDetailView.as_view(),
        name="ticket-detail",
    ),

    path(
        "validate/",
        TicketValidationView.as_view(),
        name="ticket-validate",
    ),
]