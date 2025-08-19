
-- Clean up any records with NULL cup_id values
DELETE FROM product_cups WHERE cup_id IS NULL;

-- Insert sample data for products that need cups
-- First, let's ensure we have some basic cups available
INSERT OR IGNORE INTO cups (name, name_ar, price, is_active) VALUES 
('Small Cup', 'كوب صغير', 2.00, 1),
('Medium Cup', 'كوب متوسط', 3.00, 1),
('Large Cup', 'كوب كبير', 4.00, 1);

-- Insert sample categories if they don't exist
INSERT OR IGNORE INTO categories (name, name_ar) VALUES 
('Hot Drinks', 'المشروبات الساخنة'),
('Cold Drinks', 'المشروبات الباردة'),
('Snacks', 'الوجبات الخفيفة');

-- Insert sample products
INSERT OR IGNORE INTO products (name, name_ar, price, category_id, needs_cup, allows_sugar, allows_milk, icon_url, is_active) VALUES 
('Coffee', 'قهوة', 15.00, 1, 1, 1, 1, '☕', 1),
('Tea', 'شاي', 10.00, 1, 1, 1, 1, '🍵', 1),
('Juice', 'عصير', 12.00, 2, 1, 0, 0, '🥤', 1),
('Sandwich', 'ساندويش', 25.00, 3, 0, 0, 0, '🥪', 1);

-- Link products that need cups to available cups
INSERT OR IGNORE INTO product_cups (product_id, cup_id)
SELECT p.id, c.id 
FROM products p
CROSS JOIN cups c
WHERE p.needs_cup = 1 AND p.is_active = 1 AND c.is_active = 1;

-- Insert sample inventory items for sugar and milk pricing
INSERT OR IGNORE INTO inventory (item_name, item_name_ar, unit, unit_ar, cost_per_unit, current_stock, is_active) VALUES 
('Sugar', 'سكر', 'Spoon', 'معلقة', 1.00, 1000, 1),
('Milk', 'لبن', 'Quarter Cup', 'ربع كوب', 5.00, 500, 1);
