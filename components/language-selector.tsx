"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Menu className="h-4 w-4" />
          <span className="text-2xl">{currentLang.flag}</span>
          <span className="hidden sm:inline">Languages We Speak</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Choose Your Language
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={currentLanguage === language.code ? "default" : "outline"}
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setLanguage(language.code)
                setIsOpen(false)
              }}
            >
              <span className="text-2xl">{language.flag}</span>
              <span className="flex-1 text-left">{language.name}</span>
              {currentLanguage === language.code && (
                <Badge variant="secondary" className="ml-auto">
                  Current
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
