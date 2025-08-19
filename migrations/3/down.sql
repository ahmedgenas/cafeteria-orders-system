
DROP TABLE product_cups;
ALTER TABLE products DROP COLUMN parent_id;
ALTER TABLE products DROP COLUMN needs_cup;
ALTER TABLE products DROP COLUMN allows_sugar;
ALTER TABLE products DROP COLUMN allows_milk;
ALTER TABLE products DROP COLUMN icon_url;
ALTER TABLE products DROP COLUMN image_url;
