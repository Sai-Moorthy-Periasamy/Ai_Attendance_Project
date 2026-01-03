from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import os
import cv2
import face_recognition
import numpy as np
from datetime import datetime
import mysql.connector

app = Flask(__name__)
CORS(app)
app.secret_key = "any_secret_key"

# -------------------- MySQL Setup -------------------- #
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Saimoorthy2004@gmail",
    database="ai_attendance"
)
cursor = db.cursor(dictionary=True)

# -------------------- Face Recognition Setup -------------------- #
TRAINING_PATH = './Training_images'
encodeListKnown = []
classNames = []
rollno_to_name = {}

# -------------------- Live Attendance -------------------- #
current_session_present = set()  # Tracks scanned students in current session

# -------------------- Helper Functions -------------------- #
def load_encodings():
    global encodeListKnown, classNames, rollno_to_name
    images = []
    classNames = []
    rollno_to_name = {}

    if not os.path.exists(TRAINING_PATH):
        os.makedirs(TRAINING_PATH)

    for cl in os.listdir(TRAINING_PATH):
        rollno = os.path.splitext(cl)[0]
        curImg = cv2.imread(f'{TRAINING_PATH}/{cl}')
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

    encodeList = []
    for img in images:
        enc = face_recognition.face_encodings(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        if enc:
            encodeList.append(enc[0])

    encodeListKnown = encodeList
    return encodeListKnown, classNames

def markAttendance(rollno):
    global current_session_present
    current_session_present.add(rollno)  # Update live set with rollno

    # Also update CSV for record
    if not os.path.exists("Attendance.csv"):
        with open("Attendance.csv", 'w') as f:
            f.write("Rollno,Time\n")
    with open("Attendance.csv", 'r+') as f:
        lines = f.readlines()
        rollnos = [line.split(',')[0] for line in lines]
        if rollno not in rollnos:
            now = datetime.now().strftime("%H:%M:%S")
            f.write(f"{rollno},{now}\n")

# -------------------- Camera / Attendance -------------------- #
def run_camera():
    global encodeListKnown, classNames
    if not encodeListKnown:
        load_encodings()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Cannot open camera")
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
            matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
            if len(faceDis) == 0:
                continue
            matchIndex = np.argmin(faceDis)
            if matches[matchIndex]:
                rollno = classNames[matchIndex]
                name = rollno_to_name.get(rollno, rollno)
                markAttendance(rollno)
                y1, x2, y2, x1 = [v * 4 for v in faceLoc]
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
                cv2.putText(img, name, (x1 + 6, y2 - 6),
                            cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

        cv2.imshow('Camera - Press Q to exit', img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# -------------------- Flask Routes -------------------- #
@app.route("/students", methods=["GET"])
def get_students():
    year = request.args.get("year")
    dept = request.args.get("dept")
    section = request.args.get("section")

    if not year or not dept or not section:
        return jsonify([])

    try:
        year_int = int(year)
    except ValueError:
        return jsonify([])

    sql = "SELECT rollno, name FROM users WHERE year=%s AND dept=%s AND section=%s AND profession='student'"
    cursor.execute(sql, (year_int, dept, section))
    students = cursor.fetchall()
    return jsonify(students)

@app.route("/attendance-status", methods=["GET"])
def attendance_status():
    return jsonify(list(current_session_present))  # Return only scanned students

@app.route('/train', methods=['POST'])
def train():
    try:
        load_encodings()
        return jsonify({"message": "Training / encoding completed successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/mark_attendance', methods=['POST'])
def mark_attendance_route():
    thread = threading.Thread(target=run_camera)
    thread.start()
    return jsonify({"message": "Camera started for attendance"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False, threaded=True)
