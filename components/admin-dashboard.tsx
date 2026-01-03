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
      color: "bg-white border-gray-200",
      iconColor: "text-black",
      trend: "+12%",
      trendColor: "text-green-600"
    },
    {
      title: "Present Today",
      value: mockEmployees.length - 1,
      icon: Clock,
      color: "bg-white border-gray-200",
      iconColor: "text-black",
      trend: "+5%",
      trendColor: "text-green-600"
    },
    {
      title: "Pending Approvals",
      value: pendingLeaves,
      icon: Calendar,
      color: "bg-white border-gray-200",
      iconColor: "text-black",
      trend: "-2%",
      trendColor: "text-green-600"
    },
    {
      title: "Monthly Payroll",
      value: "$485K",
      icon: DollarSign,
      color: "bg-white border-gray-200",
      iconColor: "text-black",
      trend: "+8%",
      trendColor: "text-green-600"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  {stat.trend && (
                    <span className={`text-xs font-medium ${stat.trendColor}`}>{stat.trend}</span>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color} shadow-sm`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2 border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 font-semibold">Weekly Attendance</CardTitle>
            <CardDescription className="text-gray-600">Employee attendance this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="present" fill="#000000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#6b7280" radius={[4, 4, 0, 0]} />
                <Bar dataKey="halfDay" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 font-semibold">Department Distribution</CardTitle>
            <CardDescription className="text-gray-600">Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {departmentData.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                    <span className="text-gray-600">{dept.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{dept.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 font-semibold">Pending Leave Requests</CardTitle>
            <CardDescription className="text-gray-600">{pendingLeaves} awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLeaveRequests
                .filter((l) => l.status === "pending")
                .slice(0, 3)
                .map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">{leave.employeeName}</p>
                      <p className="text-sm text-gray-600">
                        {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                      </p>
                      <p className="text-xs text-gray-500">
                        {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-gray-200 text-black bg-gray-50">
                      {leave.status}
                    </Badge>
                  </div>
                ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
              View All Requests
            </Button>
          </CardContent>
        </Card>

        {/* Employee Overview */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 font-semibold">Employee Overview</CardTitle>
            <CardDescription className="text-gray-600">Quick team summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEmployees.slice(0, 3).map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-sm text-gray-600">{emp.position}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                    {emp.department}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
              View All Employees
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
