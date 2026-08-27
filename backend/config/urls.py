from django.conf import settings
from django.conf.urls.static import static
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
    # Admin
    path("admin/", admin.site.urls),

    # Authentication
    path(
        "api/accounts/",
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

    # API documentation
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),

    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(
            url_name="schema"
        ),
        name="swagger-ui",
    ),

    # Application APIs
    path(
        "api/events/",
        include("events.urls"),
    ),

    path(
        "api/tickets/",
        include("tickets.urls"),
    ),

    path(
        "api/bookings/",
        include("bookings.urls"),
    ),

    path(
        "api/payments/",
        include("payments.urls"),
    ),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )