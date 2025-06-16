import { NextResponse } from "next/server"
import {
  getFeaturedRecipes,
  addFeaturedRecipe,
  removeFeaturedRecipe,
  updateFeaturedRecipePosition,
} from "@/lib/database"

export async function GET() {
  try {
    const featuredRecipes = await getFeaturedRecipes()
    return NextResponse.json(featuredRecipes)
  } catch (error) {
    console.error("Error fetching featured recipes:", error)
    return NextResponse.json({ error: "Failed to fetch featured recipes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, recipeId, position, id } = await request.json()

    switch (action) {
      case "add":
        const addSuccess = await addFeaturedRecipe(recipeId, position)
        if (!addSuccess) throw new Error("Failed to add featured recipe")
        return NextResponse.json({ success: true })

      case "remove":
        const removeSuccess = await removeFeaturedRecipe(recipeId)
        if (!removeSuccess) throw new Error("Failed to remove featured recipe")
        return NextResponse.json({ success: true })

      case "updatePosition":
        const updateSuccess = await updateFeaturedRecipePosition(id, position)
        if (!updateSuccess) throw new Error("Failed to update position")
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error handling featured recipe action:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
