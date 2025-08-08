let studentsByClass = {};
const classSelect = document.getElementById("classSelect");
const quizDiv = document.getElementById("quiz");
const studentImage = document.getElementById("studentImage");
const optionsDiv = document.getElementById("options");
const feedbackDiv = document.getElementById("feedback");

fetch("students.json")
  .then(res => res.json())
  .then(data => {
    studentsByClass = data;
    populateClassDropdown(Object.keys(data));
  });

function populateClassDropdown(classes) {
  classSelect.innerHTML = '<option value="">-- Select a class --</option>';
  classes.sort().forEach(cls => {
    const option = document.createElement("option");
    option.value = cls;
    option.textContent = cls;
    classSelect.appendChild(option);
  });
}

classSelect.addEventListener("change", () => {
  const selectedClass = classSelect.value;
  if (selectedClass && studentsByClass[selectedClass]) {
    quizDiv.style.display = "block";
    loadNewQuestion(selectedClass);
  } else {
    quizDiv.style.display = "none";
  }
});

function loadNewQuestion(className) {
  feedbackDiv.textContent = "";
  const classList = studentsByClass[className];
  const correct = classList[Math.floor(Math.random() * classList.length)];

  const [last, first] = correct.split(".");
  studentImage.src = `images/${className.toLowerCase()}/${correct}.jpg`;



  const options = [correct];
  while (options.length < 4 && options.length < classList.length) {
    const random = classList[Math.floor(Math.random() * classList.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }

  options.sort(() => Math.random() - 0.5);
  optionsDiv.innerHTML = "";

  options.forEach(opt => {
    const [l, f] = opt.split(".");
    const button = document.createElement("button");
    button.textContent = `${capitalize(f)} ${capitalize(l)}`;
    button.onclick = () => {
      if (opt === correct) {
        feedbackDiv.textContent = "✅ Correct!";
      } else {
        feedbackDiv.textContent = `❌ Nope. That was ${capitalize(first)} ${capitalize(last)}.`;
      }
      setTimeout(() => loadNewQuestion(className), 1500);
    };
    optionsDiv.appendChild(button);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
