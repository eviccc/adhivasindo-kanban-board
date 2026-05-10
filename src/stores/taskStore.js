import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { saveTasks, loadTasks, saveColumns, loadColumns, saveColumnOrder, } from "@/utils/localStorage";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
// ─── Dummy data ───────────────────────────────────────────────────────────────
const DUMMY_ASSIGNEES = [
    { id: "u1", name: "Adi Pratama", avatar: "AP", color: "#4F86F7" },
    { id: "u2", name: "Siti Rahayu", avatar: "SR", color: "#F76F4F" },
    { id: "u3", name: "Budi Santoso", avatar: "BS", color: "#4FC97F" },
    { id: "u4", name: "Rina Dewi", avatar: "RD", color: "#A04FF7" },
    { id: "u5", name: "Doni Kurniawan", avatar: "DK", color: "#F7C24F" },
];
const DEFAULT_BOARD = "Northern Light";
const DUMMY_TASKS = [
    {
        id: "t1",
        title: "Research for a podcast and video website",
        description: "Conduct UX research and gather references for the podcast & video streaming platform redesign.",
        boardName: DEFAULT_BOARD,
        columnId: "todo",
        assignees: [DUMMY_ASSIGNEES[0], DUMMY_ASSIGNEES[1]],
        dueDate: "2025-08-08",
        label: "Feature",
        priority: "High",
        subtasks: [
            { id: "s1", title: "Gather competitor references", completed: true },
            { id: "s2", title: "Define user personas", completed: false },
        ],
        attachments: [
            { id: "a1", name: "research_brief.pdf", type: "pdf", size: "1.2 MB" },
        ],
        coverImage: null,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t2",
        title: "Debug checkout process for the e-commerce website",
        description: "Fix payment gateway integration issues causing failed transactions on mobile.",
        boardName: DEFAULT_BOARD,
        columnId: "todo",
        assignees: [DUMMY_ASSIGNEES[2], DUMMY_ASSIGNEES[3], DUMMY_ASSIGNEES[0]],
        dueDate: "2025-08-10",
        label: "Bug",
        priority: "High",
        subtasks: [
            { id: "s3", title: "Reproduce the bug", completed: true },
            { id: "s4", title: "Identify root cause", completed: true },
            { id: "s5", title: "Write unit tests", completed: false },
            { id: "s6", title: "Deploy fix to staging", completed: false },
        ],
        attachments: [
            { id: "a2", name: "bug_report.png", type: "image", size: "340 KB" },
            { id: "a3", name: "error_logs.txt", type: "text", size: "56 KB" },
        ],
        coverImage: null,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t3",
        title: "Design wireframes for the landing page revamp",
        description: "Create low and high-fidelity wireframes for the new company landing page.",
        boardName: DEFAULT_BOARD,
        columnId: "doing",
        assignees: [DUMMY_ASSIGNEES[1], DUMMY_ASSIGNEES[4]],
        dueDate: "2025-08-12",
        label: "Feature",
        priority: "Medium",
        subtasks: [
            { id: "s7", title: "Sketch low-fi wireframes", completed: true },
            { id: "s8", title: "Create hi-fi mockup in Figma", completed: false },
        ],
        attachments: [
            { id: "a4", name: "wireframes_v1.fig", type: "figma", size: "4.8 MB" },
        ],
        coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t4",
        title: "Install and set up a marketing tool for team operations",
        description: "Evaluate and configure HubSpot CRM for the marketing team's daily workflows.",
        boardName: DEFAULT_BOARD,
        columnId: "doing",
        assignees: [DUMMY_ASSIGNEES[0], DUMMY_ASSIGNEES[2], DUMMY_ASSIGNEES[3]],
        dueDate: "2025-08-14",
        label: "Undefined",
        priority: "Low",
        subtasks: [
            { id: "s9", title: "Compare top 3 tools", completed: true },
            { id: "s10", title: "Setup free trial account", completed: true },
            { id: "s11", title: "Onboard team members", completed: false },
        ],
        attachments: [],
        coverImage: null,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t5",
        title: "Create and refine logo designs for the UI brand",
        description: "Iterate on logo concepts and finalize brand identity guidelines.",
        boardName: DEFAULT_BOARD,
        columnId: "review",
        assignees: [DUMMY_ASSIGNEES[1], DUMMY_ASSIGNEES[0]],
        dueDate: "2025-08-15",
        label: "Issue",
        priority: "Medium",
        subtasks: [
            { id: "s12", title: "Draft 5 logo concepts", completed: true },
            { id: "s13", title: "Client feedback round", completed: true },
            { id: "s14", title: "Finalize chosen concept", completed: false },
        ],
        attachments: [
            { id: "a5", name: "logo_concepts.pdf", type: "pdf", size: "2.1 MB" },
        ],
        coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&q=80",
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t6",
        title: "Create an icon library for the project",
        description: "Design and export a consistent set of UI icons in SVG format.",
        boardName: DEFAULT_BOARD,
        columnId: "review",
        assignees: [DUMMY_ASSIGNEES[3], DUMMY_ASSIGNEES[2]],
        dueDate: "2025-08-08",
        label: "Feature",
        priority: "Low",
        subtasks: [
            { id: "s15", title: "Define icon style guide", completed: true },
            { id: "s16", title: "Draw 40 base icons", completed: true },
            { id: "s17", title: "Export as SVG + PNG", completed: true },
            { id: "s18", title: "Upload to design system", completed: false },
        ],
        attachments: [
            { id: "a6", name: "icons_v2.zip", type: "zip", size: "890 KB" },
        ],
        coverImage: null,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t7",
        title: "Create the Email Page layout and necessary components",
        description: "Build reusable email template components with responsive design.",
        boardName: DEFAULT_BOARD,
        columnId: "done",
        assignees: [DUMMY_ASSIGNEES[0], DUMMY_ASSIGNEES[1]],
        dueDate: "2025-08-20",
        label: "Feature",
        priority: "High",
        subtasks: [
            { id: "s19", title: "Design email layout", completed: true },
            { id: "s20", title: "Code HTML template", completed: true },
            { id: "s21", title: "Test across email clients", completed: true },
        ],
        attachments: [
            { id: "a7", name: "email_template.html", type: "html", size: "24 KB" },
        ],
        coverImage: null,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t8",
        title: "Enhance website usability through user feedback",
        description: "Analyse usability test recordings and implement quick wins.",
        boardName: DEFAULT_BOARD,
        columnId: "done",
        assignees: [DUMMY_ASSIGNEES[2], DUMMY_ASSIGNEES[3]],
        dueDate: "2025-08-18",
        label: "Feature",
        priority: "Medium",
        subtasks: [
            { id: "s22", title: "Review session recordings", completed: true },
            { id: "s23", title: "Prioritise issues", completed: true },
        ],
        attachments: [],
        coverImage: null,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t9",
        title: "Blog Edit Page Modification and Playlist Page Design",
        description: "Redesign the blog editor UX and build the new playlist browsing experience.",
        boardName: DEFAULT_BOARD,
        columnId: "rework",
        assignees: [DUMMY_ASSIGNEES[0], DUMMY_ASSIGNEES[4]],
        dueDate: "2025-08-08",
        label: "Feature",
        priority: "High",
        subtasks: [
            { id: "s24", title: "Wireframe new blog editor", completed: true },
            { id: "s25", title: "Design playlist grid layout", completed: true },
            { id: "s26", title: "Implement drag-to-reorder", completed: false },
        ],
        attachments: [
            { id: "a8", name: "playlist_mockup.fig", type: "figma", size: "6.2 MB" },
        ],
        coverImage: null,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
    {
        id: "t10",
        title: "Plan and execute training sessions for new hires",
        description: "Prepare onboarding materials and schedule 3-day orientation for Q3 new hires.",
        boardName: DEFAULT_BOARD,
        columnId: "rework",
        assignees: [DUMMY_ASSIGNEES[1], DUMMY_ASSIGNEES[4]],
        dueDate: "2025-08-09",
        label: "Issue",
        priority: "Medium",
        subtasks: [
            { id: "s27", title: "Create onboarding checklist", completed: true },
            { id: "s28", title: "Book training rooms", completed: false },
            { id: "s29", title: "Send calendar invites", completed: false },
        ],
        attachments: [
            { id: "a9", name: "onboarding_deck.pptx", type: "pptx", size: "3.4 MB" },
        ],
        coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
    },
];
const DEFAULT_COLUMNS = [
    { id: "todo", title: "To Do", color: "#6366f1" },
    { id: "doing", title: "Doing", color: "#f59e0b" },
    { id: "review", title: "Review", color: "#8b5cf6" },
    { id: "done", title: "Done", color: "#10b981" },
    { id: "rework", title: "Rework", color: "#ef4444" },
];
// ─── Store ────────────────────────────────────────────────────────────────────
const DEFAULT_COLUMN_ORDER = [
    "todo",
    "doing",
    "review",
    "done",
    "rework",
];
export const useTaskStore = defineStore("tasks", () => {
    // Migrate old tasks that may not have boardName
    const rawTasks = loadTasks();
    const migratedTasks = rawTasks
        ? rawTasks.map((t) => ({ ...t, boardName: t.boardName ?? DEFAULT_BOARD }))
        : DUMMY_TASKS;
    const tasks = ref(migratedTasks);
    const columns = ref(loadColumns() ?? DEFAULT_COLUMNS);
    const columnOrder = ref(loadColumns()?.map((c) => c.id) ?? DEFAULT_COLUMNS.map((c) => c.id));
    // Filters
    const searchQuery = ref("");
    const filterAssignee = ref(null);
    const filterLabel = ref(null);
    const filterDueDate = ref(null);
    // Ordered columns for the board (respects user reorder)
    const orderedColumns = computed(() => columnOrder.value
        .map((id) => columns.value.find((c) => c.id === id))
        .filter(Boolean));
    // All possible assignees
    const allAssignees = computed(() => {
        const map = new Map();
        DUMMY_ASSIGNEES.forEach((a) => map.set(a.id, a));
        tasks.value.forEach((t) => t.assignees.forEach((a) => map.set(a.id, a)));
        return Array.from(map.values());
    });
    const filteredTasks = computed(() => {
        return tasks.value.filter((task) => {
            if (searchQuery.value &&
                !task.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
                return false;
            if (filterAssignee.value &&
                !task.assignees.some((a) => a.id === filterAssignee.value))
                return false;
            if (filterLabel.value && task.label !== filterLabel.value)
                return false;
            if (filterDueDate.value) {
                if (!task.dueDate)
                    return false;
                const today = dayjs().startOf("day");
                const due = dayjs(task.dueDate);
                if (filterDueDate.value === "overdue" && !due.isBefore(today))
                    return false;
                if (filterDueDate.value === "today" && !due.isSame(today, "day"))
                    return false;
                if (filterDueDate.value === "this_week") {
                    const weekEnd = today.add(7, "day");
                    if (!(due.isSameOrAfter(today) && due.isBefore(weekEnd)))
                        return false;
                }
            }
            return true;
        });
    });
    function getTasksByColumn(columnId) {
        return filteredTasks.value.filter((t) => t.columnId === columnId);
    }
    function persist() {
        saveTasks(tasks.value);
        saveColumns(columns.value);
        saveColumnOrder(columnOrder.value);
    }
    function addTask(task) {
        const newTask = {
            ...task,
            id: `t${Date.now()}`,
            createdAt: dayjs().toISOString(),
            updatedAt: dayjs().toISOString(),
        };
        tasks.value.push(newTask);
        persist();
        return newTask;
    }
    function updateTask(id, updates) {
        const idx = tasks.value.findIndex((t) => t.id === id);
        if (idx !== -1) {
            tasks.value[idx] = {
                ...tasks.value[idx],
                ...updates,
                updatedAt: dayjs().toISOString(),
            };
            persist();
        }
    }
    function deleteTask(id) {
        tasks.value = tasks.value.filter((t) => t.id !== id);
        persist();
    }
    function moveTask(taskId, toColumnId) {
        updateTask(taskId, { columnId: toColumnId });
    }
    function reorderTasks(columnId, newOrder) {
        const otherTasks = tasks.value.filter((t) => t.columnId !== columnId);
        // Ensure all tasks in newOrder carry correct columnId
        const updated = newOrder.map((t) => ({ ...t, columnId }));
        tasks.value = [...otherTasks, ...updated];
        persist();
    }
    function reorderColumns(newOrder) {
        columnOrder.value = newOrder.map((c) => c.id);
        columns.value = newOrder;
        persist();
    }
    function clearFilters() {
        searchQuery.value = "";
        filterAssignee.value = null;
        filterLabel.value = null;
        filterDueDate.value = null;
    }
    return {
        tasks,
        columns,
        columnOrder,
        orderedColumns,
        searchQuery,
        filterAssignee,
        filterLabel,
        filterDueDate,
        allAssignees,
        filteredTasks,
        getTasksByColumn,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        reorderTasks,
        reorderColumns,
        clearFilters,
        DUMMY_ASSIGNEES,
        DEFAULT_BOARD,
    };
});
