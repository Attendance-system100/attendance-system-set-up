
import cv2
import datetime
from deepface import DeepFace
import random


def name_gen():
    import os
    from datetime import date
    


    today = date.today()
    # Month abbreviation, day and year
    d4 = today.strftime("%b-%d-%Y")
    from datetime import datetime

    # datetime object containing current date and time
    now = datetime.now()

    print("now =", now)

    # dd/mm/YY H:M:S
    dt_string = now.strftime("%H%M%S")
    print("date and time =", dt_string)
    name = d4+"-"+dt_string
    print("d4 =", name)
    return name


def vid_gen():
    import cv2
    from config import RTSP_LINK

    # RTSP link of the video feed
    # rtsp_link = video_stream_link

    # Cr    eate a VideoCapture object
    cap = cv2.VideoCapture(RTSP_LINK)

    # Check if the video capture is opened successfully
    if not cap.isOpened():
        print("Failed to open RTSP link.")
        exit()

    # Define the codec for the output video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')

    # Define the output file name
    output_filename = name_gen()+".mp4"

    # Define the desired recording duration in seconds
    record_duration = 15

    # Get the frames per second (fps) of the video capture
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Calculate the total number of frames to record
    total_frames = int(fps * record_duration)

    # Create a VideoWriter object to save the recorded video
    out = cv2.VideoWriter(output_filename, fourcc, fps,
                          (int(cap.get(3)), int(cap.get(4))))

    # Start recording
    frame_count = 0
    while frame_count < total_frames:
        ret, frame = cap.read()

        if not ret:
            break

        # Write the frame to the output video file
        out.write(frame)

        # Increment the frame count
        frame_count += 1

        # Display the recording progress
        # print(f"Recording {frame_count}/{total_frames} frames")

    # Release the VideoCapture and VideoWriter objects
    cap.release()
    out.release()

    # Print a message indicating the recording has finished
    print(f"Recording finished. Saved as {output_filename}")
    return output_filename


def capture_random_frames(video_path, num_frames):
    import cv2
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    selected_frames = random.sample(range(total_frames), num_frames)

    frames = []
    for frame_number in range(total_frames):
        ret, frame = cap.read()
        if ret:
            if frame_number in selected_frames:
                frames.append(frame)
        else:
            break

    cap.release()
    return frames


def Face_Recognition(model, metric, attendance_database):
    import cv2
    import random
    from deepface import DeepFace
    import datetime
    # Example usage
    video_path = vid_gen()
    num_frames = 20
    attendance_database["confidence"] = 0
    captured_frames = capture_random_frames(video_path, num_frames)

    # for model in models:
    #     for metric in metrics:
    # excel_file_name = model+""+metric+""+"Attendance_frames_original.xlsx"
#     time_recording = open(folder_name+"\\"+"time_models.txt","a+")
#     attendance_database = pd.read_excel("Student List.xlsx")
#     attendance_database.drop("Sl No:",axis=1,inplace=True)
    print(model, metric)
    print("\n")
#     Name="Unknown"
    for i, frame in enumerate(captured_frames):
        print(i)
        print(len(attendance_database["Registration Number"]))
    #             count=0

        dfs = DeepFace.find(img_path=frame, db_path="api/photos", model_name=model,
                            detector_backend='retinaface', distance_metric=metric, enforce_detection=False)
        for val in dfs:
            if not val.empty:
                if len(val) > 1:
                    max_conf = -1
                    index = -1
                    for i in range(len(val)):
                        if (val.loc[i, model+"_"+metric] > max_conf):
                            max_conf = val.loc[i, model+"_"+metric]
                            index = i
                    Roll_no = val.loc[i, "identity"].split("/")[-1][:-5]
                    timestamp = datetime.datetime.now()
                    confidence = val.loc[i, model+"_"+metric]
                    Attendance = "Present"

                    row_val = attendance_database["Registration Number"] == Roll_no

                    if ((attendance_database.loc[row_val, "confidence"] < confidence).bool()):
                        attendance_database.loc[row_val,
                                                "confidence"] = confidence
                        attendance_database.loc[row_val,
                                                "Timestamp"] = datetime.datetime.now()
                        attendance_database.loc[row_val,
                                                "Attendance"] = "Present"

                else:
                    Roll_no = val.loc[0, "identity"].split("/")[-1][:-5]
                    timestamp = datetime.datetime.now()
                    confidence = val.loc[0, model+"_"+metric]
                    attendance_database.loc[row_val, "Attendance"] = "Present"
                    Attendance = "Present"
                    row_val = attendance_database["Registration Number"] == Roll_no

                    if ((attendance_database.loc[row_val, "confidence"] < confidence).bool()):
                        attendance_database.loc[row_val,
                                                "Timestamp"] = datetime.datetime.now()
                        attendance_database.loc[row_val,
                                                "confidence"] = confidence
                        attendance_database.loc[row_val,
                                                "Attendance"] = "Present"
    cv2.destroyAllWindows()
