import type { User } from "./auth-context"

export const mockEmployees: User[] = [
  {
    id: "2",
    employeeId: "EMP001",
    name: "Alex Chen",
    email: "alex.chen@dayflow.com",
    role: "employee",
    department: "Engineering",
    position: "Senior Developer",
    phone: "+1 (555) 234-5678",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    joinDate: "2021-06-20",
    salary: 120000,
  },
  {
    id: "3",
    employeeId: "EMP002",
    name: "Maria Garcia",
    email: "maria.garcia@dayflow.com",
    role: "employee",
    department: "Marketing",
    position: "Marketing Manager",
    phone: "+1 (555) 345-6789",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2020-03-10",
    salary: 110000,
  },
  {
    id: "4",
    employeeId: "EMP003",
    name: "James Wilson",
    email: "james.wilson@dayflow.com",
    role: "employee",
    department: "Engineering",
    position: "Junior Developer",
    phone: "+1 (555) 456-7890",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    joinDate: "2023-01-15",
    salary: 85000,
  },
  {
    id: "5",
    employeeId: "EMP004",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@dayflow.com",
    role: "employee",
    department: "Finance",
    position: "Financial Analyst",
    phone: "+1 (555) 567-8901",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    joinDate: "2022-07-01",
    salary: 95000,
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
  status: "pending" | "approved" | "rejected"
  remarks: string
  approverComments?: string
  requestDate: string
}

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Alex Chen",
    leaveType: "paid",
    startDate: "2025-01-10",
    endDate: "2025-01-15",
    status: "pending",
    remarks: "Annual vacation",
    requestDate: "2025-01-03",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Maria Garcia",
    leaveType: "sick",
    startDate: "2025-01-05",
    endDate: "2025-01-05",
    status: "approved",
    remarks: "Medical appointment",
    approverComments: "Approved - Medical documentation provided",
    requestDate: "2025-01-04",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "James Wilson",
    leaveType: "paid",
    startDate: "2025-02-01",
    endDate: "2025-02-08",
    status: "pending",
    remarks: "Personal leave",
    requestDate: "2025-01-03",
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
