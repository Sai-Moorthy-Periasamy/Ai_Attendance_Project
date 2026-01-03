import os
import cv2
import numpy as np
import face_recognition
import pickle
import RPi.GPIO as GPIO
from time import sleep
from datetime import datetime
import picamera

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
buzz=23
GPIO.setup(buzz,GPIO.OUT)

path = './Training_images'
images = []
classNames = []
myList = os.listdir(path)
for cl in myList:
    curImg = cv2.imread(f'{path}/{cl}')
    images.append(curImg)
    classNames.append(os.path.splitext(cl)[0])

def findEncodings(images):
    encodeList = []
    for img in images:
        enc = face_recognition.face_encodings(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        if enc:
            encodeList.append(enc[0])
    return encodeList

def encode(fpath):
    encodeListKnown = findEncodings(images)
    data = dict(zip(classNames, encodeListKnown))
    with open(fpath,'wb') as f:
        pickle.dump(data,f,protocol=pickle.HIGHEST_PROTOCOL)
    return encodeListKnown

# Create rollno_to_name dict for display
rollno_to_name = {}
for rollno in classNames:
    sql = "SELECT name FROM users WHERE rollno=%s"
    cursor.execute(sql, (rollno,))
    result = cursor.fetchone()
    if result:
        rollno_to_name[rollno] = result['name']
    else:
        rollno_to_name[rollno] = rollno  # Fallback to rollno if not found

def markAttendance(rollno):
    if not os.path.exists('./Attendance.csv'):
        with open('./Attendance.csv','w') as f:
            f.write('Rollno,Time\n')
    with open('./Attendance.csv','a') as f:
        now = datetime.now()
        dtString = now.strftime('%H:%M:%S')
        f.write(f'{rollno},{dtString}\n')
    GPIO.output(buzz,GPIO.HIGH)
    sleep(0.5)
    GPIO.output(buzz,GPIO.LOW)

# Load encodings
fpath = './listfile.data'
if os.path.exists(fpath) and os.stat(fpath).st_size != 0:
    with open(fpath,'rb') as f:
        data = pickle.load(f)
        names = list(data.keys())
        encodeListKnown = list(data.values())
    if names != classNames:
        encodeListKnown = encode(fpath)
else:
    encodeListKnown = encode(fpath)

# Raspberry Pi camera capture
camera = picamera.PiCamera()
camera.resolution=(320,240)
camera.rotation=180
output = np.empty((240,320,3),dtype=np.uint8)
nameList = []

while True:
    camera.capture(output,format='rgb')
    facesCurFrame = face_recognition.face_locations(output)
    encodesCurFrame = face_recognition.face_encodings(output,facesCurFrame)

    for encodeFace in encodesCurFrame:
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        matchIndex = np.argmin(faceDis)
        if matches[matchIndex]:
            rollno = classNames[matchIndex]
            name = rollno_to_name.get(rollno, rollno).upper()
            if rollno not in nameList:
                nameList.append(rollno)
                markAttendance(rollno)
                print(name)
