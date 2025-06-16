"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Search, Star, ArrowUp, ArrowDown } from "lucide-react"
import { showToast } from "@/components/toast"

interface DatabaseRecipe {
  id: number
  title: string
  description: string
  image_url: string
  prep_time: number
  cook_time: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  ingredients: string[]
  instructions: string[]
  created_at: string
  updated_at: string
}

interface FeaturedRecipe {
  id: number
  recipe_id: number
  position: number
  is_active: boolean
  recipe?: DatabaseRecipe
}

export function FeaturedRecipesManager() {
  const [featuredRecipes, setFeaturedRecipes] = useState<FeaturedRecipe[]>([])
  const [allRecipes, setAllRecipes] = useState<DatabaseRecipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [featuredResponse, allResponse] = await Promise.all([fetch("/api/featured-recipes"), fetch("/api/recipes")])

      if (featuredResponse.ok) {
        const featured = await featuredResponse.json()
        setFeaturedRecipes(featured)
      }

      if (allResponse.ok) {
        const all = await allResponse.json()
        setAllRecipes(all)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load recipes",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFeatured = async (recipeId: number) => {
    try {
      const response = await fetch("/api/featured-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", recipeId }),
      })

      if (response.ok) {
        await loadData()
        showToast({
          type: "success",
          title: "Success!",
          message: "Recipe added to featured list",
        })
      } else {
        throw new Error("Failed to add recipe")
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to add recipe to featured list",
      })
    }
  }

  const handleRemoveFeatured = async (recipeId: number) => {
    try {
      const response = await fetch("/api/featured-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", recipeId }),
      })

      if (response.ok) {
        await loadData()
        showToast({
          type: "success",
          title: "Success!",
          message: "Recipe removed from featured list",
        })
      } else {
        throw new Error("Failed to remove recipe")
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to remove recipe from featured list",
      })
    }
  }

  const handleMoveUp = async (id: number, currentPosition: number) => {
    if (currentPosition <= 0) return

    try {
      const response = await fetch("/api/featured-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updatePosition", id, position: currentPosition - 1 }),
      })

      if (response.ok) {
        await loadData()
        showToast({
          type: "success",
          title: "Success!",
          message: "Recipe position updated",
        })
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to update recipe position",
      })
    }
  }

  const handleMoveDown = async (id: number, currentPosition: number) => {
    try {
      const response = await fetch("/api/featured-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updatePosition", id, position: currentPosition + 1 }),
      })

      if (response.ok) {
        await loadData()
        showToast({
          type: "success",
          title: "Success!",
          message: "Recipe position updated",
        })
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to update recipe position",
      })
    }
  }

  const filteredRecipes = allRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const featuredRecipeIds = new Set(featuredRecipes.map((f) => f.recipe_id))
  const availableRecipes = filteredRecipes.filter((recipe) => !featuredRecipeIds.has(recipe.id))

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading recipes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Featured Recipes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Featured Recipes on Home Page</span>
            <Badge variant="secondary">{featuredRecipes.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featuredRecipes.length > 0 ? (
            <div className="space-y-3">
              {featuredRecipes.map((featured, index) => (
                <div key={featured.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <h4 className="font-medium">{featured.recipe?.title}</h4>
                      <p className="text-sm text-gray-600">{featured.recipe?.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(featured.id, featured.position)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(featured.id, featured.position)}
                      disabled={index === featuredRecipes.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeatured(featured.recipe_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No featured recipes yet</p>
              <p className="text-sm">Add some recipes below to feature them on the home page</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Featured Recipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-green-600" />
            <span>Add Recipe to Featured List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search recipes to add..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {availableRecipes.length > 0 ? (
                availableRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium">{recipe.title}</h4>
                      <p className="text-sm text-gray-600">
                        {recipe.category} • {recipe.difficulty}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddFeatured(recipe.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm ? "No recipes found matching your search" : "All recipes are already featured"}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
