import { BackgroundWrapper } from "@/components/background-wrapper"
import { getPageContent } from "@/lib/database"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Heart, Award } from "lucide-react"

async function getAboutContent() {
  try {
    const content = await getPageContent("about")
    const contentMap: Record<string, string> = {}
    content.forEach((item) => {
      contentMap[item.content_key] = item.content_text
    })
    return contentMap
  } catch (error) {
    return {
      title: "About Our Culinary Journey",
      subtitle: "Passionate about bringing delicious recipes to your kitchen",
      story:
        "We started this journey with a simple mission: to make cooking accessible, enjoyable, and delicious for everyone. Our team of passionate food enthusiasts curates recipes from around the world, ensuring each one is tested and perfected before sharing with you.",
      mission:
        "Our mission is to inspire home cooks of all skill levels to create amazing meals that bring families and friends together around the dinner table.",
      team_title: "Our Team",
      team_description:
        "A diverse group of chefs, food writers, and cooking enthusiasts dedicated to sharing our love of food.",
    }
  }
}

export default async function AboutPage() {
  const content = await getAboutContent()

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{content.subtitle}</p>
          </div>

          {/* Story Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-2xl font-semibold">Our Story</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{content.story}</p>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-2xl font-semibold">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{content.mission}</p>
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-2xl font-semibold">{content.team_title}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{content.team_description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundWrapper>
  )
}
