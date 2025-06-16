import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

export interface DatabaseRecipe {
  id: number
  title: string
  description: string
  image_url: string
  prep_time: number
  cook_time: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  ingredients: string[]
  instructions: string[]
  created_at: string
  updated_at: string
}

export interface DatabaseSettings {
  id: number
  key: string
  value: any
  updated_at: string
}

export interface FeaturedRecipe {
  id: number
  recipe_id: number
  position: number
  is_active: boolean
  recipe?: DatabaseRecipe
}

export interface PageContent {
  id: number
  page_name: string
  section_name: string
  content_key: string
  content_text: string
  content_type: string
}

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    // Create recipes table
    await sql`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        prep_time INTEGER DEFAULT 0,
        cook_time INTEGER DEFAULT 0,
        servings INTEGER DEFAULT 1,
        difficulty VARCHAR(20) DEFAULT 'Easy',
        category VARCHAR(100) DEFAULT 'Main Course',
        ingredients JSONB DEFAULT '[]',
        instructions JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create settings table
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create featured_recipes table
    await sql`
      CREATE TABLE IF NOT EXISTS featured_recipes (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create page_content table
    await sql`
      CREATE TABLE IF NOT EXISTS page_content (
        id SERIAL PRIMARY KEY,
        page_name VARCHAR(100) NOT NULL,
        section_name VARCHAR(100) NOT NULL,
        content_key VARCHAR(100) NOT NULL,
        content_text TEXT NOT NULL,
        content_type VARCHAR(50) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(page_name, section_name, content_key)
      )
    `

    // Insert default page content
    await sql`
      INSERT INTO page_content (page_name, section_name, content_key, content_text, content_type) VALUES
      ('home', 'hero', 'title', 'Discover Amazing Recipes', 'text'),
      ('home', 'hero', 'subtitle', 'From quick weeknight dinners to special occasion treats', 'text'),
      ('home', 'featured', 'title', 'Featured Recipes', 'text'),
      ('home', 'featured', 'subtitle', 'Hand-picked recipes that change daily', 'text'),
      ('home', 'game', 'title', 'Test Your Cooking Knowledge!', 'text'),
      ('home', 'game', 'subtitle', 'Challenge yourself with our fun recipe guessing game', 'text'),
      ('all-recipes', 'hero', 'title', 'All Our Delicious Recipes', 'text'),
      ('all-recipes', 'hero', 'subtitle', 'Browse through our complete collection of recipes', 'text')
      ON CONFLICT (page_name, section_name, content_key) DO NOTHING
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_featured_recipes_active ON featured_recipes(is_active)`
    await sql`CREATE INDEX IF NOT EXISTS idx_page_content_lookup ON page_content(page_name, section_name, content_key)`

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}

// Recipe functions
export async function getAllRecipes(): Promise<DatabaseRecipe[]> {
  try {
    await initializeDatabase() // Ensure tables exist
    const recipes = await sql`SELECT * FROM recipes ORDER BY created_at DESC`
    return recipes as DatabaseRecipe[]
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return []
  }
}

export async function getRecipeById(id: number): Promise<DatabaseRecipe | null> {
  try {
    await initializeDatabase() // Ensure tables exist
    const recipes = await sql`SELECT * FROM recipes WHERE id = ${id}`
    return (recipes[0] as DatabaseRecipe) || null
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return null
  }
}

export async function createRecipe(
  recipe: Omit<DatabaseRecipe, "id" | "created_at" | "updated_at">,
): Promise<DatabaseRecipe | null> {
  try {
    await initializeDatabase() // Ensure tables exist
    const result = await sql`
      INSERT INTO recipes (title, description, image_url, prep_time, cook_time, servings, difficulty, category, ingredients, instructions)
      VALUES (${recipe.title}, ${recipe.description}, ${recipe.image_url}, ${recipe.prep_time}, ${recipe.cook_time}, ${recipe.servings}, ${recipe.difficulty}, ${recipe.category}, ${JSON.stringify(recipe.ingredients)}, ${JSON.stringify(recipe.instructions)})
      RETURNING *
    `
    return result[0] as DatabaseRecipe
  } catch (error) {
    console.error("Error creating recipe:", error)
    return null
  }
}

export async function updateRecipe(
  id: number,
  recipe: Partial<Omit<DatabaseRecipe, "id" | "created_at" | "updated_at">>,
): Promise<DatabaseRecipe | null> {
  try {
    await initializeDatabase() // Ensure tables exist
    const updates = []
    const values = []

    if (recipe.title !== undefined) {
      updates.push(`title = $${updates.length + 1}`)
      values.push(recipe.title)
    }
    if (recipe.description !== undefined) {
      updates.push(`description = $${updates.length + 1}`)
      values.push(recipe.description)
    }
    if (recipe.image_url !== undefined) {
      updates.push(`image_url = $${updates.length + 1}`)
      values.push(recipe.image_url)
    }
    if (recipe.prep_time !== undefined) {
      updates.push(`prep_time = $${updates.length + 1}`)
      values.push(recipe.prep_time)
    }
    if (recipe.cook_time !== undefined) {
      updates.push(`cook_time = $${updates.length + 1}`)
      values.push(recipe.cook_time)
    }
    if (recipe.servings !== undefined) {
      updates.push(`servings = $${updates.length + 1}`)
      values.push(recipe.servings)
    }
    if (recipe.difficulty !== undefined) {
      updates.push(`difficulty = $${updates.length + 1}`)
      values.push(recipe.difficulty)
    }
    if (recipe.category !== undefined) {
      updates.push(`category = $${updates.length + 1}`)
      values.push(recipe.category)
    }
    if (recipe.ingredients !== undefined) {
      updates.push(`ingredients = $${updates.length + 1}`)
      values.push(JSON.stringify(recipe.ingredients))
    }
    if (recipe.instructions !== undefined) {
      updates.push(`instructions = $${updates.length + 1}`)
      values.push(JSON.stringify(recipe.instructions))
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)

    const result = await sql`
      UPDATE recipes 
      SET ${sql.unsafe(updates.join(", "))}
      WHERE id = ${id}
      RETURNING *
    `
    return (result[0] as DatabaseRecipe) || null
  } catch (error) {
    console.error("Error updating recipe:", error)
    return null
  }
}

export async function deleteRecipe(id: number): Promise<boolean> {
  try {
    await initializeDatabase() // Ensure tables exist
    await sql`DELETE FROM recipes WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return false
  }
}

// Featured recipes functions
export async function getFeaturedRecipes(): Promise<FeaturedRecipe[]> {
  try {
    await initializeDatabase() // Ensure tables exist

    const featured = await sql`
      SELECT fr.*, r.* 
      FROM featured_recipes fr
      JOIN recipes r ON fr.recipe_id = r.id
      WHERE fr.is_active = true
      ORDER BY fr.position ASC, fr.created_at DESC
    `

    return featured.map((row: any) => ({
      id: row.id,
      recipe_id: row.recipe_id,
      position: row.position,
      is_active: row.is_active,
      recipe: {
        id: row.recipe_id,
        title: row.title,
        description: row.description,
        image_url: row.image_url,
        prep_time: row.prep_time,
        cook_time: row.cook_time,
        servings: row.servings,
        difficulty: row.difficulty,
        category: row.category,
        ingredients: row.ingredients,
        instructions: row.instructions,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    }))
  } catch (error) {
    console.error("Error fetching featured recipes:", error)
    return []
  }
}

export async function addFeaturedRecipe(recipeId: number, position?: number): Promise<boolean> {
  try {
    await initializeDatabase() // Ensure tables exist
    await sql`
      INSERT INTO featured_recipes (recipe_id, position, is_active)
      VALUES (${recipeId}, ${position || 0}, true)
    `
    return true
  } catch (error) {
    console.error("Error adding featured recipe:", error)
    return false
  }
}

export async function removeFeaturedRecipe(recipeId: number): Promise<boolean> {
  try {
    await initializeDatabase() // Ensure tables exist
    await sql`DELETE FROM featured_recipes WHERE recipe_id = ${recipeId}`
    return true
  } catch (error) {
    console.error("Error removing featured recipe:", error)
    return false
  }
}

export async function updateFeaturedRecipePosition(id: number, position: number): Promise<boolean> {
  try {
    await initializeDatabase() // Ensure tables exist
    await sql`
      UPDATE featured_recipes 
      SET position = ${position}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error("Error updating featured recipe position:", error)
    return false
  }
}

// Page content functions
export async function getPageContent(pageName: string): Promise<PageContent[]> {
  try {
    await initializeDatabase() // Ensure tables exist
    const content = await sql`
      SELECT * FROM page_content 
      WHERE page_name = ${pageName}
      ORDER BY section_name, content_key
    `
    return content as PageContent[]
  } catch (error) {
    console.error("Error fetching page content:", error)
    return []
  }
}

export async function updatePageContent(
  pageName: string,
  sectionName: string,
  contentKey: string,
  contentText: string,
): Promise<boolean> {
  try {
    await initializeDatabase() // Ensure tables exist
    await sql`
      INSERT INTO page_content (page_name, section_name, content_key, content_text)
      VALUES (${pageName}, ${sectionName}, ${contentKey}, ${contentText})
      ON CONFLICT (page_name, section_name, content_key)
      DO UPDATE SET 
        content_text = ${contentText},
        updated_at = CURRENT_TIMESTAMP
    `
    return true
  } catch (error) {
    console.error("Error updating page content:", error)
    return false
  }
}

// Settings functions
export async function getSetting(key: string): Promise<any> {
  try {
    await initializeDatabase() // Ensure tables exist
    const result = await sql`SELECT value FROM settings WHERE key = ${key}`
    return result[0]?.value || null
  } catch (error) {
    console.error("Error fetching setting:", error)
    return null
  }
}

export async function setSetting(key: string, value: any): Promise<boolean> {
  try {
    await initializeDatabase() // Ensure tables exist
    await sql`
      INSERT INTO settings (key, value) 
      VALUES (${key}, ${JSON.stringify(value)})
      ON CONFLICT (key) 
      DO UPDATE SET value = ${JSON.stringify(value)}, updated_at = CURRENT_TIMESTAMP
    `
    return true
  } catch (error) {
    console.error("Error setting value:", error)
    return false
  }
}
