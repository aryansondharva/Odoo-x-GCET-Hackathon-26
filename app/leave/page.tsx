"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockLeaveRequests } from "@/lib/mock-data"
import { Plus, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function LeavePage() {
  const { user } = useAuth()
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [formData, setFormData] = useState({
    leaveType: "paid",
    startDate: "",
    endDate: "",
    remarks: "",
  })

  if (!user) return null

  const userLeaves = mockLeaveRequests.filter((l) => l.employeeId === user.employeeId)
  const leaveStats = {
    pending: userLeaves.filter((l) => l.status === "pending").length,
    approved: userLeaves.filter((l) => l.status === "approved").length,
    rejected: userLeaves.filter((l) => l.status === "rejected").length,
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Leave request submitted:", formData)
    setShowNewRequest(false)
    setFormData({ leaveType: "paid", startDate: "", endDate: "", remarks: "" })
  }

  return (
    <DashboardLayout currentPage="Leave">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{leaveStats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-green-600">{leaveStats.approved}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-red-600">{leaveStats.rejected}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* New Leave Request Form */}
        {!showNewRequest ? (
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewRequest(true)}>
            <Plus className="w-4 h-4" />
            Request New Leave
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Request Leave</CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveType">Leave Type</Label>
                    <Select
                      value={formData.leaveType}
                      onValueChange={(value) => setFormData({ ...formData, leaveType: value })}
                    >
                      <SelectTrigger id="leaveType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid Leave</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <textarea
                    id="remarks"
                    placeholder="Add any additional information..."
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Submit Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewRequest(false)
                      setFormData({ leaveType: "paid", startDate: "", endDate: "", remarks: "" })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Leave Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Leave Requests</CardTitle>
            <CardDescription>{userLeaves.length} total requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userLeaves.map((leave) => (
                <div key={leave.id} className="p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold capitalize">{leave.leaveType} Leave</p>
                      <p className="text-sm text-muted-foreground">
                        {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(leave.status)}>{leave.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{leave.remarks}</p>
                  {leave.approverComments && (
                    <div className="flex gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                      <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">{leave.approverComments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
