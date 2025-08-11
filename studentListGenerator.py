import os, json, re

IMAGE_ROOT = "images"
VALID_EXTS = {".jpg", ".jpeg", ".png"}

def natural_key(s):
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s)]

data = {}

for class_folder in os.listdir(IMAGE_ROOT):
    class_path = os.path.join(IMAGE_ROOT, class_folder)
    if not os.path.isdir(class_path):
        continue
    label = class_folder  # e.g. "5C"
    class_key = class_folder.lower()

    students = []
    for fname in os.listdir(class_path):
        base, ext = os.path.splitext(fname)
        if ext.lower() in VALID_EXTS:
            students.append(base.lower())

    if students:
        data[class_key] = {
            "label": label,
            "files": sorted(students)
        }

ordered = dict(sorted(data.items(), key=lambda kv: natural_key(kv[1]["label"])))
with open("students.json", "w", encoding="utf-8") as f:
    json.dump(ordered, f, indent=2)

print(f"✅ wrote students.json with {len(ordered)} classes")
