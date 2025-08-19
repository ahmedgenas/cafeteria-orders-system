
-- Clean up any duplicate entries and fix product_cups constraints
DELETE FROM product_cups WHERE cup_id IS NULL;

-- Insert proper product-cup relationships for products that need cups
INSERT OR IGNORE INTO product_cups (product_id, cup_id)
SELECT DISTINCT p.id, c.id 
FROM products p
CROSS JOIN cups c
WHERE p.needs_cup = 1 AND p.is_active = 1 AND c.is_active = 1;
