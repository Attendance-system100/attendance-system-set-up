from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('join', index),
    path('details', index),
    path('verify-attendance', index),
    path('download-attendance', index)
]
