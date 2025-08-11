let studentsByClass = {};
const classSelect = document.getElementById("classSelect");
const quizDiv = document.getElementById("quiz");
const studentImage = document.getElementById("studentImage");
const optionsDiv = document.getElementById("options");
const feedbackDiv = document.getElementById("feedback");

fetch("students.json?bust=" + Date.now())
  .then(r => r.json())
  .then(data => {
    studentsByClass = data; // { "5c": {label:"5C", files:["doe.john.jpg", ...]}, ... }
    populateClassDropdown(Object.entries(data));
  })
  .catch(err => {
    console.error("Failed to load students.json", err);
    classSelect.innerHTML = '<option value="">(Failed to load classes)</option>';
  });

function populateClassDropdown(entries) {
  classSelect.innerHTML = '<option value="">-- Select a class --</option>';
  entries.forEach(([key, val]) => {
    const option = document.createElement("option");
    option.value = key;              // lowercase key used in paths
    option.textContent = val.label;  // show original label (e.g., "5C")
    classSelect.appendChild(option);
  });
}

classSelect.addEventListener("change", () => {
  const classKey = classSelect.value;
  if (!classKey || !studentsByClass[classKey]) {
    quizDiv.style.display = "none";
    return;
  }
  loadNewQuestion(classKey);
});

function loadNewQuestion(classKey) {
  const classInfo = studentsByClass[classKey];
  console.log("Selected class:", classKey, classInfo);

  if (!classInfo || !Array.isArray(classInfo.files) || classInfo.files.length === 0) {
    quizDiv.style.display = "none";
    alert(`No photos found for class ${classInfo ? classInfo.label : classKey}.`);
    return;
  }

  quizDiv.style.display = "block";
  feedbackDiv.textContent = "";

  const list = classInfo.files; // array of full filenames WITH extension
  const correctFile = list[Math.floor(Math.random() * list.length)];
  if (!correctFile) {
    console.warn("No correctFile picked; list was:", list);
    quizDiv.style.display = "none";
    alert(`No valid images for ${classInfo.label}.`);
    return;
  }

  const stem = correctFile.replace(/\.(jpg|jpeg|png)$/i, ""); // "lastname.firstname"
  const parts = stem.split(".");
  if (parts.length < 2) {
    console.warn("Filename not in lastname.firstname.* format:", correctFile);
  }
  const [last = "", first = ""] = parts;

  // Build primary (lowercase folder) and fallback (original label) paths
  const primarySrc = `images/${classKey}/${correctFile}`;        // uses lowercase key
  const fallbackSrc = `images/${classInfo.label}/${correctFile}`; // uses label as-is

  // Try lowercase path first; if 404, retry with label-cased folder name
  studentImage.onerror = () => {
    if (studentImage.src.endsWith(encodeURI(primarySrc))) {
      console.warn("Primary image 404, trying fallback:", fallbackSrc);
      studentImage.src = fallbackSrc + "?bust=" + Date.now();
    } else {
      console.error("Both primary and fallback paths failed:", primarySrc, fallbackSrc);
      feedbackDiv.textContent = "⚠️ Image not found.";
    }
  };
  studentImage.src = primarySrc + "?bust=" + Date.now();
  console.log("Trying image:", primarySrc, "→ fallback:", fallbackSrc);

  // Build answer options (names only)
  const stems = list.map(fn => fn.replace(/\.(jpg|jpeg|png)$/i, ""));
  const optionsSet = new Set([stem]);
  while (optionsSet.size < Math.min(4, stems.length)) {
    optionsSet.add(stems[Math.floor(Math.random() * stems.length)]);
  }
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  optionsDiv.innerHTML = "";
  options.forEach(optStem => {
    const [l = "", f = ""] = optStem.split(".");
    const btn = document.createElement("button");
    btn.textContent = `${capitalize(f)} ${capitalize(l)}`;
    btn.onclick = () => {
      if (optStem === stem) {
        feedbackDiv.textContent = "✅ Correct!";
      } else {
        feedbackDiv.textContent = `❌ Nope. That was ${capitalize(first)} ${capitalize(last)}.`;
      }
      setTimeout(() => loadNewQuestion(classKey), 1200);
    };
    optionsDiv.appendChild(btn);
  });
}

function capitalize(s){ return s ? s[0].toUpperCase() + s.slice(1) : s; }
