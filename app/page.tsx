import { Suspense } from "react"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeSearch } from "@/components/recipe-search"
import { CookingGame } from "@/components/cooking-game"
import { BackgroundWrapper } from "@/components/background-wrapper"
import { LanguageSelector } from "@/components/language-selector"
import { getFeaturedRecipes, getPageContent } from "@/lib/database"
import { allCompleteRecipes } from "@/lib/complete-recipes"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, Utensils } from "lucide-react"

// Function to get daily shuffled recipes as fallback
function getDailyShuffledRecipes(count = 6) {
  const today = new Date().toDateString()
  let seed = today.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const shuffled = [...allCompleteRecipes].sort(() => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x) - 0.5
  })

  return shuffled.slice(0, count)
}

async function getPageContentSafe(pageName: string) {
  try {
    const content = await getPageContent(pageName)
    const contentMap: Record<string, Record<string, string>> = {}

    content.forEach((item) => {
      if (!contentMap[item.section_name]) {
        contentMap[item.section_name] = {}
      }
      contentMap[item.section_name][item.content_key] = item.content_text
    })

    return contentMap
  } catch (error) {
    console.error("Error loading page content:", error)
    return {
      hero: {
        title: "Discover Amazing Recipes",
        subtitle: "From quick weeknight dinners to special occasion treats",
      },
      featured: {
        title: "Featured Recipes",
        subtitle: "Hand-picked recipes that change daily",
      },
      game: {
        title: "Test Your Cooking Knowledge!",
        subtitle: "Challenge yourself with our fun recipe guessing game",
      },
    }
  }
}

async function getFeaturedRecipesSafe() {
  try {
    const featured = await getFeaturedRecipes()
    if (featured.length > 0) {
      return featured.map((f) => f.recipe).filter(Boolean)
    }
    return getDailyShuffledRecipes(6)
  } catch (error) {
    console.error("Error loading featured recipes:", error)
    return getDailyShuffledRecipes(6)
  }
}

export default async function HomePage() {
  const [pageContent, featuredRecipes] = await Promise.all([getPageContentSafe("home"), getFeaturedRecipesSafe()])

  return (
    <BackgroundWrapper>
      <div className="min-h-screen">
        {/* Language Selector - Fixed position */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector />
        </div>

        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-100 p-4 rounded-full">
                <ChefHat className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {pageContent.hero?.title || "Discover Amazing Recipes"}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {pageContent.hero?.subtitle || "From quick weeknight dinners to special occasion treats"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/recipes">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                  <Utensils className="mr-2 h-5 w-5" />
                  Browse All Recipes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Search Section - Moved above Featured Recipes */}
        <section className="py-16 px-4 bg-white/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Recipe</h2>
              <p className="text-lg text-gray-600">Search through our collection of delicious recipes</p>
            </div>
            <Suspense fallback={<div className="text-center">Loading search...</div>}>
              <RecipeSearch />
            </Suspense>
          </div>
        </section>

        {/* Featured Recipes Section */}
        <section className="py-16 px-4 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {pageContent.featured?.title || "Featured Recipes"}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {pageContent.featured?.subtitle || "Hand-picked recipes that change daily"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredRecipes.slice(0, 6).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/recipes">
                <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  View All {allCompleteRecipes.length} Recipes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Cooking Game Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {pageContent.game?.title || "Test Your Cooking Knowledge!"}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {pageContent.game?.subtitle || "Challenge yourself with our fun recipe guessing game"}
            </p>
            <Suspense fallback={<div className="text-center">Loading game...</div>}>
              <CookingGame />
            </Suspense>
          </div>
        </section>

        {/* Navigation Links */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                  About Us
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                  FAQ
                </Button>
              </Link>
              <Link href="/disclaimer">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                  Disclaimer
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </BackgroundWrapper>
  )
}
