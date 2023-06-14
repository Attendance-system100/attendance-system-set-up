from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from utils import get_db_handle
import pandas as pd
from .ble_send import ble_send  # Create your views here.
from .ble_receive import ble_receive, CreateDataBase
from .face_recognition import Face_Recognition
from .mismatch_students import getmismatch
import threading
import os


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class ExtractDataView(APIView):

    def post(self, request, format=None):
        db_handle, client = get_db_handle("University", "localhost", "27017")
        student_collection = db_handle["Students"]
        images_collection = db_handle["Images"]
        Student_Database = pd.DataFrame(
            columns=["Registration Number", "Name", "Mac_ID"])
        for doc in student_collection.find({}):
            Student_Database.loc[len(Student_Database)] = (
                doc["Registration Number"], doc["Name"], doc["Mac_ID"])
        print(Student_Database.head(1))
        BLE_Attendance = CreateDataBase(Student_Database)
        # Face_Attendance = pd.DataFrame(
        #     columns=["Roll No", "Timestamp", "confidence"])
        Face_Attendance = CreateDataBase(Student_Database)
        t1 = threading.Thread(target=ble_send)
        t2 = threading.Thread(target=ble_receive, args=(
            BLE_Attendance, Student_Database))
        t3 = threading.Thread(target=Face_Recognition, args=(
            "VGG-Face", "euclidean", Face_Attendance))

        t1.start()
        t2.start()
        t3.start()

        t1.join()
        t2.join()
        t3.join()

        print(Face_Attendance.tail(7))
        print(BLE_Attendance.head(3))
        Face_collection = db_handle["Face_Attendance"]
        for index in Face_Attendance.index:
            data = {
                "Registration Number": Face_Attendance["Registration Number"][index], "Name": Face_Attendance["Name"][index],
                "Timestamp": Face_Attendance["Timestamp"][index],
                "Attendance": Face_Attendance["Attendance"][index]
            }
            Face_collection.insert_one(data)

        BLE_collection = db_handle["BLE_Attendance"]
        for index in BLE_Attendance.index:
            data = {
                "Registration Number": BLE_Attendance["Registration Number"][index], "Name": BLE_Attendance["Name"][index],
                "Timestamp": BLE_Attendance["Timestamp"][index],
                "Attendance": BLE_Attendance["Attendance"][index]
            }
            BLE_collection.insert_one(data)

        students = []
        getmismatch(students, BLE_Attendance, Face_Attendance)
        request.data["students"] = students

        # request.data["students"] = [
        #     {'name': 'John', 'status': 'Unknown'},
        #     {'name': 'Jane', 'status': 'Unknown'},
        #     {'name': 'Michael', 'status': 'Unknown'},
        #     {'name': 'Emily', 'status': 'Unknown'}
        # ]
        return Response(request.data, status=status.HTTP_201_CREATED)


class UpdateDataView(APIView):

    def post(self, request, format=None):
        students = request.data["students"]
        print(request.data)
        db_handle, client = get_db_handle("University", "localhost", "27017")
        BLE_collection = db_handle["BLE_Attendance"]
        for student in students:
            if student['status'] == 'Present':
                name = student['name'] + " "
                Attendance = student['status']
        #         print(name)
                BLE_collection.update_one(
                    {"Name": name}, {"$set": {"Attendance": Attendance}})
        return Response(request.data, status=status.HTTP_201_CREATED)


class DownloadSheetView(APIView):
    def post(self, request, format=None):
        year = request.data['year']
        branch = request.data['branch']
        section = request.data['section']
        courseid = request.data['courseid']
        classNo = request.data['class']
        db_handle, client = get_db_handle("University", "localhost", "27017")
        BLE_collection = db_handle["BLE_Attendance"]
        Final_List = pd.DataFrame(
            columns=["Registration Number", "Name", "Timestamp", "Attendance"])
        for doc in BLE_collection.find({}):
            Final_List.loc[len(Final_List)] = (
                doc["Registration Number"], doc["Name"], doc["Timestamp"], doc["Attendance"])
        sheet_name = str(year)+"_"+branch+"_"+section + \
            "_"+courseid+"_"+"Attendance.xlsx"
        Final_List.to_excel(sheet_name)
        return Response(request.data, status=status.HTTP_201_CREATED)
