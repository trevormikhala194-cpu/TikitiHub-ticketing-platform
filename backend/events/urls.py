from django.urls import path

from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    VenueListCreateView,
    VenueDetailView,
    EventListCreateView,
    EventDetailView,
)

urlpatterns = [

    # Categories
    path(
        "categories/",
        CategoryListCreateView.as_view(),
        name="category-list",
    ),

    path(
        "categories/<int:pk>/",
        CategoryDetailView.as_view(),
        name="category-detail",
    ),

    # Venues
    path(
        "venues/",
        VenueListCreateView.as_view(),
        name="venue-list",
    ),

    path(
        "venues/<int:pk>/",
        VenueDetailView.as_view(),
        name="venue-detail",
    ),

    # Events
    path(
        "",
        EventListCreateView.as_view(),
        name="event-list",
    ),

    path(
        "<int:pk>/",
        EventDetailView.as_view(),
        name="event-detail",
    ),
]