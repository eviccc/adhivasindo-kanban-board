export type ColumnId = 'todo' | 'doing' | 'review' | 'done' | 'rework'

export type Label = 'Feature' | 'Bug' | 'Issue' | 'Undefined'
export type Priority = 'Low' | 'Medium' | 'High'

export interface Assignee {
  id: string
  name: string
  avatar: string
  color: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  dataUrl?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  boardName: string;
  columnId: ColumnId;
  assignees: Assignee[];
  dueDate: string | null;
  label: Label;
  priority: Priority;
  subtasks: Subtask[];
  attachments: Attachment[];
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnId
  title: string
  color: string
}

export interface BoardState {
  tasks: Task[];
  columns: Column[];
  columnOrder: ColumnId[];
}
