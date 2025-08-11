let studentsByClass = {};
const classSelect = document.getElementById("classSelect");
const quizDiv = document.getElementById("quiz");
const studentImage = document.getElementById("studentImage");
const optionsDiv = document.getElementById("options");
const feedbackDiv = document.getElementById("feedback");

fetch("students.json")
  .then(r => r.json())
  .then(data => {
    studentsByClass = data; // { "5c": { label:"5C", files:["doe.john.jpg", ...] }, ... }
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
    option.value = key;            // lowercase key used for paths
    option.textContent = val.label; // visible label (e.g., "5C")
    classSelect.appendChild(option);
  });
}

classSelect.addEventListener("change", () => {
  const key = classSelect.value;
  if (key && studentsByClass[key]) {
    loadNewQuestion(key);
  } else {
    quizDiv.style.display = "none";
  }
});

function loadNewQuestion(classKey) {
  const classInfo = studentsByClass[classKey];
  if (!classInfo || !classInfo.files || classInfo.files.length === 0) {
    quizDiv.style.display = "none";
    alert(`No photos found for class ${classInfo ? classInfo.label : classKey}.`);
    return;
  }

  quizDiv.style.display = "block";
  feedbackDiv.textContent = "";

  const list = classInfo.files; // array of full filenames: "doe.john.jpg"
  const correctFile = list[Math.floor(Math.random() * list.length)];
  const stem = correctFile.replace(/\.(jpg|jpeg|png)$/i, ""); // "doe.john"
  const [last, first] = stem.split(".");

  // Use the filename with extension exactly as in students.json
  studentImage.src = `images/${classKey}/${correctFile}`;

  // Build answer options from stems (names), not from filenames
  const stems = list.map(fn => fn.replace(/\.(jpg|jpeg|png)$/i, ""));
  const optionsSet = new Set([stem]);
  while (optionsSet.size < Math.min(4, stems.length)) {
    optionsSet.add(stems[Math.floor(Math.random() * stems.length)]);
  }
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  optionsDiv.innerHTML = "";
  options.forEach(optStem => {
    const [l, f] = optStem.split(".");
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

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
