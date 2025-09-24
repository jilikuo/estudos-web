const onPageLoad = () => {

    if (hasTasksStored()){
        const taskList = getTaskList();
        for (const task of taskList) {
            drawNewTask(task.description, task.tag, task.completed);
        }

        updateCounter();
        return;
    }

    addNewTask('Implementar tela de listagem de tarefas', 'frontend');
    addNewTask('Criar endpoint para cadastro de tarefas', 'backend');
    addNewTask('Criar protótipo da tela de tarefas', 'ux');

    const taskList = document.querySelectorAll('.task-item');
    setTaskCompleted(taskList[2], true);

    updateCounter();
    return;
};

const hasTasksStored = () => {
    return localStorage.getItem('tasks') !== null
};

const getTaskList = () => {
    return JSON.parse(localStorage.getItem('tasks')) || [];
};

const handleAddTask = () => {
    const inputs = document.querySelectorAll('.task-form input');
    const description = inputs[0].value.trim();
    const tag = inputs[1].value.trim();
    
    if (description && tag) {
        addNewTask(description, tag);
        
        inputs[0].value = '';
        inputs[1].value = '';
        
        inputs[0].focus();
    }
};

const addNewTask = (description, tag) => {
    drawNewTask(description, tag, false);
    
    const tasks = getTaskList();
    tasks.push({ description: description, tag: tag, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const drawNewTask = (description, tag, status) => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item`;
    
    taskItem.innerHTML = `
        <div class="task-content">
            <h3 class="task-name">${description}</h3>
            <span class="task-tag">${tag}</span>
            <span class="date">Criado em: ${new Date().toLocaleDateString('pt-BR')}</span>
        </div>
        <button class="complete-btn">Concluir</button>
    `;

    const completeBtn = taskItem.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => {
        const isCompleted = taskItem.classList.contains('completed');
        setTaskCompleted(taskItem, !isCompleted);
    });

    document.querySelector('.tasks-list').appendChild(taskItem);

    status ? completeTask(taskItem) : undoCompleteTask(taskItem);
}

const setTaskCompleted = (taskItem, status) => {
    status ? completeTask(taskItem) : undoCompleteTask(taskItem);
    
    const tasks = getTaskList();
    const allTaskElements = document.querySelectorAll('.task-item');
    const taskIndex = Array.from(allTaskElements).indexOf(taskItem);
    
    if (tasks[taskIndex]) {
        tasks[taskIndex].completed = status;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    updateCounter();
};

const completeTask = (taskItem) => {
    taskItem.classList.add('completed');
    taskItem.querySelector('.complete-btn').textContent = '✓';
};

const undoCompleteTask = (taskItem) => {
    taskItem.classList.remove('completed');
    taskItem.querySelector('.complete-btn').textContent = 'Concluir';
}

const updateCounter = () => {
    const completedTasks = document.querySelectorAll('.task-item.completed');
    document.querySelector('#tasks-completed').textContent = completedTasks.length;
};

document.addEventListener('DOMContentLoaded', onPageLoad);