from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    LogoutView,
)

from .otp_views import (
    RequestOTPView,
    VerifyOTPView,
)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    path(
        "otp/request/",
        RequestOTPView.as_view(),
        name="request-otp",
    ),

    path(
        "otp/verify/",
        VerifyOTPView.as_view(),
        name="verify-otp",
    ),
]