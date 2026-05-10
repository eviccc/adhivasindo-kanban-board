<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="app-shell">
        <!-- Topbar -->
        <header class="topbar">
          <div class="topbar-brand">
            <div class="brand-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#4F86F7" />
                <path
                  d="M8 14 C8 10 11 8 14 8 C17 8 20 10 20 14"
                  stroke="white"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                />
                <circle cx="14" cy="17" r="3" fill="white" />
              </svg>
            </div>
            <span class="brand-name">Adhivasindo</span>
          </div>

          <div class="topbar-center">
            <span class="topbar-title">Kanban Board</span>
          </div>

          <div class="topbar-right">
            <button class="new-task-btn" @click="openCreate(undefined)">
              <ion-icon :icon="addOutline" />
              <span class="btn-label">New Task</span>
            </button>
          </div>
        </header>

        <!-- FilterBar -->
        <FilterBar @invite="showInviteToast" />

        <!-- Board -->
        <Board @create-task="openCreate" @edit-task="openEdit" />
      </div>

      <!-- Task Modal -->
      <TaskModal
        :is-open="modalOpen"
        :task="selectedTask"
        :default-column="defaultColumn"
        @close="closeModal"
        @saved="closeModal"
        @deleted="closeModal"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonPage, IonContent, IonIcon, toastController } from "@ionic/vue";
import { addOutline } from "ionicons/icons";
import FilterBar from "@/components/FilterBar.vue";
import Board from "@/components/Board.vue";
import TaskModal from "@/components/TaskModal.vue";
import type { Task, ColumnId } from "@/types/task";

const modalOpen = ref(false);
const selectedTask = ref<Task | null>(null);
const defaultColumn = ref<ColumnId>("todo");

function openCreate(columnId: ColumnId | undefined) {
  selectedTask.value = null;
  defaultColumn.value = columnId ?? "todo";
  modalOpen.value = true;
}

function openEdit(task: Task) {
  selectedTask.value = task;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  selectedTask.value = null;
}

async function showInviteToast() {
  const toast = await toastController.create({
    message: "Invite feature coming soon!",
    duration: 2000,
    position: "top",
    cssClass: "kanban-toast",
    color: "medium",
  });
  await toast.present();
}
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Topbar */
.topbar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 52px;
  background: white;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  gap: 8px;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.brand-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-center {
  flex: 1;
  text-align: center;
  min-width: 0;
}

.topbar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-muted);
  white-space: nowrap;
}

.topbar-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.new-task-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  font-weight: 600;
  transition: background 200ms;
  white-space: nowrap;
}
.new-task-btn:hover {
  background: var(--color-accent-h);
}

ion-content {
  --overflow: hidden;
}

/* ── Responsive ──────────────────────────────────────────── */

/* md: shrink topbar padding */
@media (max-width: 768px) {
  .topbar {
    padding: 0 14px;
  }
  .topbar-title {
    font-size: 13px;
  }
}

/* sm: hide center title, compact brand */
@media (max-width: 640px) {
  .topbar {
    padding: 0 12px;
    height: 48px;
  }
  .topbar-center {
    display: none;
  }
  .brand-name {
    font-size: 14px;
  }
  /* Icon-only "+" button */
  .new-task-btn .btn-label {
    display: none;
  }
  .new-task-btn {
    padding: 7px 10px;
    border-radius: 8px;
  }
}

/* xs: hide brand name, logo only */
@media (max-width: 380px) {
  .brand-name {
    display: none;
  }
  .topbar {
    padding: 0 10px;
  }
}
</style>
