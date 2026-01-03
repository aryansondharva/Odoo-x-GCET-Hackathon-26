"use client"

import { Suspense } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmployeesList } from "@/components/employees-list"

export default function EmployeesPage() {
  const { user } = useAuth()

  if (!user || user.role !== "admin") return null

  return (
    <DashboardLayout currentPage="Employees">
      <Suspense fallback={null}>
        <EmployeesList />
      </Suspense>
    </DashboardLayout>
  )
}
