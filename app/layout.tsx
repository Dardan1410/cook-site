import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ToastContainer } from "@/components/toast"
import { LanguageProvider } from "@/lib/language-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Delicious Recipes - Cooking Made Easy",
  description: "Discover amazing recipes and cooking tips for every occasion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
          <ToastContainer />
        </LanguageProvider>
      </body>
    </html>
  )
}
