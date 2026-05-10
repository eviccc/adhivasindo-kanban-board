<template>
  <div class="column" :class="{ 'drop-over': isDragOver }">
    <!-- Column header -->
    <div class="col-header">
      <div class="col-title-row">
        <span class="col-drag-handle" title="Drag to reorder">
          <ion-icon :icon="reorderFourOutline" />
        </span>
        <span class="col-dot" :style="{ background: column.color }" />
        <h3 class="col-title">{{ column.title }}</h3>
        <span class="col-count">{{ tasks.length }}</span>
        <button
          class="col-btn"
          @click="$emit('add-task', column.id)"
          title="Add task"
        >
          <ion-icon :icon="addOutline" />
        </button>
        <button class="col-btn" title="Options">
          <ion-icon :icon="ellipsisHorizontal" />
        </button>
      </div>
      <button class="col-expand" title="Expand">
        <ion-icon :icon="expandOutline" />
      </button>
    </div>

    <!-- Divider line matching column color -->
    <div class="col-divider" :style="{ background: column.color }" />

    <!-- Draggable task list -->
    <draggable
      v-model="localTasks"
      group="tasks"
      item-key="id"
      class="col-tasks"
      ghost-class="sortable-ghost"
      chosen-class="sortable-chosen"
      drag-class="sortable-drag"
      animation="200"
      @start="onStart"
      @change="onDragChange"
      @dragenter="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop="isDragOver = false"
    >
      <template #item="{ element }">
        <div class="task-wrap">
          <TaskCard :task="element" @click="$emit('open-task', element)" />
        </div>
      </template>
    </draggable>

    <!-- Add task button at bottom -->
    <button class="add-task-btn" @click="$emit('add-task', column.id)">
      <ion-icon :icon="addOutline" />
      <span>Add Task</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { IonIcon } from "@ionic/vue";
import { addOutline, ellipsisHorizontal, expandOutline, reorderFourOutline  } from "ionicons/icons";
import draggable from "vuedraggable";
import TaskCard from "./TaskCard.vue";
import type { Column, Task, ColumnId } from "@/types/task";
import { useTaskStore } from "@/stores/taskStore";

const props = defineProps<{ column: Column; tasks: Task[] }>();
const emit = defineEmits(["add-task", "open-task"]);
const store = useTaskStore();
const isDragOver = ref(false);
const isDragging = ref(false);

const localTasks = ref<Task[]>([...props.tasks]);
watch(
  () => props.tasks,
  (newTasks) => {
    if (!isDragging.value) {
      localTasks.value = [...newTasks];
    }
  },
  { deep: true }
);

function onStart() {
  isDragging.value = true;
}

async function onDragChange(event: any) {
  isDragOver.value = false;

  if (event.added) {
    // Task masuk ke kolom ini — update status dulu
    await store.moveTask(event.added.element.id, props.column.id as ColumnId);
  }

  if (event.moved || event.added) {
    // Simpan urutan baru
    store.reorderTasks(props.column.id as ColumnId, localTasks.value);
  }

  // Selesai drag, izinkan watcher jalan lagi
  await nextTick();
  isDragging.value = false;
}
</script>

<style scoped>
.column {
  flex-shrink: 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  background: #f8f9fc;
  border-radius: 14px;
  padding: 12px;
  border: 2px dashed transparent;
  transition: border-color var(--transition), background var(--transition);
  max-height: calc(100vh - 100px);
}
.column.drop-over {
  border-color: var(--color-accent);
  background: #eff6ff;
}

.col-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
}
.col-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.col-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.col-title {
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
}
.col-count {
  background: #e5e7eb;
  color: #374151;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 10px;
}
.col-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: var(--transition);
}
.col-btn:hover {
  background: #e5e7eb;
  color: var(--color-text);
}
.col-expand {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--color-muted);
}

.col-divider {
  height: 3px;
  border-radius: 2px;
  margin: 6px 0 10px;
  opacity: 0.6;
}

.col-tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
  min-height: 60px;
  padding-right: 2px;
}

.task-wrap {
  transition: transform var(--transition);
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 10px;
  margin-top: 8px;
  background: none;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  color: var(--color-muted);
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: var(--transition);
  justify-content: center;
}
.add-task-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: #eff6ff;
}
</style>
