-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    prep_time INTEGER NOT NULL DEFAULT 0,
    cook_time INTEGER NOT NULL DEFAULT 0,
    servings INTEGER NOT NULL DEFAULT 1,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Easy',
    category VARCHAR(100),
    ingredients JSONB NOT NULL DEFAULT '[]',
    instructions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@cooking.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample recipes
INSERT INTO recipes (title, description, image_url, prep_time, cook_time, servings, difficulty, category, ingredients, instructions) VALUES
(
    'Classic Spaghetti Carbonara',
    'A traditional Italian pasta dish with eggs, cheese, and pancetta',
    '/placeholder.svg?height=300&width=400',
    15,
    20,
    4,
    'Medium',
    'Italian',
    '["400g spaghetti", "200g pancetta or guanciale", "4 large eggs", "100g Pecorino Romano cheese", "2 cloves garlic", "Black pepper", "Salt"]',
    '["Bring a large pot of salted water to boil and cook spaghetti according to package directions", "While pasta cooks, cut pancetta into small cubes and cook in a large skillet until crispy", "In a bowl, whisk together eggs, grated cheese, and black pepper", "Drain pasta, reserving 1 cup of pasta water", "Add hot pasta to the skillet with pancetta", "Remove from heat and quickly stir in egg mixture, adding pasta water as needed", "Serve immediately with extra cheese and black pepper"]'
),
(
    'Chocolate Chip Cookies',
    'Soft and chewy homemade chocolate chip cookies',
    '/placeholder.svg?height=300&width=400',
    15,
    12,
    24,
    'Easy',
    'Dessert',
    '["2¼ cups all-purpose flour", "1 tsp baking soda", "1 tsp salt", "1 cup butter, softened", "¾ cup granulated sugar", "¾ cup brown sugar", "2 large eggs", "2 tsp vanilla extract", "2 cups chocolate chips"]',
    '["Preheat oven to 375°F (190°C)", "Mix flour, baking soda, and salt in a bowl", "Cream butter and sugars until fluffy", "Beat in eggs and vanilla", "Gradually mix in flour mixture", "Stir in chocolate chips", "Drop rounded tablespoons onto ungreased baking sheets", "Bake 9-11 minutes until golden brown"]'
)
ON CONFLICT DO NOTHING;
