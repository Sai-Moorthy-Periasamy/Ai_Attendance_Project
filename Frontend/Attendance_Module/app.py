from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import face_recognition
import numpy as np
from datetime import datetime
import mysql.connector

app = Flask(__name__)
app.secret_key = "any_secret_key"

# ✅ CORS FIX (IMPORTANT)
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

# -------------------- MySQL Setup -------------------- #
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Saimoorthy2004@gmail",
    database="kcet"
)
cursor = db.cursor(dictionary=True)

# -------------------- Face Recognition Setup -------------------- #
TRAINING_PATH = "./Training_images"
encodeListKnown = []
classNames = []
rollno_to_name = {}

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

@app.route("/train", methods=["POST"])
def train():
    load_encodings()
    return jsonify({"message": "Training completed successfully ✅"})

# -------------------- IMAGE UPLOAD / FACE DETECTION -------------------- #
@app.route("/detect-faces", methods=["POST"])
def detect_faces():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    img_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_img)
    face_encodings = face_recognition.face_encodings(rgb_img, face_locations)

    detected_faces = []

    for encodeFace, faceLoc in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

        rollno = "Unknown"
        name = "Unknown"

        if len(faceDis) > 0:
            matchIndex = np.argmin(faceDis)
            if matches[matchIndex]:
                rollno = classNames[matchIndex]
                name = rollno_to_name.get(rollno, rollno)

        top, right, bottom, left = faceLoc

        detected_faces.append({
            "rollno": rollno,
            "name": name,
            "box": {
                "top": top,
                "right": right,
                "bottom": bottom,
                "left": left
            },
            "color": "pink"
        })

    return jsonify({
        "faces": detected_faces,
        "total_faces": len(detected_faces)
    })

# -------------------- RUN -------------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)
