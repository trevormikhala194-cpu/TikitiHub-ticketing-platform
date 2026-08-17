from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication
    path(
        "api/auth/",
        include("accounts.urls"),
    ),

    # JWT
    path(
        "api/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "api/auth/token/verify/",
        TokenVerifyView.as_view(),
        name="token_verify",
    ),

    # API Schema
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),

    # Swagger Documentation
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    # Events
    path(
        "api/events/",
        include("events.urls"),
    ),

    # Tickets
    path(
        "api/tickets/",
        include("tickets.urls"),
    ),

    # Bookings
    path(
        "api/bookings/",
        include("bookings.urls"),
    ),

    # Payments
    path(
        "api/payments/",
        include("payments.urls"),
    ),
]