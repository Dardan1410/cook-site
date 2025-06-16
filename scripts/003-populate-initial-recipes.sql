-- Insert some initial recipes from our complete recipes list
INSERT INTO recipes (title, description, image_url, prep_time, cook_time, servings, difficulty, category, ingredients, instructions) VALUES
(
  'Scrambled Eggs',
  'Fluffy and creamy scrambled eggs perfect for breakfast',
  'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop',
  5,
  5,
  2,
  'Easy',
  'Breakfast',
  '["4 large eggs", "2 tablespoons butter", "2 tablespoons milk", "Salt to taste", "Black pepper to taste", "Chives for garnish"]',
  '["Crack eggs into a bowl and whisk with milk", "Heat butter in a non-stick pan over medium-low heat", "Pour in eggs and let sit for 20 seconds", "Gently stir with a spatula, pushing eggs from edges to center", "Continue stirring gently until eggs are just set", "Remove from heat and season with salt and pepper", "Garnish with chives and serve immediately"]'
),
(
  'Classic Pancakes',
  'Light and fluffy pancakes that are perfect for weekend mornings',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
  10,
  15,
  4,
  'Easy',
  'Breakfast',
  '["2 cups all-purpose flour", "2 tablespoons sugar", "2 teaspoons baking powder", "1 teaspoon salt", "2 large eggs", "1 3/4 cups milk", "1/4 cup melted butter", "1 teaspoon vanilla extract"]',
  '["Mix dry ingredients in a large bowl", "Whisk wet ingredients in another bowl", "Combine wet and dry ingredients until just mixed", "Heat griddle or pan over medium heat", "Pour 1/4 cup batter for each pancake", "Cook until bubbles form on surface, then flip", "Cook until golden brown on both sides", "Serve hot with syrup"]'
),
(
  'Grilled Cheese Sandwich',
  'The perfect crispy, golden grilled cheese sandwich with melted cheese',
  'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop',
  5,
  8,
  1,
  'Easy',
  'Lunch',
  '["2 slices bread", "2 slices cheddar cheese", "2 tablespoons butter", "Salt to taste"]',
  '["Butter one side of each bread slice", "Place cheese between bread, buttered sides out", "Heat pan over medium heat", "Cook sandwich until golden brown, about 3-4 minutes", "Flip and cook other side until golden", "Remove from heat and let cool for 1 minute", "Cut diagonally and serve hot"]'
)
ON CONFLICT DO NOTHING;

-- Add some of these recipes to featured list
INSERT INTO featured_recipes (recipe_id, position, is_active) 
SELECT id, 0, true FROM recipes WHERE title IN ('Scrambled Eggs', 'Classic Pancakes', 'Grilled Cheese Sandwich')
ON CONFLICT DO NOTHING;
