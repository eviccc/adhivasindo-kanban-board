<template>
  <div
    class="task-card task-card-drag"
    @click="$emit('click')"
  >
    <!-- Cover image -->
    <div v-if="task.coverImage" class="card-cover">
      <img :src="task.coverImage" :alt="task.title" />
    </div>

    <!-- Label -->
    <div class="card-header">
      <span class="label-badge" :class="`label-${task.label}`">{{ task.label }}</span>
      <div class="card-actions">
        <span class="prio-dot" :class="`prio-${task.priority}`" :title="task.priority" />
      </div>
    </div>

    <!-- Title -->
    <p class="card-title">{{ task.title }}</p>

    <!-- Meta row -->
    <div class="card-meta">
      <!-- Due date -->
      <div v-if="task.dueDate" class="meta-item" :class="{ overdue: isOverdue }">
        <ion-icon :icon="timeOutline" />
        <span>{{ formatDate(task.dueDate) }}</span>
      </div>

      <!-- Subtasks progress -->
      <div v-if="task.subtasks.length" class="meta-item">
        <ion-icon :icon="checkboxOutline" />
        <span>{{ completedCount }}/{{ task.subtasks.length }}</span>
      </div>

      <!-- Attachments -->
      <div v-if="task.attachments.length" class="meta-item">
        <ion-icon :icon="attachOutline" />
        <span>{{ task.attachments.length }}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div v-if="task.subtasks.length" class="card-progress">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPct + '%' }" />
      </div>
    </div>

    <!-- Footer: assignees -->
    <div class="card-footer">
      <div class="avatar-group">
        <div
          v-for="(a, i) in visibleAssignees" :key="a.id"
          class="avatar"
          :style="{ background: a.color, zIndex: 10 - i }"
          :title="a.name"
        >{{ a.avatar }}</div>
        <div v-if="extraAssignees > 0" class="avatar avatar-more">+{{ extraAssignees }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonIcon } from '@ionic/vue'
import { timeOutline, checkboxOutline, attachOutline } from 'ionicons/icons'
import type { Task } from '@/types/task'
import dayjs from 'dayjs'

const props = defineProps<{ task: Task }>()
defineEmits(['click'])

const completedCount = computed(() => props.task.subtasks.filter(s => s.completed).length)
const progressPct = computed(() =>
  props.task.subtasks.length ? Math.round((completedCount.value / props.task.subtasks.length) * 100) : 0
)
const visibleAssignees = computed(() => props.task.assignees.slice(0, 3))
const extraAssignees = computed(() => Math.max(0, props.task.assignees.length - 3))
const isOverdue = computed(() => props.task.dueDate && dayjs(props.task.dueDate).isBefore(dayjs(), 'day'))

function formatDate(d: string) {
  return dayjs(d).format('D MMM')
}
</script>

<style scoped>
.task-card {
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 12px;
  cursor: pointer;
  transition: box-shadow var(--transition), transform var(--transition);
  border: 1px solid rgba(0,0,0,.04);
  overflow: hidden;
}
.task-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}

.card-cover {
  margin: -12px -12px 10px;
  height: 120px;
  overflow: hidden;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
}
.card-cover img { width: 100%; height: 100%; object-fit: cover; }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}
.card-actions { display: flex; align-items: center; gap: 6px; }

.card-title {
  font-size: 13px; font-weight: 500; line-height: 1.45;
  color: var(--color-text); margin: 0 0 8px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
  margin-bottom: 6px;
}
.meta-item {
  display: flex; align-items: center; gap: 3px;
  font-size: 11px; color: var(--color-muted); font-weight: 500;
}
.meta-item ion-icon { font-size: 12px; }
.meta-item.overdue { color: var(--prio-high); }

.card-progress { margin-bottom: 8px; }
.progress-track {
  height: 3px; background: #e5e7eb; border-radius: 2px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: var(--color-accent);
  border-radius: 2px; transition: width .4s ease;
}

.card-footer { display: flex; align-items: center; justify-content: flex-end; }
</style>
