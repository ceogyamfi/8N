// Function to toggle the hamburger menu
function show() {
    const hamburgerButton = document.querySelector('.hamburger');
    const navigation = document.querySelector('.navigation');
    hamburgerButton.classList.toggle('open');
    navigation.classList.toggle('active');
}

// Select elements from the DOM
const addTaskButtons = document.querySelectorAll(".add-task-button");
const taskModal = document.getElementById("task-modal");
const closeModalButton = document.getElementById("close-modal");
const addTaskButton = document.getElementById("add-task");
const taskInput = document.getElementById("task-input");
const taskLists = document.querySelectorAll(".task-list");

// Check if there are tasks in localStorage and load them
const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const dayTasks = {};

daysOfWeek.forEach(day => {
    dayTasks[day] = JSON.parse(localStorage.getItem(day + "-tasks")) || [];
});

// Function to open the task modal
function openTaskModal() {
    taskModal.style.display = "block";
}

// Function to close the task modal
function closeTaskModal() {
    taskModal.style.display = "none";
}

// Function to add a new task
function addTask(day) {
    openTaskModal();

    addTaskButton.disabled = false; // Re-enable the button

    addTaskButton.onclick = () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = { text: taskText, completed: false };
            dayTasks[day].push(task);
            saveTasksToLocalStorage(day);
            updateTaskList(day);
            taskInput.value = "";
            closeTaskModal();
        }
    };
}

// Function to update the task list for a specific day
function updateTaskList(day) {
    const taskList = document.getElementById(day + "-tasks");
    taskList.innerHTML = "";
    dayTasks[day].forEach((task, taskIndex) => {
        const listItem = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode(task.text));
        taskList.appendChild(listItem);

        checkbox.addEventListener("change", () => {
            dayTasks[day][taskIndex].completed = checkbox.checked;
            if (checkbox.checked) {
                dayTasks[day].splice(taskIndex, 1);
            }
            updateTaskList(day);
            saveTasksToLocalStorage(day);
        });
    });
}

// Function to save tasks to local storage for a specific day
function saveTasksToLocalStorage(day) {
    localStorage.setItem(day + "-tasks", JSON.stringify(dayTasks[day]));
}

// Event listeners
addTaskButtons.forEach(button => {
    const day = button.getAttribute("data-day");
    button.addEventListener("click", () => {
        addTask(day);
    });
});

closeModalButton.addEventListener("click", closeTaskModal);

// Initial update of task lists for all days
daysOfWeek.forEach(day => {
    updateTaskList(day);
});
