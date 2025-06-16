import { NextResponse } from "next/server"
import { getPageContent, updatePageContent } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pageName = searchParams.get("page")

    if (!pageName) {
      return NextResponse.json({ error: "Page name is required" }, { status: 400 })
    }

    const content = await getPageContent(pageName)
    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching page content:", error)
    return NextResponse.json({ error: "Failed to fetch page content" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { pageName, sectionName, contentKey, contentText } = await request.json()

    if (!pageName || !sectionName || !contentKey || contentText === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await updatePageContent(pageName, sectionName, contentKey, contentText)
    if (!success) {
      throw new Error("Failed to update page content")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating page content:", error)
    return NextResponse.json({ error: "Failed to update page content" }, { status: 500 })
  }
}
