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
      color: "bg-white border-gray-200",
      iconColor: "text-black",
    },
    {
      title: "Apply Leave",
      icon: Calendar,
      href: "/leave",
      color: "bg-white border-gray-200",
      iconColor: "text-black",
    },
    {
      title: "Payroll",
      icon: DollarSign,
      href: "/payroll",
      color: "bg-white border-gray-200",
      iconColor: "text-black",
    },
    {
      title: "Profile",
      icon: FileText,
      href: "/profile",
      color: "bg-white border-gray-200",
      iconColor: "text-black",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-black border-0 text-white shadow-lg">
        <CardContent className="pt-8">
          <p className="text-sm opacity-90 mb-1">Welcome back,</p>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <div className="flex items-center gap-2 text-sm opacity-75">
            <span>{user.position}</span>
            <span>•</span>
            <span>{user.department}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.href}>
            <Card className="border border-gray-200 bg-white hover:border-black transition-colors">
              <CardContent className="pt-6 text-center">
                <div className={`w-12 h-12 rounded-xl border ${action.color} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <p className="font-medium text-black">{action.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Present Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{presentDays}</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{pendingLeaves}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">${(user.salary || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Base salary</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leaves */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 font-semibold">Recent Leave Requests</CardTitle>
            <CardDescription className="text-gray-600">Your leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userLeaves.slice(0, 3).map((leave) => (
                <div key={leave.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                  <div>
                    <p className="font-medium text-sm text-gray-900 capitalize">{leave.leaveType} Leave</p>
                    <p className="text-xs text-gray-500">
                      {leave.startDate} to {leave.endDate}
                    </p>
                  </div>
                  <Badge
                    variant={
                      leave.status === "approved" ? "default" : leave.status === "pending" ? "secondary" : "destructive"
                    }
                    className={
                      leave.status === "approved" ? "bg-green-100 text-green-800 border-green-200" :
                      leave.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                      "bg-green-100 text-green-800 border-green-200"
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
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 font-semibold">Recent Attendance</CardTitle>
            <CardDescription className="text-gray-600">Your last 3 check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userAttendance.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{record.date}</p>
                    <p className="text-xs text-gray-500">
                      {record.checkIn && record.checkOut ? `${record.checkIn} - ${record.checkOut}` : "No check-in"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      record.status === "present" ? "default" : record.status === "leave" ? "secondary" : "destructive"
                    }
                    className={
                      record.status === "present" ? "bg-green-100 text-green-800 border-green-200" :
                      record.status === "leave" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                      "bg-green-100 text-green-800 border-green-200"
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
