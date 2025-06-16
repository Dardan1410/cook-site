"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, FileText, HelpCircle, Shield, ArrowLeft } from "lucide-react"
import { showToast } from "@/components/toast"
import Link from "next/link"

interface PageContent {
  id: number
  page_name: string
  section_name: string
  content_key: string
  content_text: string
  content_type: string
  updated_at: string
}

export default function PageManagement() {
  const [aboutContent, setAboutContent] = useState<PageContent[]>([])
  const [faqContent, setFaqContent] = useState<PageContent[]>([])
  const [disclaimerContent, setDisclaimerContent] = useState<PageContent[]>([])
  const [footerContent, setFooterContent] = useState<PageContent[]>([])
  const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
      return
    }
    loadContent()
  }, [router])

  const loadContent = async () => {
    try {
      const [aboutResponse, faqResponse, disclaimerResponse, footerResponse] = await Promise.all([
        fetch("/api/page-content?page=about"),
        fetch("/api/page-content?page=faq"),
        fetch("/api/page-content?page=disclaimer"),
        fetch("/api/page-content?page=footer"),
      ])

      if (aboutResponse.ok) {
        const about = await aboutResponse.json()
        setAboutContent(about)
        initializeEditingState(about, "about")
      }

      if (faqResponse.ok) {
        const faq = await faqResponse.json()
        setFaqContent(faq)
        initializeEditingState(faq, "faq")
      }

      if (disclaimerResponse.ok) {
        const disclaimer = await disclaimerResponse.json()
        setDisclaimerContent(disclaimer)
        initializeEditingState(disclaimer, "disclaimer")
      }

      if (footerResponse.ok) {
        const footer = await footerResponse.json()
        setFooterContent(footer)
        initializeEditingState(footer, "footer")
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

  const initializeEditingState = (content: PageContent[], pageName: string) => {
    const editing: { [key: string]: string } = {}
    content.forEach((item) => {
      editing[`${pageName}.${item.section_name}.${item.content_key}`] = item.content_text
    })
    setEditingContent((prev) => ({ ...prev, ...editing }))
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

  const renderContentEditor = (content: PageContent[], pageName: string, pageTitle: string, icon: React.ReactNode) => {
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
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">{icon}</div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{pageTitle}</h3>
          <p className="text-sm text-gray-600">Edit the content that appears on this page</p>
        </div>

        {Object.entries(sections).map(([sectionName, items]) => (
          <Card key={sectionName}>
            <CardHeader>
              <CardTitle className="capitalize flex items-center space-x-2">
                <FileText className="h-4 w-4" />
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
                        rows={4}
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading page content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Content Management</h1>
          <p className="text-gray-600">
            Edit the content that appears on your website pages. Changes are saved immediately.
          </p>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>About Us</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="disclaimer" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Disclaimer</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Footer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            {renderContentEditor(
              aboutContent,
              "about",
              "About Us Page",
              <FileText className="h-6 w-6 text-orange-600" />,
            )}
          </TabsContent>

          <TabsContent value="faq">
            {renderContentEditor(faqContent, "faq", "FAQ Page", <HelpCircle className="h-6 w-6 text-orange-600" />)}
          </TabsContent>

          <TabsContent value="disclaimer">
            {renderContentEditor(
              disclaimerContent,
              "disclaimer",
              "Disclaimer Page",
              <Shield className="h-6 w-6 text-orange-600" />,
            )}
          </TabsContent>

          <TabsContent value="footer">
            {renderContentEditor(
              footerContent,
              "footer",
              "Footer Content",
              <FileText className="h-6 w-6 text-orange-600" />,
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
