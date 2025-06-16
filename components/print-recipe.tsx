"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { Recipe } from "@/lib/types"

interface PrintRecipeProps {
  recipe: Recipe
  className?: string
}

export function PrintRecipe({ recipe, className = "" }: PrintRecipeProps) {
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recipe.title} - Recipe</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .recipe-title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
            }
            .recipe-meta {
              display: flex;
              justify-content: space-around;
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .meta-item {
              text-align: center;
            }
            .meta-label {
              font-weight: bold;
              color: #666;
              font-size: 12px;
              text-transform: uppercase;
            }
            .meta-value {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .ingredients-list {
              list-style: none;
              padding: 0;
            }
            .ingredients-list li {
              padding: 8px 0;
              border-bottom: 1px dotted #ccc;
              position: relative;
              padding-left: 25px;
            }
            .ingredients-list li:before {
              content: "☐";
              position: absolute;
              left: 0;
              font-size: 16px;
              color: #666;
            }
            .instructions-list {
              list-style: none;
              padding: 0;
              counter-reset: step-counter;
            }
            .instructions-list li {
              counter-increment: step-counter;
              margin-bottom: 15px;
              padding-left: 40px;
              position: relative;
            }
            .instructions-list li:before {
              content: counter(step-counter);
              position: absolute;
              left: 0;
              top: 0;
              background-color: #333;
              color: white;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="recipe-title">${recipe.title}</div>
            <div style="color: #666; font-style: italic;">${recipe.description}</div>
          </div>
          
          <div class="recipe-meta">
            <div class="meta-item">
              <div class="meta-label">Prep Time</div>
              <div class="meta-value">${recipe.prepTime} min</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Cook Time</div>
              <div class="meta-value">${recipe.cookTime} min</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Total Time</div>
              <div class="meta-value">${recipe.prepTime + recipe.cookTime} min</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Servings</div>
              <div class="meta-value">${recipe.servings}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Ingredients</div>
            <ul class="ingredients-list">
              ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Instructions</div>
            <ol class="instructions-list">
              ${recipe.instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
            </ol>
          </div>

          <div class="footer">
            <p>Recipe from Delicious Recipes</p>
            <p>Printed on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <Button onClick={handlePrint} variant="outline" className={className}>
      <Printer className="h-4 w-4 mr-2" />
      Print Recipe
    </Button>
  )
}
