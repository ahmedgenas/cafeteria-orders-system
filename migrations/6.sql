
-- Add sample main products (parent products)
INSERT INTO products (name, name_ar, price, category_id, parent_id, is_active, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Coffee', 'قهوة', 0, 5, NULL, 1, 0, 0, 0, '☕'),
('Tea', 'شاي', 0, 6, NULL, 1, 0, 0, 0, '🍵'),
('Juice', 'عصائر', 0, 2, NULL, 1, 0, 0, 0, '🧃'),
('Dessert', 'حلويات', 0, 3, NULL, 1, 0, 0, 0, '🧁');

-- Add sub-products under Coffee
INSERT INTO products (name, name_ar, price, category_id, parent_id, is_active, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Turkish Coffee', 'قهوة تركي', 15, 5, (SELECT id FROM products WHERE name_ar = 'قهوة' AND parent_id IS NULL), 1, 1, 1, 0, '☕'),
('Espresso', 'اسبريسو', 20, 5, (SELECT id FROM products WHERE name_ar = 'قهوة' AND parent_id IS NULL), 1, 1, 1, 1, '☕'),
('Cappuccino', 'كابتشينو', 25, 5, (SELECT id FROM products WHERE name_ar = 'قهوة' AND parent_id IS NULL), 1, 1, 1, 1, '☕'),
('American Coffee', 'قهوة أمريكي', 18, 5, (SELECT id FROM products WHERE name_ar = 'قهوة' AND parent_id IS NULL), 1, 1, 1, 1, '☕');

-- Add sub-products under Tea  
INSERT INTO products (name, name_ar, price, category_id, parent_id, is_active, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Black Tea', 'شاي أحمر', 8, 6, (SELECT id FROM products WHERE name_ar = 'شاي' AND parent_id IS NULL), 1, 1, 1, 1, '🍵'),
('Green Tea', 'شاي أخضر', 10, 6, (SELECT id FROM products WHERE name_ar = 'شاي' AND parent_id IS NULL), 1, 1, 1, 0, '🍵'),
('Mint Tea', 'شاي نعناع', 12, 6, (SELECT id FROM products WHERE name_ar = 'شاي' AND parent_id IS NULL), 1, 1, 1, 1, '🍵'),
('Herbal Tea', 'شاي أعشاب', 15, 6, (SELECT id FROM products WHERE name_ar = 'شاي' AND parent_id IS NULL), 1, 1, 1, 1, '🍵');

-- Add more cups
INSERT INTO cups (name, name_ar, price, is_active) VALUES
('Ceramic Cup', 'كوب سيراميك', 2, 1),
('Plastic Cup', 'كوب بلاستيك', 0.5, 1),
('Large Glass', 'كوب زجاج كبير', 3, 1);
