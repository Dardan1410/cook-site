"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getInstagramSettings, saveInstagramSettings, type InstagramSettings } from "@/lib/instagram"
import { showToast } from "@/components/toast"
import { Instagram, CheckCircle, Sparkles, Save, RotateCcw } from "lucide-react"

export function InstagramSettingsComponent() {
  const [settings, setSettings] = useState<InstagramSettings>({
    enabled: true,
    displayCount: 6,
    showOnHomepage: true,
    sectionTitle: "Follow Us on Instagram",
    username: "deliciousrecipes",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalSettings, setOriginalSettings] = useState<InstagramSettings | null>(null)

  useEffect(() => {
    const currentSettings = getInstagramSettings()
    console.log("Loading Instagram settings:", currentSettings)
    setSettings(currentSettings)
    setOriginalSettings(currentSettings)
  }, [])

  const handleSettingsChange = (newSettings: Partial<InstagramSettings>) => {
    const updated = { ...settings, ...newSettings }
    console.log("Updating Instagram settings:", updated)
    setSettings(updated)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log("Saving Instagram settings:", settings)
      saveInstagramSettings(settings)

      // Trigger Instagram update event
      window.dispatchEvent(new Event("instagramChanged"))

      // Update original settings to track changes
      setOriginalSettings(settings)
      setHasChanges(false)

      // Show success toast
      showToast({
        type: "success",
        title: "Settings Saved!",
        message: "Instagram settings have been updated successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Failed to save Instagram settings. Please try again.",
        duration: 4000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    const defaultSettings: InstagramSettings = {
      enabled: true,
      displayCount: 6,
      showOnHomepage: true,
      sectionTitle: "Follow Us on Instagram",
      username: "deliciousrecipes",
    }
    console.log("Resetting Instagram settings to:", defaultSettings)
    setSettings(defaultSettings)
    setHasChanges(true)

    showToast({
      type: "info",
      title: "Settings Reset",
      message: "Instagram settings have been reset to defaults. Don't forget to save!",
      duration: 3000,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Instagram className="h-5 w-5" />
          <span>Instagram Feed</span>
          {hasChanges && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Unsaved changes</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="instagram-enabled">Enable Instagram Feed</Label>
            <p className="text-sm text-gray-600">Display Instagram-style posts on your website</p>
          </div>
          <Switch
            id="instagram-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingsChange({ enabled: checked })}
          />
        </div>

        {/* Demo Mode Notice */}
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">✨ Demo Content Active</p>
              <p className="text-sm">
                Beautiful sample posts showcasing your delicious recipes! No API setup required - just pure visual
                appeal.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {settings.enabled && (
          <>
            {/* Show on Homepage */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showOnHomepage">Show on Homepage</Label>
                <p className="text-sm text-gray-600">Display Instagram feed on the main homepage</p>
              </div>
              <Switch
                id="showOnHomepage"
                checked={settings.showOnHomepage}
                onCheckedChange={(checked) => handleSettingsChange({ showOnHomepage: checked })}
              />
            </div>

            {/* Section Title */}
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input
                id="sectionTitle"
                value={settings.sectionTitle}
                onChange={(e) => handleSettingsChange({ sectionTitle: e.target.value })}
                placeholder="Follow Us on Instagram"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">This title will appear above your Instagram feed</p>
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username">Instagram Username</Label>
              <Input
                id="username"
                value={settings.username}
                onChange={(e) => handleSettingsChange({ username: e.target.value })}
                placeholder="deliciousrecipes"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Used for the "Follow us" button link</p>
            </div>

            {/* Display Count */}
            <div>
              <Label htmlFor="displayCount">Number of Posts to Display: {settings.displayCount}</Label>
              <Slider
                id="displayCount"
                min={3}
                max={12}
                step={1}
                value={[settings.displayCount]}
                onValueChange={(value) => handleSettingsChange({ displayCount: value[0] })}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Choose how many posts to show (3-12)</p>
            </div>

            {/* Features */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">What's Included:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Beautiful food photography placeholders</li>
                    <li>• Realistic captions with hashtags</li>
                    <li>• Like and comment counts</li>
                    <li>• Hover effects and animations</li>
                    <li>• Mobile responsive design</li>
                    <li>• No API setup required!</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
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
      </CardContent>
    </Card>
  )
}
