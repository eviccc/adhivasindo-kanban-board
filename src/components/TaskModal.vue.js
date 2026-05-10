/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch } from "vue";
import { IonModal, IonContent, IonIcon, toastController, alertController, } from "@ionic/vue";
import { closeOutline, pencilOutline, addOutline, calendarOutline, checkmarkCircle, imageOutline, cloudUploadOutline, trashOutline, checkmarkOutline, documentOutline, archiveOutline, codeSlashOutline, lockClosed, } from "ionicons/icons";
import { useTaskStore } from "@/stores/taskStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const props = defineProps();
const emit = defineEmits(["close", "saved", "deleted"]);
// ─── Store & constants ────────────────────────────────────────────────────────
const store = useTaskStore();
const allAssignees = store.DUMMY_ASSIGNEES;
const labels = ["Feature", "Bug", "Issue", "Undefined"];
const priorities = ["Low", "Medium", "High"];
function blankForm() {
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
const form = ref(blankForm());
// ─── UI state ─────────────────────────────────────────────────────────────────
const isEditing = ref(false);
const showAssigneeDropdown = ref(false);
const newSubtask = ref("");
const editingSubtaskId = ref(null);
const editingSubtaskTitle = ref("");
// File input refs
const coverInput = ref(null);
const attachInput = ref(null);
// Drag-over state
const isCoverDragOver = ref(false);
const isAttachDragOver = ref(false);
// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(() => props.isOpen, (open) => {
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
        }
        else {
            form.value = blankForm();
            form.value.columnId = props.defaultColumn ?? "todo";
            isEditing.value = true;
        }
    }
});
// ─── Computed ─────────────────────────────────────────────────────────────────
const completedCount = computed(() => form.value.subtasks.filter((s) => s.completed).length);
const progressPct = computed(() => form.value.subtasks.length
    ? Math.round((completedCount.value / form.value.subtasks.length) * 100)
    : 0);
const columnTitle = computed(() => store.columns.find((c) => c.id === form.value.columnId)?.title ??
    form.value.columnId);
// ─── Assignee ─────────────────────────────────────────────────────────────────
function toggleAssignee(a) {
    const idx = form.value.assignees.findIndex((x) => x.id === a.id);
    if (idx === -1)
        form.value.assignees.push(a);
    else
        form.value.assignees.splice(idx, 1);
}
// ─── Subtasks ─────────────────────────────────────────────────────────────────
function toggleSubtask(id) {
    const sub = form.value.subtasks.find((s) => s.id === id);
    if (sub)
        sub.completed = !sub.completed;
}
function addSubtask() {
    if (!newSubtask.value.trim())
        return;
    form.value.subtasks.push({
        id: `s${Date.now()}`,
        title: newSubtask.value.trim(),
        completed: false,
    });
    newSubtask.value = "";
}
function removeSubtask(id) {
    form.value.subtasks = form.value.subtasks.filter((s) => s.id !== id);
}
function startEditSubtask(sub) {
    editingSubtaskId.value = sub.id;
    editingSubtaskTitle.value = sub.title;
}
function saveEditSubtask(id) {
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
function onCoverFileChange(event) {
    const file = event.target.files?.[0];
    if (!file)
        return;
    readImageFile(file, (dataUrl) => {
        form.value.coverImage = dataUrl;
    });
    // reset so same file can be re-selected
    event.target.value = "";
}
function onCoverDrop(e) {
    isCoverDragOver.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith("image/"))
        return;
    readImageFile(file, (dataUrl) => {
        form.value.coverImage = dataUrl;
    });
}
function readImageFile(file, cb) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        if (ev.target?.result)
            cb(ev.target.result);
    };
    reader.readAsDataURL(file);
}
// ─── Attachments ──────────────────────────────────────────────────────────────
function handleFileUpload(event) {
    const files = event.target.files;
    if (!files)
        return;
    processFiles(Array.from(files));
    event.target.value = "";
}
function onAttachDrop(e) {
    isAttachDragOver.value = false;
    const files = e.dataTransfer?.files;
    if (!files)
        return;
    processFiles(Array.from(files));
}
function processFiles(files) {
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const attachment = {
                id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                name: file.name,
                type: file.name.split(".").pop()?.toLowerCase() ?? "file",
                size: formatFileSize(file.size),
                dataUrl: ev.target?.result,
            };
            form.value.attachments.push(attachment);
        };
        reader.readAsDataURL(file);
    });
}
function removeAttachment(id) {
    form.value.attachments = form.value.attachments.filter((a) => a.id !== id);
}
function formatFileSize(bytes) {
    if (bytes < 1024)
        return bytes + " B";
    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
// ─── Mark complete ────────────────────────────────────────────────────────────
function toggleComplete() {
    if (!props.task)
        return;
    const targetColumn = props.task.columnId === "done" ? "todo" : "done";
    store.updateTask(props.task.id, { columnId: targetColumn });
    form.value.columnId = targetColumn;
}
// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAttachIcon(type) {
    if (type === "image" ||
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(type))
        return imageOutline;
    if (["zip", "rar", "7z", "tar", "gz"].includes(type))
        return archiveOutline;
    if (["html", "css", "js", "ts", "vue", "figma"].includes(type))
        return codeSlashOutline;
    return documentOutline;
}
function getAttachColor(type) {
    if (["image", "jpg", "jpeg", "png", "gif", "webp"].includes(type))
        return "#f59e0b";
    if (type === "pdf")
        return "#ef4444";
    if (["zip", "rar", "7z"].includes(type))
        return "#8b5cf6";
    if (["figma", "html", "css", "vue"].includes(type))
        return "#10b981";
    if (["js", "ts", "text", "txt"].includes(type))
        return "#3b82f6";
    return "var(--color-accent)";
}
function formatDate(d) {
    return dayjs(d).format("DD MMM, YYYY");
}
function formatRelative(d) {
    return dayjs(d).fromNow();
}
// ─── Save / Delete ────────────────────────────────────────────────────────────
async function save() {
    if (!form.value.title.trim())
        return;
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
        await showToast("Task updated successfully", "checkmark-circle-outline", "#10b981");
        emit("saved");
    }
    else {
        store.addTask(payload);
        await showToast("Task created successfully", "add-circle-outline", "#4F86F7");
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
async function showToast(message, icon, color) {
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['modal-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-right']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-right']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-img-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['title-input']} */ ;
/** @type {__VLS_StyleScopedClasses['title-input']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-add-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-drop']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-drop']} */ ;
/** @type {__VLS_StyleScopedClasses['drop-active']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-drop']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-item']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask-input']} */ ;
/** @type {__VLS_StyleScopedClasses['add-more-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.IonModal;
/** @type {[typeof __VLS_components.IonModal, typeof __VLS_components.ionModal, typeof __VLS_components.IonModal, typeof __VLS_components.ionModal, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onDidDismiss': {} },
    isOpen: (__VLS_ctx.isOpen),
    ...{ class: "task-modal" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onDidDismiss': {} },
    isOpen: (__VLS_ctx.isOpen),
    ...{ class: "task-modal" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onDidDismiss: (...[$event]) => {
        __VLS_ctx.$emit('close');
    }
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.IonContent;
/** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.ionContent, typeof __VLS_components.IonContent, typeof __VLS_components.ionContent, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "modal-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "modal-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "modal-toolbar" },
});
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleComplete) },
        ...{ class: "mark-btn" },
    });
    const __VLS_13 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        icon: (__VLS_ctx.checkmarkCircle),
    }));
    const __VLS_15 = __VLS_14({
        icon: (__VLS_ctx.checkmarkCircle),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.task?.columnId === "done" ? "Completed" : "Mark Complete");
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('close');
        } },
    ...{ class: "icon-btn" },
});
const __VLS_17 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    icon: (__VLS_ctx.closeOutline),
}));
const __VLS_19 = __VLS_18({
    icon: (__VLS_ctx.closeOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
if (__VLS_ctx.form.coverImage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cover-img-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.form.coverImage),
        alt: "cover",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.form.coverImage))
                    return;
                __VLS_ctx.form.coverImage = null;
            } },
        ...{ class: "remove-cover" },
    });
    const __VLS_21 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        icon: (__VLS_ctx.closeOutline),
    }));
    const __VLS_23 = __VLS_22({
        icon: (__VLS_ctx.closeOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.triggerCoverInput) },
        ...{ onDragover: (...[$event]) => {
                if (!!(__VLS_ctx.form.coverImage))
                    return;
                __VLS_ctx.isCoverDragOver = true;
            } },
        ...{ onDragleave: (...[$event]) => {
                if (!!(__VLS_ctx.form.coverImage))
                    return;
                __VLS_ctx.isCoverDragOver = false;
            } },
        ...{ onDrop: (__VLS_ctx.onCoverDrop) },
        ...{ class: "cover-placeholder" },
        ...{ class: ({ 'drop-active': __VLS_ctx.isCoverDragOver }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: (__VLS_ctx.onCoverFileChange) },
        ref: "coverInput",
        type: "file",
        accept: "image/*",
        ...{ style: {} },
    });
    /** @type {typeof __VLS_ctx.coverInput} */ ;
    const __VLS_25 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        icon: (__VLS_ctx.imageOutline),
    }));
    const __VLS_27 = __VLS_26({
        icon: (__VLS_ctx.imageOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ class: "title-input" },
    placeholder: "Task title…",
    readonly: (!__VLS_ctx.isEditing),
});
(__VLS_ctx.form.title);
if (!__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isEditing))
                    return;
                __VLS_ctx.isEditing = true;
            } },
        ...{ class: "icon-btn-sm" },
        title: "Edit",
    });
    const __VLS_29 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        icon: (__VLS_ctx.pencilOutline),
    }));
    const __VLS_31 = __VLS_30({
        icon: (__VLS_ctx.pencilOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fields-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-val" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-group" },
});
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.form.assignees))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (a.id),
        ...{ class: "avatar" },
        ...{ style: ({ background: a.color }) },
        title: (a.name),
    });
    (a.avatar);
}
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isEditing))
                    return;
                __VLS_ctx.showAssigneeDropdown = !__VLS_ctx.showAssigneeDropdown;
            } },
        ...{ class: "avatar-add-btn" },
    });
    const __VLS_33 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        icon: (__VLS_ctx.addOutline),
    }));
    const __VLS_35 = __VLS_34({
        icon: (__VLS_ctx.addOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
}
const __VLS_37 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    name: "fade",
}));
const __VLS_39 = __VLS_38({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
if (__VLS_ctx.showAssigneeDropdown) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dropdown" },
    });
    for (const [a] of __VLS_getVForSourceType((__VLS_ctx.allAssignees))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showAssigneeDropdown))
                        return;
                    __VLS_ctx.toggleAssignee(a);
                } },
            key: (a.id),
            ...{ class: "dropdown-item" },
            ...{ class: ({
                    selected: __VLS_ctx.form.assignees.some((x) => x.id === a.id),
                }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "chip-avatar" },
            ...{ style: ({ background: a.color }) },
        });
        (a.avatar);
        (a.name);
        if (__VLS_ctx.form.assignees.some((x) => x.id === a.id)) {
            const __VLS_41 = {}.IonIcon;
            /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
            // @ts-ignore
            const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                icon: (__VLS_ctx.checkmarkOutline),
                ...{ class: "ml-auto" },
            }));
            const __VLS_43 = __VLS_42({
                icon: (__VLS_ctx.checkmarkOutline),
                ...{ class: "ml-auto" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        }
    }
}
var __VLS_40;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-val" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "date-display" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.form.dueDate ? __VLS_ctx.formatDate(__VLS_ctx.form.dueDate) : "No date");
const __VLS_45 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    icon: (__VLS_ctx.calendarOutline),
    ...{ style: {} },
}));
const __VLS_47 = __VLS_46({
    icon: (__VLS_ctx.calendarOutline),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "date",
        ...{ class: "date-input" },
    });
    (__VLS_ctx.form.dueDate);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-val" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "field-tag" },
});
const __VLS_49 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    icon: (__VLS_ctx.lockClosed),
    ...{ style: {} },
}));
const __VLS_51 = __VLS_50({
    icon: (__VLS_ctx.lockClosed),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-val" },
});
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.form.columnId),
        ...{ class: "select-field" },
    });
    for (const [col] of __VLS_getVForSourceType((__VLS_ctx.store.columns))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (col.id),
            value: (col.id),
        });
        (col.title);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-tag" },
    });
    (__VLS_ctx.columnTitle);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-val" },
});
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.form.label),
        ...{ class: "select-field" },
    });
    for (const [lbl] of __VLS_getVForSourceType((__VLS_ctx.labels))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (lbl),
        });
        (lbl);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label-badge" },
        ...{ class: (`label-${__VLS_ctx.form.label}`) },
    });
    (__VLS_ctx.form.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field-val" },
});
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.form.priority),
        ...{ class: "select-field" },
    });
    for (const [p] of __VLS_getVForSourceType((__VLS_ctx.priorities))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (p),
        });
        (p);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: "prio-dot" },
        ...{ class: (`prio-${__VLS_ctx.form.priority}`) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm" },
    });
    (__VLS_ctx.form.priority);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
    value: (__VLS_ctx.form.description),
    ...{ class: "desc-textarea" },
    placeholder: "Add a description…",
    readonly: (!__VLS_ctx.isEditing),
    rows: "3",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "modal-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "attachments-area" },
});
if (!__VLS_ctx.form.attachments.length && !__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-hint" },
    });
}
for (const [att] of __VLS_getVForSourceType((__VLS_ctx.form.attachments))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (att.id),
        ...{ class: "attach-item" },
    });
    const __VLS_53 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        icon: (__VLS_ctx.getAttachIcon(att.type)),
        ...{ class: "attach-icon" },
        ...{ style: ({ color: __VLS_ctx.getAttachColor(att.type) }) },
    }));
    const __VLS_55 = __VLS_54({
        icon: (__VLS_ctx.getAttachIcon(att.type)),
        ...{ class: "attach-icon" },
        ...{ style: ({ color: __VLS_ctx.getAttachColor(att.type) }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "attach-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "attach-name" },
    });
    (att.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "attach-size text-xs text-muted" },
    });
    (att.size);
    if (__VLS_ctx.isEditing) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isEditing))
                        return;
                    __VLS_ctx.removeAttachment(att.id);
                } },
            ...{ class: "icon-btn-sm" },
        });
        const __VLS_57 = {}.IonIcon;
        /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
            icon: (__VLS_ctx.closeOutline),
        }));
        const __VLS_59 = __VLS_58({
            icon: (__VLS_ctx.closeOutline),
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    }
}
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: (__VLS_ctx.handleFileUpload) },
        ref: "attachInput",
        type: "file",
        multiple: true,
        ...{ style: {} },
    });
    /** @type {typeof __VLS_ctx.attachInput} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isEditing))
                    return;
                __VLS_ctx.attachInput?.click();
            } },
        ...{ onDragover: (...[$event]) => {
                if (!(__VLS_ctx.isEditing))
                    return;
                __VLS_ctx.isAttachDragOver = true;
            } },
        ...{ onDragleave: (...[$event]) => {
                if (!(__VLS_ctx.isEditing))
                    return;
                __VLS_ctx.isAttachDragOver = false;
            } },
        ...{ onDrop: (__VLS_ctx.onAttachDrop) },
        ...{ class: "upload-drop" },
        ...{ class: ({ 'drop-active': __VLS_ctx.isAttachDragOver }) },
    });
    const __VLS_61 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        icon: (__VLS_ctx.cloudUploadOutline),
    }));
    const __VLS_63 = __VLS_62({
        icon: (__VLS_ctx.cloudUploadOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mt-4 flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-xs text-muted font-medium" },
});
(__VLS_ctx.completedCount);
(__VLS_ctx.form.subtasks.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "progress-track mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "progress-fill" },
    ...{ style: ({ width: __VLS_ctx.progressPct + '%' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "subtasks-list" },
});
for (const [sub] of __VLS_getVForSourceType((__VLS_ctx.form.subtasks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (sub.id),
        ...{ class: "subtask-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: (...[$event]) => {
                __VLS_ctx.toggleSubtask(sub.id);
            } },
        type: "checkbox",
        checked: (sub.completed),
        ...{ class: "subtask-check" },
    });
    if (__VLS_ctx.isEditing && __VLS_ctx.editingSubtaskId === sub.id) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onKeydown: (...[$event]) => {
                    if (!(__VLS_ctx.isEditing && __VLS_ctx.editingSubtaskId === sub.id))
                        return;
                    __VLS_ctx.saveEditSubtask(sub.id);
                } },
            ...{ onBlur: (...[$event]) => {
                    if (!(__VLS_ctx.isEditing && __VLS_ctx.editingSubtaskId === sub.id))
                        return;
                    __VLS_ctx.saveEditSubtask(sub.id);
                } },
            ...{ class: "subtask-input" },
            ...{ style: {} },
        });
        (__VLS_ctx.editingSubtaskTitle);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onDblclick: (...[$event]) => {
                    if (!!(__VLS_ctx.isEditing && __VLS_ctx.editingSubtaskId === sub.id))
                        return;
                    __VLS_ctx.isEditing && __VLS_ctx.startEditSubtask(sub);
                } },
            ...{ class: "subtask-title" },
            ...{ class: ({ 'completed-text': sub.completed }) },
        });
        (sub.title);
    }
    if (__VLS_ctx.isEditing) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "subtask-actions" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isEditing))
                        return;
                    __VLS_ctx.startEditSubtask(sub);
                } },
            ...{ class: "icon-btn-sm" },
            title: "Edit",
        });
        const __VLS_65 = {}.IonIcon;
        /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
            icon: (__VLS_ctx.pencilOutline),
        }));
        const __VLS_67 = __VLS_66({
            icon: (__VLS_ctx.pencilOutline),
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isEditing))
                        return;
                    __VLS_ctx.removeSubtask(sub.id);
                } },
            ...{ class: "icon-btn-sm" },
            title: "Delete",
        });
        const __VLS_69 = {}.IonIcon;
        /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
            icon: (__VLS_ctx.closeOutline),
        }));
        const __VLS_71 = __VLS_70({
            icon: (__VLS_ctx.closeOutline),
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    }
}
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "add-subtask-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onKeydown: (__VLS_ctx.addSubtask) },
        placeholder: "Add subtask…",
        ...{ class: "subtask-input" },
    });
    (__VLS_ctx.newSubtask);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.addSubtask) },
        ...{ class: "btn-primary-sm" },
    });
    const __VLS_73 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        icon: (__VLS_ctx.addOutline),
    }));
    const __VLS_75 = __VLS_74({
        icon: (__VLS_ctx.addOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.isEditing))
                    return;
                __VLS_ctx.isEditing = true;
            } },
        ...{ class: "add-more-btn" },
    });
    const __VLS_77 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        icon: (__VLS_ctx.addOutline),
    }));
    const __VLS_79 = __VLS_78({
        icon: (__VLS_ctx.addOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "activity-placeholder text-sm text-muted" },
});
if (__VLS_ctx.task) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatRelative(__VLS_ctx.task.updatedAt));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "modal-actions" },
});
if (__VLS_ctx.task) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.confirmDelete) },
        ...{ class: "btn-danger" },
    });
    const __VLS_81 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        icon: (__VLS_ctx.trashOutline),
    }));
    const __VLS_83 = __VLS_82({
        icon: (__VLS_ctx.trashOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('close');
        } },
    ...{ class: "btn-secondary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.save) },
    ...{ class: "btn-primary" },
    disabled: (!__VLS_ctx.form.title.trim()),
});
var __VLS_12;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['task-modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-left']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-img-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['field-row']} */ ;
/** @type {__VLS_StyleScopedClasses['title-input']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['fields-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field-val']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-group']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-add-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field-val']} */ ;
/** @type {__VLS_StyleScopedClasses['date-display']} */ ;
/** @type {__VLS_StyleScopedClasses['date-input']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field-val']} */ ;
/** @type {__VLS_StyleScopedClasses['field-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field-val']} */ ;
/** @type {__VLS_StyleScopedClasses['select-field']} */ ;
/** @type {__VLS_StyleScopedClasses['field-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field-val']} */ ;
/** @type {__VLS_StyleScopedClasses['select-field']} */ ;
/** @type {__VLS_StyleScopedClasses['label-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field-val']} */ ;
/** @type {__VLS_StyleScopedClasses['select-field']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['prio-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-right']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['attachments-area']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-item']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-info']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-name']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-size']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-drop']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['subtasks-list']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask-item']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask-check']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask-input']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask-title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['add-subtask-row']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['add-more-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['activity-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonModal: IonModal,
            IonContent: IonContent,
            IonIcon: IonIcon,
            closeOutline: closeOutline,
            pencilOutline: pencilOutline,
            addOutline: addOutline,
            calendarOutline: calendarOutline,
            checkmarkCircle: checkmarkCircle,
            imageOutline: imageOutline,
            cloudUploadOutline: cloudUploadOutline,
            trashOutline: trashOutline,
            checkmarkOutline: checkmarkOutline,
            lockClosed: lockClosed,
            store: store,
            allAssignees: allAssignees,
            labels: labels,
            priorities: priorities,
            form: form,
            isEditing: isEditing,
            showAssigneeDropdown: showAssigneeDropdown,
            newSubtask: newSubtask,
            editingSubtaskId: editingSubtaskId,
            editingSubtaskTitle: editingSubtaskTitle,
            coverInput: coverInput,
            attachInput: attachInput,
            isCoverDragOver: isCoverDragOver,
            isAttachDragOver: isAttachDragOver,
            completedCount: completedCount,
            progressPct: progressPct,
            columnTitle: columnTitle,
            toggleAssignee: toggleAssignee,
            toggleSubtask: toggleSubtask,
            addSubtask: addSubtask,
            removeSubtask: removeSubtask,
            startEditSubtask: startEditSubtask,
            saveEditSubtask: saveEditSubtask,
            triggerCoverInput: triggerCoverInput,
            onCoverFileChange: onCoverFileChange,
            onCoverDrop: onCoverDrop,
            handleFileUpload: handleFileUpload,
            onAttachDrop: onAttachDrop,
            removeAttachment: removeAttachment,
            toggleComplete: toggleComplete,
            getAttachIcon: getAttachIcon,
            getAttachColor: getAttachColor,
            formatDate: formatDate,
            formatRelative: formatRelative,
            save: save,
            confirmDelete: confirmDelete,
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
