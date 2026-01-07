#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "todos.json");

function loadTodos() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

function saveTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({
    id: Date.now(),
    text,
    done: false,
  });
  saveTodos(todos);
  console.log("✅ Todo added!");
}

function listTodos() {
  const todos = loadTodos();
  if (todos.length === 0) {
    console.log("📭 No todos yet.");
    return;
  }

  todos.forEach((todo, index) => {
    const status = todo.done ? "✔" : " ";
    console.log(`${index + 1}. [${status}] ${todo.text}`);
  });
}

function completeTodo(index) {
  const todos = loadTodos();

  if (!todos[index]) {
    console.log("❌ Invalid todo number.");
    return;
  }

  todos[index].done = true;
  saveTodos(todos);
  console.log("🎉 Todo completed!");
}

const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    addTodo(args.join(" "));
    break;
  case "list":
    listTodos();
    break;
  case "done":
    completeTodo(Number(args[0]) - 1);
    break;
  default:
    console.log(`
Usage:
  node todo.js add "Buy milk"
  node todo.js list
  node todo.js done 1
    `);
}
