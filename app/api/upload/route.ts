import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("Upload API called")

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    console.log("File received:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    })

    if (!file) {
      console.error("No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type:", file.type)
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Check if BLOB_READ_WRITE_TOKEN is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN environment variable not found")
      return NextResponse.json(
        {
          error: "Server configuration error: Missing blob storage token",
        },
        { status: 500 },
      )
    }

    // Generate unique filename
    const filename = `recipe-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    console.log("Generated filename:", filename)

    // Upload to Vercel Blob
    console.log("Attempting to upload to Vercel Blob...")
    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("Upload successful:", blob.url)
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    })

    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
