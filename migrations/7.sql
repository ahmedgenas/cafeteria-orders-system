
-- Link products with appropriate cups
INSERT INTO product_cups (product_id, cup_id) VALUES
-- Coffee products with all cup types
((SELECT id FROM products WHERE name_ar = 'قهوة تركي'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'قهوة تركي'), (SELECT id FROM cups WHERE name_ar = 'كوب ورق')),
((SELECT id FROM products WHERE name_ar = 'قهوة تركي'), (SELECT id FROM cups WHERE name_ar = 'كوب سيراميك')),

((SELECT id FROM products WHERE name_ar = 'اسبريسو'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'اسبريسو'), (SELECT id FROM cups WHERE name_ar = 'كوب ورق')),
((SELECT id FROM products WHERE name_ar = 'اسبريسو'), (SELECT id FROM cups WHERE name_ar = 'كوب سيراميك')),

((SELECT id FROM products WHERE name_ar = 'كابتشينو'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'كابتشينو'), (SELECT id FROM cups WHERE name_ar = 'كوب ورق')),
((SELECT id FROM products WHERE name_ar = 'كابتشينو'), (SELECT id FROM cups WHERE name_ar = 'كوب سيراميك')),
((SELECT id FROM products WHERE name_ar = 'كابتشينو'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج كبير')),

((SELECT id FROM products WHERE name_ar = 'قهوة أمريكي'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'قهوة أمريكي'), (SELECT id FROM cups WHERE name_ar = 'كوب ورق')),
((SELECT id FROM products WHERE name_ar = 'قهوة أمريكي'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج كبير')),

-- Tea products
((SELECT id FROM products WHERE name_ar = 'شاي أحمر'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'شاي أحمر'), (SELECT id FROM cups WHERE name_ar = 'كوب سيراميك')),

((SELECT id FROM products WHERE name_ar = 'شاي أخضر'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'شاي أخضر'), (SELECT id FROM cups WHERE name_ar = 'كوب سيراميك')),

((SELECT id FROM products WHERE name_ar = 'شاي نعناع'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'شاي نعناع'), (SELECT id FROM cups WHERE name_ar = 'كوب سيراميك')),

((SELECT id FROM products WHERE name_ar = 'شاي أعشاب'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'شاي أعشاب'), (SELECT id FROM cups WHERE name_ar = 'كوب سيراميك'));

-- Also link the existing product
INSERT INTO product_cups (product_id, cup_id) VALUES
((SELECT id FROM products WHERE name_ar = 'قهوة سادة'), (SELECT id FROM cups WHERE name_ar = 'كوب زجاج')),
((SELECT id FROM products WHERE name_ar = 'قهوة سادة'), (SELECT id FROM cups WHERE name_ar = 'كوب ورق')),
((SELECT id FROM products WHERE name_ar = 'قهوة سادة'), (SELECT id FROM cups WHERE name_ar = 'كوب سيراميك'));
