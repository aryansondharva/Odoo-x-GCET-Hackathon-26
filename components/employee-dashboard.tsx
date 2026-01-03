"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, DollarSign, FileText } from "lucide-react"
import Link from "next/link"
import { mockAttendance, mockLeaveRequests, mockPayroll } from "@/lib/mock-data"

export default function EmployeeDashboard() {
  const { user } = useAuth()

  if (!user) return null

  const userAttendance = mockAttendance.filter((a) => a.employeeId === user.employeeId)
  const userLeaves = mockLeaveRequests.filter((l) => l.employeeId === user.employeeId)
  const userPayroll = mockPayroll.find((p) => p.employeeId === user.employeeId)

  const presentDays = userAttendance.filter((a) => a.status === "present").length
  const pendingLeaves = userLeaves.filter((l) => l.status === "pending").length

  const quickActions = [
    {
      title: "Attendance",
      icon: Clock,
      href: "/attendance",
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Apply Leave",
      icon: Calendar,
      href: "/leave",
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Payroll",
      icon: DollarSign,
      href: "/payroll",
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Profile",
      icon: FileText,
      href: "/profile",
      color: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
        <CardContent className="pt-6">
          <p className="text-sm opacity-90">Welcome back,</p>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-sm opacity-75 mt-1">
            {user.position} • {user.department}
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.href}>
            <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <p className="font-medium text-sm">{action.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{presentDays}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingLeaves}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${(user.salary || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Base salary</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leaves */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Your leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userLeaves.slice(0, 3).map((leave) => (
                <div key={leave.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm capitalize">{leave.leaveType} Leave</p>
                    <p className="text-xs text-muted-foreground">
                      {leave.startDate} to {leave.endDate}
                    </p>
                  </div>
                  <Badge
                    variant={
                      leave.status === "approved" ? "default" : leave.status === "pending" ? "secondary" : "destructive"
                    }
                  >
                    {leave.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your last 3 check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userAttendance.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{record.date}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.checkIn && record.checkOut ? `${record.checkIn} - ${record.checkOut}` : "No check-in"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      record.status === "present" ? "default" : record.status === "leave" ? "secondary" : "destructive"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
