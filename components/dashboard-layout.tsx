"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Menu,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Bell,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage: string
}

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [openSheet, setOpenSheet] = useState(false)

  if (!isAuthenticated || !user) {
    router.push("/")
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems =
    user.role === "admin"
      ? [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "Employees", href: "/employees", icon: Users },
          { name: "Attendance", href: "/attendance", icon: Clock },
          { name: "Leave Requests", href: "/leave-requests", icon: Calendar },
          { name: "Payroll", href: "/payroll", icon: DollarSign },
          { name: "Reports", href: "/reports", icon: FileText },
        ]
      : [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "Profile", href: "/profile", icon: User },
          { name: "Attendance", href: "/attendance", icon: Clock },
          { name: "Leave", href: "/leave", icon: Calendar },
          { name: "Payroll", href: "/payroll", icon: DollarSign },
        ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Link
        href="/dashboard"
        className="p-4 font-bold text-xl bg-black text-white rounded-xl mb-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
      >
        Talentsphere
      </Link>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpenSheet(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium",
              currentPage === item.name
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )

  return (
    <div className="h-screen flex bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 border-r border-gray-200 bg-white flex-col p-4">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Header */}
        <div className="border-b border-gray-200 bg-white px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
                  <Menu className="w-5 h-5 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white border-r border-gray-200">
                <div className="p-4 h-full">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold text-black">{currentPage}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-gray-100 pr-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-black">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-xl">
                <DropdownMenuLabel className="text-black font-medium">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Settings className="w-4 h-4 mr-2 text-gray-500" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
