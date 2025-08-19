
-- Insert sample data for hierarchical products

-- Main categories
INSERT INTO categories (name, name_ar) VALUES 
('Coffee', 'قهوة'),
('Tea', 'شاي'),
('Juices', 'عصائر'),
('Sweets', 'حلويات');

-- Main products (parent products)
INSERT INTO products (name, name_ar, price, category_id, parent_id, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Coffee', 'قهوة', 0, 1, NULL, 0, 0, 0, '☕'),
('Tea', 'شاي', 0, 2, NULL, 0, 0, 0, '🍵'),
('Fresh Juices', 'عصائر طازجة', 0, 3, NULL, 0, 0, 0, '🥤'),
('Desserts', 'حلويات', 0, 4, NULL, 0, 0, 0, '🍰');

-- Sub-products for Coffee
INSERT INTO products (name, name_ar, price, category_id, parent_id, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Plain Coffee', 'قهوة سادة', 15.0, 1, 1, 1, 1, 1, '☕'),
('Turkish Coffee', 'قهوة تركي', 20.0, 1, 1, 1, 1, 0, '☕'),
('Espresso', 'إسبريسو', 25.0, 1, 1, 1, 1, 1, '☕'),
('Cappuccino', 'كابتشينو', 30.0, 1, 1, 1, 1, 0, '☕'),
('Latte', 'لاتيه', 35.0, 1, 1, 1, 1, 0, '☕');

-- Sub-products for Tea
INSERT INTO products (name, name_ar, price, category_id, parent_id, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Black Tea', 'شاي أحمر', 10.0, 2, 2, 1, 1, 1, '🍵'),
('Green Tea', 'شاي أخضر', 12.0, 2, 2, 1, 1, 0, '🍵'),
('Mint Tea', 'شاي بالنعناع', 15.0, 2, 2, 1, 1, 1, '🍵'),
('Herbal Tea', 'شاي أعشاب', 18.0, 2, 2, 1, 1, 0, '🍵');

-- Sub-products for Juices
INSERT INTO products (name, name_ar, price, category_id, parent_id, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Orange Juice', 'عصير برتقال', 20.0, 3, 3, 1, 0, 0, '🍊'),
('Apple Juice', 'عصير تفاح', 22.0, 3, 3, 1, 0, 0, '🍎'),
('Mango Juice', 'عصير مانجو', 25.0, 3, 3, 1, 0, 0, '🥭'),
('Mixed Juice', 'عصير مشكل', 30.0, 3, 3, 1, 0, 0, '🥤');

-- Sub-products for Desserts
INSERT INTO products (name, name_ar, price, category_id, parent_id, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Cake Slice', 'قطعة كيك', 25.0, 4, 4, 0, 0, 0, '🍰'),
('Cookies', 'كوكيز', 15.0, 4, 4, 0, 0, 0, '🍪'),
('Ice Cream', 'آيس كريم', 20.0, 4, 4, 0, 0, 0, '🍨'),
('Chocolate', 'شوكولاتة', 30.0, 4, 4, 0, 0, 0, '🍫');
