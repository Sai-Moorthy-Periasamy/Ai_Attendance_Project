# TODO: Fix Mark Attendance Navigation and Create Dedicated Page

## Pending Tasks
- [x] Create new CameraAttendance.jsx component that calls Flask API on mount and displays live attendance
- [x] Add "/mark-attendance" route in App.jsx pointing to CameraAttendance component
- [x] Update AttendanceData.jsx: Change "Mark Attendance" button to navigate to "/mark-attendance" instead of direct API call
- [x] Update Flask app.py: Change route from '/mark_attendance' to '/mark-attendance' for consistency

## Followup Steps
- [ ] Test navigation flow: AttendanceData -> CameraAttendance
- [ ] Verify camera opens and attendance updates in real-time
- [ ] Ensure no CORS or backend issues
