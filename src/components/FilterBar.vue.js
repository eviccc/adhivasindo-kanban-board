/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, ref } from "vue";
import { IonIcon } from "@ionic/vue";
import { lockClosed, chevronDown, personAdd, funnelOutline, cloudUploadOutline, searchOutline, closeOutline, } from "ionicons/icons";
import { useTaskStore } from "@/stores/taskStore";
const __VLS_emit = defineEmits(["invite"]);
const store = useTaskStore();
const showFilters = ref(false);
const labels = ["Feature", "Bug", "Issue", "Undefined"];
const visibleAssignees = computed(() => store.allAssignees.slice(0, 4));
const extraCount = computed(() => Math.max(0, store.allAssignees.length - 4));
const hasActiveFilters = computed(() => store.searchQuery ||
    store.filterAssignee ||
    store.filterLabel ||
    store.filterDueDate);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-expanded']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "board-title" },
});
const __VLS_0 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    icon: (__VLS_ctx.lockClosed),
    ...{ class: "board-icon" },
}));
const __VLS_2 = __VLS_1({
    icon: (__VLS_ctx.lockClosed),
    ...{ class: "board-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "board-name" },
});
const __VLS_4 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    icon: (__VLS_ctx.chevronDown),
    ...{ class: "board-icon-sm" },
}));
const __VLS_6 = __VLS_5({
    icon: (__VLS_ctx.chevronDown),
    ...{ class: "board-icon-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-group ml-2" },
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
if (__VLS_ctx.extraCount > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar avatar-more" },
    });
    (__VLS_ctx.extraCount);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('invite');
        } },
    ...{ class: "btn-outline ml-2" },
});
const __VLS_8 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    icon: (__VLS_ctx.personAdd),
}));
const __VLS_10 = __VLS_9({
    icon: (__VLS_ctx.personAdd),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "btn-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showFilters = !__VLS_ctx.showFilters;
        } },
    ...{ class: "btn-outline" },
    ...{ class: ({ active: __VLS_ctx.hasActiveFilters }) },
});
const __VLS_12 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    icon: (__VLS_ctx.funnelOutline),
}));
const __VLS_14 = __VLS_13({
    icon: (__VLS_ctx.funnelOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "btn-label" },
});
if (__VLS_ctx.hasActiveFilters) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: "filter-dot" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "btn-outline hide-xs" },
});
const __VLS_16 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    icon: (__VLS_ctx.cloudUploadOutline),
}));
const __VLS_18 = __VLS_17({
    icon: (__VLS_ctx.cloudUploadOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "btn-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-wrap" },
});
const __VLS_20 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    icon: (__VLS_ctx.searchOutline),
    ...{ class: "search-icon" },
}));
const __VLS_22 = __VLS_21({
    icon: (__VLS_ctx.searchOutline),
    ...{ class: "search-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    value: (__VLS_ctx.store.searchQuery),
    type: "text",
    placeholder: "Search Tasks",
    ...{ class: "search-input" },
});
if (__VLS_ctx.store.searchQuery) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.store.searchQuery))
                    return;
                __VLS_ctx.store.searchQuery = '';
            } },
        ...{ class: "search-clear" },
    });
    const __VLS_24 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        icon: (__VLS_ctx.closeOutline),
    }));
    const __VLS_26 = __VLS_25({
        icon: (__VLS_ctx.closeOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
}
const __VLS_28 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    name: "slide-down",
}));
const __VLS_30 = __VLS_29({
    name: "slide-down",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
if (__VLS_ctx.showFilters) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-expanded" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "filter-chip-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-chips" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showFilters))
                    return;
                __VLS_ctx.store.filterAssignee = null;
            } },
        ...{ class: "chip" },
        ...{ class: ({ active: !__VLS_ctx.store.filterAssignee }) },
    });
    for (const [a] of __VLS_getVForSourceType((__VLS_ctx.store.allAssignees))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showFilters))
                        return;
                    __VLS_ctx.store.filterAssignee = a.id;
                } },
            key: (a.id),
            ...{ class: "chip" },
            ...{ class: ({ active: __VLS_ctx.store.filterAssignee === a.id }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "chip-avatar" },
            ...{ style: ({ background: a.color }) },
        });
        (a.avatar);
        (a.name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "filter-chip-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-chips" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showFilters))
                    return;
                __VLS_ctx.store.filterLabel = null;
            } },
        ...{ class: "chip" },
        ...{ class: ({ active: !__VLS_ctx.store.filterLabel }) },
    });
    for (const [lbl] of __VLS_getVForSourceType((__VLS_ctx.labels))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showFilters))
                        return;
                    __VLS_ctx.store.filterLabel = lbl;
                } },
            key: (lbl),
            ...{ class: "chip label-chip" },
            ...{ class: ([`label-${lbl}`, { active: __VLS_ctx.store.filterLabel === lbl }]) },
        });
        (lbl);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "filter-chip-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-chips" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showFilters))
                    return;
                __VLS_ctx.store.filterDueDate = null;
            } },
        ...{ class: "chip" },
        ...{ class: ({ active: !__VLS_ctx.store.filterDueDate }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showFilters))
                    return;
                __VLS_ctx.store.filterDueDate = 'overdue';
            } },
        ...{ class: "chip" },
        ...{ class: ({ active: __VLS_ctx.store.filterDueDate === 'overdue' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showFilters))
                    return;
                __VLS_ctx.store.filterDueDate = 'today';
            } },
        ...{ class: "chip" },
        ...{ class: ({ active: __VLS_ctx.store.filterDueDate === 'today' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showFilters))
                    return;
                __VLS_ctx.store.filterDueDate = 'this_week';
            } },
        ...{ class: "chip" },
        ...{ class: ({ active: __VLS_ctx.store.filterDueDate === 'this_week' }) },
    });
    if (__VLS_ctx.hasActiveFilters) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showFilters))
                        return;
                    if (!(__VLS_ctx.hasActiveFilters))
                        return;
                    __VLS_ctx.store.clearFilters();
                } },
            ...{ class: "btn-ghost" },
        });
        const __VLS_32 = {}.IonIcon;
        /** @type {[typeof __VLS_components.IonIcon, typeof __VLS_components.ionIcon, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            icon: (__VLS_ctx.closeOutline),
        }));
        const __VLS_34 = __VLS_33({
            icon: (__VLS_ctx.closeOutline),
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    }
}
var __VLS_31;
/** @type {__VLS_StyleScopedClasses['filter-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-left']} */ ;
/** @type {__VLS_StyleScopedClasses['board-title']} */ ;
/** @type {__VLS_StyleScopedClasses['board-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['board-name']} */ ;
/** @type {__VLS_StyleScopedClasses['board-icon-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-group']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-more']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-right']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['hide-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-label']} */ ;
/** @type {__VLS_StyleScopedClasses['search-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['search-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['search-clear']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-expanded']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['label-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonIcon: IonIcon,
            lockClosed: lockClosed,
            chevronDown: chevronDown,
            personAdd: personAdd,
            funnelOutline: funnelOutline,
            cloudUploadOutline: cloudUploadOutline,
            searchOutline: searchOutline,
            closeOutline: closeOutline,
            store: store,
            showFilters: showFilters,
            labels: labels,
            visibleAssignees: visibleAssignees,
            extraCount: extraCount,
            hasActiveFilters: hasActiveFilters,
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
