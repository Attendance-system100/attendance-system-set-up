def DataExtraction(data):
    from datetime import datetime
    timestamp = data["timestamp"]
    mac_id = data['transmitterId']
    #     rssi=data["rssi"]
    payload = data["packets"][0]
    time = datetime.fromtimestamp(
        int(timestamp/1000)+19800).strftime("%d-%m-%Y %H:%M:%S")
    return time, mac_id, payload


def MarkAttendance(df, time, mac_id, payload, Student_Database):
    try:
        roll = Student_Database.loc[Student_Database["Mac_ID"]
                                    == mac_id, "Registration Number"].values[0]
        name = Student_Database.loc[Student_Database["Mac_ID"]
                                    == mac_id, "Name"].values[0]
    except:
        return None
    if len(roll):
        if df.loc[df["Registration Number"] == roll, "Timestamp"].values[0] == None:
            df.loc[df["Registration Number"] == roll] = (
                roll, name, time, "Present")
        else:
            df.loc[df["Registration Number"] == roll, "Timestamp"] = time


def CreateDataBase(Student_Database):
    #      df = pd.DataFrame(columns=["Timestamp","Mac_id","Count"]).set_index("Mac_id")
    BLE_Attendance = Student_Database.drop(["Mac_ID"], axis=1, inplace=False)
    BLE_Attendance["Timestamp"] = None
    BLE_Attendance["Attendance"] = "Absent"
    return BLE_Attendance


def ble_receive(BLE_Attendance, Student_Database):
    import pika
    import sys
    import os
    import json

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost'))

    channel = connection.channel()

    channel.queue_declare(queue='hello')

    def callback(ch, method, properties, body):
        Byte_To_Str = str(body, "UTF-8")
#         print(Byte_To_Str)
        if Byte_To_Str == "End":
            connection.close()
            return
        Str_To_Json = json.loads(Byte_To_Str)
        time, mac_id, payload = DataExtraction(Str_To_Json)
#         print(time,mac_id,payload)
        MarkAttendance(BLE_Attendance, time, mac_id, payload, Student_Database)
#         print(mac_id)
#         print("\nmac id = ",mac_id,"\npayload = ",payload,"\nTimestamp = ",time)

    channel.basic_consume(
        queue='hello', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()
