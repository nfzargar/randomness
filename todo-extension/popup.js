let todos = [];

function loadTodos() {
  chrome.storage.local.get(['todos', 'lastReset'], (result) => {
    todos = result.todos || [];
    renderTodos();
  });
}

function saveTodos() {
  chrome.storage.local.set({ todos });
}

function renderTodos() {
  const todoList = document.getElementById('todoList');
  const emptyMessage = document.getElementById('emptyMessage');
  
  todoList.innerHTML = '';
  
  if (todos.length === 0) {
    emptyMessage.style.display = 'block';
    todoList.style.display = 'none';
  } else {
    emptyMessage.style.display = 'none';
    todoList.style.display = 'block';
    
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.completed ? ' completed' : '');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => toggleTodo(index));
      
      const text = document.createElement('span');
      text.className = 'todo-text';
      text.textContent = todo.text;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Remove';
      deleteBtn.addEventListener('click', () => deleteTodo(index));
      
      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  
  if (text) {
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    input.value = '';
    input.focus();
  }
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

document.getElementById('addBtn').addEventListener('click', addTodo);
document.getElementById('todoInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

loadTodos();