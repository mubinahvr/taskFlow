# TaskFlow – Personal Task and Habit Manager



## 🚀 Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* JSON Server
* Fetch API
* Bootstrap Icons

---

## 📁 Project Structure

```text
TaskFlow/
│
├── index.html
├── README.md
├── db.json
├── package.json
│
└── src/
    ├── css/
    │   └── style.css
    │
    └── js/
        ├── app.js
        │
        ├── api/
        │   └── api.js
        │
        ├── ui/
        │   └── ui.js
        │
        └── validation/
            └── validation.js
```

---

## ✨ Features

### Task Management

Users can create tasks with:

* Task title
* Description
* Due date
* Priority
* Category
* Status

Tasks can be:

* Added
* Updated
* Deleted
* Completed
* Marked as pending

### 🔍 Search and Filters

Tasks can be searched by:

* Title
* Description

Tasks can also be filtered by:

* Status
* Priority
* Category

Tasks can be sorted by:

* Due date
* Priority

### 📊 Dashboard

The dashboard displays:

* Total Tasks
* Completed Tasks
* Pending Tasks
* High Priority Tasks
* Overall completion percentage

### ✅ Habit Tracking

Users can:

* View habits
* Mark a habit as completed
* Mark a completed habit as incomplete

### 📱 Responsive Design

The application is designed to work on:

* Desktop
* Tablet
* Mobile

---

## 🗄️ JSON Server

The project uses JSON Server as a simple backend.

Example `db.json`:

```json
{
  "tasks": [
    {
      "id": "1",
      "title": "Complete project",
      "description": "Finish TaskFlow project",
      "dueDate": "2026-09-03",
      "priority": "High",
      "category": "Work",
      "status": "Pending",
      "createdAt": "2026-09-03T10:00:00.000Z"
    }
  ],
  "habits": [
    {
      "id": "1",
      "name": "Drink Water",
      "frequency": "Daily",
      "completedToday": false
    }
  ]
}
```

---

## ⚙️ Installation

### 1. Clone or download the project

Open the project folder in VS Code.

### 2. Install dependencies

```bash
npm install
```

### 3. Start JSON Server

```bash
npm run server
```

The API will run at:

```text
http://localhost:3000
```

### 4. Open the application

Open `index.html` in the browser using Live Server.

---

## 📦 Package Scripts

The `package.json` should contain:

```json
{
  "scripts": {
    "server": "json-server --watch db.json --port 3000"
  }
}
```

Run the backend with:

```bash
npm run server
```

---

## 🔗 API Endpoints

### Tasks

| Method | Endpoint     | Purpose       |
| ------ | ------------ | ------------- |
| GET    | `/tasks`     | Get all tasks |
| POST   | `/tasks`     | Create a task |
| PATCH  | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Habits

| Method | Endpoint      | Purpose        |
| ------ | ------------- | -------------- |
| GET    | `/habits`     | Get all habits |
| PATCH  | `/habits/:id` | Update a habit |

---

## 🛡️ Validation

Task forms include validation before saving.

Validation can check:

* Required task title
* Description length
* Due date
* Priority
* Category
* Other required fields

Validation errors are displayed to the user using toast messages.

---

## 🎨 UI Features

The dashboard includes:

* Summary cards
* Colored icons
* Task cards
* Progress bar
* Search box
* Filters
* Add Task modal
* Habit cards
* Responsive navigation
* Toast notifications
* Background image
* Daily greeting

---

## 📈 Task Progress

The completion percentage is calculated using:

```text
Completed Tasks / Total Tasks × 100
```

For example:

```text
Total Tasks: 10
Completed: 7

Progress: 70%
```

---

## 🔄 Application Flow

```text
User
  ↓
TaskFlow UI
  ↓
JavaScript
  ↓
Fetch API
  ↓
JSON Server
  ↓
db.json
```

When a task is added, updated, completed, or deleted, the application communicates with JSON Server and refreshes the dashboard.

---

## 🧩 Main JavaScript Modules

### `api.js`

Handles communication with JSON Server.

```javascript
getTasks()
createTask()
updateTask()
deleteTask()
getHabits()
updateHabit()
```

### `validation.js`

Handles task form validation.

### `ui.js`

Contains reusable UI functions such as:

```javascript
showToast()
formatDate()
priorityRank()
```

### `app.js`

Controls the main application logic:

* Loading data
* Rendering tasks
* Rendering habits
* Form submission
* Filtering
* Searching
* Sorting
* Dashboard updates
* Task actions

---

## 💡 Learning Objectives

This project demonstrates practical knowledge of:

* Semantic HTML
* CSS responsive design
* JavaScript ES6+
* ES modules
* DOM manipulation
* Event handling
* Array methods
* Async/Await
* Promises
* Fetch API
* CRUD operations
* Form validation
* JSON Server
* Local development workflow

---

## 🧪 Testing Checklist

Before submitting the project, verify:

* [ ] Tasks load correctly
* [ ] New task can be added
* [ ] Form validation works
* [ ] Task can be edited
* [ ] Task can be deleted
* [ ] Task can be completed
* [ ] Completed task can be marked pending
* [ ] Search works
* [ ] Status filter works
* [ ] Priority filter works
* [ ] Category filter works
* [ ] Sorting works
* [ ] Dashboard counts update
* [ ] Progress bar updates
* [ ] Habits load correctly
* [ ] Habits can be completed
* [ ] Mobile menu works
* [ ] Responsive layout works
* [ ] JSON Server connection works

---

## 👩‍💻 Author

**Mubina D**

Frontend / UI Developer

---

## 📄 License

This project is created for learning and educational purposes.
