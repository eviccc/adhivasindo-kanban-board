/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from "vue";
import { IonIcon, toastController } from "@ionic/vue";
import { addOutline } from "ionicons/icons";
import draggable from "vuedraggable";
import Column from "./Column.vue";
import { useTaskStore } from "@/stores/taskStore";
const store = useTaskStore();
const emit = defineEmits(["create-task", "edit-task"]);
const localColumns = ref([...store.columns]);
watch(() => store.columns, (cols) => {
    localColumns.value = [...cols];
}, { deep: true });
function onColumnReorder() {
    store.reorderColumns(localColumns.value);
}
function openCreate(columnId) {
    emit("create-task", columnId);
}
function openEdit(task) {
    emit("edit-task", task);
}
async function showSoonToast() {
    const toast = await toastController.create({
        message: 'Feature coming soon',
        duration: 1800,
        position: 'top',
        color: 'medium',
    });
    await toast.present();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['add-list-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "board-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "board" },
});
const __VLS_0 = {}.draggable;
/** @type {[typeof __VLS_components.Draggable, typeof __VLS_components.draggable, typeof __VLS_components.Draggable, typeof __VLS_components.draggable, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.localColumns),
    ...{ class: "columns-draggable" },
    itemKey: "id",
    handle: ".col-drag-handle",
    animation: "250",
    ghostClass: "column-ghost",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.localColumns),
    ...{ class: "columns-draggable" },
    itemKey: "id",
    handle: ".col-drag-handle",
    animation: "250",
    ghostClass: "column-ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onChange: (__VLS_ctx.onColumnReorder)
};
__VLS_3.slots.default;
{
    const { item: __VLS_thisSlot } = __VLS_3.slots;
    const [{ element }] = __VLS_getSlotParams(__VLS_thisSlot);
    /** @type {[typeof Column, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(Column, new Column({
        ...{ 'onAddTask': {} },
        ...{ 'onOpenTask': {} },
        column: (element),
        tasks: (__VLS_ctx.store.getTasksByColumn(element.id)),
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onAddTask': {} },
        ...{ 'onOpenTask': {} },
        column: (element),
        tasks: (__VLS_ctx.store.getTasksByColumn(element.id)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_11;
    let __VLS_12;
    let __VLS_13;
    const __VLS_14 = {
        onAddTask: (__VLS_ctx.openCreate)
    };
    const __VLS_15 = {
        onOpenTask: (__VLS_ctx.openEdit)
    };
    var __VLS_10;
}
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.showSoonToast) },
    ...{ class: "add-list-btn" },
});
const __VLS_16 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    icon: (__VLS_ctx.addOutline),
}));
const __VLS_18 = __VLS_17({
    icon: (__VLS_ctx.addOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
/** @type {__VLS_StyleScopedClasses['board-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['board']} */ ;
/** @type {__VLS_StyleScopedClasses['columns-draggable']} */ ;
/** @type {__VLS_StyleScopedClasses['add-list-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonIcon: IonIcon,
            addOutline: addOutline,
            draggable: draggable,
            Column: Column,
            store: store,
            localColumns: localColumns,
            onColumnReorder: onColumnReorder,
            openCreate: openCreate,
            openEdit: openEdit,
            showSoonToast: showSoonToast,
        };
    },
    emits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
});
; /* PartiallyEnd: #4569/main.vue */
