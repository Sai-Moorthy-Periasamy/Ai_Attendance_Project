import face_recognition
import dlib

print("dlib version:", dlib.__version__)

# Load a sample image
image = face_recognition.load_image_file(r"D:\SAI_Pre\Training_images\Aman Dhakar.jpg")
# Make sure the file name matches

# Detect faces
face_locations = face_recognition.face_locations(image)
print(f"Found {len(face_locations)} face(s) in the image.")

# Optional: print coordinates of each face
for i, face in enumerate(face_locations):
    print(f"Face {i+1} location: {face}")
