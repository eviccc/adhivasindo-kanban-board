<template>
  <div class="filter-bar">
    <!-- Left: board title + avatars -->
    <div class="filter-left">
      <div class="board-title">
        <ion-icon :icon="lockClosed" class="board-icon" />
        <span class="board-name">Adhivasindo</span>
        <ion-icon :icon="chevronDown" class="board-icon-sm" />
      </div>

      <div class="avatar-group ml-2">
        <div
          v-for="(a, i) in visibleAssignees"
          :key="a.id"
          class="avatar"
          :style="{ background: a.color, zIndex: 10 - i }"
          :title="a.name"
        >
          {{ a.avatar }}
        </div>
        <div v-if="extraCount > 0" class="avatar avatar-more">
          +{{ extraCount }}
        </div>
      </div>

      <button class="btn-outline ml-2" @click="$emit('invite')">
        <ion-icon :icon="personAdd" />
        <span class="btn-label">Invite</span>
      </button>
    </div>

    <!-- Right: filter/search controls -->
    <div class="filter-right">
      <button
        class="btn-outline"
        :class="{ active: hasActiveFilters }"
        @click="showFilters = !showFilters"
      >
        <ion-icon :icon="funnelOutline" />
        <span class="btn-label">Filter</span>
        <span v-if="hasActiveFilters" class="filter-dot" />
      </button>

      <button class="btn-outline hide-xs">
        <ion-icon :icon="cloudUploadOutline" />
        <span class="btn-label">Export / Import</span>
      </button>

      <div class="search-wrap">
        <ion-icon :icon="searchOutline" class="search-icon" />
        <input
          v-model="store.searchQuery"
          type="text"
          placeholder="Search Tasks"
          class="search-input"
        />
        <button
          v-if="store.searchQuery"
          class="search-clear"
          @click="store.searchQuery = ''"
        >
          <ion-icon :icon="closeOutline" />
        </button>
      </div>
    </div>

    <!-- Expanded filters row -->
    <transition name="slide-down">
      <div v-if="showFilters" class="filter-expanded">
        <div class="filter-group">
          <label class="filter-chip-label">Assignee</label>
          <div class="filter-chips">
            <button
              class="chip"
              :class="{ active: !store.filterAssignee }"
              @click="store.filterAssignee = null"
            >
              All
            </button>
            <button
              v-for="a in store.allAssignees"
              :key="a.id"
              class="chip"
              :class="{ active: store.filterAssignee === a.id }"
              @click="store.filterAssignee = a.id"
            >
              <span class="chip-avatar" :style="{ background: a.color }">{{
                a.avatar
              }}</span>
              {{ a.name }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-chip-label">Label</label>
          <div class="filter-chips">
            <button
              class="chip"
              :class="{ active: !store.filterLabel }"
              @click="store.filterLabel = null"
            >
              All
            </button>
            <button
              v-for="lbl in labels"
              :key="lbl"
              class="chip label-chip"
              :class="[`label-${lbl}`, { active: store.filterLabel === lbl }]"
              @click="store.filterLabel = lbl as any"
            >
              {{ lbl }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-chip-label">Due Date</label>
          <div class="filter-chips">
            <button
              class="chip"
              :class="{ active: !store.filterDueDate }"
              @click="store.filterDueDate = null"
            >
              All
            </button>
            <button
              class="chip"
              :class="{ active: store.filterDueDate === 'overdue' }"
              @click="store.filterDueDate = 'overdue'"
            >
              Overdue
            </button>
            <button
              class="chip"
              :class="{ active: store.filterDueDate === 'today' }"
              @click="store.filterDueDate = 'today'"
            >
              Today
            </button>
            <button
              class="chip"
              :class="{ active: store.filterDueDate === 'this_week' }"
              @click="store.filterDueDate = 'this_week'"
            >
              This Week
            </button>
          </div>
        </div>

        <button
          v-if="hasActiveFilters"
          class="btn-ghost"
          @click="store.clearFilters()"
        >
          <ion-icon :icon="closeOutline" /> Clear filters
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { IonIcon } from "@ionic/vue";
import {
  lockClosed,
  chevronDown,
  personAdd,
  funnelOutline,
  cloudUploadOutline,
  searchOutline,
  closeOutline,
} from "ionicons/icons";
import { useTaskStore } from "@/stores/taskStore";

defineEmits(["invite"]);

const store = useTaskStore();
const showFilters = ref(false);
const labels = ["Feature", "Bug", "Issue", "Undefined"];

const visibleAssignees = computed(() => store.allAssignees.slice(0, 4));
const extraCount = computed(() => Math.max(0, store.allAssignees.length - 4));

const hasActiveFilters = computed(
  () =>
    store.searchQuery ||
    store.filterAssignee ||
    store.filterLabel ||
    store.filterDueDate
);
</script>

<style scoped>
.filter-bar {
  background: white;
  border-bottom: 1px solid var(--color-border);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.board-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
.board-icon {
  font-size: 14px;
  color: var(--color-muted);
}
.board-icon-sm {
  font-size: 12px;
  color: var(--color-muted);
}

/* Avatar group */
.avatar-group {
  display: flex;
  align-items: center;
}
.avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: white;
  margin-left: -6px;
}
.avatar:first-child {
  margin-left: 0;
}
.avatar-more {
  background: var(--color-border);
  color: var(--color-muted);
  font-size: 9px;
}

/* Buttons */
.btn-outline {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: white;
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  color: var(--color-text);
  white-space: nowrap;
  transition: var(--transition);
  font-weight: 500;
  position: relative;
}
.btn-outline:hover {
  background: #f9fafb;
}
.btn-outline.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Active filter indicator dot */
.filter-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.btn-ghost {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: none;
  background: none;
  font-size: 12px;
  color: var(--color-muted);
  cursor: pointer;
  font-family: var(--font-sans);
  border-radius: 6px;
  white-space: nowrap;
}
.btn-ghost:hover {
  background: #f3f4f6;
}

/* Search */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 10px;
  color: var(--color-muted);
  font-size: 14px;
  pointer-events: none;
}
.search-input {
  padding: 6px 32px 6px 32px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-sans);
  width: 200px;
  background: #f9fafb;
  outline: none;
  transition: var(--transition);
}
.search-input:focus {
  border-color: var(--color-accent);
  background: white;
}
.search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  padding: 0;
}

/* Expanded filters */
.filter-expanded {
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
  margin-top: 2px;
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-chip-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
  white-space: nowrap;
}

.filter-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: var(--transition);
  white-space: nowrap;
}
.chip:hover {
  border-color: var(--color-accent);
}
.chip.active {
  border-color: var(--color-accent);
  background: #eff6ff;
  color: var(--color-accent);
  font-weight: 600;
}
.chip-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.label-chip {
  border-width: 0;
}

.ml-2 {
  margin-left: 8px;
}

/* Transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 300px;
}

/* ── Responsive ─────────────────────────────────────────── */

/* md: hide Export/Import text label */
@media (max-width: 768px) {
  .search-input {
    width: 160px;
  }
  .filter-expanded {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-group {
    width: 100%;
  }
}

/* sm: icon-only buttons, narrower search */
@media (max-width: 640px) {
  .filter-bar {
    padding: 8px 12px;
  }
  .btn-label {
    display: none;
  }
  .btn-outline {
    padding: 6px 8px;
  }
  .search-input {
    width: 120px;
  }
  /* Hide board name text on very small screens */
  .board-name {
    display: none;
  }
}

/* xs: hide Export/Import button entirely */
@media (max-width: 480px) {
  .hide-xs {
    display: none;
  }
  .search-input {
    width: 100px;
  }
  /* Show only 2 avatars on tiny screens */
  .avatar:nth-child(n + 3) {
    display: none;
  }
}
</style>
