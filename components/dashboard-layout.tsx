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
        className="p-4 font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg mb-4"
      >
        Dayflow
      </Link>
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpenSheet(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
              currentPage === item.name
                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )

  return (
    <div className="h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 border-r border-border bg-card flex-col p-4">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="border-b border-border bg-card px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 h-full">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">{currentPage}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
