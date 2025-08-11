name: Build students.json
on:
  push:
    paths:
      - "images/**"
      - ".github/workflows/build-students.yml"

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-python@v5
        with:
          python-version: "3.x"
      - name: Generate students.json
        run: |
          python - <<'PY'
          import os, json, re
          IMAGE_ROOT = "images"
          exts = {".jpg",".jpeg",".png"}
          def natural_key(s): return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s)]
          data = {}
          for d in os.listdir(IMAGE_ROOT):
              p = os.path.join(IMAGE_ROOT,d)
              if not os.path.isdir(p): continue
              label = d
              key = d.lower()
              files = []
              for f in os.listdir(p):
                  b,e = os.path.splitext(f)
                  if e.lower() in exts:
                      files.append(b.lower())
              if files:
                  data[key] = {"label": label, "files": sorted(files)}
          ordered = dict(sorted(data.items(), key=lambda kv: natural_key(kv[1]["label"])))
          with open("students.json","w",encoding="utf-8") as fh:
              json.dump(ordered, fh, indent=2)
          print(f"wrote students.json with {len(ordered)} classes")
          PY
      - name: Commit students.json
        run: |
          if git diff --quiet -- students.json; then
            echo "No changes."
          else
            git config user.name "github-actions[bot]"
            git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
            git add students.json
            git commit -m "Auto-update students.json"
            git push
          fi
