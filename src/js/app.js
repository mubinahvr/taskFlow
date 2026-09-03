import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getHabits,
    updateHabit
} from "./api/api.js";

import { validateTask } from "./validation/validation.js";
import { showToast, formatDate, priorityRank } from "./ui/ui.js";

let tasks = [];
let habits = [];
let submitting = false;

const $ = id => document.getElementById(id);


// --------------------
// Message
// --------------------

function setMessage(message = "", type = "") {
    const element = $("taskMessage");

    element.textContent = message;
    element.className = `message ${type}`;

    if (!message) {
        element.classList.add("hidden");
    } else {
        element.classList.remove("hidden");
    }
}


// --------------------
// Dashboard
// --------------------

function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.status === "Completed"
    ).length;

    const pending = total - completed;

    const highPriority = tasks.filter(
        task => task.priority === "High" &&
                task.status !== "Completed"
    ).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    $("totalCount").textContent = total;
    $("completedCount").textContent = completed;
    $("pendingCount").textContent = pending;
    $("highCount").textContent = highPriority;

    $("progressText").textContent = percentage + "%";
    $("progressBar").style.width = percentage + "%";
}


// --------------------
// Filter Tasks
// --------------------

function getFilteredTasks() {

    const search = $("searchInput").value
        .trim()
        .toLowerCase();

    const status = $("statusFilter").value;
    const priority = $("priorityFilter").value;
    const category = $("categoryFilter").value;
    const sort = $("sortSelect").value;

    let result = tasks.filter(task => {

        const title = task.title.toLowerCase();
        const description = (task.description || "").toLowerCase();

        return (
            (!search ||
                title.includes(search) ||
                description.includes(search)) &&

            (!status || task.status === status) &&

            (!priority || task.priority === priority) &&

            (!category || task.category === category)
        );
    });


    // Sorting

    if (sort === "priority") {

        result.sort(
            (a, b) =>
                priorityRank(a.priority) -
                priorityRank(b.priority)
        );

    } else if (sort === "dueDesc") {

        result.sort(
            (a, b) =>
                b.dueDate.localeCompare(a.dueDate)
        );

    } else {

        result.sort(
            (a, b) =>
                a.dueDate.localeCompare(b.dueDate)
        );
    }

    return result;
}


// --------------------
// Show Tasks
// --------------------

function renderTasks() {

    const list = $("taskList");

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {

        list.innerHTML = "";

        if (tasks.length === 0) {
            setMessage(
                "No tasks yet. Click Add New Task to create one.",
                "empty"
            );
        } else {
            setMessage(
                "No tasks match your search or filters.",
                "empty"
            );
        }

        return;
    }

    setMessage("");

    list.innerHTML = filteredTasks.map(task => {

        return `
            <article class="task-card">

                <div class="task-main">

                    <h3>${escapeHtml(task.title)}</h3>

                    <p>
                        ${escapeHtml(
                            task.description || "No description"
                        )}
                    </p>

                    <div class="meta">

                        <span class="tag ${task.priority.toLowerCase()}">
                            ${task.priority}
                        </span>

                        <span class="tag">
                            ${escapeHtml(task.category)}
                        </span>

                        <span class="tag">
                            Due ${formatDate(task.dueDate)}
                        </span>

                        <span class="tag ${task.status === "Completed" ? "done" : ""}">
                            ${task.status}
                        </span>

                    </div>

                </div>

                <div class="actions">

                    <button
                        class="complete"
                        data-action="toggle"
                        data-id="${task.id}">
                        ${task.status === "Completed" ? "↩" : "✓"}
                    </button>

                    <button
                        data-action="edit"
                        data-id="${task.id}">
                        ✎
                    </button>

                    <button
                        class="delete"
                        data-action="delete"
                        data-id="${task.id}">
                        🗑
                    </button>

                </div>

            </article>
        `;

    }).join("");
}


// --------------------
// Show Habits
// --------------------

function renderHabits() {

    $("habitList").innerHTML = habits.map(habit => {

        return `
            <article class="habit-card ${habit.completedToday ? "habit-done" : ""}">

                <div>
                    <h3>${escapeHtml(habit.name)}</h3>
                    <p>${escapeHtml(habit.frequency)}</p>
                </div>

                <button
                    class="complete-btn"
                    data-habit="${habit.id}">
                    ${habit.completedToday ? "✓ Done" : "Complete"}
                </button>

            </article>
        `;

    }).join("");
}


// --------------------
// Prevent HTML Injection
// --------------------

function escapeHtml(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}


// --------------------
// Modal
// --------------------

function openModal(task = null) {

    $("modal").classList.remove("hidden");

    $("modalTitle").textContent =
        task ? "Edit Task" : "Add New Task";

    $("taskId").value = task ? task.id : "";

    $("title").value =
        task ? task.title : "";

    $("description").value =
        task ? task.description : "";

    $("dueDate").value =
        task
            ? task.dueDate
            : new Date().toISOString().slice(0, 10);

    $("priority").value =
        task ? task.priority : "Medium";

    $("category").value =
        task ? task.category : "Work";

    $("status").value =
        task ? task.status : "Pending";

    updateCharCount();

    $("title").focus();
}


function closeModal() {

    $("modal").classList.add("hidden");

    $("taskForm").reset();

    $("taskId").value = "";

    updateCharCount();
}


// --------------------
// Load Tasks & Habits
// --------------------

async function loadData() {

    setMessage("Loading tasks...");

    try {

        tasks = await getTasks();
        habits = await getHabits();

        updateDashboard();
        renderTasks();
        renderHabits();

    } catch (error) {

        setMessage(
            "Unable to connect to JSON Server. Start it with: npm run server",
            "error"
        );

        $("habitList").innerHTML = "";
    }
}


// --------------------
// Save Task
// --------------------

async function handleSubmit(event) {

    event.preventDefault();

    if (submitting) {
        return;
    }

    const task = {

        title: $("title").value.trim(),

        description: $("description").value.trim(),

        dueDate: $("dueDate").value,

        priority: $("priority").value,

        category: $("category").value,

        status: $("status").value
    };


    // Validation

    const errors = validateTask(
        task,
        $("taskId").value !== ""
    );

    if (Object.keys(errors).length > 0) {

        showToast(Object.values(errors)[0]);

        return;
    }


    submitting = true;

    $("saveBtn").disabled = true;
    $("saveBtn").textContent = "Saving...";


    try {

        const id = $("taskId").value;

        if (id) {

            await updateTask(id, task);

            showToast("Task updated successfully.");

        } else {

            await createTask({
                ...task,
                createdAt: new Date().toISOString()
            });

            showToast("Task created successfully.");
        }


        closeModal();

        await loadData();

    } catch (error) {

        showToast(
            "Could not save the task. Please try again."
        );

    } finally {

        submitting = false;

        $("saveBtn").disabled = false;
        $("saveBtn").textContent = "Save Task";
    }
}


// --------------------
// Character Count
// --------------------

function updateCharCount() {

    $("charCount").textContent =
        $("description").value.length;
}


// --------------------
// Task Buttons
// --------------------

$("taskList").addEventListener("click", async event => {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const id = button.dataset.id;

    const task = tasks.find(
        task => String(task.id) === String(id)
    );

    if (!task) {
        return;
    }


    try {

        // Edit

        if (button.dataset.action === "edit") {

            openModal(task);
            return;
        }


        // Delete

        if (button.dataset.action === "delete") {

            const confirmed = confirm(
                `Delete "${task.title}"?`
            );

            if (!confirmed) {
                return;
            }

            await deleteTask(id);

            showToast("Task deleted.");

            await loadData();

            return;
        }


        // Complete / Pending

        if (button.dataset.action === "toggle") {

            const newStatus =
                task.status === "Completed"
                    ? "Pending"
                    : "Completed";

            await updateTask(id, {
                status: newStatus
            });

            showToast(
                newStatus === "Completed"
                    ? "Task completed!"
                    : "Task marked pending."
            );

            await loadData();
        }

    } catch (error) {

        showToast(
            "Operation failed. Please try again."
        );
    }
});


// --------------------
// Habit Button
// --------------------

$("habitList").addEventListener("click", async event => {

    const button =
        event.target.closest("[data-habit]");

    if (!button) {
        return;
    }

    const habit = habits.find(
        habit =>
            String(habit.id) ===
            String(button.dataset.habit)
    );

    if (!habit) {
        return;
    }


    try {

        await updateHabit(habit.id, {
            completedToday: !habit.completedToday
        });

        showToast(
            habit.completedToday
                ? "Habit marked incomplete."
                : "Habit completed today!"
        );

        await loadData();

    } catch (error) {

        showToast("Could not update habit.");
    }
});


// --------------------
// Events
// --------------------

$("addTaskBtn").addEventListener(
    "click",
    () => openModal()
);

$("closeModal").addEventListener(
    "click",
    closeModal
);

$("cancelBtn").addEventListener(
    "click",
    closeModal
);

$("taskForm").addEventListener(
    "submit",
    handleSubmit
);

$("description").addEventListener(
    "input",
    updateCharCount
);


// Search and Filters

[
    "searchInput",
    "statusFilter",
    "priorityFilter",
    "categoryFilter",
    "sortSelect"
].forEach(id => {

    $(id).addEventListener(
        "input",
        renderTasks
    );
});


// --------------------
// Mobile Menu
// --------------------

$("menuBtn").addEventListener("click", () => {

    $("nav").classList.toggle("open");
});


// --------------------
// Today's Date
// --------------------

$("todayDate").textContent =
    new Date().toLocaleDateString("en-IN", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });


// --------------------
// Greeting
// --------------------

const hour = new Date().getHours();

if (hour < 12) {

    $("greeting").textContent =
        "Good Morning ☀️ Mubina D";

} else if (hour < 18) {

    $("greeting").textContent =
        "Good Afternoon 🌤️ Mubina D";

} else {

    $("greeting").textContent =
        "Good Evening 🌙 Mubina D";
}


// --------------------
// Start Application
// --------------------

loadData();