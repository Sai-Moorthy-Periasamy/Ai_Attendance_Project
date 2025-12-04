from flask import Flask, render_template, send_file, request, redirect, flash
import csv, os, pickle, cv2, face_recognition, threading
from datetime import datetime
import numpy as np

app = Flask(__name__)
app.secret_key = "any_secret_key"

TRAINING_PATH = './Training_images'
encodeListKnown = []
classNames = []

# -------------------- Camera / Attendance -------------------- #
def load_encodings():
    global encodeListKnown, classNames
    images = []
    classNames = []
    for cl in os.listdir(TRAINING_PATH):
        curImg = cv2.imread(f'{TRAINING_PATH}/{cl}')
        images.append(curImg)
        classNames.append(os.path.splitext(cl)[0])

    encodeList = []
    for img in images:
        enc = face_recognition.face_encodings(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        if enc:
            encodeList.append(enc[0])
    encodeListKnown = encodeList
    return encodeListKnown, classNames

def markAttendance(name):
    if not os.path.exists("Attendance.csv"):
        with open("Attendance.csv", 'w') as f:
            f.write("Name,Time\n")
    with open("Attendance.csv", 'r+') as f:
        lines = f.readlines()
        names = [line.split(',')[0] for line in lines]
        if name not in names:
            now = datetime.now().strftime("%H:%M:%S")
            f.write(f"{name},{now}\n")

def run_camera():
    global encodeListKnown, classNames
    if not encodeListKnown:
        load_encodings()
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
            if len(faceDis) == 0:
                continue
            matchIndex = np.argmin(faceDis)
            if matches[matchIndex]:
                name = classNames[matchIndex]
                markAttendance(name)
                y1,x2,y2,x1 = [v*4 for v in faceLoc]
                cv2.rectangle(img,(x1,y1),(x2,y2),(0,255,0),2)
                cv2.rectangle(img,(x1,y2-35),(x2,y2),(0,255,0),cv2.FILLED)
                cv2.putText(img,name,(x1+6,y2-6),cv2.FONT_HERSHEY_COMPLEX,1,(255,255,255),2)

        cv2.imshow('Camera - Press Q to exit', img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

# -------------------- Flask Routes -------------------- #
@app.route('/')
def index():
    attendance_data = []
    if os.path.exists('Attendance.csv'):
        with open('Attendance.csv', newline='') as csvfile:
            reader = csv.reader(csvfile)
            for line in reader:
                if len(line) >= 2:
                    attendance_data.append([line[0], line[1]])
    return render_template('index.html', data=attendance_data)

@app.route('/train', methods=['POST'])
def train():
    load_encodings()
    flash("Training / encoding completed successfully!")
    return redirect('/')

@app.route('/mark_attendance', methods=['POST'])
def mark_attendance_route():
    thread = threading.Thread(target=run_camera)
    thread.start()
    flash("Attendance marking started! Camera opened.")
    return redirect('/')

@app.route('/download')
def download():
    if os.path.exists('Attendance.csv'):
        return send_file('Attendance.csv', as_attachment=True)
    else:
        flash("Attendance.csv not found!")
        return redirect('/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
