import { Building, Landmark, ShoppingBag, Train } from "lucide-react-native";

export const INSPECTION_TABS = [
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
    { id: "paused", label: "Paused" },
    { id: "done", label: "Done" },
];

export const ROLES = ["Developer", "Site Manager", "Engineer", "Architect", "Foreman"];

export const INTRO_SLIDES = [
    {
        id: "1",
        title: "Welcome to DigiQC",
        description: "Your digital quality control companion. Streamline your workflow with ease.",
        image: require("../../assets/welcome-to-digiqc.png"),
    },
    {
        id: "2",
        title: "Track Quality",
        description: "Monitor construction quality in real-time with comprehensive digital checklists.",
        image: require("../../assets/track-quality.png"),
    },
    {
        id: "3",
        title: "Get Reports",
        description: "Generate detailed reports and analytics to keep your project on track.",
        image: require("../../assets/get-reports.png"),
    },
];

export const DEFAULT_QUESTIONS = [
    {
        id: 1,
        text: "Is the foundation leveled correctly?",
        type: 'radio',
        options: ['Yes', 'No', 'N/A'],
        answer: null,
        comment: "",
        proof: null,
        requiredProof: true
    },
    {
        id: 2,
        text: "Enter the measured width (meters):",
        type: 'text',
        answer: "",
        comment: "",
        proof: null,
        requiredProof: false
    },
    {
        id: 3,
        text: "Material quality verification status:",
        type: 'select',
        options: ['Approved', 'Pending', 'Rejected'],
        answer: null,
        comment: "",
        proof: null,
        requiredProof: true
    },
    {
        id: 4,
        text: "Are safety barriers in place?",
        type: 'boolean',
        answer: null,
        comment: "",
        proof: null,
        requiredProof: false
    },
];
export const PROJECTS = [
    {
        id: "1",
        name: "Skyline Tower",
        location: "New York, NY",
        completed: 75,
        icon: "building",
    },
    {
        id: "2",
        name: "River Bridge",
        location: "London, UK",
        completed: 33,
        icon: "bridge",
    },
    {
        id: "3",
        name: "Metro Station",
        location: "Tokyo, JP",
        completed: 52,
        icon: "metro",
    },
    {
        id: "4",
        name: "City Mall",
        location: "Dubai, UAE",
        completed: 90,
        icon: "mall",
    },
];
export const PROJECT_ICONS: any = {
    building: Building,
    bridge: Landmark,
    metro: Train,
    mall: ShoppingBag,
};

export const TODO_LIST = [
    {
        id: 1,
        title: "Inspect Site A foundation",
        status: "completed",
        time: "Completed 2h ago",
        icon: "check",
        color: "#10B981"
    },
    {
        id: 2,
        title: "Review safety report",
        status: "pending",
        time: "Due Today, 5:00 PM",
        icon: "clock",
        color: "#F59E0B"
    },
    {
        id: 3,
        title: "Approve material request",
        status: "overdue",
        time: "Overdue",
        icon: "alert",
        color: "#EF4444"
    }
];
export interface LogItem {
    id: string;
    date: string;
    fileName: string;
}

export const MOCK_LOGS: LogItem[] = [
    { id: '1', date: '2023-10-27', fileName: 'error_log_server_01.txt' },
    { id: '2', date: '2023-10-26', fileName: 'access_log_main.txt' },
    { id: '3', date: '2023-10-25', fileName: 'debug_log_auth.txt' },
    { id: '4', date: '2023-10-24', fileName: 'error_log_db_connection.txt' },
    { id: '5', date: '2023-10-23', fileName: 'access_log_api.txt' },
];

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'success' | 'warning' | 'info' | 'alert';
    read: boolean;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Project Update',
        message: 'Skyline Tower foundation work completed ahead of schedule.',
        time: '2 hours ago',
        type: 'success',
        read: false,
    },
    {
        id: '2',
        title: 'Safety Alert',
        message: 'Heavy rain expected tomorrow. Secure all loose materials.',
        time: '5 hours ago',
        type: 'alert',
        read: false,
    },
    {
        id: '3',
        title: 'Meeting Reminder',
        message: 'Site inspection with client at 10:00 AM tomorrow.',
        time: '1 day ago',
        type: 'info',
        read: true,
    },
    {
        id: '4',
        title: 'Material Delay',
        message: 'Cement delivery for River Bridge delayed by 24 hours.',
        time: '2 days ago',
        type: 'warning',
        read: true,
    },
];

export const MOCK_INSPECTIONS = [
    { id: 1, status: 'active', title: 'QC #1001', subtitle: 'Flooring Check', date: 'Dec 12, 2024', deadline: '14:00' },
    { id: 2, status: 'active', title: 'QC #1002', subtitle: 'Electrical Wiring', date: 'Dec 12, 2024', deadline: '16:30' },
    { id: 3, status: 'active', title: 'QC #1003', subtitle: 'Safety Barriers', date: 'Dec 13, 2024', deadline: '10:00' },

    { id: 4, status: 'pending', title: 'QC #1004', subtitle: 'Plumbing Initial', date: 'Dec 11, 2024', deadline: 'Overdue' },
    { id: 5, status: 'pending', title: 'QC #1005', subtitle: 'Foundation Pour', date: 'Dec 11, 2024', deadline: 'Overdue' },

    { id: 6, status: 'paused', title: 'QC #1006', subtitle: 'Roofing Layers', date: 'Dec 10, 2024', deadline: 'Paused' },

    { id: 7, status: 'done', title: 'QC #1007', subtitle: 'Excavation', date: 'Dec 01, 2024' },
    { id: 8, status: 'done', title: 'QC #1008', subtitle: 'Site Fencing', date: 'Nov 28, 2024' },
    { id: 9, status: 'done', title: 'QC #1009', subtitle: 'Crane Setup', date: 'Nov 25, 2024' },
    { id: 12, status: 'active', title: 'QC #1012', subtitle: 'Rebar Check', date: 'Dec 14, 2024', deadline: '09:00' },
    { id: 13, status: 'active', title: 'QC #1013', subtitle: 'Concrete Pour A', date: 'Dec 14, 2024', deadline: '11:00' },
    { id: 14, status: 'active', title: 'QC #1014', subtitle: 'Concrete Pour B', date: 'Dec 14, 2024', deadline: '13:00' },
    { id: 15, status: 'active', title: 'QC #1015', subtitle: 'Formwork Verify', date: 'Dec 14, 2024', deadline: '15:00' },

    { id: 16, status: 'pending', title: 'QC #1016', subtitle: 'HVAC Ducting', date: 'Dec 10, 2024', deadline: 'Overdue' },
    { id: 17, status: 'pending', title: 'QC #1017', subtitle: 'Fire Safety', date: 'Dec 09, 2024', deadline: 'Overdue' },
    { id: 18, status: 'pending', title: 'QC #1018', subtitle: 'Waterproofing', date: 'Dec 08, 2024', deadline: 'Overdue' },

    { id: 19, status: 'paused', title: 'QC #1019', subtitle: 'Paint Layer 1', date: 'Dec 05, 2024', deadline: 'Paused' },
    { id: 20, status: 'paused', title: 'QC #1020', subtitle: 'Paint Layer 2', date: 'Dec 06, 2024', deadline: 'Paused' },

    { id: 21, status: 'done', title: 'QC #1021', subtitle: 'Site Clearing', date: 'Nov 10, 2024' },
    { id: 22, status: 'done', title: 'QC #1022', subtitle: 'Perimeter Wall', date: 'Nov 08, 2024' },
    { id: 23, status: 'done', title: 'QC #1023', subtitle: 'Gate Install', date: 'Nov 05, 2024' },
    { id: 24, status: 'done', title: 'QC #1024', subtitle: 'Soil Testing', date: 'Nov 01, 2024' },
];