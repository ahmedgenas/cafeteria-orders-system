
-- Add parent_id to products table for hierarchical structure
ALTER TABLE products ADD COLUMN parent_id INTEGER;

-- Add fields for product configuration
ALTER TABLE products ADD COLUMN needs_cup BOOLEAN DEFAULT 0;
ALTER TABLE products ADD COLUMN allows_sugar BOOLEAN DEFAULT 0;
ALTER TABLE products ADD COLUMN allows_milk BOOLEAN DEFAULT 0;
ALTER TABLE products ADD COLUMN icon_url TEXT;
ALTER TABLE products ADD COLUMN image_url TEXT;

-- Create product_cups junction table
CREATE TABLE product_cups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  cup_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
