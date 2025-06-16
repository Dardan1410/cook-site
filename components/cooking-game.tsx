"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { gameRecipes, allIngredients, type GameRecipe } from "@/lib/game-recipes"
import { ChefHat, Clock, Trophy, RotateCcw, Zap, Filter, Shuffle, Target } from "lucide-react"

type GameMode = "random" | "difficulty" | "specific"
type Difficulty = "Easy" | "Medium" | "Hard" | "All"

export function CookingGame() {
  const [gameMode, setGameMode] = useState<GameMode>("random")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("All")
  const [selectedRecipe, setSelectedRecipe] = useState<string>("")
  const [currentRecipe, setCurrentRecipe] = useState<GameRecipe | null>(null)
  const [guessedIngredients, setGuessedIngredients] = useState<string[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [recipesCompleted, setRecipesCompleted] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && gameActive) {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameActive])

  const getFilteredRecipes = (): GameRecipe[] => {
    if (selectedDifficulty === "All") {
      return gameRecipes
    }
    return gameRecipes.filter((recipe) => recipe.difficulty === selectedDifficulty)
  }

  const startGame = () => {
    setGameActive(true)
    setGameCompleted(false)
    setScore(0)
    setStreak(0)
    setRecipesCompleted(0)
    setTimeLeft(60) // Increased time for more recipes
    startNewRound()
  }

  const startNewRound = () => {
    let recipe: GameRecipe

    if (gameMode === "specific" && selectedRecipe) {
      recipe = gameRecipes.find((r) => r.name === selectedRecipe) || gameRecipes[0]
    } else if (gameMode === "difficulty") {
      const filteredRecipes = getFilteredRecipes()
      recipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)]
    } else {
      // Random mode
      recipe = gameRecipes[Math.floor(Math.random() * gameRecipes.length)]
    }

    setCurrentRecipe(recipe)
    setGuessedIngredients([])

    // Create a mix of correct and incorrect ingredients
    const correctIngredients = recipe.ingredients
    const incorrectIngredients = allIngredients
      .filter((ing) => !correctIngredients.includes(ing))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(8, 15 - correctIngredients.length)) // Adjust based on correct ingredients

    const mixed = [...correctIngredients, ...incorrectIngredients].sort(() => Math.random() - 0.5)

    setAvailableIngredients(mixed)
  }

  const selectIngredient = (ingredient: string) => {
    if (!currentRecipe || guessedIngredients.includes(ingredient)) return

    const newGuessed = [...guessedIngredients, ingredient]
    setGuessedIngredients(newGuessed)

    if (currentRecipe.ingredients.includes(ingredient)) {
      // Correct ingredient
      const basePoints = currentRecipe.difficulty === "Hard" ? 15 : currentRecipe.difficulty === "Medium" ? 10 : 5
      const streakBonus = streak * 2
      const timeBonus = timeLeft > 45 ? 5 : timeLeft > 30 ? 3 : 1
      const totalPoints = basePoints + streakBonus + timeBonus

      setScore((prev) => prev + totalPoints)
      setStreak((prev) => prev + 1)

      // Check if recipe is complete
      if (
        newGuessed.filter((ing) => currentRecipe.ingredients.includes(ing)).length === currentRecipe.ingredients.length
      ) {
        // Recipe completed!
        const completionBonus = Math.floor(timeLeft / 2) * 10
        setScore((prev) => prev + completionBonus)
        setRecipesCompleted((prev) => prev + 1)

        setTimeout(() => {
          if (timeLeft > 10) {
            startNewRound()
          }
        }, 1500)
      }
    } else {
      // Wrong ingredient
      setStreak(0)
      setTimeLeft((prev) => Math.max(0, prev - 5)) // Increased penalty: lose 5 seconds
    }
  }

  const endGame = () => {
    setGameActive(false)
    setGameCompleted(true)
  }

  const resetGame = () => {
    setGameActive(false)
    setGameCompleted(false)
    setCurrentRecipe(null)
    setGuessedIngredients([])
    setAvailableIngredients([])
    setScore(0)
    setTimeLeft(60)
    setStreak(0)
    setRecipesCompleted(0)
  }

  const getScoreRating = (score: number) => {
    if (score >= 500) return { text: "Legendary Chef! 👑", color: "text-yellow-600" }
    if (score >= 400) return { text: "Master Chef! 👨‍🍳", color: "text-yellow-600" }
    if (score >= 300) return { text: "Expert Cook! 🌟", color: "text-green-600" }
    if (score >= 200) return { text: "Skilled Chef! 👍", color: "text-blue-600" }
    if (score >= 100) return { text: "Good Cook! 🥄", color: "text-purple-600" }
    if (score >= 50) return { text: "Kitchen Helper! 📚", color: "text-gray-600" }
    return { text: "Keep Practicing! 📖", color: "text-gray-600" }
  }

  if (!gameActive && !gameCompleted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <span>Recipe Master Challenge</span>
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Test your cooking knowledge with over 100 recipes! Choose your game mode and difficulty.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Mode Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Game Mode</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer transition-all ${gameMode === "random" ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50"}`}
                onClick={() => setGameMode("random")}
              >
                <CardContent className="p-4 text-center">
                  <Shuffle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-medium">Random Mode</h3>
                  <p className="text-sm text-gray-600">Random recipes from all difficulties</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${gameMode === "difficulty" ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50"}`}
                onClick={() => setGameMode("difficulty")}
              >
                <CardContent className="p-4 text-center">
                  <Filter className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-medium">Difficulty Mode</h3>
                  <p className="text-sm text-gray-600">Choose your preferred difficulty</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${gameMode === "specific" ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50"}`}
                onClick={() => setGameMode("specific")}
              >
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-medium">Specific Recipe</h3>
                  <p className="text-sm text-gray-600">Practice with a specific recipe</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Difficulty Selection for Difficulty Mode */}
          {gameMode === "difficulty" && (
            <div className="space-y-2">
              <Label htmlFor="difficulty">Select Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={(value: Difficulty) => setSelectedDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Difficulties</SelectItem>
                  <SelectItem value="Easy">
                    Easy ({gameRecipes.filter((r) => r.difficulty === "Easy").length} recipes)
                  </SelectItem>
                  <SelectItem value="Medium">
                    Medium ({gameRecipes.filter((r) => r.difficulty === "Medium").length} recipes)
                  </SelectItem>
                  <SelectItem value="Hard">
                    Hard ({gameRecipes.filter((r) => r.difficulty === "Hard").length} recipes)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Recipe Selection for Specific Mode */}
          {gameMode === "specific" && (
            <div className="space-y-2">
              <Label htmlFor="recipe">Select Recipe</Label>
              <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a recipe" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {gameRecipes.map((recipe) => (
                    <SelectItem key={recipe.name} value={recipe.name}>
                      {recipe.name} ({recipe.difficulty}) - {recipe.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Scoring Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="font-medium text-green-800">Easy Recipes</div>
              <div className="text-green-600">5 points per ingredient</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="font-medium text-yellow-800">Medium Recipes</div>
              <div className="text-yellow-600">10 points per ingredient</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="font-medium text-red-800">Hard Recipes</div>
              <div className="text-red-600">15 points per ingredient</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              • <strong>Streak bonus:</strong> +2 points per consecutive correct answer
            </p>
            <p>
              • <strong>Time bonus:</strong> +1-5 points based on remaining time
            </p>
            <p>
              • <strong>Completion bonus:</strong> Remaining seconds × 10 points
            </p>
            <p>
              • <strong>Wrong answers:</strong> Lose 5 seconds!
            </p>
            <p>
              • <strong>Total recipes:</strong> {gameRecipes.length} available
            </p>
          </div>

          <Button
            onClick={startGame}
            size="lg"
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={gameMode === "specific" && !selectedRecipe}
          >
            <ChefHat className="h-5 w-5 mr-2" />
            Start Cooking Challenge
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameCompleted) {
    const rating = getScoreRating(score)
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <span>Game Complete!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-orange-600">{score} Points</div>
            <div className={`text-xl font-medium ${rating.color}`}>{rating.text}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium">Final Score</div>
              <div className="text-2xl font-bold text-orange-600">{score}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium">Recipes Completed</div>
              <div className="text-2xl font-bold text-green-600">{recipesCompleted}</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Game Mode:</strong>{" "}
              {gameMode === "random"
                ? "Random"
                : gameMode === "difficulty"
                  ? `Difficulty (${selectedDifficulty})`
                  : `Specific (${selectedRecipe})`}
            </p>
            <p>
              <strong>Best Streak:</strong> {streak} consecutive correct answers
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={startGame} className="bg-orange-600 hover:bg-orange-700">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={resetGame} variant="outline">
              Change Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentRecipe) return null

  const correctGuesses = guessedIngredients.filter((ing) => currentRecipe.ingredients.includes(ing))
  const progress = (correctGuesses.length / currentRecipe.ingredients.length) * 100

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-orange-600" />
            <span>{currentRecipe.name}</span>
            <Badge
              variant={
                currentRecipe.difficulty === "Hard"
                  ? "destructive"
                  : currentRecipe.difficulty === "Medium"
                    ? "default"
                    : "secondary"
              }
            >
              {currentRecipe.difficulty}
            </Badge>
            <Badge variant="outline">{currentRecipe.category}</Badge>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className={timeLeft <= 15 ? "text-red-600 font-bold" : ""}>{timeLeft}s</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>{score}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-600 font-bold">{streak}</span>
              </div>
            )}
            <div className="text-xs text-gray-500">Recipes: {recipesCompleted}</div>
          </div>
        </div>
        <Progress value={progress} className="mt-2" />
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Find {currentRecipe.ingredients.length} ingredients ({correctGuesses.length} found)
          </span>
          <span>{currentRecipe.description}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Select ingredients:</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {availableIngredients.map((ingredient) => {
                const isGuessed = guessedIngredients.includes(ingredient)
                const isCorrect = currentRecipe.ingredients.includes(ingredient)
                const isWrong = isGuessed && !isCorrect

                return (
                  <Button
                    key={ingredient}
                    variant={isGuessed ? (isCorrect ? "default" : "destructive") : "outline"}
                    size="sm"
                    onClick={() => selectIngredient(ingredient)}
                    disabled={isGuessed}
                    className={`text-xs ${isCorrect && isGuessed ? "bg-green-600 hover:bg-green-700" : ""}`}
                  >
                    {ingredient}
                  </Button>
                )
              })}
            </div>
          </div>

          {correctGuesses.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-green-600">Correct ingredients:</h4>
              <div className="flex flex-wrap gap-1">
                {correctGuesses.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="bg-green-100 text-green-800">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Recipe Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Cook Time:</span>
                <div>{currentRecipe.cookTime} min</div>
              </div>
              <div>
                <span className="font-medium">Category:</span>
                <div>{currentRecipe.category}</div>
              </div>
              <div>
                <span className="font-medium">Difficulty:</span>
                <div>{currentRecipe.difficulty}</div>
              </div>
              <div>
                <span className="font-medium">Mode:</span>
                <div className="capitalize">{gameMode}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
