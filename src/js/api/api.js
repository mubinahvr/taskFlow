const API_URL = "https://taskflow-api.onrender.com";

// Get all tasks
export async function getTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    return response.json();
}

// Add a new task
export async function createTask(task) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return response.json();
}

// Update a task
export async function updateTask(id, task) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return response.json();
}

// Delete a task
export async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });
}

// Get all habits
export async function getHabits() {
    const response = await fetch(`${API_URL}/habits`);
    return response.json();
}

// Update a habit
export async function updateHabit(id, data) {
    const response = await fetch(`${API_URL}/habits/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return response.json();
}