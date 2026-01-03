"use client"

import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Mail, Phone, Calendar, Briefcase, FileText, Download, X, Save, Loader2 } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    name?: string
    email?: string
    phone?: string
    position?: string
    department?: string
  }>(
    user
      ? {
          name: user.name,
          email: user.email,
          phone: user.phone,
          position: user.position,
          department: user.department,
        }
      : {},
  )
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  if (!user) return null

  const handleSaveProfile = async () => {
    setSaveError("")
    setIsSaving(true)

    try {
      await updateProfile(editData)
      setIsEditing(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = (fileName: string) => {
    const element = document.createElement("a")
    const file = new Blob([`Sample ${fileName} content`], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${fileName.replace(" ", "_")}_${user.employeeId}.pdf`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const profileSections = [
    {
      title: "Personal Information",
      items: [
        { label: "Full Name", value: user.name, icon: null },
        { label: "Email", value: user.email, icon: Mail },
        { label: "Phone", value: user.phone, icon: Phone },
        { label: "Join Date", value: new Date(user.joinDate).toLocaleDateString(), icon: Calendar },
      ],
    },
    {
      title: "Professional Details",
      items: [
        { label: "Employee ID", value: user.employeeId, icon: null },
        { label: "Department", value: user.department, icon: Briefcase },
        { label: "Position", value: user.position, icon: null },
        { label: "Status", value: "Active", icon: null },
      ],
    },
  ]

  return (
    <DashboardLayout currentPage="Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-gray-700 text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-black">{user.name}</h1>
                  <p className="text-gray-600">{user.position}</p>
                  <Badge className="mt-2 bg-white text-black border-gray-300">
                    {user.department}
                  </Badge>
                </div>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-black">Edit Profile</CardTitle>
              <CardDescription className="text-gray-600">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              {saveError && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600">
                  {saveError}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    disabled={isSaving}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    disabled={isSaving}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    disabled={isSaving}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={editData.position}
                    onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                    disabled={isSaving}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editData.department}
                    onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                    disabled={isSaving}
                    className="bg-white border-gray-200"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profileSections.map((section, idx) => (
            <Card key={idx} className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-black">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                      {item.icon && <item.icon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="font-medium text-black">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documents */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Documents</CardTitle>
            <CardDescription className="text-gray-600">Important employment documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Employment Contract", date: "2021-06-20" },
                { name: "Offer Letter", date: "2021-06-10" },
                { name: "Tax Documentation", date: "2024-12-31" },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm text-black">{doc.name}</p>
                      <p className="text-xs text-gray-600">{doc.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(doc.name)} className="gap-1 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
