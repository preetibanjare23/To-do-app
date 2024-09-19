document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const incompleteTaskList = document.getElementById('incomplete-task-list');
    const resetTasksButton = document.getElementById('reset-tasks');
    const searchTaskInput = document.getElementById('search-task');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Load tasks from local storage
    loadTasks();

    // Add event listeners
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    resetTasksButton.addEventListener('click', resetTasks);
    searchTaskInput.addEventListener('input', searchTasks);
    tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', switchTab);
    });

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const taskItem = createTaskItem(taskText, false);
            taskList.insertBefore(taskItem, taskList.firstChild);
            saveTasks();
            taskInput.value = '';
        }
    }

    // Function to create a task item
    function createTaskItem(text, completed) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed');
            saveTasks();
        });

        const taskText = document.createElement('span');
        taskText.textContent = text;
        taskText.contentEditable = true;
        taskText.addEventListener('blur', function() {
            saveTasks();
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit-task');
        editButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
      </svg>
        `;
        editButton.addEventListener('click', function() {
            taskText.contentEditable = true;
            taskText.focus();
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-task');
        removeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
      </svg>
        `;
        removeButton.addEventListener('click', function() {
            li.remove();
            saveTasks();
        });

        // Append checkbox, task text, edit button, and remove button to the list item
        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(removeButton);
        if (completed) {
            li.classList.add('completed');
        }
        return li;
    }

    // Function to save tasks to local storage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('span').textContent,
                completed: taskItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        filterTasks();
    }

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.completed);
            taskList.appendChild(taskItem);
        });
        filterTasks();
    }

    // Function to reset tasks and clear local storage
    function resetTasks() {
        taskList.innerHTML = '';
        completedTaskList.innerHTML = '';
        incompleteTaskList.innerHTML = '';
        localStorage.removeItem('tasks');
    }

    // Function to search tasks
    function searchTasks() {
        const searchText = searchTaskInput.value.toLowerCase();
        document.querySelectorAll('#task-list li').forEach(taskItem => {
            const taskText = taskItem.querySelector('span').textContent.toLowerCase();
            if (taskText.includes(searchText)) {
                taskItem.style.display = '';
            } else {
                taskItem.style.display = 'none';
            }
        });
    }

    // Function to switch between tabs
    function switchTab(event) {
        const targetTab = event.target.dataset.tab;
        tabLinks.forEach(tabLink => {
            tabLink.classList.remove('active');
        });
        event.target.classList.add('active');
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
            if (tabContent.id === targetTab) {
                tabContent.classList.add('active');
            }
        });
    }

    // Function to filter tasks into completed and incomplete lists
    function filterTasks() {
        const allTasks = [...taskList.querySelectorAll('li')];
        const completedTasks = allTasks.filter(taskItem => taskItem.classList.contains('completed'));
        const incompleteTasks = allTasks.filter(taskItem => !taskItem.classList.contains('completed'));

        completedTaskList.innerHTML = '';
        incompleteTaskList.innerHTML = '';

        completedTasks.forEach(taskItem => {
            const clonedItem = taskItem.cloneNode(true);
            completedTaskList.appendChild(clonedItem);
        });

        incompleteTasks.forEach(taskItem => {
            const clonedItem = taskItem.cloneNode(true);
            incompleteTaskList.appendChild(clonedItem);
        });
    }

    const searchBox = document.getElementById('new-task');

    // Automatically focus and select the text in the search input
    function focusSearch() {
        searchBox.focus(); // Focus on the search input
        searchBox.setSelectionRange(0, searchBox.value.length); // Select all text
    }

    // Call the function to focus and select the text in the search input
    focusSearch();
});
