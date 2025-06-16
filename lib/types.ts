export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  ingredients: string[]
  instructions: string[]
  category: string
  createdAt: string
  story?: string
}

export interface User {
  id: string
  email: string
  password: string
  role: "admin"
}
