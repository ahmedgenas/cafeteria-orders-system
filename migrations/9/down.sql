
-- Remove the product-cup relationships we just added
DELETE FROM product_cups WHERE id IN (
  SELECT pc.id FROM product_cups pc
  JOIN products p ON pc.product_id = p.id
  WHERE p.needs_cup = 1
);
