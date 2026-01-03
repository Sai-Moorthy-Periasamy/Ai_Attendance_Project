# TODO: Update Face Recognition System to Use Rollno Mapping

## Pending Tasks
- [ ] Update Frontend/Attendance_Module/app.py
  - Modify load_encodings to create rollno_to_name dict by querying DB for each rollno
  - Update classNames to be rollno (already is, since filenames are rollno)
  - Modify markAttendance to write rollno instead of name to CSV
  - Update run_camera to display name from dict instead of rollno
  - Change CSV header to "Rollno,Time"
- [ ] Update Frontend/Attendance_Module/facerecog.py
  - Add MySQL DB connection
  - Create rollno_to_name dict by querying DB
  - Update markAttendance to write rollno to CSV
  - Update display to show name
  - Change CSV header to "Rollno,Time"
- [ ] Update Frontend/Attendance_Module/main.py
  - Add MySQL DB connection
  - Create rollno_to_name dict by querying DB
  - Update markAttendance to write rollno to CSV
  - Update run_camera to display name
  - Change CSV header to "Rollno,Time"
- [ ] Update Frontend/src/Pages/AttendanceData.jsx
  - Change presentNames.includes(s.name) to presentNames.includes(s.rollno)
- [ ] Test the changes by running the app and checking recognition
