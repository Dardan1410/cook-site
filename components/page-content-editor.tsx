"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Edit, Home, List } from "lucide-react"
import { showToast } from "@/components/toast"

interface PageContent {
  id: number
  page_name: string
  section_name: string
  content_key: string
  content_text: string
  content_type: string
  updated_at: string
}

export function PageContentEditor() {
  const [homeContent, setHomeContent] = useState<PageContent[]>([])
  const [recipesContent, setRecipesContent] = useState<PageContent[]>([])
  const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const [homeResponse, recipesResponse] = await Promise.all([
        fetch("/api/page-content?page=home"),
        fetch("/api/page-content?page=all-recipes"),
      ])

      if (homeResponse.ok) {
        const home = await homeResponse.json()
        setHomeContent(home)

        // Initialize editing state for home content
        const editing: { [key: string]: string } = {}
        home.forEach((item: PageContent) => {
          editing[`home.${item.section_name}.${item.content_key}`] = item.content_text
        })
        setEditingContent((prev) => ({ ...prev, ...editing }))
      }

      if (recipesResponse.ok) {
        const recipes = await recipesResponse.json()
        setRecipesContent(recipes)

        // Initialize editing state for recipes content
        const editing: { [key: string]: string } = {}
        recipes.forEach((item: PageContent) => {
          editing[`all-recipes.${item.section_name}.${item.content_key}`] = item.content_text
        })
        setEditingContent((prev) => ({ ...prev, ...editing }))
      }
    } catch (error) {
      console.error("Error loading content:", error)
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load page content",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (pageName: string, sectionName: string, contentKey: string) => {
    const key = `${pageName}.${sectionName}.${contentKey}`
    const newText = editingContent[key]

    if (!newText) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageName,
          sectionName,
          contentKey,
          contentText: newText,
        }),
      })

      if (response.ok) {
        await loadContent()
        showToast({
          type: "success",
          title: "Saved!",
          message: "Page content updated successfully",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to save page content",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setEditingContent((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const renderContentSection = (content: PageContent[], pageName: string, pageTitle: string) => {
    const sections = content.reduce(
      (acc, item) => {
        if (!acc[item.section_name]) {
          acc[item.section_name] = []
        }
        acc[item.section_name].push(item)
        return acc
      },
      {} as { [key: string]: PageContent[] },
    )

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{pageTitle}</h3>
          <p className="text-sm text-gray-600">Edit the text content that appears on this page</p>
        </div>

        {Object.entries(sections).map(([sectionName, items]) => (
          <Card key={sectionName}>
            <CardHeader>
              <CardTitle className="capitalize flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>{sectionName} Section</span>
                <Badge variant="outline">{items.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const key = `${pageName}.${item.section_name}.${item.content_key}`
                const isLongText = item.content_text.length > 100

                return (
                  <div key={item.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {item.content_key.replace(/[._]/g, " ")}
                    </label>
                    {isLongText ? (
                      <Textarea
                        value={editingContent[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={`Enter ${item.content_key}...`}
                        rows={3}
                        className="w-full"
                      />
                    ) : (
                      <Input
                        value={editingContent[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={`Enter ${item.content_key}...`}
                        className="w-full"
                      />
                    )}
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(item.updated_at).toLocaleDateString()}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleSave(item.page_name, item.section_name, item.content_key)}
                        disabled={isSaving || editingContent[key] === item.content_text}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading page content...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Page Content</h2>
        <p className="text-gray-600">
          Change the text that appears on your website pages. Changes are saved immediately.
        </p>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home" className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Home Page</span>
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>All Recipes Page</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home">{renderContentSection(homeContent, "home", "Home Page Content")}</TabsContent>

        <TabsContent value="recipes">
          {renderContentSection(recipesContent, "all-recipes", "All Recipes Page Content")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
