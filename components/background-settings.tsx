"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleImageUpload } from "@/components/simple-image-upload"
import { getBackgroundSettings, saveBackgroundSettings, type BackgroundSettings } from "@/lib/background-settings"
import { showToast } from "@/components/toast"
import { Palette, Image, ContrastIcon as Gradient, Eye, RotateCcw, Save } from "lucide-react"

export function BackgroundSettingsComponent() {
  const [settings, setSettings] = useState<BackgroundSettings>({
    type: "gradient",
    gradientStart: "#fef7ed",
    gradientEnd: "#ffffff",
    gradientDirection: "to-b",
    opacity: 100,
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalSettings, setOriginalSettings] = useState<BackgroundSettings | null>(null)

  useEffect(() => {
    const currentSettings = getBackgroundSettings()
    setSettings(currentSettings)
    setOriginalSettings(currentSettings)
  }, [])

  const handleSettingsChange = (newSettings: Partial<BackgroundSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    setHasChanges(true)
    if (previewMode) {
      saveBackgroundSettings(updated)
      // Trigger background update event
      window.dispatchEvent(new Event("backgroundChanged"))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      saveBackgroundSettings(settings)
      // Trigger background update event
      window.dispatchEvent(new Event("backgroundChanged"))
      setPreviewMode(false)
      setOriginalSettings(settings)
      setHasChanges(false)

      showToast({
        type: "success",
        title: "Background Saved!",
        message: "Your background settings have been applied successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error saving background:", error)
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Failed to save background settings. Please try again.",
        duration: 4000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    setPreviewMode(!previewMode)
    if (!previewMode) {
      saveBackgroundSettings(settings)
      window.dispatchEvent(new Event("backgroundChanged"))
      showToast({
        type: "info",
        title: "Preview Mode",
        message: "Background preview is now active. Don't forget to save your changes!",
        duration: 3000,
      })
    } else {
      // Restore original settings
      if (originalSettings) {
        saveBackgroundSettings(originalSettings)
        window.dispatchEvent(new Event("backgroundChanged"))
      }
    }
  }

  const handleReset = () => {
    const defaultSettings: BackgroundSettings = {
      type: "gradient",
      gradientStart: "#fef7ed",
      gradientEnd: "#ffffff",
      gradientDirection: "to-b",
      opacity: 100,
    }
    setSettings(defaultSettings)
    setHasChanges(true)

    showToast({
      type: "info",
      title: "Settings Reset",
      message: "Background settings have been reset to defaults. Don't forget to save!",
      duration: 3000,
    })
  }

  const colorPresets = [
    { name: "Orange Gradient", start: "#fef7ed", end: "#ffffff" },
    { name: "Blue Gradient", start: "#eff6ff", end: "#ffffff" },
    { name: "Green Gradient", start: "#f0fdf4", end: "#ffffff" },
    { name: "Purple Gradient", start: "#faf5ff", end: "#ffffff" },
    { name: "Pink Gradient", start: "#fdf2f8", end: "#ffffff" },
    { name: "Gray Gradient", start: "#f9fafb", end: "#ffffff" },
  ]

  // Generate preview styles using separate properties
  const getPreviewStyle = () => {
    const style: React.CSSProperties = {}

    switch (settings.type) {
      case "color":
        style.backgroundColor = settings.color || "#ffffff"
        break
      case "gradient":
        const direction = settings.gradientDirection || "to-b"
        const start = settings.gradientStart || "#fef7ed"
        const end = settings.gradientEnd || "#ffffff"
        style.backgroundImage = `linear-gradient(${direction}, ${start}, ${end})`
        break
      case "image":
        if (settings.imageUrl && settings.imageUrl !== "/placeholder.svg?height=400&width=800") {
          style.backgroundImage = `url(${settings.imageUrl})`
          style.backgroundPosition = settings.imagePosition || "center"
          style.backgroundSize = settings.imageSize || "cover"
          style.backgroundRepeat = settings.imageRepeat || "no-repeat"
        } else {
          style.backgroundColor = "#f3f4f6"
        }
        break
      default:
        style.backgroundColor = "#f3f4f6"
    }

    return style
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Background Settings</span>
          {hasChanges && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Unsaved changes</span>
          )}
          {previewMode && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Preview active</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={settings.type}
          onValueChange={(value) => handleSettingsChange({ type: value as BackgroundSettings["type"] })}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="color" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Color</span>
            </TabsTrigger>
            <TabsTrigger value="gradient" className="flex items-center space-x-2">
              <Gradient className="h-4 w-4" />
              <span>Gradient</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Image</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="color" className="space-y-4">
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={settings.color || "#ffffff"}
                  onChange={(e) => handleSettingsChange({ color: e.target.value })}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={settings.color || "#ffffff"}
                  onChange={(e) => handleSettingsChange({ color: e.target.value })}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gradient" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gradientStart">Start Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    id="gradientStart"
                    type="color"
                    value={settings.gradientStart || "#fef7ed"}
                    onChange={(e) => handleSettingsChange({ gradientStart: e.target.value })}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.gradientStart || "#fef7ed"}
                    onChange={(e) => handleSettingsChange({ gradientStart: e.target.value })}
                    className="flex-1 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="gradientEnd">End Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    id="gradientEnd"
                    type="color"
                    value={settings.gradientEnd || "#ffffff"}
                    onChange={(e) => handleSettingsChange({ gradientEnd: e.target.value })}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.gradientEnd || "#ffffff"}
                    onChange={(e) => handleSettingsChange({ gradientEnd: e.target.value })}
                    className="flex-1 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="gradientDirection">Gradient Direction</Label>
              <Select
                value={settings.gradientDirection || "to-b"}
                onValueChange={(value) =>
                  handleSettingsChange({ gradientDirection: value as BackgroundSettings["gradientDirection"] })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-t">Top</SelectItem>
                  <SelectItem value="to-tr">Top Right</SelectItem>
                  <SelectItem value="to-r">Right</SelectItem>
                  <SelectItem value="to-br">Bottom Right</SelectItem>
                  <SelectItem value="to-b">Bottom</SelectItem>
                  <SelectItem value="to-bl">Bottom Left</SelectItem>
                  <SelectItem value="to-l">Left</SelectItem>
                  <SelectItem value="to-tl">Top Left</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color Presets</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSettingsChange({ gradientStart: preset.start, gradientEnd: preset.end })}
                    className="justify-start"
                  >
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{
                        backgroundImage: `linear-gradient(to-r, ${preset.start}, ${preset.end})`,
                      }}
                    />
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <SimpleImageUpload
              value={settings.imageUrl || "/placeholder.svg?height=400&width=800"}
              onChange={(url) => handleSettingsChange({ imageUrl: url })}
              label="Background Image"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imagePosition">Position</Label>
                <Select
                  value={settings.imagePosition || "center"}
                  onValueChange={(value) =>
                    handleSettingsChange({ imagePosition: value as BackgroundSettings["imagePosition"] })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imageSize">Size</Label>
                <Select
                  value={settings.imageSize || "cover"}
                  onValueChange={(value) =>
                    handleSettingsChange({ imageSize: value as BackgroundSettings["imageSize"] })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="imageRepeat">Repeat</Label>
              <Select
                value={settings.imageRepeat || "no-repeat"}
                onValueChange={(value) =>
                  handleSettingsChange({ imageRepeat: value as BackgroundSettings["imageRepeat"] })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-repeat">No Repeat</SelectItem>
                  <SelectItem value="repeat">Repeat</SelectItem>
                  <SelectItem value="repeat-x">Repeat X</SelectItem>
                  <SelectItem value="repeat-y">Repeat Y</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="imageOpacity">Image Opacity: {settings.opacity || 100}%</Label>
              <Slider
                id="imageOpacity"
                min={10}
                max={100}
                step={5}
                value={[settings.opacity || 100]}
                onValueChange={(value) => handleSettingsChange({ opacity: value[0] })}
                className="mt-2"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview */}
        <div className="border rounded-lg p-4">
          <Label className="text-sm font-medium mb-2 block">Preview</Label>
          <div className="w-full h-24 rounded border relative overflow-hidden" style={getPreviewStyle()}>
            {settings.type === "image" && settings.opacity && settings.opacity < 100 && (
              <div
                className="absolute inset-0 bg-white pointer-events-none"
                style={{ opacity: (100 - settings.opacity) / 100 }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium">Sample Content</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePreview} disabled={isSaving}>
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Stop Preview" : "Preview"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={hasChanges ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "Saved"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
