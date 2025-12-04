# Integration Plan for Face Recognition System

## Step 1: Set up FinalWorking as a Microservice
- [ ] Install Python dependencies in FinalWorking/ using `pip install -r requirements.txt`
- [ ] Add flask-cors to requirements.txt and install it
- [ ] Modify FinalWorking/app.py to add CORS support
- [ ] Ensure Flask runs on port 1000

## Step 2: Update Node.js Backend
- [ ] Read Backend/server.js to understand current structure
- [ ] Add axios dependency to Backend/package.json if not present
- [ ] Add proxy routes in server.js for /api/face/start and /api/face/add-user
- [ ] Handle responses from Flask and send back to frontend

## Step 3: Update React Frontend
- [ ] Read Frontend/src/App.jsx to understand routing
- [ ] Add routes for /face-attendance and /face-registration in App.jsx
- [ ] Create Frontend/src/Pages/FaceAttendance.jsx component
- [ ] Create Frontend/src/Pages/FaceRegistration.jsx component
- [ ] Update Frontend/src/Pages/Home.jsx to add navigation buttons to face recognition pages
- [ ] Ensure components use fetch/axios to call Node.js backend

## Step 4: Testing and Followup
- [ ] Run Flask app separately (python FinalWorking/app.py)
- [ ] Test Node.js proxy routes
- [ ] Test frontend integration
- [ ] Full end-to-end testing: face registration, training, attendance marking
- [ ] Optional: Integrate attendance data with existing database instead of CSV

## Notes
- Camera access in Flask is server-side; for web integration, may need to modify Flask to accept image uploads from React via Node.js proxy.
- If issues arise, consider adjusting to client-side camera capture in React and send images to Flask.
