export function validateTask(task, isEditing = false) {
  const errors = {};
  const title = String(task.title || '').trim();
  const description = String(task.description || '').trim();
  const dueDate = String(task.dueDate || '').trim();

  // Title
  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters.';
  } else if (!/[A-Za-z0-9]/.test(title)) {
    errors.title = 'Title must contain at least one letter or number.';
  } else if (/\s{2,}/.test(title)) {
    errors.title = 'Title cannot contain consecutive spaces.';
  }

  // Description
  if (description.length > 250) {
    errors.description = 'Description cannot exceed 250 characters.';
  }

  // Due date
  if (!dueDate) {
    errors.dueDate = 'Due date is required.';
   
    
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    errors.dueDate = 'Please enter a valid due date.';
  } else {
    const selected = new Date(`${dueDate}T00:00:00`);
    if (Number.isNaN(selected.getTime())) {
      errors.dueDate = 'Please enter a valid due date.';
    } else {
      const [year, month, day] = dueDate.split('-').map(Number);
      if (selected.getFullYear() !== year || selected.getMonth() + 1 !== month || selected.getDate() !== day) {
        errors.dueDate = 'Please enter a valid calendar date.';
      }

      // Allow an existing past task to be edited, but new tasks cannot be overdue.
      if (!isEditing) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          errors.dueDate = 'Due date cannot be in the past.';
        }
      }
    }
  }

  // Priority
  if (!['Low', 'Medium', 'High'].includes(task.priority)) {
    errors.priority = 'Please select a valid priority.';
  }

  // Category — matches the options in index.html
  if (!['Work', 'Personal', 'Learning', 'Other'].includes(task.category)) {
    errors.category = 'Please select a valid category.';
  }

  // Status
  if (!['Pending', 'Completed'].includes(task.status)) {
    errors.status = 'Please select a valid status.';
  }

  return errors;
}
