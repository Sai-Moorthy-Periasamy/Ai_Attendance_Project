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
    database="kcet"   # ✅ CHANGED
)

cursor = db.cursor(dictionary=True)

# -------------------- Face Recognition Setup -------------------- #
TRAINING_PATH = './Training_images'
encodeListKnown = []
classNames = []
rollno_to_name = {}

# -------------------- Live Attendance -------------------- #
current_session_present = set()

# -------------------- Helper Functions -------------------- #
def load_encodings():
    global encodeListKnown, classNames, rollno_to_name

    images = []
    classNames = []
    rollno_to_name = {}

    if not os.path.exists(TRAINING_PATH):
        os.makedirs(TRAINING_PATH)

    for file in os.listdir(TRAINING_PATH):
        rollno = os.path.splitext(file)[0]
        img_path = os.path.join(TRAINING_PATH, file)

        img = cv2.imread(img_path)
        if img is None:
            continue

        images.append(img)
        classNames.append(rollno)

        sql = "SELECT name FROM users WHERE rollno=%s"
        cursor.execute(sql, (rollno,))
        result = cursor.fetchone()

        rollno_to_name[rollno] = result["name"] if result else rollno

    encodeList = []
    for img in images:
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        enc = face_recognition.face_encodings(rgb)
        if enc:
            encodeList.append(enc[0])

    encodeListKnown = encodeList
    return encodeListKnown, classNames


def markAttendance(rollno):
    global current_session_present
    current_session_present.add(rollno)

    if not os.path.exists("Attendance.csv"):
        with open("Attendance.csv", 'w') as f:
            f.write("Rollno,Time\n")

    with open("Attendance.csv", 'r+') as f:
        lines = f.readlines()
        rollnos = [line.split(',')[0] for line in lines]

        if rollno not in rollnos:
            time_now = datetime.now().strftime("%H:%M:%S")
            f.write(f"{rollno},{time_now}\n")

# -------------------- Camera Logic -------------------- #
def run_camera():
    if not encodeListKnown:
        load_encodings()

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

        faces = face_recognition.face_locations(imgS)
        encodes = face_recognition.face_encodings(imgS, faces)

        for encodeFace, faceLoc in zip(encodes, faces):
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
                cv2.rectangle(img, (x1, y2 - 35), (x2, y2),
                              (0, 255, 0), cv2.FILLED)
                cv2.putText(img, name, (x1 + 6, y2 - 6),
                            cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

        cv2.imshow("Camera - Press Q to Exit", img)
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
        year = int(year)
    except:
        return jsonify([])

    sql = """
        SELECT rollno, name
        FROM users
        WHERE year=%s AND dept=%s AND section=%s
        AND profession='student'
    """
    cursor.execute(sql, (year, dept, section))
    return jsonify(cursor.fetchall())


@app.route("/attendance-status", methods=["GET"])
def attendance_status():
    return jsonify(list(current_session_present))


@app.route("/train", methods=["POST"])
def train():
    load_encodings()
    return jsonify({"message": "Training completed successfully ✅"})


@app.route("/mark_attendance", methods=["POST"])
def mark_attendance():
    threading.Thread(target=run_camera).start()
    return jsonify({"message": "Camera started for attendance 📸"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)
