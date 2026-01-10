import cv2
import face_recognition
import os
import pickle
import numpy as np
from datetime import datetime

# ---------------- MySQL Setup ---------------- #
import mysql.connector
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Saimoorthy2004@gmail",
    database="kcet"   # ✅ CHANGED
)
cursor = db.cursor(dictionary=True)

# ---------------- Load Training Images ---------------- #
path = "./Training_images"
images = []
classNames = []
rollno_to_name = {}

if not os.path.exists(path):
    os.makedirs(path)

for file in os.listdir(path):
    rollno = os.path.splitext(file)[0]
    img_path = os.path.join(path, file)

    img = cv2.imread(img_path)
    if img is None:
        continue

    images.append(img)
    classNames.append(rollno)

    sql = "SELECT name FROM users WHERE rollno=%s"
    cursor.execute(sql, (rollno,))
    result = cursor.fetchone()

    rollno_to_name[rollno] = result["name"] if result else rollno

# ---------------- Encoding Functions ---------------- #
def findEncodings(images):
    encodeList = []
    for img in images:
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        enc = face_recognition.face_encodings(rgb)
        if enc:
            encodeList.append(enc[0])
        else:
            print("⚠ No face found in image")
    return encodeList


def encode():
    encodeListKnown = findEncodings(images)
    data = dict(zip(classNames, encodeListKnown))

    with open("listfile.data", "wb") as f:
        pickle.dump(data, f, protocol=pickle.HIGHEST_PROTOCOL)

    return encodeListKnown


# ---------------- Load Encodings ---------------- #
if os.path.exists("listfile.data") and os.stat("listfile.data").st_size > 0:
    with open("listfile.data", "rb") as f:
        data = pickle.load(f)
        encodeListKnown = list(data.values())
        classNames = list(data.keys())
else:
    encodeListKnown = encode()

# ---------------- Attendance ---------------- #
def markAttendance(rollno):
    if not os.path.exists("Attendance.csv"):
        with open("Attendance.csv", "w") as f:
            f.write("Rollno,Time\n")

    with open("Attendance.csv", "r+") as f:
        lines = f.readlines()
        rollnos = [line.split(",")[0] for line in lines]

        if rollno not in rollnos:
            now = datetime.now().strftime("%H:%M:%S")
            f.write(f"{rollno},{now}\n")

# ---------------- Camera ---------------- #
def run_camera():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Camera not accessible")
        return

    while True:
        success, img = cap.read()
        if not success:
            continue

        imgS = cv2.resize(img, (0, 0), fx=0.25, fy=0.25)
        imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

        facesCurFrame = face_recognition.face_locations(imgS)
        encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

        for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
            if len(faceDis) == 0:
                continue

            matchIndex = np.argmin(faceDis)

            if face_recognition.compare_faces(
                encodeListKnown, encodeFace
            )[matchIndex]:
                rollno = classNames[matchIndex]
                name = rollno_to_name.get(rollno, rollno)

                markAttendance(rollno)

                y1, x2, y2, x1 = [v * 4 for v in faceLoc]
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.rectangle(
                    img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED
                )
                cv2.putText(
                    img,
                    name,
                    (x1 + 6, y2 - 6),
                    cv2.FONT_HERSHEY_COMPLEX,
                    1,
                    (255, 255, 255),
                    2,
                )

        cv2.imshow("Camera - Press Q to Exit", img)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


# ---------------- Run ---------------- #
run_camera()
