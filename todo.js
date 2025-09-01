// Date & Time
function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime-display").textContent =
    now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Task handling
const taskField = document.getElementById("task-field");
const addBtn = document.getElementById("task-add-btn");
const taskList = document.getElementById("task-list");
const template = document.getElementById("task-template");

const progressRing = document.getElementById("progress-ring");
const progressValue = document.getElementById("progress-value");
const progressStatus = document.getElementById("progress-status");

function updateProgress() {
  const tasks = taskList.querySelectorAll(".task-item");
  const completed = taskList.querySelectorAll(".task-check:checked");
  const total = tasks.length;
  const done = completed.length;

  if (total === 0) {
    progressValue.textContent = "0%";
    progressStatus.textContent = "No tasks yet";
    progressRing.style.strokeDashoffset = 283;
    return;
  }

  const percent = Math.round((done / total) * 100);
  progressValue.textContent = percent + "%";
  progressStatus.textContent =
    done === total ? "All tasks done 🎉" : `${done}/${total} completed`;
  progressRing.style.strokeDashoffset = 283 - (283 * percent) / 100;
}

function addTask(text) {
  if (!text.trim()) return;

  const clone = template.content.cloneNode(true);
  const li = clone.querySelector("li");
  const span = li.querySelector(".task-text");
  const checkbox = li.querySelector(".task-check");
  const editBtn = li.querySelector(".edit-btn");
  const delBtn = li.querySelector(".delete-btn");

  span.textContent = text;

  checkbox.addEventListener("change", () => {
    span.classList.toggle("conquered", checkbox.checked);
    updateProgress();
  });

  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit task:", span.textContent);
    if (newText) span.textContent = newText;
  });

  delBtn.addEventListener("click", () => {
    li.remove();
    updateProgress();
  });

  taskList.appendChild(li);
  taskField.value = "";
  updateProgress();
}

addBtn.addEventListener("click", () => addTask(taskField.value));
taskField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask(taskField.value);
});
