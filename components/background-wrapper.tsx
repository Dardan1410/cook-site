"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  getBackgroundSettings,
  generateBackgroundStyle,
  generateBackgroundOverlay,
  type BackgroundSettings,
} from "@/lib/background-settings"

interface BackgroundWrapperProps {
  children: React.ReactNode
  className?: string
}

export function BackgroundWrapper({ children, className = "" }: BackgroundWrapperProps) {
  const [settings, setSettings] = useState<BackgroundSettings | null>(null)

  useEffect(() => {
    setSettings(getBackgroundSettings())

    // Listen for background changes
    const handleStorageChange = () => {
      setSettings(getBackgroundSettings())
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("backgroundChanged", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("backgroundChanged", handleStorageChange)
    }
  }, [])

  if (!settings) {
    return <div className={className}>{children}</div>
  }

  const backgroundStyle = generateBackgroundStyle(settings)
  const overlayStyle = generateBackgroundOverlay(settings)

  return (
    <div className={`${className} relative`} style={backgroundStyle}>
      {overlayStyle && <div style={overlayStyle} />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
