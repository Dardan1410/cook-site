"use client"

import type React from "react"

export interface BackgroundSettings {
  type: "color" | "gradient" | "image"
  color?: string
  gradientStart?: string
  gradientEnd?: string
  gradientDirection?: "to-r" | "to-br" | "to-b" | "to-bl" | "to-l" | "to-tl" | "to-t" | "to-tr"
  imageUrl?: string
  imagePosition?: "center" | "top" | "bottom" | "left" | "right"
  imageSize?: "cover" | "contain" | "auto"
  imageRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y"
  opacity?: number
}

const defaultSettings: BackgroundSettings = {
  type: "gradient",
  gradientStart: "#fef7ed", // orange-50
  gradientEnd: "#ffffff", // white
  gradientDirection: "to-b",
  opacity: 100,
}

export function getBackgroundSettings(): BackgroundSettings {
  if (typeof window === "undefined") return defaultSettings
  const stored = localStorage.getItem("backgroundSettings")
  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
}

export function saveBackgroundSettings(settings: BackgroundSettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem("backgroundSettings", JSON.stringify(settings))
}

export function generateBackgroundStyle(settings: BackgroundSettings): React.CSSProperties {
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
      if (settings.imageUrl) {
        style.backgroundImage = `url(${settings.imageUrl})`
        style.backgroundPosition = settings.imagePosition || "center"
        style.backgroundSize = settings.imageSize || "cover"
        style.backgroundRepeat = settings.imageRepeat || "no-repeat"
        if (settings.opacity && settings.opacity < 100) {
          style.position = "relative"
        }
      }
      break
  }

  return style
}

export function generateBackgroundOverlay(settings: BackgroundSettings): React.CSSProperties | null {
  if (settings.type === "image" && settings.opacity && settings.opacity < 100) {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "white",
      opacity: (100 - settings.opacity) / 100,
      pointerEvents: "none",
      zIndex: 1,
    }
  }
  return null
}
