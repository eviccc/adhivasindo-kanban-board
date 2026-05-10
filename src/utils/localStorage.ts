import type { Task, Column, ColumnId } from "@/types/task";

const TASKS_KEY = "adhivasindo_kanban_tasks";
const COLUMNS_KEY = "adhivasindo_kanban_columns";
const COLUMN_ORDER_KEY = "adhivasindo_kanban_column_order";

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks:", e);
  }
}

export function loadTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to load tasks:", e);
    return null;
  }
}

export function saveColumns(columns: Column[]): void {
  try {
    localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns));
  } catch (e) {
    console.error("Failed to save columns:", e);
  }
}

export function loadColumns(): Column[] | null {
  try {
    const raw = localStorage.getItem(COLUMNS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to load columns:", e);
    return null;
  }
}

export function saveColumnOrder(order: ColumnId[]): void {
  try {
    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(order));
  } catch (e) {
    console.error("Failed to save column order:", e);
  }
}

export function loadColumnOrder(): ColumnId[] | null {
  try {
    const raw = localStorage.getItem(COLUMN_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to load column order:", e);
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(TASKS_KEY);
  localStorage.removeItem(COLUMNS_KEY);
  localStorage.removeItem(COLUMN_ORDER_KEY);
}
