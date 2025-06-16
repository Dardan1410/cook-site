"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Recipe } from "@/lib/types"
import { getRecipes } from "@/lib/recipes"
import { Button } from "@/components/ui/button"
import { ChefHat, ArrowLeft, TrendingUp } from "lucide-react"
import { BackgroundWrapper } from "@/components/background-wrapper"
import { RecipeSearch } from "@/components/recipe-search"
import { RecipeFilters } from "@/components/recipe-filters"
import { RecipeCard } from "@/components/recipe-card"
import { ToastContainer } from "@/components/toast"

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRecipes = () => {
      console.log("Loading all recipes...")
      const allRecipes = getRecipes()
      console.log("Loaded recipes count:", allRecipes.length)
      setRecipes(allRecipes)
      setFilteredRecipes(allRecipes)
      setIsLoading(false)
    }

    loadRecipes()

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleCategoryFilter = (category: string) => {
    console.log("Filter by category:", category)
  }

  const handleDifficultyFilter = (difficulty: string) => {
    console.log("Filter by difficulty:", difficulty)
  }

  const handleFilterToggle = () => {
    setShowFilters(!showFilters)
  }

  const handleFiltersChange = (filtered: Recipe[]) => {
    console.log("Filters changed, new count:", filtered.length)
    setFilteredRecipes(filtered)
  }

  if (isLoading) {
    return (
      <BackgroundWrapper className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ChefHat className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading all recipes...</p>
          </div>
        </div>
      </BackgroundWrapper>
    )
  }

  return (
    <BackgroundWrapper className="min-h-screen">
      <div>
        <ToastContainer />

        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-600">Back to Home</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <ChefHat className="h-8 w-8 text-orange-600" />
                  <h1 className="text-2xl font-bold text-gray-900">All Recipes</h1>
                </div>
              </div>

              {/* Search Bar */}
              <div className={`${isMobile ? "flex-1 ml-4" : "flex-1 max-w-md mx-8"}`}>
                <RecipeSearch onFilterClick={isMobile ? handleFilterToggle : undefined} />
              </div>

              {/* Desktop Filter Toggle */}
              {!isMobile && (
                <Button variant="outline" onClick={handleFilterToggle} className="relative">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">All Our Delicious Recipes</h2>
            <p className="text-xl text-gray-600 mb-6">Browse through our complete collection of recipes</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="font-medium">{recipes.length}</span> total recipes
              </div>
              <div className="flex items-center space-x-2">
                <ChefHat className="h-4 w-4 text-orange-600" />
                <span className="font-medium">{filteredRecipes.length}</span> showing
              </div>
            </div>
          </div>
        </section>

        {/* Recipes Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Browse Recipes</h3>
              {/* Mobile Filters */}
              {isMobile && <RecipeFilters onFiltersChange={handleFiltersChange} isMobile={true} />}
            </div>

            <div className={`${showFilters && !isMobile ? "grid grid-cols-1 lg:grid-cols-4 gap-8" : ""}`}>
              {/* Desktop Filters Sidebar */}
              {showFilters && !isMobile && (
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <RecipeFilters onFiltersChange={handleFiltersChange} isMobile={false} />
                  </div>
                </div>
              )}

              {/* Recipes Grid */}
              <div className={`${showFilters && !isMobile ? "lg:col-span-3" : ""}`}>
                {filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onCategoryClick={handleCategoryFilter}
                        onDifficultyClick={handleDifficultyFilter}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search terms</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 Delicious Recipes. Made with ❤️ for food lovers.</p>
            </div>
          </div>
        </footer>
      </div>
    </BackgroundWrapper>
  )
}
