def getmismatch(students, BLE_Attendance, Face_Attendance):
    for index in BLE_Attendance.index:
        if BLE_Attendance["Attendance"][index] == "Present":
            roll = BLE_Attendance["Registration Number"][index]
            mismatch = roll if ((
                Face_Attendance.loc[Face_Attendance["Registration Number"] == roll, "Attendance"] == 'Absent').bool()) else None
            if (mismatch):
                students.append({'name': mismatch, 'status': 'Unknown'})
