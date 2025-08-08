import os
import json

# Folder where your images are stored (e.g., images/1C/*.jpg)
IMAGE_ROOT = "images"

# Output JSON file
OUTPUT_FILE = "students.json"

data = {}

for class_folder in os.listdir(IMAGE_ROOT):
    class_path = os.path.join(IMAGE_ROOT, class_folder)
    if os.path.isdir(class_path):
        student_files = [
            f.replace(".jpg", "").lower()
            for f in os.listdir(class_path)
            if f.lower().endswith(".jpg")
        ]
        data[class_folder] = sorted(student_files)

with open(OUTPUT_FILE, "w") as f:
    json.dump(data, f, indent=2)

print(f"✅ Created {OUTPUT_FILE} with {len(data)} classes.")
