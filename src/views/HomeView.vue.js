/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from "vue";
import { IonPage, IonContent, IonIcon, toastController } from "@ionic/vue";
import { addOutline } from "ionicons/icons";
import FilterBar from "@/components/FilterBar.vue";
import Board from "@/components/Board.vue";
import TaskModal from "@/components/TaskModal.vue";
const modalOpen = ref(false);
const selectedTask = ref(null);
const defaultColumn = ref("todo");
function openCreate(columnId) {
    selectedTask.value = null;
    defaultColumn.value = columnId ?? "todo";
    modalOpen.value = true;
}
function openEdit(task) {
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['new-task-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-title']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-center']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-name']} */ ;
/** @type {__VLS_StyleScopedClasses['new-task-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['new-task-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-name']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.IonPage;
/** @type {[typeof __VLS_components.IonPage, typeof __VLS_components.ionPage, typeof __VLS_components.IonPage, typeof __VLS_components.ionPage, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.IonContent;
/** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.ionContent, typeof __VLS_components.IonContent, typeof __VLS_components.ionContent, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    fullscreen: (true),
}));
const __VLS_7 = __VLS_6({
    fullscreen: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-shell" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "topbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-brand" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand-logo" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "28",
    height: "28",
    viewBox: "0 0 28 28",
    fill: "none",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "14",
    cy: "14",
    r: "14",
    fill: "#4F86F7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M8 14 C8 10 11 8 14 8 C17 8 20 10 20 14",
    stroke: "white",
    'stroke-width': "2",
    fill: "none",
    'stroke-linecap': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "14",
    cy: "17",
    r: "3",
    fill: "white",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "brand-name" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "topbar-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openCreate(undefined);
        } },
    ...{ class: "new-task-btn" },
});
const __VLS_9 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    icon: (__VLS_ctx.addOutline),
}));
const __VLS_11 = __VLS_10({
    icon: (__VLS_ctx.addOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "btn-label" },
});
/** @type {[typeof FilterBar, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(FilterBar, new FilterBar({
    ...{ 'onInvite': {} },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onInvite': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onInvite: (__VLS_ctx.showInviteToast)
};
var __VLS_15;
/** @type {[typeof Board, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(Board, new Board({
    ...{ 'onCreateTask': {} },
    ...{ 'onEditTask': {} },
}));
const __VLS_21 = __VLS_20({
    ...{ 'onCreateTask': {} },
    ...{ 'onEditTask': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    onCreateTask: (__VLS_ctx.openCreate)
};
const __VLS_27 = {
    onEditTask: (__VLS_ctx.openEdit)
};
var __VLS_22;
/** @type {[typeof TaskModal, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(TaskModal, new TaskModal({
    ...{ 'onClose': {} },
    ...{ 'onSaved': {} },
    ...{ 'onDeleted': {} },
    isOpen: (__VLS_ctx.modalOpen),
    task: (__VLS_ctx.selectedTask),
    defaultColumn: (__VLS_ctx.defaultColumn),
}));
const __VLS_29 = __VLS_28({
    ...{ 'onClose': {} },
    ...{ 'onSaved': {} },
    ...{ 'onDeleted': {} },
    isOpen: (__VLS_ctx.modalOpen),
    task: (__VLS_ctx.selectedTask),
    defaultColumn: (__VLS_ctx.defaultColumn),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_31;
let __VLS_32;
let __VLS_33;
const __VLS_34 = {
    onClose: (__VLS_ctx.closeModal)
};
const __VLS_35 = {
    onSaved: (__VLS_ctx.closeModal)
};
const __VLS_36 = {
    onDeleted: (__VLS_ctx.closeModal)
};
var __VLS_30;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['app-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-name']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-center']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-title']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['new-task-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-label']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonPage: IonPage,
            IonContent: IonContent,
            IonIcon: IonIcon,
            addOutline: addOutline,
            FilterBar: FilterBar,
            Board: Board,
            TaskModal: TaskModal,
            modalOpen: modalOpen,
            selectedTask: selectedTask,
            defaultColumn: defaultColumn,
            openCreate: openCreate,
            openEdit: openEdit,
            closeModal: closeModal,
            showInviteToast: showInviteToast,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
