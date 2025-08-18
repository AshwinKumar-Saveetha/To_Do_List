// DOM references
const todoInput = document.getElementById('todo-input');
const todoList  = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-bar button');

// State
let todos = [];      // { id, text, completed }
let filter = 'all';  // all | active | completed

// Init
loadTodos();
renderTodos();

// Add new task on Enter
todoInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTodo();
  }
});

// Filter buttons
filterBtns.forEach(btn =>
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.toggle('active', b === btn));
    filter = btn.dataset.filter;
    renderTodos();
  })
);

// CRUD
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, completed: false });
  saveTodos();
  renderTodos();
  todoInput.value = '';
}

function toggleComplete(id) {
  todos = todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

// Persistence
function loadTodos() {
  const data = localStorage.getItem('todos');
  if (data) {
    try { todos = JSON.parse(data); }
    catch { todos = []; }
  }
}
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Render
function renderTodos() {
  todoList.innerHTML = '';
  todos
    .filter(t => {
      if (filter === 'active')    return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .forEach(({ id, text, completed }) => {
      const li = document.createElement('li');
      li.className = `todo-item${completed ? ' completed' : ''}`;

      const span = document.createElement('span');
      span.textContent = text;

      const btns = document.createElement('div');
      btns.className = 'todo-buttons';

      const comp = document.createElement('button');
      comp.textContent = completed ? 'Undo' : 'Complete';
      comp.className = 'complete-btn';
      comp.onclick = () => toggleComplete(id);

      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.className = 'delete-btn';
      del.onclick = () => deleteTodo(id);

      btns.append(comp, del);
      li.append(span, btns);
      todoList.appendChild(li);
    });
}
