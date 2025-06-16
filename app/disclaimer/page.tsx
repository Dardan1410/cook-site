import { BackgroundWrapper } from "@/components/background-wrapper"
import { getPageContent } from "@/lib/database"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, Info } from "lucide-react"

async function getDisclaimerContent() {
  try {
    const content = await getPageContent("disclaimer")
    const contentMap: Record<string, string> = {}
    content.forEach((item) => {
      contentMap[item.content_key] = item.content_text
    })
    return contentMap
  } catch (error) {
    return {
      title: "Disclaimer",
      subtitle: "Important information about using our recipes and website",
      general_title: "General Disclaimer",
      general_content:
        "The information provided on this website is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or suitability of the information.",
      recipe_title: "Recipe Disclaimer",
      recipe_content:
        "All recipes are provided as-is and results may vary based on ingredients, equipment, and cooking techniques. Please use your best judgment when preparing recipes and be aware of any food allergies or dietary restrictions.",
      liability_title: "Limitation of Liability",
      liability_content:
        "In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.",
      updates_title: "Updates",
      updates_content:
        "This disclaimer may be updated from time to time. Please check this page regularly for any changes.",
    }
  }
}

export default async function DisclaimerPage() {
  const content = await getDisclaimerContent()

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{content.subtitle}</p>
          </div>

          <div className="space-y-6">
            {/* General Disclaimer */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Info className="h-6 w-6 text-orange-600 mr-2" />
                  <h2 className="text-2xl font-semibold">{content.general_title}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{content.general_content}</p>
              </CardContent>
            </Card>

            {/* Recipe Disclaimer */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
                  <h2 className="text-2xl font-semibold">{content.recipe_title}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{content.recipe_content}</p>
              </CardContent>
            </Card>

            {/* Liability */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600 mr-2" />
                  <h2 className="text-2xl font-semibold">{content.liability_title}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{content.liability_content}</p>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Info className="h-6 w-6 text-orange-600 mr-2" />
                  <h2 className="text-2xl font-semibold">{content.updates_title}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{content.updates_content}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  )
}
