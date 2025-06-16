"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, ArrowLeft } from "lucide-react"
import { BackgroundWrapper } from "@/components/background-wrapper"
import { InstagramFeed } from "@/components/instagram-feed"

export default function InstagramPage() {
  return (
    <BackgroundWrapper className="min-h-screen">
      <div>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-6">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <ChefHat className="h-6 w-6 text-orange-600" />
                <span className="text-lg font-semibold text-gray-900">Delicious Recipes</span>
              </div>
            </div>
          </div>
        </header>

        {/* Instagram Feed */}
        <InstagramFeed showTitle={true} />
      </div>
    </BackgroundWrapper>
  )
}
