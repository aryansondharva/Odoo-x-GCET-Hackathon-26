"use client"

import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockLeaveRequests } from "@/lib/mock-data"
import { Check, X } from "lucide-react"
import { useState } from "react"

export default function LeaveRequestsPage() {
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [approverComments, setApproverComments] = useState("")

  if (!user || user.role !== "admin") return null

  const pendingRequests = mockLeaveRequests.filter((l) => l.status === "pending")
  const allRequests = mockLeaveRequests

  return (
    <DashboardLayout currentPage="Leave Requests">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
              <p className="text-xs text-muted-foreground">Pending Approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-green-600">
                {allRequests.filter((r) => r.status === "approved").length}
              </p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-green-600">
                {allRequests.filter((r) => r.status === "rejected").length}
              </p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>Review and approve/reject employee leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allRequests.map((leave) => (
                <div key={leave.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{leave.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave • {leave.startDate}{" "}
                        to {leave.endDate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        leave.status === "approved"
                          ? "default"
                          : leave.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{leave.remarks}</p>

                  {leave.status === "pending" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Approver Comments</label>
                        <textarea
                          placeholder="Add comments..."
                          value={selectedId === leave.id ? approverComments : ""}
                          onChange={(e) => setApproverComments(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1 resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            console.log("Approved:", leave.id)
                            setSelectedId(null)
                            setApproverComments("")
                          }}
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                          onClick={() => {
                            console.log("Rejected:", leave.id)
                            setSelectedId(null)
                            setApproverComments("")
                          }}
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {leave.approverComments && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Approver Comments:</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">{leave.approverComments}</p>
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
