"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Camera, Loader2 } from "lucide-react"
import Image from "next/image"

interface PhotoUploadProps {
  currentPhoto?: string
  employeeId: string
  onPhotoUpdate?: (photoUrl: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PhotoUpload({ 
  currentPhoto, 
  employeeId, 
  onPhotoUpdate, 
  className = "",
  size = "md" 
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  }

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      uploadPhoto(file)
    }
  }

  const uploadPhoto = async (file: File) => {
    console.log("=== Photo Upload Started ===")
    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
      employeeId: employeeId || 'temp_user'
    })
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('employeeId', employeeId || 'temp_user')

      console.log("Sending request to /api/upload/profile-picture")

      const response = await fetch('/api/upload/profile-picture', {
        method: 'POST',
        body: formData
      })

      console.log("Response received:", response.status, response.statusText)

      const result = await response.json()
      console.log("Response data:", result)

      if (result.success) {
        console.log("Upload successful, updating UI")
        onPhotoUpdate?.(result.profilePicture)
        setPreview(null)
      } else {
        console.error('Upload failed:', result.error)
        // Show error message to user
        alert('Upload failed: ' + result.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + error)
    } finally {
      setIsUploading(false)
      console.log("=== Photo Upload Completed ===")
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const removePhoto = async () => {
    // For now, just clear the photo from the UI
    // Database integration will be added later
    onPhotoUpdate?.('')
    setPreview(null)
  }

  const displayPhoto = preview || currentPhoto

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Card className={`relative overflow-hidden ${sizeClasses[size]} border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors`}>
        <CardContent className="p-0">
          {displayPhoto ? (
            <div className="relative w-full h-full">
              <Image
                src={displayPhoto}
                alt="Profile"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {!isUploading && (
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={removePhoto}
                    className="bg-white/90 hover:bg-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer ${
                dragActive ? 'bg-green-50' : 'hover:bg-gray-50'
              } transition-colors`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 text-center px-2">
                    {dragActive ? 'Drop here' : 'Upload photo'}
                  </span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {size !== "sm" && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Click or drag to upload
          </p>
          <p className="text-xs text-gray-400">
            JPEG, PNG, GIF, WebP (max 5MB)
          </p>
        </div>
      )}
    </div>
  )
}
