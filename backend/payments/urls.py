from django.urls import path

from .views import STKPushView
from .callbacks import DarajaCallbackView

urlpatterns = [
    path(
        "stk-push/",
        STKPushView.as_view(),
        name="stk-push",
    ),

    path(
        "callback/",
        DarajaCallbackView.as_view(),
        name="daraja-callback",
    ),
]