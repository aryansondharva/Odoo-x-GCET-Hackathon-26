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
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">{pendingRequests.length}</p>
                  <p className="text-sm text-gray-600">Pending Approval</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">
                    {allRequests.filter((r) => r.status === "approved").length}
                  </p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <X className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">
                    {allRequests.filter((r) => r.status === "rejected").length}
                  </p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl text-black">Leave Requests</CardTitle>
            <CardDescription className="text-gray-600">Review and approve/reject employee leave requests</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {allRequests.map((leave) => (
                <div key={leave.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">{leave.employeeName}</h3>
                      <p className="text-sm text-gray-600">
                        {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave • {leave.startDate}{" "}
                        to {leave.endDate}
                      </p>
                    </div>
                    <Badge
                      className={
                        leave.status === "approved"
                          ? "bg-green-100 text-black border-green-200"
                          : leave.status === "pending"
                            ? "bg-yellow-100 text-black border-yellow-200"
                            : "bg-green-100 text-black border-green-200"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{leave.remarks}</p>

                  {leave.status === "pending" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Approver Comments</label>
                        <textarea
                          placeholder="Add comments..."
                          value={selectedId === leave.id ? approverComments : ""}
                          onChange={(e) => setApproverComments(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 resize-none focus:border-green-500 focus:ring-green-500 bg-white"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
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
                          variant="outline"
                          className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
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
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-black mb-1">Approver Comments:</p>
                      <p className="text-xs text-gray-600">{leave.approverComments}</p>
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
