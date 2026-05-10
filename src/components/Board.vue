<template>
  <div class="board-wrap">
    <div class="board">
      <draggable
        v-model="localColumns"
        class="columns-draggable"
        item-key="id"
        handle=".col-drag-handle"
        animation="250"
        ghost-class="column-ghost"
        @change="onColumnReorder"
      >
        <template #item="{ element }">
          <Column
            :column="element"
            :tasks="store.getTasksByColumn(element.id)"
            @add-task="openCreate"
            @open-task="openEdit"
          />
        </template>
      </draggable>

      <button class="add-list-btn" @click="showSoonToast">
        <ion-icon :icon="addOutline" />
        <span>Add new List</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { IonIcon, toastController } from "@ionic/vue";
import { addOutline } from "ionicons/icons";
import draggable from "vuedraggable";
import Column from "./Column.vue";
import { useTaskStore } from "@/stores/taskStore";
import type { Task, ColumnId, Column as ColumnType } from "@/types/task";

const store = useTaskStore();
const emit = defineEmits(["create-task", "edit-task"]);

const localColumns = ref<ColumnType[]>([...store.columns]);

watch(
  () => store.columns,
  (cols) => {
    localColumns.value = [...cols];
  },
  { deep: true }
);

function onColumnReorder() {
  store.reorderColumns(localColumns.value);
}

function openCreate(columnId: ColumnId) {
  emit("create-task", columnId);
}

function openEdit(task: Task) {
  emit("edit-task", task);
}

async function showSoonToast() {
  const toast = await toastController.create({
    message: 'Feature coming soon',
    duration: 1800,
    position: 'top',
    color: 'medium',
  })

  await toast.present()
}
</script>

<style scoped>
.board-wrap {
  overflow-x: auto;
  flex: 1;
  padding: 20px;
}

.board {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  min-width: max-content;
}

.columns-draggable {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.add-list-btn {
  flex-shrink: 0;
  width: 260px;
  /* margin-top: 25px; */

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 1.5px dashed #d1d5db;
  border-radius: 14px;

  color: var(--color-muted);
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: var(--transition);
}

.add-list-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(79, 134, 247, 0.06);
}
</style>
