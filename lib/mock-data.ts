import type { User } from "./auth-context"

export const mockEmployees: User[] = [
  {
    id: "2",
    employeeId: "EMP001",
    name: "Alex Chen",
    email: "alex.chen@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Engineering",
    position: "Senior Developer",
    phone: "+1 (555) 234-5678",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    joinDate: "2021-06-20",
    salary: 120000,
    status: "active",
  },
  {
    id: "3",
    employeeId: "EMP002",
    name: "Maria Garcia",
    email: "maria.garcia@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Marketing",
    position: "Marketing Manager",
    phone: "+1 (555) 345-6789",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2020-03-10",
    salary: 110000,
    status: "active",
  },
  {
    id: "4",
    employeeId: "EMP003",
    name: "James Wilson",
    email: "james.wilson@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Engineering",
    position: "Junior Developer",
    phone: "+1 (555) 456-7890",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    joinDate: "2023-01-15",
    salary: 85000,
    status: "active",
  },
  {
    id: "5",
    employeeId: "EMP004",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "HR",
    position: "HR Specialist",
    phone: "+1 (555) 567-8901",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400",
    joinDate: "2022-08-15",
    salary: 75000,
    status: "active",
  },
  {
    id: "6",
    employeeId: "EMP005",
    name: "David Kim",
    email: "david.kim@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Finance",
    position: "Financial Analyst",
    phone: "+1 (555) 678-9012",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    joinDate: "2021-11-10",
    salary: 95000,
    status: "active",
  },
  {
    id: "7",
    employeeId: "EMP006",
    name: "Sarah Johnson",
    email: "sarah.johnson@talentsphere.com",
    password: "default123",
    role: "admin",
    department: "Operations",
    position: "Operations Manager",
    phone: "+1 (555) 789-0123",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2019-05-20",
    salary: 130000,
    status: "active",
  },
  {
    id: "8",
    employeeId: "EMP007",
    name: "Michael Brown",
    email: "michael.brown@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Sales",
    position: "Sales Representative",
    phone: "+1 (555) 890-1234",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    joinDate: "2022-02-28",
    salary: 80000,
    status: "active",
  },
  {
    id: "9",
    employeeId: "EMP008",
    name: "Lisa Wang",
    email: "lisa.wang@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Engineering",
    position: "DevOps Engineer",
    phone: "+1 (555) 901-2345",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400",
    joinDate: "2020-09-15",
    salary: 115000,
    status: "active",
  },
  {
    id: "10",
    employeeId: "EMP009",
    name: "Robert Martinez",
    email: "robert.martinez@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Marketing",
    position: "Content Strategist",
    phone: "+1 (555) 012-3456",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    joinDate: "2023-03-10",
    salary: 70000,
    status: "active",
  },
  {
    id: "11",
    employeeId: "EMP010",
    name: "Jennifer Lee",
    email: "jennifer.lee@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Finance",
    position: "Accountant",
    phone: "+1 (555) 123-4567",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2021-07-08",
    salary: 85000,
    status: "active",
  },
  {
    id: "12",
    employeeId: "EMP011",
    name: "Thomas Anderson",
    email: "thomas.anderson@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Engineering",
    position: "QA Engineer",
    phone: "+1 (555) 234-5678",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    joinDate: "2022-12-01",
    salary: 90000,
    status: "active",
  },
  {
    id: "13",
    employeeId: "EMP012",
    name: "Amanda Taylor",
    email: "amanda.taylor@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "HR",
    position: "Recruiter",
    phone: "+1 (555) 345-6789",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400",
    joinDate: "2023-06-20",
    salary: 65000,
    status: "active",
  },
]

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  status: "present" | "absent" | "half-day" | "leave"
  checkIn?: string
  checkOut?: string
}

export const mockAttendance: AttendanceRecord[] = [
  { id: "1", employeeId: "EMP001", date: "2025-01-03", status: "present", checkIn: "09:00", checkOut: "17:30" },
  { id: "2", employeeId: "EMP001", date: "2025-01-02", status: "present", checkIn: "09:15", checkOut: "17:45" },
  { id: "3", employeeId: "EMP001", date: "2025-01-01", status: "leave" },
  { id: "4", employeeId: "EMP002", date: "2025-01-03", status: "present", checkIn: "09:30", checkOut: "18:00" },
  { id: "5", employeeId: "EMP002", date: "2025-01-02", status: "half-day", checkIn: "10:00", checkOut: "14:00" },
]

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveType: "paid" | "sick" | "unpaid"
  startDate: string
  endDate: string
  days: number
  status: "pending" | "approved" | "rejected"
  remarks: string
  approverComments: string | null
  requestDate: string
  appliedDate: string
}

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Alex Chen",
    leaveType: "paid",
    startDate: "2025-01-10",
    endDate: "2025-01-12",
    days: 3,
    status: "pending",
    remarks: "Annual vacation",
    approverComments: null,
    requestDate: "2025-01-03",
    appliedDate: "2025-01-03",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Maria Garcia",
    leaveType: "sick",
    startDate: "2025-01-05",
    endDate: "2025-01-05",
    days: 1,
    status: "approved",
    remarks: "Medical appointment",
    approverComments: "Approved - Medical documentation provided",
    requestDate: "2025-01-04",
    appliedDate: "2025-01-04",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "James Wilson",
    leaveType: "paid",
    startDate: "2025-02-01",
    endDate: "2025-02-08",
    days: 8,
    status: "pending",
    remarks: "Personal leave",
    approverComments: null,
    requestDate: "2025-01-03",
    appliedDate: "2025-01-03",
  },
]

export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  baseSalary: number
  allowances: number
  deductions: number
  netSalary: number
  month: string
  year: number
}

export const mockPayroll: PayrollRecord[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Alex Chen",
    baseSalary: 120000,
    allowances: 15000,
    deductions: 22000,
    netSalary: 113000,
    month: "December",
    year: 2024,
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Maria Garcia",
    baseSalary: 110000,
    allowances: 12000,
    deductions: 20000,
    netSalary: 102000,
    month: "December",
    year: 2024,
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "James Wilson",
    baseSalary: 85000,
    allowances: 10000,
    deductions: 15500,
    netSalary: 79500,
    month: "December",
    year: 2024,
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Emily Rodriguez",
    baseSalary: 95000,
    allowances: 11000,
    deductions: 17500,
    netSalary: 88500,
    month: "December",
    year: 2024,
  },
]
