"use client"

import Link from "next/link"
import { Clock, Users, ChefHat } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  onCategoryClick?: (category: string) => void
  onDifficultyClick?: (difficulty: string) => void
}

export function RecipeCard({ recipe, onCategoryClick, onDifficultyClick }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "bg-purple-100 text-purple-800 hover:bg-purple-200",
      "bg-pink-100 text-pink-800 hover:bg-pink-200",
      "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      "bg-teal-100 text-teal-800 hover:bg-teal-200",
    ]
    const hash = category.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  // Add safety checks for recipe data
  if (!recipe) {
    return null
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title || "Recipe"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            className={`${getDifficultyColor(recipe.difficulty || "Easy")} cursor-pointer transition-colors`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDifficultyClick?.(recipe.difficulty)
            }}
          >
            {recipe.difficulty || "Easy"}
          </Badge>
          <Badge
            className={`${getCategoryColor(recipe.category || "Main Course")} cursor-pointer transition-colors`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCategoryClick?.(recipe.category)
            }}
          >
            {recipe.category || "Main Course"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <Link href={`/recipe/${recipe.id}`} className="block group-hover:text-orange-600 transition-colors">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{recipe.title || "Untitled Recipe"}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description || "No description available"}</p>
        </Link>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings || 1}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-orange-600">
            <ChefHat className="h-4 w-4" />
            <span className="font-medium">Recipe</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
