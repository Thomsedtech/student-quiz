import os
import json

root = "images"
data = {}

for class_folder in os.listdir(root):
    class_path = os.path.join(root, class_folder)
    if os.path.isdir(class_path):
        student_files = [
            f.replace(".jpg", "").lower()
            for f in os.listdir(class_path)
            if f.endswith(".jpg")
        ]
        data[class_folder] = student_files

with open("students.json", "w") as f:
    json.dump(data, f, indent=2)
