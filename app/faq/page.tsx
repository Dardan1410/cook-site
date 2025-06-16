import { BackgroundWrapper } from "@/components/background-wrapper"
import { getPageContent } from "@/lib/database"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

async function getFAQContent() {
  try {
    const content = await getPageContent("faq")
    const contentMap: Record<string, string> = {}
    content.forEach((item) => {
      contentMap[item.content_key] = item.content_text
    })
    return contentMap
  } catch (error) {
    return {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about our recipes and website",
      q1: "How do I save my favorite recipes?",
      a1: "You can bookmark recipes by clicking the heart icon on any recipe card. Your favorites will be saved in your browser.",
      q2: "Can I submit my own recipes?",
      a2: "Currently, recipe submissions are managed through our admin panel. Contact us if you'd like to contribute recipes.",
      q3: "Are the recipes tested?",
      a3: "Yes! Every recipe on our site is thoroughly tested by our team to ensure the best results.",
      q4: "Can I adjust serving sizes?",
      a4: "Many of our recipes include serving size information that you can use to scale ingredients up or down as needed.",
      q5: "Do you have dietary restriction filters?",
      a5: "Yes, you can filter recipes by difficulty, cooking time, and ingredients to find recipes that match your dietary needs.",
    }
  }
}

export default async function FAQPage() {
  const content = await getFAQContent()

  const faqs = [
    { question: content.q1, answer: content.a1 },
    { question: content.q2, answer: content.a2 },
    { question: content.q3, answer: content.a3 },
    { question: content.q4, answer: content.a4 },
    { question: content.q5, answer: content.a5 },
  ]

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <HelpCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{content.subtitle}</p>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundWrapper>
  )
}
