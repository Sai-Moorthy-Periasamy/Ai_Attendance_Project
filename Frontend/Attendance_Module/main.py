import cv2
import face_recognition
import os
import pickle
import numpy as np
from datetime import datetime
import subprocess
import sys
subprocess.Popen(['start', 'cmd', '/k', sys.executable, 'main.py'], shell=True)

# MySQL Setup
import mysql.connector
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Saimoorthy2004@gmail",
    database="ai_attendance"
)
cursor = db.cursor(dictionary=True)

# Load training images
path = './Training_images'
images = []
classNames = []
rollno_to_name = {}

for cl in os.listdir(path):
    rollno = os.path.splitext(cl)[0]
    curImg = cv2.imread(f'{path}/{cl}')
    images.append(curImg)
    classNames.append(rollno)
    # Query DB for name
    sql = "SELECT name FROM users WHERE rollno=%s"
    cursor.execute(sql, (rollno,))
    result = cursor.fetchone()
    if result:
        rollno_to_name[rollno] = result['name']
    else:
        rollno_to_name[rollno] = rollno  # Fallback to rollno if not found

# Load or create encodings
def findEncodings(images):
    encodeList = []
    for img in images:
        enc = face_recognition.face_encodings(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        if enc:
            encodeList.append(enc[0])
        else:
            print("No face found in image!")
    return encodeList

def encode():
    encodeListKnown = findEncodings(images)
    data = dict(zip(classNames, encodeListKnown))
    with open('listfile.data', 'wb') as f:
        pickle.dump(data, f, protocol=pickle.HIGHEST_PROTOCOL)
    return encodeListKnown

# Load known encodings
if os.path.exists("listfile.data") and os.stat("listfile.data").st_size != 0:
    with open('listfile.data', 'rb') as f:
        data = pickle.load(f)
        encodeListKnown = list(data.values())
        classNames = list(data.keys())
else:
    encodeListKnown = encode()

# Attendance mark function
def markAttendance(rollno):
    if not os.path.exists("Attendance.csv"):
        with open("Attendance.csv", 'w') as f:
            f.write("Rollno,Time\n")
    with open("Attendance.csv", 'r+') as f:
        lines = f.readlines()
        rollnos = [line.split(',')[0] for line in lines]
        if rollno not in rollnos:
            now = datetime.now().strftime("%H:%M:%S")
            f.write(f"{rollno},{now}\n")

# Run camera
def run_camera():
    cap = cv2.VideoCapture(0)
    while True:
        success, img = cap.read()
        if not success:
            continue
        imgS = cv2.resize(img, (0,0), fx=0.25, fy=0.25)
        imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)
        facesCurFrame = face_recognition.face_locations(imgS)
        encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

        for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
            matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
            matchIndex = np.argmin(faceDis)

            if matches[matchIndex]:
                rollno = classNames[matchIndex]
                name = rollno_to_name.get(rollno, rollno)
                markAttendance(rollno)
                y1,x2,y2,x1 = [v*4 for v in faceLoc]
                cv2.rectangle(img,(x1,y1),(x2,y2),(0,255,0),2)
                cv2.rectangle(img,(x1,y2-35),(x2,y2),(0,255,0),cv2.FILLED)
                cv2.putText(img,name,(x1+6,y2-6),cv2.FONT_HERSHEY_COMPLEX,1,(255,255,255),2)

        cv2.imshow('Camera - Press Q to exit', img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
