from django.urls import path
from .views import RoomView, ExtractDataView, UpdateDataView, DownloadSheetView

urlpatterns = [
    path('room', RoomView.as_view()),
    path('extract-data', ExtractDataView.as_view()),
    path('update-data', UpdateDataView.as_view()),
    path('download-sheet', DownloadSheetView.as_view())
]
