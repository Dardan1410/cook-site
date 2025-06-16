"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react"

interface SimpleImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function SimpleImageUpload({ value, onChange, label = "Recipe Image" }: SimpleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    console.log("File selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    setError(null)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please select an image file"
      console.error("Validation error:", errorMsg)
      setError(errorMsg)
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = "Image size must be less than 5MB"
      console.error("Validation error:", errorMsg)
      setError(errorMsg)
      return
    }

    setIsUploading(true)
    console.log("Starting upload process...")

    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("Making request to /api/upload")
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("Upload response status:", response.status)
      console.log("Upload response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Upload failed with error data:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("Upload successful, received data:", data)

      if (!data.url) {
        throw new Error("No URL returned from upload")
      }

      onChange(data.url)
      console.log("Image URL updated:", data.url)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to upload image"
      console.error("Upload error:", {
        error,
        message: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
      })
      setError(`Upload failed: ${errorMsg}`)
    } finally {
      setIsUploading(false)
      console.log("Upload process completed")
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log("File input changed:", file ? file.name : "No file selected")
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemoveImage = () => {
    console.log("Removing image, resetting to placeholder")
    onChange("/placeholder.svg?height=300&width=400")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    console.log("Opening file dialog")
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>

      {/* Current Image Preview */}
      {value && !value.includes("placeholder.svg") && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={value || "/placeholder.svg"}
                alt="Recipe preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  console.error("Image failed to load:", value)
                  console.error("Image error event:", e)
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", value)
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Image uploaded successfully</span>
              <Button type="button" variant="outline" size="sm" onClick={openFileDialog} disabled={isUploading}>
                Change Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          <div className="text-center">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-orange-600 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Uploading image...</p>
                <p className="text-xs text-gray-500 mt-1">Check browser console for details</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {value && !value.includes("placeholder.svg") ? "Change image" : "Upload an image"}
                </p>
                <Button type="button" variant="outline" onClick={openFileDialog} disabled={isUploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF up to 5MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Upload Error</p>
            <p>{error}</p>
            <p className="text-xs mt-1 text-red-500">Check browser console for more details</p>
          </div>
        </div>
      )}

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>Current value: {value}</p>
          <p>Is uploading: {isUploading.toString()}</p>
          <p>Has error: {error ? "Yes" : "No"}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
    </div>
  )
}
