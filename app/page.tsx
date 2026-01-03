"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockLeaveRequests, mockEmployees } from "@/lib/mock-data"
import { Plus, AlertCircle, Calendar, Clock, CheckCircle, XCircle, TrendingUp, Users, FileText } from "lucide-react"

export default function LeavePage() {
  const { user } = useAuth()
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [formData, setFormData] = useState({
    leaveType: "paid",
    startDate: "",
    endDate: "",
    remarks: "",
  })

  if (!user) return null

  const isAdmin = user.role === "admin"
  const allLeaves = isAdmin ? mockLeaveRequests : mockLeaveRequests.filter((l) => l.employeeId === user.employeeId)
  
  // Calculate leave statistics
  const leaveStats = useMemo(() => {
    const pending = allLeaves.filter((l) => l.status === "pending").length
    const approved = allLeaves.filter((l) => l.status === "approved").length
    const rejected = allLeaves.filter((l) => l.status === "rejected").length
    const total = allLeaves.length
    
    // Calculate leave balance (mock data)
    const totalLeaveDays = 21 // Annual leave days
    const usedLeaveDays = allLeaves
      .filter(l => l.status === "approved")
      .reduce((acc, leave) => {
        const start = new Date(leave.startDate)
        const end = new Date(leave.endDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        return acc + days
      }, 0)
    
    return {
      pending,
      approved,
      rejected,
      total,
      balance: totalLeaveDays - usedLeaveDays,
      used: usedLeaveDays
    }
  }, [allLeaves])
  
  // Filter leave requests
  const filteredLeaves = useMemo(() => {
    let filtered = allLeaves
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(l => l.status === filterStatus)
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(l => l.leaveType === filterType)
    }
    
    return filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  }, [allLeaves, filterStatus, filterType])

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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }
  
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Calculate days
    const days = calculateDays(formData.startDate, formData.endDate)
    
    // Create new leave request (in real app, this would be an API call)
    const newLeave = {
      id: Date.now().toString(),
      employeeId: user.employeeId,
      employeeName: user.name,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      remarks: formData.remarks,
      status: "pending",
      appliedDate: new Date().toISOString().split('T')[0],
      approverComments: null
    }
    
    console.log("Leave request submitted:", newLeave)
    
    // In a real app, you would save this to the database
    // mockLeaveRequests.push(newLeave)
    
    setShowNewRequest(false)
    setFormData({ leaveType: "paid", startDate: "", endDate: "", remarks: "" })
  }

  return (
    <DashboardLayout currentPage="Leave">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">
            {isAdmin ? "Leave Management" : "Leave Requests"}
          </h1>
          {!isAdmin && (
            <Button 
              className="gap-2 bg-black hover:bg-gray-800 text-white" 
              onClick={() => setShowNewRequest(true)}
            >
              <Plus className="w-4 h-4" />
              Request New Leave
            </Button>
          )}
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-black">{leaveStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-black">{leaveStats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-black">{leaveStats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {!isAdmin && (
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="text-2xl font-bold text-black">{leaveStats.balance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-black">{leaveStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-white border-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 bg-white border-gray-200">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="paid">Paid Leave</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="unpaid">Unpaid Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* New Leave Request Form */}
        {!isAdmin && showNewRequest && (
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-black">Request Leave</CardTitle>
              <CardDescription className="text-gray-600">Submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveType" className="text-black">Leave Type</Label>
                    <Select
                      value={formData.leaveType}
                      onValueChange={(value) => setFormData({ ...formData, leaveType: value })}
                    >
                      <SelectTrigger id="leaveType" className="bg-white border-gray-200">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-black">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="bg-white border-gray-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-black">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="bg-white border-gray-200"
                      required
                    />
                  </div>
                </div>
                
                {formData.startDate && formData.endDate && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Duration:</strong> {calculateDays(formData.startDate, formData.endDate)} days
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="remarks" className="text-black">Remarks</Label>
                  <textarea
                    id="remarks"
                    placeholder="Add any additional information..."
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none bg-white"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
                    Submit Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-black">
              {isAdmin ? "All Leave Requests" : "Your Leave Requests"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {filteredLeaves.length} of {allLeaves.length} requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLeaves.map((leave) => (
                <div key={leave.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold capitalize text-black">
                          {leave.leaveType} Leave
                        </h3>
                        <Badge className={`${getStatusBadge(leave.status)} gap-1`}>
                          {getStatusIcon(leave.status)}
                          <span>{leave.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{leave.startDate} to {leave.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{leave.days || calculateDays(leave.startDate, leave.endDate)} days</span>
                        </div>
                      </div>
                      {isAdmin && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Employee:</strong> {leave.employeeName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Applied: {leave.appliedDate}
                      </p>
                    </div>
                    
                    {isAdmin && leave.status === "pending" && (
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {leave.remarks && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">
                        <strong>Remarks:</strong> {leave.remarks}
                      </p>
                    </div>
                  )}
                  
                  {leave.approverComments && (
                    <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-blue-800 mb-1">Management Comment</p>
                        <p className="text-xs text-blue-700">{leave.approverComments}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {filteredLeaves.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">No leave requests found</h3>
                <p className="text-gray-600">
                  {filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No leave requests have been submitted yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
