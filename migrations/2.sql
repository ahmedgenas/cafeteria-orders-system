
-- Insert sample categories
INSERT INTO categories (name, name_ar) VALUES 
('Hot Drinks', 'المشروبات الساخنة'),
('Cold Drinks', 'المشروبات الباردة'),
('Desserts', 'الحلويات');

-- Insert sample products
INSERT INTO products (name, name_ar, price, category_id) VALUES 
('Turkish Coffee', 'قهوة تركية', 15.0, 1),
('Espresso', 'إسبريسو', 12.0, 1),
('Cappuccino', 'كابتشينو', 18.0, 1),
('Tea', 'شاي', 8.0, 1),
('Iced Coffee', 'قهوة مثلجة', 20.0, 2),
('Fresh Juice', 'عصير طازج', 15.0, 2),
('Baklava', 'بقلاوة', 25.0, 3);

-- Insert cup types
INSERT INTO cups (name, name_ar, price) VALUES 
('Small Cup', 'كوب صغير', 2.0),
('Medium Cup', 'كوب متوسط', 3.0),
('Large Cup', 'كوب كبير', 5.0),
('Paper Cup', 'كوب ورقي', 1.0);

-- Insert inventory items
INSERT INTO inventory (item_name, item_name_ar, unit, unit_ar, cost_per_unit, current_stock) VALUES 
('Sugar', 'سكر', 'spoon', 'معلقة', 1.0, 100),
('Milk', 'لبن', 'quarter_cup', 'ربع كوب', 5.0, 50);
