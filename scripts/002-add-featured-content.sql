-- Add featured recipes table
CREATE TABLE IF NOT EXISTS featured_recipes (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add page content table for editable text
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(100) NOT NULL,
  section_name VARCHAR(100) NOT NULL,
  content_key VARCHAR(100) NOT NULL,
  content_text TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text', -- text, html, markdown
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_name, section_name, content_key)
);

-- Insert default page content
INSERT INTO page_content (page_name, section_name, content_key, content_text, content_type) VALUES
('home', 'hero', 'title', 'Discover Amazing Recipes', 'text'),
('home', 'hero', 'subtitle', 'From quick weeknight dinners to special occasion treats', 'text'),
('home', 'featured', 'title', 'Featured Recipes', 'text'),
('home', 'featured', 'subtitle', 'Hand-picked recipes that change daily', 'text'),
('home', 'game', 'title', 'Test Your Cooking Knowledge!', 'text'),
('home', 'game', 'subtitle', 'Challenge yourself with our fun recipe guessing game', 'text'),
('all-recipes', 'hero', 'title', 'All Our Delicious Recipes', 'text'),
('all-recipes', 'hero', 'subtitle', 'Browse through our complete collection of recipes', 'text')
ON CONFLICT (page_name, section_name, content_key) DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_featured_recipes_active ON featured_recipes(is_active);
CREATE INDEX IF NOT EXISTS idx_page_content_lookup ON page_content(page_name, section_name, content_key);
