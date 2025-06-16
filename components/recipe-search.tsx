"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Clock, Users, X, Filter } from "lucide-react"
import { getRecipes } from "@/lib/recipes"
import type { Recipe } from "@/lib/types"

interface RecipeSearchProps {
  className?: string
  onFilterClick?: () => void
}

export function RecipeSearch({ className = "", onFilterClick }: RecipeSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Recipe[]>([])
  const [showResults, setShowResults] = useState(false)
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setAllRecipes(getRecipes())

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Check for secret admin access phrase
    if (searchTerm.toLowerCase() === "ilovecookingbecauseilovecooking") {
      router.push("/admin/login")
      return
    }

    if (searchTerm.trim() === "") {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const filtered = allRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setSearchResults(filtered)
    setShowResults(true)
  }, [searchTerm, allRecipes, router])

  const handleClearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
    setShowResults(false)
  }

  const handleResultClick = () => {
    setShowResults(false)
    setSearchTerm("")
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={isMobile ? "Search recipes..." : "Search recipes by name, ingredient, or category..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter button for mobile */}
        {isMobile && onFilterClick && (
          <Button variant="outline" size="sm" onClick={onFilterClick}>
            <Filter className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <div
          className={`absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-lg shadow-lg ${
            isMobile ? "max-h-[70vh]" : "max-h-96"
          } overflow-y-auto`}
        >
          {searchResults.length > 0 ? (
            <div className="p-2">
              <div className="text-sm text-gray-600 px-2 py-1 border-b">
                {searchResults.length} recipe{searchResults.length !== 1 ? "s" : ""} found
              </div>
              {searchResults.map((recipe) => (
                <Link key={recipe.id} href={`/recipe/${recipe.id}`} onClick={handleResultClick}>
                  <Card className="m-1 hover:bg-gray-50 transition-colors cursor-pointer">
                    <CardContent className={`${isMobile ? "p-2" : "p-3"}`}>
                      <div className="flex items-start space-x-3">
                        <img
                          src={recipe.image || "/placeholder.svg"}
                          alt={recipe.title}
                          className={`${isMobile ? "w-12 h-12" : "w-16 h-16"} object-cover rounded`}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium ${isMobile ? "text-xs" : "text-sm"} line-clamp-1`}>
                            {recipe.title}
                          </h3>
                          <p className={`${isMobile ? "text-xs" : "text-xs"} text-gray-600 line-clamp-2 mt-1`}>
                            {recipe.description}
                          </p>
                          <div
                            className={`flex items-center space-x-2 mt-2 ${isMobile ? "text-xs" : "text-xs"} text-gray-500`}
                          >
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{recipe.prepTime + recipe.cookTime}m</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{recipe.servings}</span>
                            </div>
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {recipe.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {recipe.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className={isMobile ? "text-sm" : ""}>No recipes found for "{searchTerm}"</p>
              <p className={`${isMobile ? "text-xs" : "text-xs"} mt-1`}>
                Try searching by recipe name, ingredient, or category
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
