"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "admin" | "employee"

export interface User {
  id: string
  employeeId: string
  name: string
  email: string
  role: UserRole
  department: string
  position: string
  phone: string
  profilePicture?: string
  joinDate: string
  salary?: number
  companyName?: string
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("hrms_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        localStorage.removeItem("hrms_user")
      }
    }
    setIsLoading(false)
  }, [])

  const generateOTP = async (email: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    otpStore.set(email, { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 })
    console.log("[v0] Generated OTP for demo:", otp)
    return otp
  }

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const stored = otpStore.get(email)
    if (!stored || stored.expiresAt < Date.now()) {
      return false
    }
    return stored.code === otp
  }

  const login = async (email: string, password: string, otp?: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (otp && !(await verifyOTP(email, otp))) {
        throw new Error("Invalid OTP")
      }

      const mockUsers: Record<string, { password: string; user: User }> = {
        "admin@hrms.com": {
          password: "Admin@123",
          user: {
            id: "1",
            employeeId: "OIHR2022001",
            name: "Sarah Johnson",
            email: "admin@hrms.com",
            role: "admin",
            department: "HR",
            position: "HR Manager",
            phone: "+1 (555) 123-4567",
            profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            joinDate: "2022-01-15",
            companyName: "TechCorp Inc",
          },
        },
        "employee@hrms.com": {
          password: "Employee@123",
          user: {
            id: "2",
            employeeId: "OIEX2021001",
            name: "Alex Chen",
            email: "employee@hrms.com",
            role: "employee",
            department: "Engineering",
            position: "Senior Developer",
            phone: "+1 (555) 234-5678",
            profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            joinDate: "2021-06-20",
            salary: 120000,
            companyName: "TechCorp Inc",
          },
        },
      }

      const userRecord = mockUsers[email]
      if (!userRecord || userRecord.password !== password) {
        throw new Error("Invalid credentials")
      }

      setUser(userRecord.user)
      localStorage.setItem("hrms_user", JSON.stringify(userRecord.user))
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData, otp?: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (otp && !(await verifyOTP(data.email, otp))) {
        throw new Error("Invalid OTP")
      }

      // Generate employee ID in format: First 2 letters of first + first 2 of last + year + serial
      const firstName = data.name.split(" ")[0]
      const lastName = data.name.split(" ")[1] || ""
      const year = new Date().getFullYear()
      const serial = String(Math.floor(Math.random() * 10000)).padStart(3, "0")
      const employeeId = `${firstName.substring(0, 2)}${lastName.substring(0, 2)}${year}${serial}`.toUpperCase()

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        position: data.position,
        phone: data.phone,
        companyName: data.companyName,
        joinDate: new Date().toISOString().split("T")[0],
      }

      setUser(newUser)
      localStorage.setItem("hrms_user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!user) throw new Error("User not found")

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("hrms_user", JSON.stringify(updatedUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hrms_user")
  }

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
