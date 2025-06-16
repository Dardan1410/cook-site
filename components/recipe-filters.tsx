"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Filter, X, RotateCcw, Clock, Users, ChefHat, Search, SlidersHorizontal, Package } from "lucide-react"
import { getRecipes } from "@/lib/recipes"
import type { Recipe } from "@/lib/types"

interface RecipeFiltersProps {
  onFiltersChange: (filteredRecipes: Recipe[]) => void
  isMobile?: boolean
  className?: string
}

interface FilterState {
  categories: string[]
  difficulties: string[]
  prepTimeRange: [number, number]
  cookTimeRange: [number, number]
  servingsRange: [number, number]
  sortBy: string
  searchTerm: string
  availableIngredients: string[]
}

const initialFilters: FilterState = {
  categories: [],
  difficulties: [],
  prepTimeRange: [0, 120],
  cookTimeRange: [0, 300],
  servingsRange: [1, 12],
  sortBy: "name",
  searchTerm: "",
  availableIngredients: [],
}

export function RecipeFilters({ onFiltersChange, isMobile = false, className = "" }: RecipeFiltersProps) {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [allIngredients, setAllIngredients] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const getFilteredCategories = () => {
    if (filters.difficulties.length === 0) {
      return [...new Set(allRecipes.map((r) => r.category))].sort()
    }

    const recipesInSelectedDifficulties = allRecipes.filter((recipe) =>
      filters.difficulties.includes(recipe.difficulty),
    )

    return [...new Set(recipesInSelectedDifficulties.map((r) => r.category))].sort()
  }

  useEffect(() => {
    const recipes = getRecipes()
    setAllRecipes(recipes)

    // Get all unique ingredients
    const ingredients = [...new Set(recipes.flatMap((r) => r.ingredients))].sort()
    setAllIngredients(ingredients)
  }, [])

  useEffect(() => {
    const filteredCategories = getFilteredCategories()
    setAvailableCategories(filteredCategories)

    if (filters.categories.length > 0) {
      const validCategories = filters.categories.filter((cat) => filteredCategories.includes(cat))
      if (validCategories.length !== filters.categories.length) {
        setFilters((prev) => ({ ...prev, categories: validCategories }))
        return
      }
    }

    applyFilters()
    updateActiveFiltersCount()
  }, [filters, allRecipes])

  const updateActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.difficulties.length > 0) count++
    if (filters.prepTimeRange[0] !== 0 || filters.prepTimeRange[1] !== 120) count++
    if (filters.cookTimeRange[0] !== 0 || filters.cookTimeRange[1] !== 300) count++
    if (filters.servingsRange[0] !== 1 || filters.servingsRange[1] !== 12) count++
    if (filters.sortBy !== "name") count++
    if (filters.searchTerm.trim() !== "") count++
    if (filters.availableIngredients.length > 0) count++
    setActiveFiltersCount(count)
  }

  const applyFilters = () => {
    let filtered = [...allRecipes]

    // Filter by search term
    if (filters.searchTerm.trim() !== "") {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.description.toLowerCase().includes(searchLower) ||
          recipe.category.toLowerCase().includes(searchLower) ||
          recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchLower)),
      )
    }

    // Filter by available ingredients
    if (filters.availableIngredients.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.ingredients.some((ingredient) =>
          filters.availableIngredients.some((available) => ingredient.toLowerCase().includes(available.toLowerCase())),
        ),
      )
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((recipe) => filters.categories.includes(recipe.category))
    }

    // Filter by difficulties
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((recipe) => filters.difficulties.includes(recipe.difficulty))
    }

    // Filter by prep time
    filtered = filtered.filter(
      (recipe) => recipe.prepTime >= filters.prepTimeRange[0] && recipe.prepTime <= filters.prepTimeRange[1],
    )

    // Filter by cook time
    filtered = filtered.filter(
      (recipe) => recipe.cookTime >= filters.cookTimeRange[0] && recipe.cookTime <= filters.cookTimeRange[1],
    )

    // Filter by servings
    filtered = filtered.filter(
      (recipe) => recipe.servings >= filters.servingsRange[0] && recipe.servings <= filters.servingsRange[1],
    )

    // Sort recipes
    switch (filters.sortBy) {
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "prepTime":
        filtered.sort((a, b) => a.prepTime - b.prepTime)
        break
      case "cookTime":
        filtered.sort((a, b) => a.cookTime - b.cookTime)
        break
      case "totalTime":
        filtered.sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime))
        break
      case "difficulty":
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 }
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        break
      case "servings":
        filtered.sort((a, b) => a.servings - b.servings)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    onFiltersChange(filtered)
  }

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const toggleDifficulty = (difficulty: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulties: prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter((d) => d !== difficulty)
        : [...prev.difficulties, difficulty],
    }))
  }

  const toggleIngredient = (ingredient: string) => {
    setFilters((prev) => ({
      ...prev,
      availableIngredients: prev.availableIngredients.includes(ingredient)
        ? prev.availableIngredients.filter((i) => i !== ingredient)
        : [...prev.availableIngredients, ingredient],
    }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const FilterContent = () => (
    <TooltipProvider>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search Recipes
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ingredient, or description..."
              value={filters.searchTerm}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {filters.searchTerm && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, searchTerm: "" }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Clear search</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <Separator />

        {/* Available Ingredients Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center">
            <Package className="h-4 w-4 mr-2" />
            What do you have? ({filters.availableIngredients.length} selected)
          </Label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {allIngredients.slice(0, 20).map((ingredient) => (
              <Tooltip key={ingredient}>
                <TooltipTrigger asChild>
                  <Badge
                    variant={filters.availableIngredients.includes(ingredient) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      filters.availableIngredients.includes(ingredient)
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "hover:bg-orange-50 hover:border-orange-300"
                    }`}
                    onClick={() => toggleIngredient(ingredient)}
                  >
                    {ingredient}
                    {filters.availableIngredients.includes(ingredient) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {filters.availableIngredients.includes(ingredient)
                    ? `Remove ${ingredient} from your available ingredients`
                    : `Add ${ingredient} to your available ingredients`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Sort By
          </Label>
          <Select value={filters.sortBy} onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="prepTime">Prep Time (Low to High)</SelectItem>
              <SelectItem value="cookTime">Cook Time (Low to High)</SelectItem>
              <SelectItem value="totalTime">Total Time (Low to High)</SelectItem>
              <SelectItem value="difficulty">Difficulty (Easy to Hard)</SelectItem>
              <SelectItem value="servings">Servings (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Difficulties */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center">
            <ChefHat className="h-4 w-4 mr-2" />
            Difficulty Level
          </Label>
          <div className="flex flex-wrap gap-2">
            {["Easy", "Medium", "Hard"].map((difficulty) => (
              <Tooltip key={difficulty}>
                <TooltipTrigger asChild>
                  <Badge
                    variant={filters.difficulties.includes(difficulty) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      filters.difficulties.includes(difficulty)
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : getDifficultyColor(difficulty)
                    }`}
                    onClick={() => toggleDifficulty(difficulty)}
                  >
                    {difficulty}
                    {filters.difficulties.includes(difficulty) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {filters.difficulties.includes(difficulty)
                    ? `Remove ${difficulty} difficulty filter`
                    : `Filter by ${difficulty} difficulty recipes`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            Recipe Categories ({availableCategories.length})
            {filters.difficulties.length > 0 && (
              <span className="text-xs text-gray-500 font-normal ml-1">(filtered by difficulty)</span>
            )}
          </Label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {availableCategories.map((category) => {
              const categoryCount = allRecipes.filter((recipe) => {
                const matchesCategory = recipe.category === category
                const matchesDifficulty =
                  filters.difficulties.length === 0 || filters.difficulties.includes(recipe.difficulty)
                return matchesCategory && matchesDifficulty
              }).length

              return (
                <Tooltip key={category}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={filters.categories.includes(category) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        filters.categories.includes(category)
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "hover:bg-orange-50 hover:border-orange-300"
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category} ({categoryCount})
                      {filters.categories.includes(category) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {filters.categories.includes(category)
                      ? `Remove ${category} category filter`
                      : `Filter by ${category} recipes (${categoryCount} available)`}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Time Filters */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Time Filters
          </Label>

          {/* Prep Time */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Prep Time (minutes)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">Min</Label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={filters.prepTimeRange[0]}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(120, Number.parseInt(e.target.value) || 0))
                    setFilters((prev) => ({
                      ...prev,
                      prepTimeRange: [value, Math.max(value, prev.prepTimeRange[1])] as [number, number],
                    }))
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Max</Label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={filters.prepTimeRange[1]}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(120, Number.parseInt(e.target.value) || 120))
                    setFilters((prev) => ({
                      ...prev,
                      prepTimeRange: [Math.min(prev.prepTimeRange[0], value), value] as [number, number],
                    }))
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="120"
                />
              </div>
            </div>
          </div>

          {/* Cook Time */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Cook Time (minutes)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">Min</Label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={filters.cookTimeRange[0]}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(300, Number.parseInt(e.target.value) || 0))
                    setFilters((prev) => ({
                      ...prev,
                      cookTimeRange: [value, Math.max(value, prev.cookTimeRange[1])] as [number, number],
                    }))
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Max</Label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={filters.cookTimeRange[1]}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(300, Number.parseInt(e.target.value) || 300))
                    setFilters((prev) => ({
                      ...prev,
                      cookTimeRange: [Math.min(prev.cookTimeRange[0], value), value] as [number, number],
                    }))
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="300"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Servings */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center justify-between">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Servings
            </span>
            <span className="text-xs text-gray-500">
              {filters.servingsRange[0]}-{filters.servingsRange[1]} people
            </span>
          </Label>
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="12"
              value={filters.servingsRange[1]}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                setFilters((prev) => ({
                  ...prev,
                  servingsRange: [Math.min(prev.servingsRange[0], value), value] as [number, number],
                }))
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Reset Button - Only show when filters are active */}
        {activeFiltersCount > 0 && (
          <>
            <Separator />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={resetFilters} className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Filters ({activeFiltersCount})
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear all active filters and show all recipes</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open recipe filters</TooltipContent>
          </Tooltip>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] overflow-hidden">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center justify-between">
              <span>Filter Recipes</span>
              <SheetClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-full pb-20">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <FilterContent />
      </CardContent>
    </Card>
  )
}

export default RecipeFilters
