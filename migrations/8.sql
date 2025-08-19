
INSERT OR IGNORE INTO categories (name, name_ar) VALUES
('Hot Drinks', 'مشروبات ساخنة'),
('Cold Drinks', 'مشروبات باردة'),
('Desserts', 'حلويات'),
('Snacks', 'سناكس');

INSERT OR IGNORE INTO inventory (item_name, item_name_ar, unit, unit_ar, cost_per_unit, current_stock) VALUES
('Sugar', 'سكر', 'spoon', 'معلقة', 1.0, 100),
('Milk', 'لبن', 'quarter_cup', 'ربع كوب', 5.0, 50);

INSERT OR IGNORE INTO cups (name, name_ar, price) VALUES
('Small', 'صغير', 2.0),
('Medium', 'متوسط', 3.0),
('Large', 'كبير', 4.0);

INSERT OR IGNORE INTO products (name, name_ar, price, category_id, needs_cup, allows_sugar, allows_milk, icon_url) VALUES
('Coffee', 'قهوة', 15.0, 1, 1, 1, 1, '☕'),
('Tea', 'شاي', 10.0, 1, 1, 1, 1, '🍵'),
('Hot Chocolate', 'شوكولاتة ساخنة', 20.0, 1, 1, 1, 1, '🍫'),
('Iced Coffee', 'قهوة مثلجة', 18.0, 2, 1, 1, 1, '🧊'),
('Fresh Juice', 'عصير طبيعي', 25.0, 2, 1, 0, 0, '🥤');

INSERT OR IGNORE INTO product_cups (product_id, cup_id)
SELECT p.id, c.id 
FROM products p 
CROSS JOIN cups c 
WHERE p.needs_cup = 1;
