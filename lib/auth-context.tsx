"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { mockEmployees } from "./mock-data"

export type UserRole = "admin" | "employee"

export interface User {
  id: string
  employeeId: string
  name: string
  email: string
  password: string
  role: UserRole
  department: string
  position: string
  phone: string
  profilePicture?: string
  joinDate: string
  salary?: number
  companyName?: string
  status?: "active" | "inactive"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, otp?: string) => Promise<void>
  signup: (data: SignupData, otp?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  updateProfile: (data: Partial<User>) => Promise<void>
  generateOTP: (email: string) => Promise<string>
  verifyOTP: (email: string, otp: string) => Promise<boolean>
}

interface SignupData {
  companyName: string
  name: string
  email: string
  phone: string
  password: string
  role: UserRole
  department: string
  position: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const otpStore = new Map<string, { code: string; expiresAt: number }>()

const MOCK_USERS: Record<string, User> = {
  "hr1@example.com": {
    id: "1",
    employeeId: "OIHR2022001",
    name: "Sarah Johnson",
    email: "hr1@example.com",
    password: "HR@12345",
    role: "admin",
    department: "Human Resources",
    position: "HR Manager",
    phone: "+1 (555) 123-4567",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    joinDate: "2022-01-15",
    companyName: "Tech Excellence Corp",
  },
  "hr2@example.com": {
    id: "2",
    employeeId: "OIHR2021002",
    name: "Michael Chen",
    email: "hr2@example.com",
    password: "HR@54321",
    role: "admin",
    department: "Human Resources",
    position: "HR Director",
    phone: "+1 (555) 234-5678",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    joinDate: "2021-03-10",
    companyName: "Tech Excellence Corp",
  },
  "emp1@example.com": {
    id: "3",
    employeeId: "ALCH2023001",
    name: "Alex Chen",
    email: "emp1@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Engineering",
    position: "Senior Developer",
    phone: "+1 (555) 345-6789",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    joinDate: "2023-06-20",
    salary: 120000,
    companyName: "Tech Excellence Corp",
  },
  "emp2@example.com": {
    id: "4",
    employeeId: "EMRO2023002",
    name: "Emma Rodriguez",
    email: "emp2@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Product",
    position: "Product Manager",
    phone: "+1 (555) 456-7890",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2023-05-15",
    salary: 110000,
    companyName: "Tech Excellence Corp",
  },
  "emp3@example.com": {
    id: "5",
    employeeId: "JAMR2023003",
    name: "James Williams",
    email: "emp3@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Design",
    position: "UI/UX Designer",
    phone: "+1 (555) 567-8901",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    joinDate: "2023-04-10",
    salary: 95000,
    companyName: "Tech Excellence Corp",
  },
  "emp4@example.com": {
    id: "6",
    employeeId: "SARA2023004",
    name: "Sarah Martinez",
    email: "emp4@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Marketing",
    position: "Marketing Specialist",
    phone: "+1 (555) 678-9012",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2023-03-25",
    salary: 85000,
    companyName: "Tech Excellence Corp",
  },
  "emp5@example.com": {
    id: "7",
    employeeId: "DPAN2023005",
    name: "David Anderson",
    email: "emp5@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Engineering",
    position: "DevOps Engineer",
    phone: "+1 (555) 789-0123",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    joinDate: "2023-02-14",
    salary: 105000,
    companyName: "Tech Excellence Corp",
  },
  "emp6@example.com": {
    id: "8",
    employeeId: "LITA2023006",
    name: "Lisa Taylor",
    email: "emp6@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Finance",
    position: "Financial Analyst",
    phone: "+1 (555) 890-1234",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2023-01-30",
    salary: 92000,
    companyName: "Tech Excellence Corp",
  },
  "emp7@example.com": {
    id: "9",
    employeeId: "ROTH2023007",
    name: "Robert Thompson",
    email: "emp7@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Sales",
    position: "Sales Executive",
    phone: "+1 (555) 901-2345",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    joinDate: "2023-01-10",
    salary: 80000,
    companyName: "Tech Excellence Corp",
  },
  "emp8@example.com": {
    id: "10",
    employeeId: "JOHA2023008",
    name: "Jessica Harris",
    email: "emp8@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Customer Support",
    position: "Support Manager",
    phone: "+1 (555) 012-3456",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2022-12-20",
    salary: 75000,
    companyName: "Tech Excellence Corp",
  },
  "emp9@example.com": {
    id: "11",
    employeeId: "MABE2023009",
    name: "Matthew Bennett",
    email: "emp9@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Engineering",
    position: "Full Stack Developer",
    phone: "+1 (555) 123-4567",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    joinDate: "2022-11-15",
    salary: 115000,
    companyName: "Tech Excellence Corp",
  },
  "emp10@example.com": {
    id: "12",
    employeeId: "NICA2023010",
    name: "Nicole Carter",
    email: "emp10@example.com",
    password: "Emp@12345",
    role: "employee",
    department: "Operations",
    position: "Operations Coordinator",
    phone: "+1 (555) 234-5678",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    joinDate: "2022-10-05",
    salary: 70000,
    companyName: "Tech Excellence Corp",
  },
  // Add mock employees from mock-data.ts for authentication
  "alex.chen@talentsphere.com": {
    id: "emp-001",
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
    companyName: "Tech Excellence Corp",
  },
  "maria.garcia@talentsphere.com": {
    id: "emp-002",
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
    companyName: "Tech Excellence Corp",
  },
  "james.wilson@talentsphere.com": {
    id: "emp-003",
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
    companyName: "Tech Excellence Corp",
  },
  "emily.rodriguez@talentsphere.com": {
    id: "emp-004",
    employeeId: "EMP004",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@talentsphere.com",
    password: "default123",
    role: "employee",
    department: "Finance",
    position: "Financial Analyst",
    phone: "+1 (555) 567-8901",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    joinDate: "2022-07-01",
    salary: 95000,
    companyName: "Tech Excellence Corp",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = localStorage.getItem("hrms_user")
        const sessionToken = sessionStorage.getItem("hrms_token")

        if (stored && sessionToken) {
          const userData = JSON.parse(stored)
          setUser(userData)
        }

        // Initialize HR employees with mock data if not already present
        if (!localStorage.getItem("hr_employees")) {
          const mockEmployeesWithIds = mockEmployees.map((emp: any) => ({
            ...emp,
            password: "default123", // Add default password for mock employees
            companyName: "Tech Excellence Corp"
          }))
          localStorage.setItem("hr_employees", JSON.stringify(mockEmployeesWithIds))
        }
      } catch (e) {
        localStorage.removeItem("hrms_user")
        sessionStorage.removeItem("hrms_token")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const generateOTP = useCallback(async (email: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Use a deterministic OTP based on email and timestamp for demo purposes
    const seed = email.length + Date.now().toString().slice(-6)
    const otp = (parseInt(seed) % 900000 + 100000).toString()
    otpStore.set(email, { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 })
    console.log("[v0] OTP generated for demo:", otp)
    return otp
  }, [])

  const verifyOTP = useCallback(async (email: string, otp: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const stored = otpStore.get(email)
    if (!stored || stored.expiresAt < Date.now()) {
      return false
    }
    return stored.code === otp
  }, [])

  const login = useCallback(
    async (email: string, password: string, otp?: string) => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        if (otp && !(await verifyOTP(email, otp))) {
          throw new Error("Invalid OTP")
        }

        const userRecord = MOCK_USERS[email]
        if (!userRecord || userRecord.password !== password) {
          throw new Error("Invalid email or password")
        }

        setUser(userRecord)
        localStorage.setItem("hrms_user", JSON.stringify(userRecord))
        sessionStorage.setItem("hrms_token", `token_${Date.now()}`)
      } finally {
        setIsLoading(false)
      }
    },
    [verifyOTP],
  )

  const signup = useCallback(
    async (data: SignupData, otp?: string) => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        if (otp && !(await verifyOTP(data.email, otp))) {
          throw new Error("Invalid OTP")
        }

        const firstName = data.name.split(" ")[0]
        const lastName = data.name.split(" ")[1] || ""
        const year = new Date().getFullYear()
        const serial = String(Date.now()).slice(-4)
        const employeeId = `${firstName.substring(0, 2)}${lastName.substring(0, 2)}${year}${serial}`.toUpperCase()

        const newUser: User = {
          id: `user_${Date.now()}_${data.email.length}`,
          employeeId,
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          department: data.department,
          position: data.position,
          phone: data.phone,
          companyName: data.companyName,
          joinDate: new Date().toISOString().split("T")[0],
          status: "active",
        }

        // Add to MOCK_USERS for authentication
        MOCK_USERS[data.email] = newUser

        // Add to HR employees system
        const hrEmployees = JSON.parse(localStorage.getItem("hr_employees") || "[]")
        const hrEmployee = {
          ...newUser,
          salary: data.role === "admin" ? 150000 : 80000, // Default salary based on role
          profilePicture: `https://images.unsplash.com/photo-${Date.now() % 1000000000}?w=400`
        }
        hrEmployees.push(hrEmployee)
        localStorage.setItem("hr_employees", JSON.stringify(hrEmployees))

        setUser(newUser)
        localStorage.setItem("hrms_user", JSON.stringify(newUser))
        sessionStorage.setItem("hrms_token", `token_${Date.now()}`)
      } finally {
        setIsLoading(false)
      }
    },
    [verifyOTP],
  )

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        if (!user) throw new Error("User not found")

        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        localStorage.setItem("hrms_user", JSON.stringify(updatedUser))
      } finally {
        setIsLoading(false)
      }
    },
    [user],
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("hrms_user")
    sessionStorage.removeItem("hrms_token")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        updateProfile,
        generateOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
