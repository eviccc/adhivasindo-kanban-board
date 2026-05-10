import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { timeOutline, checkboxOutline, attachOutline } from 'ionicons/icons';
import dayjs from 'dayjs';
const props = defineProps();
const __VLS_emit = defineEmits(['click']);
const completedCount = computed(() => props.task.subtasks.filter(s => s.completed).length);
const progressPct = computed(() => props.task.subtasks.length ? Math.round((completedCount.value / props.task.subtasks.length) * 100) : 0);
const visibleAssignees = computed(() => props.task.assignees.slice(0, 3));
const extraAssignees = computed(() => Math.max(0, props.task.assignees.length - 3));
const isOverdue = computed(() => props.task.dueDate && dayjs(props.task.dueDate).isBefore(dayjs(), 'day'));
function formatDate(d) {
    return dayjs(d).format('D MMM');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['task-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('click');
        } },
    ...{ class: "task-card task-card-drag" },
});
if (__VLS_ctx.task.coverImage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-cover" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.task.coverImage),
        alt: (__VLS_ctx.task.title),
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label-badge" },
    ...{ class: (`label-${__VLS_ctx.task.label}`) },
});
(__VLS_ctx.task.label);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
    ...{ class: "prio-dot" },
    ...{ class: (`prio-${__VLS_ctx.task.priority}`) },
    title: (__VLS_ctx.task.priority),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "card-title" },
});
(__VLS_ctx.task.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-meta" },
});
if (__VLS_ctx.task.dueDate) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta-item" },
        ...{ class: ({ overdue: __VLS_ctx.isOverdue }) },
    });
    const __VLS_0 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        icon: (__VLS_ctx.timeOutline),
    }));
    const __VLS_2 = __VLS_1({
        icon: (__VLS_ctx.timeOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatDate(__VLS_ctx.task.dueDate));
}
if (__VLS_ctx.task.subtasks.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta-item" },
    });
    const __VLS_4 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        icon: (__VLS_ctx.checkboxOutline),
    }));
    const __VLS_6 = __VLS_5({
        icon: (__VLS_ctx.checkboxOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.completedCount);
    (__VLS_ctx.task.subtasks.length);
}
if (__VLS_ctx.task.attachments.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta-item" },
    });
    const __VLS_8 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        icon: (__VLS_ctx.attachOutline),
    }));
    const __VLS_10 = __VLS_9({
        icon: (__VLS_ctx.attachOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.task.attachments.length);
}
if (__VLS_ctx.task.subtasks.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-progress" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-track" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ class: "progress-fill" },
        ...{ style: ({ width: __VLS_ctx.progressPct + '%' }) },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-group" },
});
for (const [a, i] of __VLS_getVForSourceType((__VLS_ctx.visibleAssignees))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (a.id),
        ...{ class: "avatar" },
        ...{ style: ({ background: a.color, zIndex: 10 - i }) },
        title: (a.name),
    });
    (a.avatar);
}
if (__VLS_ctx.extraAssignees > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar avatar-more" },
    });
    (__VLS_ctx.extraAssignees);
}
/** @type {__VLS_StyleScopedClasses['task-card']} */ ;
/** @type {__VLS_StyleScopedClasses['task-card-drag']} */ ;
/** @type {__VLS_StyleScopedClasses['card-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['label-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['card-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['prio-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['card-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-group']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-more']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonIcon: IonIcon,
            timeOutline: timeOutline,
            checkboxOutline: checkboxOutline,
            attachOutline: attachOutline,
            completedCount: completedCount,
            progressPct: progressPct,
            visibleAssignees: visibleAssignees,
            extraAssignees: extraAssignees,
            isOverdue: isOverdue,
            formatDate: formatDate,
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
