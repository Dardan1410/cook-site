"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { Recipe } from "@/lib/types"
import { getRecipeById, updateRecipe } from "@/lib/recipes"
import { isAuthenticated } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SimpleImageUpload } from "@/components/simple-image-upload"
import { ChefHat, ArrowLeft, Plus, X } from "lucide-react"
import { BackgroundWrapper } from "@/components/background-wrapper"

export default function EditRecipe() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "/placeholder.svg?height=300&width=400",
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy" as Recipe["difficulty"],
    category: "",
    ingredients: [""],
    instructions: [""],
    story: "",
  })
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
      return
    }

    if (params.id) {
      const foundRecipe = getRecipeById(params.id as string)
      if (foundRecipe) {
        setRecipe(foundRecipe)
        setFormData({
          title: foundRecipe.title,
          description: foundRecipe.description,
          image: foundRecipe.image,
          prepTime: foundRecipe.prepTime,
          cookTime: foundRecipe.cookTime,
          servings: foundRecipe.servings,
          difficulty: foundRecipe.difficulty,
          category: foundRecipe.category,
          ingredients: foundRecipe.ingredients,
          instructions: foundRecipe.instructions,
          story: foundRecipe.story || "",
        })
      }
    }
    setIsLoading(false)
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipe) return

    setIsSaving(true)

    // Filter out empty ingredients and instructions
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter((item) => item.trim() !== ""),
      instructions: formData.instructions.filter((item) => item.trim() !== ""),
    }

    try {
      updateRecipe(recipe.id, cleanedData)
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error updating recipe:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }))
  }

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((item, i) => (i === index ? value : item)),
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <Link href="/admin/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <BackgroundWrapper className="min-h-screen">
      <div className="">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-6">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <ChefHat className="h-6 w-6 text-orange-600" />
                <span className="text-lg font-semibold text-gray-900">Edit Recipe</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Edit "{recipe.title}"</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Recipe Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="story">Personal Story (Optional)</Label>
                  <Textarea
                    id="story"
                    value={formData.story}
                    onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
                    placeholder="Share a personal story about this recipe - where you learned it, special memories, or why it's meaningful to you..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will appear in a separate "Story" tab on the recipe page
                  </p>
                </div>

                <SimpleImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  label="Recipe Image"
                />

                {/* Recipe Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="prepTime">Prep Time (min)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={formData.prepTime}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, prepTime: Number.parseInt(e.target.value) || 0 }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cookTime">Cook Time (min)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      value={formData.cookTime}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, cookTime: Number.parseInt(e.target.value) || 0 }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={formData.servings}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, servings: Number.parseInt(e.target.value) || 1 }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: Recipe["difficulty"]) =>
                        setFormData((prev) => ({ ...prev, difficulty: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Ingredients</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={ingredient}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                          placeholder="Enter ingredient"
                        />
                        {formData.ingredients.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeIngredient(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Instructions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-2 flex-shrink-0">
                          {index + 1}
                        </span>
                        <Textarea
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          placeholder="Enter instruction step"
                          className="flex-1"
                        />
                        {formData.instructions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInstruction(index)}
                            className="mt-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end space-x-4">
                  <Link href="/admin/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Update Recipe"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundWrapper>
  )
}
