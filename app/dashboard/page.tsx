"use client"

import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import AdminDashboard from "@/components/admin-dashboard"
import EmployeeDashboard from "@/components/employee-dashboard"

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <DashboardLayout currentPage="Dashboard">
      {user.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />}
    </DashboardLayout>
  )
}
