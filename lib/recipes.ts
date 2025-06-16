"use client"

import type { Recipe } from "./types"
import { allCompleteRecipes } from "./complete-recipes"

export function getRecipes(): Recipe[] {
  if (typeof window === "undefined") return allCompleteRecipes
  const stored = localStorage.getItem("recipes")
  return stored ? JSON.parse(stored) : allCompleteRecipes
}

export function saveRecipes(recipes: Recipe[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("recipes", JSON.stringify(recipes))
}

export function addRecipe(recipe: Omit<Recipe, "id" | "createdAt">): Recipe {
  const recipes = getRecipes()
  const newRecipe: Recipe = {
    ...recipe,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  }
  const updatedRecipes = [...recipes, newRecipe]
  saveRecipes(updatedRecipes)
  return newRecipe
}

export function updateRecipe(id: string, recipe: Partial<Recipe>): Recipe | null {
  const recipes = getRecipes()
  const index = recipes.findIndex((r) => r.id === id)
  if (index === -1) return null

  const updatedRecipe = { ...recipes[index], ...recipe }
  recipes[index] = updatedRecipe
  saveRecipes(recipes)
  return updatedRecipe
}

export function deleteRecipe(id: string): boolean {
  const recipes = getRecipes()
  const filteredRecipes = recipes.filter((r) => r.id !== id)
  if (filteredRecipes.length === recipes.length) return false

  saveRecipes(filteredRecipes)
  return true
}

export function getRecipeById(id: string): Recipe | null {
  const recipes = getRecipes()
  return recipes.find((r) => r.id === id) || null
}
