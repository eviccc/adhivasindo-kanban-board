/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, nextTick } from "vue";
import { IonIcon } from "@ionic/vue";
import { addOutline, ellipsisHorizontal, expandOutline, reorderFourOutline } from "ionicons/icons";
import draggable from "vuedraggable";
import TaskCard from "./TaskCard.vue";
import { useTaskStore } from "@/stores/taskStore";
const props = defineProps();
const emit = defineEmits(["add-task", "open-task"]);
const store = useTaskStore();
const isDragOver = ref(false);
const isDragging = ref(false);
const localTasks = ref([...props.tasks]);
watch(() => props.tasks, (newTasks) => {
    if (!isDragging.value) {
        localTasks.value = [...newTasks];
    }
}, { deep: true });
function onStart() {
    isDragging.value = true;
}
async function onDragChange(event) {
    isDragOver.value = false;
    if (event.added) {
        // Task masuk ke kolom ini — update status dulu
        await store.moveTask(event.added.element.id, props.column.id);
    }
    if (event.moved || event.added) {
        // Simpan urutan baru
        store.reorderTasks(props.column.id, localTasks.value);
    }
    // Selesai drag, izinkan watcher jalan lagi
    await nextTick();
    isDragging.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['column']} */ ;
/** @type {__VLS_StyleScopedClasses['col-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['add-task-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "column" },
    ...{ class: ({ 'drop-over': __VLS_ctx.isDragOver }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-title-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "col-drag-handle" },
    title: "Drag to reorder",
});
const __VLS_0 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    icon: (__VLS_ctx.reorderFourOutline),
}));
const __VLS_2 = __VLS_1({
    icon: (__VLS_ctx.reorderFourOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
    ...{ class: "col-dot" },
    ...{ style: ({ background: __VLS_ctx.column.color }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "col-title" },
});
(__VLS_ctx.column.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "col-count" },
});
(__VLS_ctx.tasks.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('add-task', __VLS_ctx.column.id);
        } },
    ...{ class: "col-btn" },
    title: "Add task",
});
const __VLS_4 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    icon: (__VLS_ctx.addOutline),
}));
const __VLS_6 = __VLS_5({
    icon: (__VLS_ctx.addOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "col-btn" },
    title: "Options",
});
const __VLS_8 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    icon: (__VLS_ctx.ellipsisHorizontal),
}));
const __VLS_10 = __VLS_9({
    icon: (__VLS_ctx.ellipsisHorizontal),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "col-expand" },
    title: "Expand",
});
const __VLS_12 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    icon: (__VLS_ctx.expandOutline),
}));
const __VLS_14 = __VLS_13({
    icon: (__VLS_ctx.expandOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "col-divider" },
    ...{ style: ({ background: __VLS_ctx.column.color }) },
});
const __VLS_16 = {}.draggable;
/** @type {[typeof __VLS_components.Draggable, typeof __VLS_components.draggable, typeof __VLS_components.Draggable, typeof __VLS_components.draggable, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onStart': {} },
    ...{ 'onChange': {} },
    ...{ 'onDragenter': {} },
    ...{ 'onDragleave': {} },
    ...{ 'onDrop': {} },
    modelValue: (__VLS_ctx.localTasks),
    group: "tasks",
    itemKey: "id",
    ...{ class: "col-tasks" },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    animation: "200",
}));
const __VLS_18 = __VLS_17({
    ...{ 'onStart': {} },
    ...{ 'onChange': {} },
    ...{ 'onDragenter': {} },
    ...{ 'onDragleave': {} },
    ...{ 'onDrop': {} },
    modelValue: (__VLS_ctx.localTasks),
    group: "tasks",
    itemKey: "id",
    ...{ class: "col-tasks" },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    animation: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onStart: (__VLS_ctx.onStart)
};
const __VLS_24 = {
    onChange: (__VLS_ctx.onDragChange)
};
const __VLS_25 = {
    onDragenter: (...[$event]) => {
        __VLS_ctx.isDragOver = true;
    }
};
const __VLS_26 = {
    onDragleave: (...[$event]) => {
        __VLS_ctx.isDragOver = false;
    }
};
const __VLS_27 = {
    onDrop: (...[$event]) => {
        __VLS_ctx.isDragOver = false;
    }
};
__VLS_19.slots.default;
{
    const { item: __VLS_thisSlot } = __VLS_19.slots;
    const [{ element }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "task-wrap" },
    });
    /** @type {[typeof TaskCard, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(TaskCard, new TaskCard({
        ...{ 'onClick': {} },
        task: (element),
    }));
    const __VLS_29 = __VLS_28({
        ...{ 'onClick': {} },
        task: (element),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    let __VLS_31;
    let __VLS_32;
    let __VLS_33;
    const __VLS_34 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('open-task', element);
        }
    };
    var __VLS_30;
}
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('add-task', __VLS_ctx.column.id);
        } },
    ...{ class: "add-task-btn" },
});
const __VLS_35 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    icon: (__VLS_ctx.addOutline),
}));
const __VLS_37 = __VLS_36({
    icon: (__VLS_ctx.addOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
/** @type {__VLS_StyleScopedClasses['column']} */ ;
/** @type {__VLS_StyleScopedClasses['col-header']} */ ;
/** @type {__VLS_StyleScopedClasses['col-title-row']} */ ;
/** @type {__VLS_StyleScopedClasses['col-drag-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['col-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['col-title']} */ ;
/** @type {__VLS_StyleScopedClasses['col-count']} */ ;
/** @type {__VLS_StyleScopedClasses['col-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['col-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['col-expand']} */ ;
/** @type {__VLS_StyleScopedClasses['col-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['col-tasks']} */ ;
/** @type {__VLS_StyleScopedClasses['task-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['add-task-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonIcon: IonIcon,
            addOutline: addOutline,
            ellipsisHorizontal: ellipsisHorizontal,
            expandOutline: expandOutline,
            reorderFourOutline: reorderFourOutline,
            draggable: draggable,
            TaskCard: TaskCard,
            isDragOver: isDragOver,
            localTasks: localTasks,
            onStart: onStart,
            onDragChange: onDragChange,
        };
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
