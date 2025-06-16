"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getInstagramSettings, fetchInstagramPosts, type InstagramPost, type InstagramSettings } from "@/lib/instagram"
import { Instagram, ExternalLink, Heart, MessageCircle, Calendar, Play } from "lucide-react"

interface InstagramFeedProps {
  showTitle?: boolean
  className?: string
}

export function InstagramFeed({ showTitle = true, className = "" }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [settings, setSettings] = useState<InstagramSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadInstagramData = async () => {
      console.log("Loading Instagram data...")
      setIsLoading(true)
      setError(null)

      try {
        const instagramSettings = getInstagramSettings()
        console.log("Instagram settings:", instagramSettings)
        setSettings(instagramSettings)

        if (instagramSettings?.enabled && instagramSettings?.showOnHomepage) {
          console.log("Fetching Instagram posts...")
          const instagramPosts = await fetchInstagramPosts(instagramSettings)
          console.log("Fetched posts:", instagramPosts)
          setPosts(instagramPosts || [])
        } else {
          console.log("Instagram disabled or not showing on homepage")
          setPosts([])
        }
      } catch (error) {
        console.error("Error loading Instagram data:", error)
        setError("Failed to load Instagram posts")
        setPosts([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    loadInstagramData()

    // Listen for Instagram settings changes
    const handleInstagramChange = () => {
      console.log("Instagram settings changed, reloading...")
      loadInstagramData()
    }

    window.addEventListener("instagramChanged", handleInstagramChange)
    return () => {
      window.removeEventListener("instagramChanged", handleInstagramChange)
    }
  }, [])

  if (isLoading) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading Instagram posts...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>Error loading Instagram posts: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (!settings?.enabled || !settings?.showOnHomepage) {
    console.log("Instagram not enabled or not showing on homepage")
    return null
  }

  if (posts.length === 0) {
    return null
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const truncateCaption = (caption: string, maxLength = 120) => {
    if (caption.length <= maxLength) return caption
    return caption.substring(0, maxLength) + "..."
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  return (
    <section className={`py-16 bg-gradient-to-b from-gray-50 to-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
              <Instagram className="h-8 w-8 text-pink-600" />
              <span>{settings.sectionTitle}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out our latest culinary creations and get inspired for your next meal
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white border-0 shadow-md"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={post.media_url || "/placeholder.svg"}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Media Type Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900 shadow-sm">
                    {post.media_type === "VIDEO" ? (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Video
                      </>
                    ) : post.media_type === "CAROUSEL_ALBUM" ? (
                      <>
                        <Instagram className="h-3 w-3 mr-1" />
                        Album
                      </>
                    ) : (
                      <>
                        <Instagram className="h-3 w-3 mr-1" />
                        Photo
                      </>
                    )}
                  </Badge>
                </div>

                {/* Hover Stats */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-5 w-5 fill-current" />
                        <span className="font-medium">{formatNumber(post.likes || 0)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium">{post.comments || 0}</span>
                      </div>
                    </div>
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-pink-300 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{formatNumber(post.likes || 0)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments || 0}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{truncateCaption(post.caption)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <a
              href={`https://instagram.com/${settings.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2"
            >
              <Instagram className="h-5 w-5" />
              <span>Follow @{settings.username}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
