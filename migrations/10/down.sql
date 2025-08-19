
-- Remove the sample data we added
DELETE FROM product_cups WHERE product_id IN (
  SELECT id FROM products WHERE name IN ('Coffee', 'Tea', 'Juice', 'Sandwich')
);

DELETE FROM inventory WHERE item_name IN ('Sugar', 'Milk');

DELETE FROM products WHERE name IN ('Coffee', 'Tea', 'Juice', 'Sandwich');

DELETE FROM cups WHERE name IN ('Small Cup', 'Medium Cup', 'Large Cup');

DELETE FROM categories WHERE name IN ('Hot Drinks', 'Cold Drinks', 'Snacks');
