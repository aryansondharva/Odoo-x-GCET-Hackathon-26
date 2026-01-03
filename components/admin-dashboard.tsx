"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, Calendar, DollarSign } from "lucide-react"
import { mockEmployees, mockLeaveRequests, mockAttendance } from "@/lib/mock-data"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const attendanceData = [
  { day: "Mon", present: 34, absent: 4, halfDay: 2 },
  { day: "Tue", present: 36, absent: 2, halfDay: 2 },
  { day: "Wed", present: 35, absent: 3, halfDay: 2 },
  { day: "Thu", present: 37, absent: 1, halfDay: 2 },
  { day: "Fri", present: 34, absent: 2, halfDay: 4 },
]

const departmentData = [
  { name: "Engineering", value: 15, color: "#3b82f6" },
  { name: "Marketing", value: 8, color: "#8b5cf6" },
  { name: "Finance", value: 6, color: "#ec4899" },
  { name: "HR", value: 3, color: "#10b981" },
  { name: "Sales", value: 8, color: "#f59e0b" },
]

export default function AdminDashboard() {
  const pendingLeaves = mockLeaveRequests.filter((l) => l.status === "pending").length
  const presentToday = mockAttendance.filter(
    (a) => a.date === new Date().toISOString().split("T")[0] && a.status === "present",
  ).length

  const stats = [
    {
      title: "Total Employees",
      value: mockEmployees.length,
      icon: Users,
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Present Today",
      value: mockEmployees.length - 1,
      icon: Clock,
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Pending Approvals",
      value: pendingLeaves,
      icon: Calendar,
      color: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Monthly Payroll",
      value: "$485K",
      icon: DollarSign,
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>Employee attendance this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10b981" />
                <Bar dataKey="absent" fill="#ef4444" />
                <Bar dataKey="halfDay" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
            <CardDescription>{pendingLeaves} awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaveRequests
                .filter((l) => l.status === "pending")
                .slice(0, 3)
                .map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{leave.employeeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <Badge variant="outline">{leave.status}</Badge>
                  </div>
                ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Requests
            </Button>
          </CardContent>
        </Card>

        {/* Employee Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Overview</CardTitle>
            <CardDescription>Quick team summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEmployees.slice(0, 3).map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.position}</p>
                  </div>
                  <Badge variant="secondary">{emp.department}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Employees
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
