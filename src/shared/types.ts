import z from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  name_ar: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  name_ar: z.string(),
  price: z.number(),
  category_id: z.number(),
  parent_id: z.number().nullable(),
  is_active: z.number(),
  needs_cup: z.number(),
  allows_sugar: z.number(),
  allows_milk: z.number(),
  icon_url: z.string().nullable(),
  image_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CupSchema = z.object({
  id: z.number(),
  name: z.string(),
  name_ar: z.string(),
  price: z.number(),
  is_active: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProductCupSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  cup_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const InventorySchema = z.object({
  id: z.number(),
  item_name: z.string(),
  item_name_ar: z.string(),
  unit: z.string(),
  unit_ar: z.string(),
  cost_per_unit: z.number(),
  current_stock: z.number(),
  is_active: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const OrderItemSchema = z.object({
  product_id: z.number(),
  cup_id: z.number().nullable(),
  quantity: z.number(),
  sugar_spoons: z.number().default(0),
  milk_quarters: z.number().default(0),
});

export const CreateOrderSchema = z.object({
  customer_name: z.string().optional(),
  items: z.array(OrderItemSchema),
  notes: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Cup = z.infer<typeof CupSchema>;
export type ProductCup = z.infer<typeof ProductCupSchema>;
export type Inventory = z.infer<typeof InventorySchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
