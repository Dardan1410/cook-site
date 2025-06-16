"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { CheckCircle, RotateCcw, ShoppingCart } from "lucide-react"

interface IngredientChecklistProps {
  ingredients: string[]
  className?: string
}

export function IngredientChecklist({ ingredients, className = "" }: IngredientChecklistProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())

  const handleIngredientCheck = (index: number, checked: boolean) => {
    const newChecked = new Set(checkedIngredients)
    if (checked) {
      newChecked.add(index)
    } else {
      newChecked.delete(index)
    }
    setCheckedIngredients(newChecked)
  }

  const handleCheckAll = () => {
    if (checkedIngredients.size === ingredients.length) {
      setCheckedIngredients(new Set())
    } else {
      setCheckedIngredients(new Set(ingredients.map((_, index) => index)))
    }
  }

  const handleReset = () => {
    setCheckedIngredients(new Set())
  }

  const completedCount = checkedIngredients.size
  const totalCount = ingredients.length
  const isAllChecked = completedCount === totalCount

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping List</span>
            <span className="text-sm font-normal text-gray-500">
              ({completedCount}/{totalCount})
            </span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCheckAll}>
              <CheckCircle className="h-4 w-4 mr-1" />
              {isAllChecked ? "Uncheck All" : "Check All"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        {isAllChecked && (
          <div className="text-sm text-green-600 font-medium">🎉 All ingredients ready! You're set to cook!</div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-2 rounded transition-colors ${
                checkedIngredients.has(index) ? "bg-green-50 text-green-800" : "hover:bg-gray-50"
              }`}
            >
              <Checkbox
                id={`ingredient-${index}`}
                checked={checkedIngredients.has(index)}
                onCheckedChange={(checked) => handleIngredientCheck(index, checked as boolean)}
              />
              <label
                htmlFor={`ingredient-${index}`}
                className={`flex-1 cursor-pointer ${checkedIngredients.has(index) ? "line-through" : ""}`}
              >
                {ingredient}
              </label>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
