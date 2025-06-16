"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LanguageContextType {
  currentLanguage: string
  setLanguage: (lang: string) => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Translation function - in a real app, this would load from translation files
const translations: Record<string, Record<string, string>> = {
  en: {
    "site.title": "Delicious Recipes",
    "site.subtitle": "Cooking Made Easy",
    "nav.home": "Home",
    "nav.recipes": "Recipes",
    "nav.about": "About Us",
    "nav.faq": "FAQ",
    "nav.disclaimer": "Disclaimer",
    "hero.title": "Discover Amazing Recipes",
    "hero.subtitle": "From quick weeknight dinners to special occasion treats",
    "featured.title": "Featured Recipes",
    "featured.subtitle": "Hand-picked recipes that change daily",
    "search.placeholder": "Search recipes...",
    "filter.categories": "Categories",
    "filter.difficulty": "Difficulty",
    "filter.time": "Time",
    "footer.rights": "All rights reserved",
  },
  es: {
    "site.title": "Recetas Deliciosas",
    "site.subtitle": "Cocinar Hecho Fácil",
    "nav.home": "Inicio",
    "nav.recipes": "Recetas",
    "nav.about": "Acerca de",
    "nav.faq": "Preguntas",
    "nav.disclaimer": "Descargo",
    "hero.title": "Descubre Recetas Increíbles",
    "hero.subtitle": "Desde cenas rápidas hasta delicias especiales",
    "featured.title": "Recetas Destacadas",
    "featured.subtitle": "Recetas seleccionadas que cambian diariamente",
    "search.placeholder": "Buscar recetas...",
    "filter.categories": "Categorías",
    "filter.difficulty": "Dificultad",
    "filter.time": "Tiempo",
    "footer.rights": "Todos los derechos reservados",
  },
  fr: {
    "site.title": "Recettes Délicieuses",
    "site.subtitle": "Cuisine Facile",
    "nav.home": "Accueil",
    "nav.recipes": "Recettes",
    "nav.about": "À Propos",
    "nav.faq": "FAQ",
    "nav.disclaimer": "Avertissement",
    "hero.title": "Découvrez des Recettes Incroyables",
    "hero.subtitle": "Des dîners rapides aux délices spéciaux",
    "featured.title": "Recettes Vedettes",
    "featured.subtitle": "Recettes sélectionnées qui changent quotidiennement",
    "search.placeholder": "Rechercher des recettes...",
    "filter.categories": "Catégories",
    "filter.difficulty": "Difficulté",
    "filter.time": "Temps",
    "footer.rights": "Tous droits réservés",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language")
    if (saved && translations[saved]) {
      setCurrentLanguage(saved)
    }
  }, [])

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang)
    localStorage.setItem("preferred-language", lang)
  }

  const t = (key: string, fallback?: string) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || fallback || key
  }

  return <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>{children}</LanguageContext.Provider>
}
