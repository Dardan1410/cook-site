"use client"

export interface InstagramPost {
  id: string
  caption: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
  username?: string
  likes?: number
  comments?: number
}

export interface InstagramSettings {
  enabled: boolean
  displayCount: number
  showOnHomepage: boolean
  sectionTitle: string
  username: string
}

const defaultInstagramSettings: InstagramSettings = {
  enabled: true,
  displayCount: 6,
  showOnHomepage: true,
  sectionTitle: "Follow Us on Instagram",
  username: "deliciousrecipes",
}

export function getInstagramSettings(): InstagramSettings {
  if (typeof window === "undefined") return defaultInstagramSettings
  const stored = localStorage.getItem("instagramSettings")
  return stored ? { ...defaultInstagramSettings, ...JSON.parse(stored) } : defaultInstagramSettings
}

export function saveInstagramSettings(settings: InstagramSettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem("instagramSettings", JSON.stringify(settings))
}

// Beautiful demo Instagram posts - no API needed!
export const mockInstagramPosts: InstagramPost[] = [
  {
    id: "1",
    caption:
      "Fresh homemade pasta with basil and tomatoes 🍝 Perfect for a cozy dinner! Recipe coming soon to the blog! #pasta #homemade #cooking #italian #foodie",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🍝+Fresh+Pasta&bg=f8f4e6",
    permalink: "https://instagram.com/p/pasta-dish",
    timestamp: "2024-01-15T10:30:00Z",
    username: "deliciousrecipes",
    likes: 247,
    comments: 18,
  },
  {
    id: "2",
    caption:
      "Behind the scenes: prepping ingredients for tonight's special 👨‍🍳 The magic happens in the prep work! What's your favorite cooking prep tip? #prep #cooking #chef #behindthescenes #kitchenlife",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=👨‍🍳+Kitchen+Prep&bg=e8f5e8",
    permalink: "https://instagram.com/p/kitchen-prep",
    timestamp: "2024-01-14T15:45:00Z",
    username: "deliciousrecipes",
    likes: 189,
    comments: 12,
  },
  {
    id: "3",
    caption:
      "Perfect chocolate chip cookies fresh from the oven! 🍪 These are a family favorite - crispy edges, chewy center. Recipe link in bio! #cookies #baking #chocolate #homemade #sweet",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🍪+Fresh+Cookies&bg=f4e4d6",
    permalink: "https://instagram.com/p/chocolate-cookies",
    timestamp: "2024-01-13T12:20:00Z",
    username: "deliciousrecipes",
    likes: 312,
    comments: 25,
  },
  {
    id: "4",
    caption:
      "Sunday brunch vibes with these fluffy pancakes 🥞 Nothing beats a lazy weekend morning with good food and great company! #brunch #pancakes #weekend #fluffy #breakfast",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🥞+Fluffy+Pancakes&bg=fff8dc",
    permalink: "https://instagram.com/p/sunday-pancakes",
    timestamp: "2024-01-12T09:15:00Z",
    username: "deliciousrecipes",
    likes: 156,
    comments: 8,
  },
  {
    id: "5",
    caption:
      "Fresh garden salad with herbs straight from our garden 🥗 Farm to table at its finest! Nothing beats the taste of homegrown ingredients #fresh #salad #garden #organic #healthy",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🥗+Garden+Salad&bg=f0f8f0",
    permalink: "https://instagram.com/p/garden-salad",
    timestamp: "2024-01-11T14:30:00Z",
    username: "deliciousrecipes",
    likes: 203,
    comments: 15,
  },
  {
    id: "6",
    caption:
      "Homemade pizza night! 🍕 What's your favorite topping combination? Tell us in the comments - we love trying new ideas! #pizza #homemade #dinner #family #toppings",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🍕+Pizza+Night&bg=ffe4e1",
    permalink: "https://instagram.com/p/pizza-night",
    timestamp: "2024-01-10T18:00:00Z",
    username: "deliciousrecipes",
    likes: 278,
    comments: 32,
  },
  {
    id: "7",
    caption:
      "Creamy mushroom risotto that's pure comfort food 🍄 Took some patience but so worth it! Swipe for the step-by-step process #risotto #mushroom #comfort #italian #creamy",
    media_type: "CAROUSEL_ALBUM",
    media_url: "/placeholder.svg?height=400&width=400&text=🍄+Mushroom+Risotto&bg=f5f5dc",
    permalink: "https://instagram.com/p/mushroom-risotto",
    timestamp: "2024-01-09T19:20:00Z",
    username: "deliciousrecipes",
    likes: 195,
    comments: 14,
  },
  {
    id: "8",
    caption:
      "Fresh berry tart with vanilla custard 🫐 Summer flavors that make every bite special! Perfect for entertaining guests #berries #tart #dessert #summer #elegant",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🫐+Berry+Tart&bg=f0f8ff",
    permalink: "https://instagram.com/p/berry-tart",
    timestamp: "2024-01-08T16:45:00Z",
    username: "deliciousrecipes",
    likes: 234,
    comments: 19,
  },
  {
    id: "9",
    caption:
      "Grilled salmon with lemon herb butter 🐟 Healthy, delicious, and ready in 20 minutes! Perfect for busy weeknights #salmon #grilled #healthy #quick #dinner",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🐟+Grilled+Salmon&bg=e6f3ff",
    permalink: "https://instagram.com/p/grilled-salmon",
    timestamp: "2024-01-07T18:30:00Z",
    username: "deliciousrecipes",
    likes: 167,
    comments: 11,
  },
  {
    id: "10",
    caption:
      "Artisan sourdough bread fresh from the oven 🍞 The smell alone is worth the 3-day process! Nothing beats homemade bread #sourdough #bread #artisan #homemade #baking",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🍞+Sourdough+Bread&bg=f5deb3",
    permalink: "https://instagram.com/p/sourdough-bread",
    timestamp: "2024-01-06T08:15:00Z",
    username: "deliciousrecipes",
    likes: 289,
    comments: 23,
  },
  {
    id: "11",
    caption:
      "Colorful veggie stir-fry that's as beautiful as it is nutritious 🌈 Quick, healthy, and packed with flavor! #stirfry #vegetables #healthy #colorful #quick",
    media_type: "IMAGE",
    media_url: "/placeholder.svg?height=400&width=400&text=🌈+Veggie+Stir+Fry&bg=f0fff0",
    permalink: "https://instagram.com/p/veggie-stirfry",
    timestamp: "2024-01-05T17:00:00Z",
    username: "deliciousrecipes",
    likes: 145,
    comments: 9,
  },
  {
    id: "12",
    caption:
      "Decadent chocolate lava cake with vanilla ice cream 🍫 The perfect ending to any meal! Who else loves that molten center? #chocolate #lavacake #dessert #decadent #molten",
    media_type: "VIDEO",
    media_url: "/placeholder.svg?height=400&width=400&text=🍫+Lava+Cake&bg=2f1b14",
    permalink: "https://instagram.com/p/chocolate-lava",
    timestamp: "2024-01-04T20:30:00Z",
    username: "deliciousrecipes",
    likes: 356,
    comments: 28,
  },
]

export async function fetchInstagramPosts(settings: InstagramSettings): Promise<InstagramPost[]> {
  // No API needed! Just return our beautiful demo posts
  if (!settings.enabled) {
    return []
  }

  // Simulate a small delay to make it feel realistic
  await new Promise((resolve) => setTimeout(resolve, 300))

  console.log("Fetching Instagram posts (demo mode):", settings)
  return mockInstagramPosts.slice(0, settings.displayCount)
}
