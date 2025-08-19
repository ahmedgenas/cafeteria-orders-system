import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

// Order creation schema
const CreateOrderSchema = z.object({
  customer_name: z.string().optional(),
  items: z.array(z.object({
    product_id: z.number(),
    cup_id: z.number().nullable(),
    quantity: z.number(),
    sugar_spoons: z.number().default(0),
    milk_quarters: z.number().default(0)
  })),
  notes: z.string().optional()
});

// Get all categories
app.get("/api/categories", async (c) => {
  const categories = await c.env.DB.prepare("SELECT * FROM categories WHERE 1=1").all();
  return c.json(categories.results);
});

// Get main products by category (parent products only)
app.get("/api/main-products", async (c) => {
  const categoryId = c.req.query("category_id");
  let query = "SELECT * FROM products WHERE is_active = 1 AND parent_id IS NULL";
  const params = [];
  
  if (categoryId) {
    query += " AND category_id = ?";
    params.push(categoryId);
  }
  
  const products = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(products.results);
});

// Get sub-products by parent product
app.get("/api/sub-products/:parentId", async (c) => {
  const parentId = c.req.param("parentId");
  const products = await c.env.DB.prepare(
    "SELECT * FROM products WHERE is_active = 1 AND parent_id = ?"
  ).bind(parentId).all();
  return c.json(products.results);
});

// Get products by category (all products)
app.get("/api/products", async (c) => {
  const categoryId = c.req.query("category_id");
  const parentId = c.req.query("parent_id");
  let query = "SELECT * FROM products WHERE is_active = 1";
  const params = [];
  
  if (categoryId) {
    query += " AND category_id = ?";
    params.push(categoryId);
  }
  
  if (parentId) {
    query += " AND parent_id = ?";
    params.push(parentId);
  }
  
  const products = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(products.results);
});

// Get cups for a specific product
app.get("/api/product-cups/:productId", async (c) => {
  const productId = c.req.param("productId");
  const cups = await c.env.DB.prepare(`
    SELECT c.* FROM cups c
    JOIN product_cups pc ON c.id = pc.cup_id
    WHERE pc.product_id = ? AND c.is_active = 1
  `).bind(productId).all();
  return c.json(cups.results);
});

// Get all cups
app.get("/api/cups", async (c) => {
  const cups = await c.env.DB.prepare("SELECT * FROM cups WHERE is_active = 1").all();
  return c.json(cups.results);
});

// Get inventory items
app.get("/api/inventory", async (c) => {
  const inventory = await c.env.DB.prepare("SELECT * FROM inventory WHERE is_active = 1").all();
  return c.json(inventory.results);
});

// Get ingredient prices
app.get("/api/ingredient-prices", async (c) => {
  const ingredients = await c.env.DB.prepare(`
    SELECT item_name, item_name_ar, cost_per_unit, unit, unit_ar 
    FROM inventory 
    WHERE is_active = 1 AND (item_name = 'Sugar' OR item_name = 'Milk')
  `).all();
  return c.json(ingredients.results);
});

// Create order
app.post("/api/orders", zValidator("json", CreateOrderSchema), async (c) => {
  const data = c.req.valid("json");
  
  // Calculate total price
  let totalPrice = 0;
  const orderItems = [];
  
  for (const item of data.items) {
    // Get product
    const product = await c.env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(item.product_id).first() as any;
    
    if (!product) {
      return c.json({ error: "Product not found" }, 400);
    }
    
    let itemTotal = product.price * item.quantity;
    
    // Add cup cost if product needs cup
    if (product.needs_cup && item.cup_id) {
      const cup = await c.env.DB.prepare("SELECT price FROM cups WHERE id = ?").bind(item.cup_id).first() as { price: number } | null;
      if (cup) {
        itemTotal += cup.price * item.quantity;
      }
    }
    
    // Add sugar cost if product allows sugar
    if (product.allows_sugar) {
      const sugarItem = await c.env.DB.prepare("SELECT cost_per_unit FROM inventory WHERE item_name = 'Sugar' AND is_active = 1").first() as { cost_per_unit: number } | null;
      const sugarCost = item.sugar_spoons * (sugarItem?.cost_per_unit || 1.0);
      itemTotal += sugarCost * item.quantity;
    }
    
    // Add milk cost if product allows milk
    if (product.allows_milk) {
      const milkItem = await c.env.DB.prepare("SELECT cost_per_unit FROM inventory WHERE item_name = 'Milk' AND is_active = 1").first() as { cost_per_unit: number } | null;
      const milkCost = item.milk_quarters * (milkItem?.cost_per_unit || 5.0);
      itemTotal += milkCost * item.quantity;
    }
    
    totalPrice += itemTotal;
    orderItems.push({
      ...item,
      item_total: itemTotal
    });
  }
  
  try {
    // Insert order
    const orderResult = await c.env.DB.prepare(
      "INSERT INTO orders (customer_name, total_price, notes) VALUES (?, ?, ?) RETURNING id"
    ).bind(data.customer_name || null, totalPrice, data.notes || null).first() as { id: number } | null;
    
    if (!orderResult) {
      return c.json({ error: "Failed to create order" }, 500);
    }
    
    const orderId = orderResult.id;
    
    // Insert order items
    for (const item of orderItems) {
      await c.env.DB.prepare(
        "INSERT INTO order_items (order_id, product_id, cup_id, quantity, sugar_spoons, milk_quarters, item_total) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(orderId, item.product_id, item.cup_id || null, item.quantity, item.sugar_spoons, item.milk_quarters, item.item_total).run();
    }
    
    return c.json({ 
      success: true, 
      order_id: orderId, 
      total_price: totalPrice 
    });
  } catch (error) {
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Get orders
app.get("/api/orders", async (c) => {
  const orders = await c.env.DB.prepare(`
    SELECT o.*, 
           GROUP_CONCAT(p.name_ar || ' (' || oi.quantity || ')') as items_summary
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 50
  `).all();
  
  return c.json(orders.results);
});

// Upload image endpoint
app.post("/api/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'Invalid file type' }, 400);
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return c.json({ error: 'File too large' }, 400);
    }

    // For now, return a placeholder URL
    // In production, you would upload to Cloudflare Images or R2
    const imageUrl = `https://mocha-cdn.com/uploads/${Date.now()}-${file.name}`;
    
    return c.json({ 
      success: true, 
      url: imageUrl 
    });
  } catch (error) {
    return c.json({ error: 'Upload failed' }, 500);
  }
});

export default {
  fetch: app.fetch.bind(app)
};
