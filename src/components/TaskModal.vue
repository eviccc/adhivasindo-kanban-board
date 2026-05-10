<template>
  <ion-modal :is-open="isOpen" class="task-modal" @did-dismiss="$emit('close')">
    <ion-content>
      <div class="modal-layout">
        <!-- ── LEFT PANEL ──────────────────────────────────────── -->
        <div class="modal-left">
          <!-- Toolbar -->
          <div class="modal-toolbar">
            <button v-if="isEditing" class="mark-btn" @click="toggleComplete">
              <ion-icon :icon="checkmarkCircle" />
              <span>{{
                task?.columnId === "done" ? "Completed" : "Mark Complete"
              }}</span>
            </button>
            <div style="flex: 1" />
            <button class="icon-btn" @click="$emit('close')">
              <ion-icon :icon="closeOutline" />
            </button>
          </div>

          <!-- Cover image -->
          <div v-if="form.coverImage" class="cover-img-wrap">
            <img :src="form.coverImage" alt="cover" />
            <button class="remove-cover" @click="form.coverImage = null">
              <ion-icon :icon="closeOutline" />
            </button>
          </div>
          <div
            v-else
            class="cover-placeholder"
            :class="{ 'drop-active': isCoverDragOver }"
            @click="triggerCoverInput"
            @dragover.prevent="isCoverDragOver = true"
            @dragleave="isCoverDragOver = false"
            @drop.prevent="onCoverDrop"
          >
            <input
              ref="coverInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onCoverFileChange"
            />
            <ion-icon :icon="imageOutline" />
            <span>Add Cover Image</span>
          </div>

          <!-- Title -->
          <div class="field-row">
            <input
              v-model="form.title"
              class="title-input"
              placeholder="Task title…"
              :readonly="!isEditing"
            />
            <button
              v-if="!isEditing"
              class="icon-btn-sm"
              @click="isEditing = true"
              title="Edit"
            >
              <ion-icon :icon="pencilOutline" />
            </button>
          </div>

          <!-- Grid of fields -->
          <div class="fields-grid">
            <!-- Assignee -->
            <div class="field-label">Assignee</div>
            <div class="field-val">
              <div class="avatar-group">
                <div
                  v-for="a in form.assignees"
                  :key="a.id"
                  class="avatar"
                  :style="{ background: a.color }"
                  :title="a.name"
                >
                  {{ a.avatar }}
                </div>
              </div>
              <button
                v-if="isEditing"
                class="avatar-add-btn"
                @click="showAssigneeDropdown = !showAssigneeDropdown"
              >
                <ion-icon :icon="addOutline" />
              </button>
              <!-- Assignee dropdown -->
              <transition name="fade">
                <div v-if="showAssigneeDropdown" class="dropdown">
                  <div
                    v-for="a in allAssignees"
                    :key="a.id"
                    class="dropdown-item"
                    :class="{
                      selected: form.assignees.some((x) => x.id === a.id),
                    }"
                    @click="toggleAssignee(a)"
                  >
                    <span class="chip-avatar" :style="{ background: a.color }">
                      {{ a.avatar }}
                    </span>
                    {{ a.name }}
                    <ion-icon
                      v-if="form.assignees.some((x) => x.id === a.id)"
                      :icon="checkmarkOutline"
                      class="ml-auto"
                    />
                  </div>
                </div>
              </transition>
            </div>

            <!-- Due Date -->
            <div class="field-label">Due Date</div>
            <div class="field-val">
              <div class="date-display">
                <span>{{
                  form.dueDate ? formatDate(form.dueDate) : "No date"
                }}</span>
                <ion-icon
                  :icon="calendarOutline"
                  style="color: var(--color-muted)"
                />
              </div>
              <input
                v-if="isEditing"
                type="date"
                v-model="form.dueDate"
                class="date-input"
              />
            </div>

            <!-- Board (readonly — single board) -->
            <div class="field-label">Board</div>
            <div class="field-val">
              <span class="field-tag">
                <ion-icon
                  :icon="lockClosed"
                  style="font-size: 11px; margin-right: 3px"
                />
                Northern Light
              </span>
            </div>

            <!-- Column/Status -->
            <div class="field-label">Column</div>
            <div class="field-val">
              <select
                v-if="isEditing"
                v-model="form.columnId"
                class="select-field"
              >
                <option
                  v-for="col in store.columns"
                  :key="col.id"
                  :value="col.id"
                >
                  {{ col.title }}
                </option>
              </select>
              <span v-else class="field-tag">{{ columnTitle }}</span>
            </div>

            <!-- Label -->
            <div class="field-label">Label</div>
            <div class="field-val">
              <select
                v-if="isEditing"
                v-model="form.label"
                class="select-field"
              >
                <option v-for="lbl in labels" :key="lbl">{{ lbl }}</option>
              </select>
              <span v-else class="label-badge" :class="`label-${form.label}`">{{
                form.label
              }}</span>
            </div>

            <!-- Priority -->
            <div class="field-label">Priority</div>
            <div class="field-val">
              <select
                v-if="isEditing"
                v-model="form.priority"
                class="select-field"
              >
                <option v-for="p in priorities" :key="p">{{ p }}</option>
              </select>
              <div v-else class="flex items-center gap-1">
                <span class="prio-dot" :class="`prio-${form.priority}`" />
                <span class="text-sm">{{ form.priority }}</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="section-title">Description</div>
          <textarea
            v-model="form.description"
            class="desc-textarea"
            placeholder="Add a description…"
            :readonly="!isEditing"
            rows="3"
          />
        </div>

        <!-- ── RIGHT PANEL ─────────────────────────────────────── -->
        <div class="modal-right">
          <!-- Attachments -->
          <div class="section-title">Attachments</div>
          <div class="attachments-area">
            <div
              v-if="!form.attachments.length && !isEditing"
              class="empty-hint"
            >
              No attachments yet.
            </div>
            <div
              v-for="att in form.attachments"
              :key="att.id"
              class="attach-item"
            >
              <ion-icon
                :icon="getAttachIcon(att.type)"
                class="attach-icon"
                :style="{ color: getAttachColor(att.type) }"
              />
              <div class="attach-info">
                <span class="attach-name">{{ att.name }}</span>
                <span class="attach-size text-xs text-muted">{{
                  att.size
                }}</span>
              </div>
              <button
                v-if="isEditing"
                class="icon-btn-sm"
                @click="removeAttachment(att.id)"
              >
                <ion-icon :icon="closeOutline" />
              </button>
            </div>

            <!-- Upload zone (only in edit mode) -->
            <div v-if="isEditing">
              <input
                ref="attachInput"
                type="file"
                multiple
                style="display: none"
                @change="handleFileUpload"
              />
              <div
                class="upload-drop"
                :class="{ 'drop-active': isAttachDragOver }"
                @click="attachInput?.click()"
                @dragover.prevent="isAttachDragOver = true"
                @dragleave="isAttachDragOver = false"
                @drop.prevent="onAttachDrop"
              >
                <ion-icon :icon="cloudUploadOutline" />
                <span>Drag & Drop files here or <b>browse from device</b></span>
              </div>
            </div>
          </div>

          <!-- Checklist -->
          <div class="section-title mt-4 flex items-center gap-2">
            <span>Check List</span>
            <span class="text-xs text-muted font-medium">
              {{ completedCount }}/{{ form.subtasks.length }}
            </span>
          </div>
          <div class="progress-track mb-2">
            <div class="progress-fill" :style="{ width: progressPct + '%' }" />
          </div>
          <div class="subtasks-list">
            <div
              v-for="sub in form.subtasks"
              :key="sub.id"
              class="subtask-item"
            >
              <input
                type="checkbox"
                :checked="sub.completed"
                @change="toggleSubtask(sub.id)"
                class="subtask-check"
              />
              <template v-if="isEditing && editingSubtaskId === sub.id">
                <input
                  v-model="editingSubtaskTitle"
                  class="subtask-input"
                  style="flex: 1"
                  @keydown.enter="saveEditSubtask(sub.id)"
                  @blur="saveEditSubtask(sub.id)"
                />
              </template>
              <span
                v-else
                class="subtask-title"
                :class="{ 'completed-text': sub.completed }"
                @dblclick="isEditing && startEditSubtask(sub)"
                >{{ sub.title }}</span
              >
              <div v-if="isEditing" class="subtask-actions">
                <button
                  class="icon-btn-sm"
                  @click="startEditSubtask(sub)"
                  title="Edit"
                >
                  <ion-icon :icon="pencilOutline" />
                </button>
                <button
                  class="icon-btn-sm"
                  @click="removeSubtask(sub.id)"
                  title="Delete"
                >
                  <ion-icon :icon="closeOutline" />
                </button>
              </div>
            </div>
          </div>
          <div v-if="isEditing" class="add-subtask-row">
            <input
              v-model="newSubtask"
              placeholder="Add subtask…"
              class="subtask-input"
              @keydown.enter="addSubtask"
            />
            <button class="btn-primary-sm" @click="addSubtask">
              <ion-icon :icon="addOutline" />
              Add subtask
            </button>
          </div>
          <button v-else class="add-more-btn" @click="isEditing = true">
            <ion-icon :icon="addOutline" /> Add subtask
          </button>

          <!-- Activity (placeholder) -->
          <div class="section-title mt-4">Activity</div>
          <div class="activity-placeholder text-sm text-muted">
            <span v-if="task"
              >Last updated {{ formatRelative(task.updatedAt) }}</span
            >
            <span v-else>New task — no activity yet.</span>
          </div>

          <!-- Action buttons -->
          <div class="modal-actions">
            <button class="btn-danger" v-if="task" @click="confirmDelete">
              <ion-icon :icon="trashOutline" /> Delete
            </button>
            <div style="flex: 1" />
            <button class="btn-secondary" @click="$emit('close')">
              Discard
            </button>
            <button
              class="btn-primary"
              @click="save"
              :disabled="!form.title.trim()"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  IonModal,
  IonContent,
  IonIcon,
  toastController,
  alertController,
} from "@ionic/vue";
import {
  closeOutline,
  pencilOutline,
  addOutline,
  calendarOutline,
  checkmarkCircle,
  imageOutline,
  cloudUploadOutline,
  trashOutline,
  checkmarkOutline,
  documentOutline,
  archiveOutline,
  codeSlashOutline,
  lockClosed,
} from "ionicons/icons";
import type {
  Task,
  ColumnId,
  Label,
  Priority,
  Assignee,
  Attachment,
  Subtask,
} from "@/types/task";
import { useTaskStore } from "@/stores/taskStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// ─── Props & Emits ────────────────────────────────────────────────────────────

const props = defineProps<{
  isOpen: boolean;
  task: Task | null;
  defaultColumn?: ColumnId;
}>();
const emit = defineEmits(["close", "saved", "deleted"]);

// ─── Store & constants ────────────────────────────────────────────────────────

const store = useTaskStore();
const allAssignees = store.DUMMY_ASSIGNEES;
const labels: Label[] = ["Feature", "Bug", "Issue", "Undefined"];
const priorities: Priority[] = ["Low", "Medium", "High"];

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  description: string;
  boardName: string;
  columnId: ColumnId;
  assignees: Assignee[];
  dueDate: string | null;
  label: Label;
  priority: Priority;
  subtasks: Subtask[];
  attachments: Attachment[]; // uses the real Attachment type (includes dataUrl?)
  coverImage: string | null;
}

function blankForm(): FormState {
  return {
    title: "",
    description: "",
    boardName: "Northern Light",
    columnId: props.defaultColumn ?? "todo",
    assignees: [],
    dueDate: null,
    label: "Feature",
    priority: "Medium",
    subtasks: [],
    attachments: [],
    coverImage: null,
  };
}

const form = ref<FormState>(blankForm());

// ─── UI state ─────────────────────────────────────────────────────────────────

const isEditing = ref(false);
const showAssigneeDropdown = ref(false);
const newSubtask = ref("");
const editingSubtaskId = ref<string | null>(null);
const editingSubtaskTitle = ref("");

// File input refs
const coverInput = ref<HTMLInputElement | null>(null);
const attachInput = ref<HTMLInputElement | null>(null);

// Drag-over state
const isCoverDragOver = ref(false);
const isAttachDragOver = ref(false);

// ─── Watchers ─────────────────────────────────────────────────────────────────

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      showAssigneeDropdown.value = false;
      editingSubtaskId.value = null;
      if (props.task) {
        const t = props.task;
        form.value = {
          title: t.title,
          description: t.description,
          boardName: t.boardName ?? "Northern Light",
          columnId: t.columnId,
          assignees: [...t.assignees],
          dueDate: t.dueDate,
          label: t.label,
          priority: t.priority,
          subtasks: t.subtasks.map((s) => ({ ...s })),
          attachments: t.attachments.map((a) => ({ ...a })),
          coverImage: t.coverImage,
        };
        isEditing.value = false;
      } else {
        form.value = blankForm();
        form.value.columnId = props.defaultColumn ?? "todo";
        isEditing.value = true;
      }
    }
  }
);

// ─── Computed ─────────────────────────────────────────────────────────────────

const completedCount = computed(
  () => form.value.subtasks.filter((s) => s.completed).length
);
const progressPct = computed(() =>
  form.value.subtasks.length
    ? Math.round((completedCount.value / form.value.subtasks.length) * 100)
    : 0
);
const columnTitle = computed(
  () =>
    store.columns.find((c) => c.id === form.value.columnId)?.title ??
    form.value.columnId
);

// ─── Assignee ─────────────────────────────────────────────────────────────────

function toggleAssignee(a: Assignee) {
  const idx = form.value.assignees.findIndex((x) => x.id === a.id);
  if (idx === -1) form.value.assignees.push(a);
  else form.value.assignees.splice(idx, 1);
}

// ─── Subtasks ─────────────────────────────────────────────────────────────────

function toggleSubtask(id: string) {
  const sub = form.value.subtasks.find((s) => s.id === id);
  if (sub) sub.completed = !sub.completed;
}

function addSubtask() {
  if (!newSubtask.value.trim()) return;
  form.value.subtasks.push({
    id: `s${Date.now()}`,
    title: newSubtask.value.trim(),
    completed: false,
  });
  newSubtask.value = "";
}

function removeSubtask(id: string) {
  form.value.subtasks = form.value.subtasks.filter((s) => s.id !== id);
}

function startEditSubtask(sub: Subtask) {
  editingSubtaskId.value = sub.id;
  editingSubtaskTitle.value = sub.title;
}

function saveEditSubtask(id: string) {
  const sub = form.value.subtasks.find((s) => s.id === id);
  if (sub && editingSubtaskTitle.value.trim()) {
    sub.title = editingSubtaskTitle.value.trim();
  }
  editingSubtaskId.value = null;
  editingSubtaskTitle.value = "";
}

// ─── Cover image ──────────────────────────────────────────────────────────────

function triggerCoverInput() {
  coverInput.value?.click();
}

function onCoverFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  readImageFile(file, (dataUrl) => {
    form.value.coverImage = dataUrl;
  });
  // reset so same file can be re-selected
  (event.target as HTMLInputElement).value = "";
}

function onCoverDrop(e: DragEvent) {
  isCoverDragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;
  readImageFile(file, (dataUrl) => {
    form.value.coverImage = dataUrl;
  });
}

function readImageFile(file: File, cb: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (ev.target?.result) cb(ev.target.result as string);
  };
  reader.readAsDataURL(file);
}

// ─── Attachments ──────────────────────────────────────────────────────────────

function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;
  processFiles(Array.from(files));
  (event.target as HTMLInputElement).value = "";
}

function onAttachDrop(e: DragEvent) {
  isAttachDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (!files) return;
  processFiles(Array.from(files));
}

function processFiles(files: File[]) {
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const attachment: Attachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        type: file.name.split(".").pop()?.toLowerCase() ?? "file",
        size: formatFileSize(file.size),
        dataUrl: ev.target?.result as string,
      };
      form.value.attachments.push(attachment);
    };
    reader.readAsDataURL(file);
  });
}

function removeAttachment(id: string) {
  form.value.attachments = form.value.attachments.filter((a) => a.id !== id);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ─── Mark complete ────────────────────────────────────────────────────────────

function toggleComplete() {
  if (!props.task) return;
  const targetColumn = props.task.columnId === "done" ? "todo" : "done";
  store.updateTask(props.task.id, { columnId: targetColumn });
  form.value.columnId = targetColumn;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAttachIcon(type: string) {
  if (
    type === "image" ||
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(type)
  )
    return imageOutline;
  if (["zip", "rar", "7z", "tar", "gz"].includes(type)) return archiveOutline;
  if (["html", "css", "js", "ts", "vue", "figma"].includes(type))
    return codeSlashOutline;
  return documentOutline;
}

function getAttachColor(type: string): string {
  if (["image", "jpg", "jpeg", "png", "gif", "webp"].includes(type))
    return "#f59e0b";
  if (type === "pdf") return "#ef4444";
  if (["zip", "rar", "7z"].includes(type)) return "#8b5cf6";
  if (["figma", "html", "css", "vue"].includes(type)) return "#10b981";
  if (["js", "ts", "text", "txt"].includes(type)) return "#3b82f6";
  return "var(--color-accent)";
}

function formatDate(d: string) {
  return dayjs(d).format("DD MMM, YYYY");
}

function formatRelative(d: string) {
  return dayjs(d).fromNow();
}

// ─── Save / Delete ────────────────────────────────────────────────────────────

async function save() {
  if (!form.value.title.trim()) return;

  // Build payload that satisfies Task (minus id/createdAt/updatedAt)
  const payload = {
    title: form.value.title,
    description: form.value.description,
    boardName: form.value.boardName,
    columnId: form.value.columnId,
    assignees: form.value.assignees,
    dueDate: form.value.dueDate,
    label: form.value.label,
    priority: form.value.priority,
    subtasks: form.value.subtasks,
    attachments: form.value.attachments,
    coverImage: form.value.coverImage,
  };

  if (props.task) {
    store.updateTask(props.task.id, payload);
    await showToast(
      "Task updated successfully",
      "checkmark-circle-outline",
      "#10b981"
    );
    emit("saved");
  } else {
    store.addTask(payload);
    await showToast(
      "Task created successfully",
      "add-circle-outline",
      "#4F86F7"
    );
    emit("saved");
  }
  emit("close");
}

async function confirmDelete() {
  const alert = await alertController.create({
    header: "Delete Task",
    message: `Are you sure you want to delete "${props.task?.title}"?`,
    buttons: [
      { text: "Cancel", role: "cancel" },
      {
        text: "Delete",
        role: "destructive",
        cssClass: "danger-btn",
        handler: async () => {
          if (props.task) {
            store.deleteTask(props.task.id);
            await showToast("Task deleted", "trash-outline", "#ef4444");
            emit("deleted");
            emit("close");
          }
        },
      },
    ],
  });
  await alert.present();
}

async function showToast(message: string, icon: string, color: string) {
  const toast = await toastController.create({
    message,
    duration: 2500,
    position: "top",
    cssClass: "kanban-toast",
    icon,
    color: "light",
  });
  await toast.present();
}
</script>

<style scoped>
.task-modal {
  --width: 800px;
  --height: 70vh;
  --border-radius: 20px;
}
.modal-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100%;
}
@media (max-width: 800px) {
  .modal-layout {
    grid-template-columns: 1fr;
  }
  .modal-right {
    border-left: none;
    border-top: 1px solid var(--color-border);
  }
}

.modal-left,
.modal-right {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}
.modal-right {
  border-left: 1px solid var(--color-border);
}

/* Toolbar */
.modal-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.mark-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: white;
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  font-weight: 500;
}
.mark-btn:hover {
  background: #f9fafb;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--color-muted);
  font-size: 18px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: var(--transition);
}
.icon-btn:hover {
  background: #f3f4f6;
  color: var(--color-text);
}
.icon-btn-sm {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--color-muted);
  font-size: 14px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: var(--transition);
  flex-shrink: 0;
}
.icon-btn-sm:hover {
  background: #f3f4f6;
  color: var(--color-text);
}

/* Cover */
.cover-img-wrap {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  height: 140px;
  margin-bottom: 12px;
}
.cover-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.remove-cover {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 14px;
}
.cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 80px;
  border: 1.5px dashed #d1d5db;
  border-radius: 10px;
  color: var(--color-muted);
  cursor: pointer;
  font-size: 13px;
  margin-bottom: 12px;
  transition: var(--transition);
}
.cover-placeholder:hover,
.cover-placeholder.drop-active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: #eff6ff;
}
.cover-placeholder ion-icon {
  font-size: 22px;
}

/* Title */
.field-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}
.title-input {
  font-size: 18px;
  font-weight: 700;
  border: none;
  outline: none;
  width: 100%;
  font-family: var(--font-sans);
  color: var(--color-text);
  background: transparent;
}
.title-input:focus {
  border-bottom: 2px solid var(--color-accent);
}
.title-input[readonly] {
  cursor: default;
}

/* Grid fields */
.fields-grid {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px 12px;
  margin-bottom: 16px;
}
.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
  align-self: center;
}
.field-val {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  position: relative;
}
.field-tag {
  padding: 3px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 12px;
  background: #f9fafb;
  display: flex;
  align-items: center;
}
.select-field {
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 12px;
  font-family: var(--font-sans);
  background: white;
  cursor: pointer;
  outline: none;
}
.avatar-add-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px dashed var(--color-border);
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  transition: var(--transition);
}
.avatar-add-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.date-display {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.date-input {
  padding: 3px 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 12px;
  font-family: var(--font-sans);
  outline: none;
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: 36px;
  left: 0;
  z-index: 50;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: var(--shadow-hover);
  min-width: 180px;
  overflow: hidden;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  transition: background var(--transition);
}
.dropdown-item:hover {
  background: #f9fafb;
}
.dropdown-item.selected {
  background: #eff6ff;
  color: var(--color-accent);
}
.chip-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.ml-auto {
  margin-left: auto;
}

/* Description */
.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
  margin-top: 6px;
}
.desc-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-sans);
  resize: vertical;
  outline: none;
  background: #fafafa;
  transition: var(--transition);
  color: var(--color-text);
  min-height: 72px;
}
.desc-textarea:focus {
  border-color: var(--color-accent);
  background: white;
}
.desc-textarea[readonly] {
  background: #fafafa;
  cursor: default;
}

/* Attachments */
.attachments-area {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}
.upload-drop {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-top: 1px dashed #d1d5db;
  color: var(--color-muted);
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition);
}
.upload-drop:hover,
.upload-drop.drop-active {
  background: #eff6ff;
  color: var(--color-accent);
  border-top-color: var(--color-accent);
}
.upload-drop b {
  color: var(--color-accent);
}
.attach-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
}
.attach-item:last-child {
  border-bottom: none;
}
.attach-icon {
  font-size: 18px;
  flex-shrink: 0;
}
.attach-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.attach-name {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.empty-hint {
  padding: 12px;
  font-size: 12px;
  color: var(--color-muted);
  text-align: center;
}

/* Progress */
.progress-track {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}
.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 2px;
  transition: width 0.4s ease;
}
.mb-2 {
  margin-bottom: 8px;
}

/* Subtasks */
.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}
.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}
.subtask-check {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  cursor: pointer;
  accent-color: var(--color-accent);
}
.subtask-title {
  font-size: 13px;
  flex: 1;
}
.subtask-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  flex-shrink: 0;
}
.completed-text {
  text-decoration: line-through;
  color: var(--color-muted);
}
.add-subtask-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
}
.subtask-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-sans);
  outline: none;
}
.subtask-input:focus {
  border-color: var(--color-accent);
}
.btn-primary-sm {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-family: var(--font-sans);
  cursor: pointer;
  white-space: nowrap;
}
.add-more-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  color: var(--color-muted);
  font-size: 12px;
  font-family: var(--font-sans);
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: var(--transition);
}
.add-more-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Activity */
.activity-placeholder {
  padding: 12px 0;
}
.mt-4 {
  margin-top: 14px;
}

/* Actions */
.modal-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}
.btn-primary {
  padding: 8px 22px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-sans);
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
}
.btn-primary:hover {
  background: var(--color-accent-h);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-secondary {
  padding: 8px 18px;
  background: white;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-sans);
  cursor: pointer;
  font-weight: 500;
}
.btn-secondary:hover {
  background: #f9fafb;
}
.btn-danger {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  background: none;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
}
.btn-danger:hover {
  background: #fef2f2;
}

/* Avatar group (reused in assignee field) */
.avatar-group {
  display: flex;
}
.avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: white;
  border: 2px solid white;
  margin-left: -6px;
  flex-shrink: 0;
}
.avatar:first-child {
  margin-left: 0;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Utility */
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.text-sm {
  font-size: 13px;
}
.text-xs {
  font-size: 11px;
}
.text-muted {
  color: var(--color-muted);
}
.font-medium {
  font-weight: 500;
}
</style>
