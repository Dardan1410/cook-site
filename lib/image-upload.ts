"use client"

export async function uploadImage(file: File): Promise<string> {
  try {
    // Create FormData for the upload
    const formData = new FormData()
    formData.append("file", file)

    // Upload to Vercel Blob
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export function validateImageFile(file: File): string | null {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return "Please select an image file"
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return "Image size must be less than 5MB"
  }

  return null
}
