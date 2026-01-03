"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Building, User as UserIcon, Briefcase, Edit } from "lucide-react"
import type { User } from "@/lib/auth-context"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [employee, setEmployee] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEmployee = () => {
      const employeeId = params.id as string
      
      // Search in mock employees
      const { mockEmployees } = require("@/lib/mock-data")
      let foundEmployee = mockEmployees.find((emp: any) => emp.id === employeeId || emp.employeeId === employeeId)
      
      // Search in localStorage employees (newly registered users)
      if (!foundEmployee) {
        const hrEmployees = JSON.parse(localStorage.getItem("hr_employees") || "[]")
        foundEmployee = hrEmployees.find((emp: any) => emp.id === employeeId || emp.employeeId === employeeId)
      }
      
      // Search in MOCK_USERS (demo accounts)
      if (!foundEmployee) {
        const { MOCK_USERS } = require("@/lib/auth-context")
        const userEntry = Object.entries(MOCK_USERS).find(([_, user]: [string, any]) => 
          user.id === employeeId || user.employeeId === employeeId
        )
        if (userEntry) {
          foundEmployee = userEntry[1]
        }
      }
      
      setEmployee(foundEmployee || null)
      setLoading(false)
    }

    loadEmployee()
  }, [params.id])

  if (!currentUser || currentUser.role !== "admin") {
    router.push("/dashboard")
    return null
  }

  if (loading) {
    return (
      <DashboardLayout currentPage="Employees">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!employee) {
    return (
      <DashboardLayout currentPage="Employees">
        <div className="space-y-6">
          <Button onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Employees
          </Button>
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <p className="text-muted-foreground">Employee not found.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="Employees">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Employees
          </Button>
          <Button className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            Edit Employee
          </Button>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 bg-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-gray-700 font-bold text-3xl mx-auto">
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black">{employee.name}</h2>
                  <p className="text-gray-600">{employee.position}</p>
                  <Badge variant="secondary" className="mt-2 bg-white text-black border-gray-300">
                    {employee.role === "admin" ? "Administrator" : "Employee"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="text-black">Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Employee ID</label>
                    <p className="font-medium text-black">{employee.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium flex items-center gap-2 text-black">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {employee.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium flex items-center gap-2 text-black">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {employee.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Join Date</label>
                    <p className="font-medium flex items-center gap-2 text-black">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {employee.joinDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Work Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Department</label>
                    <p className="font-medium flex items-center gap-2 text-black">
                      <Building className="w-4 h-4 text-gray-500" />
                      {employee.department}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Position</label>
                    <p className="font-medium text-black">{employee.position}</p>
                  </div>
                  {employee.salary && (
                    <div>
                      <label className="text-sm text-gray-600">Salary</label>
                      <p className="font-medium flex items-center gap-2 text-black">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        ${employee.salary.toLocaleString()}/year
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-600">Company</label>
                    <p className="font-medium text-black">{employee.companyName || "Tech Excellence Corp"}</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="font-semibold mb-3">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Account Status</label>
                    <p className="font-medium">
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Access Level</label>
                    <p className="font-medium">
                      <Badge variant={employee.role === "admin" ? "default" : "secondary"} className={employee.role === "admin" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-white text-black border-gray-300"}>
                        {employee.role === "admin" ? "Full Access" : "Limited Access"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
          <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            View Attendance
          </Button>
          <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <DollarSign className="w-4 h-4" />
            View Payroll
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
