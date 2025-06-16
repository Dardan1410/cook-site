"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isAuthenticated, logout } from "@/lib/auth"
import { BackgroundWrapper } from "@/components/background-wrapper"
import { BackgroundSettingsComponent } from "@/components/background-settings"
import { InstagramSettingsComponent } from "@/components/instagram-settings"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, ArrowLeft, LogOut, Eye, Palette, Instagram } from "lucide-react"
import { FeaturedRecipesManager } from "@/components/featured-recipes-manager"
import { PageContentEditor } from "@/components/page-content-editor"
import { Star, Edit } from "lucide-react"

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
      return
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <BackgroundWrapper className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-spin" />
          <p>Loading...</p>
        </div>
      </BackgroundWrapper>
    )
  }

  return (
    <BackgroundWrapper className="min-h-screen">
      <div>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Site
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="background" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="background" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Background</span>
              </TabsTrigger>
              <TabsTrigger value="instagram" className="flex items-center space-x-2">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Featured</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Page Text</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="background">
              <BackgroundSettingsComponent />
            </TabsContent>

            <TabsContent value="instagram">
              <InstagramSettingsComponent />
            </TabsContent>

            <TabsContent value="featured">
              <FeaturedRecipesManager />
            </TabsContent>

            <TabsContent value="content">
              <PageContentEditor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BackgroundWrapper>
  )
}
