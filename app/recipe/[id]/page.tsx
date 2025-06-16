"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { Recipe } from "@/lib/types"
import { getRecipeById } from "@/lib/recipes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, ChefHat, ArrowLeft, BookOpen } from "lucide-react"
import { BackgroundWrapper } from "@/components/background-wrapper"
import { IngredientChecklist } from "@/components/ingredient-checklist"
import { PrintRecipe } from "@/components/print-recipe"

export default function RecipePage() {
  const params = useParams()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    if (params.id) {
      const foundRecipe = getRecipeById(params.id as string)
      setRecipe(foundRecipe)
    }
  }, [params.id])

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
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
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Recipes
                  </Button>
                </Link>
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <ChefHat className="h-6 w-6 text-orange-600" />
                  <span className="text-lg font-semibold text-gray-900">Delicious Recipes</span>
                </Link>
              </div>
              <PrintRecipe recipe={recipe} />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Recipe Header */}
          <div className="mb-8">
            <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
              <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge variant="secondary">{recipe.difficulty}</Badge>
              <Badge variant="outline">{recipe.category}</Badge>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>

            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium">Prep Time</div>
                <div className="text-sm text-gray-600">{recipe.prepTime} min</div>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium">Cook Time</div>
                <div className="text-sm text-gray-600">{recipe.cookTime} min</div>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium">Servings</div>
                <div className="text-sm text-gray-600">{recipe.servings}</div>
              </div>
            </div>
          </div>

          {/* Recipe Content with Tabs */}
          <Tabs defaultValue="recipe" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recipe">Recipe</TabsTrigger>
              <TabsTrigger value="checklist">Shopping List</TabsTrigger>
              {recipe.story && (
                <TabsTrigger value="story" className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Story</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="recipe">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ingredients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="checklist">
              <IngredientChecklist ingredients={recipe.ingredients} />
            </TabsContent>

            {recipe.story && (
              <TabsContent value="story">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>My Story</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{recipe.story}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </BackgroundWrapper>
  )
}
