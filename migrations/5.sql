
-- Insert cup types
INSERT INTO cups (name, name_ar, price) VALUES
('Small Cup', 'كوب صغير', 2.0),
('Medium Cup', 'كوب وسط', 5.0),
('Large Cup', 'كوب كبير', 8.0),
('Glass', 'كوب زجاج', 3.0),
('Plastic Cup', 'كوب بلاستيك', 1.0);

-- Link products with appropriate cups
INSERT INTO product_cups (product_id, cup_id) VALUES
-- Coffee products with coffee cups
(5, 1), (5, 2), (5, 3), -- Plain Coffee
(6, 1), (6, 2), -- Turkish Coffee (small/medium only)
(7, 1), (7, 2), -- Espresso
(8, 2), (8, 3), -- Cappuccino
(9, 2), (9, 3), -- Latte

-- Tea products with tea cups
(10, 1), (10, 2), (10, 4), -- Black Tea
(11, 1), (11, 2), (11, 4), -- Green Tea
(12, 1), (12, 2), (12, 4), -- Mint Tea
(13, 1), (13, 2), (13, 4), -- Herbal Tea

-- Juice products with juice cups
(14, 2), (14, 3), (14, 4), (14, 5), -- Orange Juice
(15, 2), (15, 3), (15, 4), (15, 5), -- Apple Juice
(16, 2), (16, 3), (16, 4), (16, 5), -- Mango Juice
(17, 2), (17, 3), (17, 4), (17, 5); -- Mixed Juice
