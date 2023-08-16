import { z } from 'zod';

const productInfoSchema = z.object({
  mass_g: z.number(),
  product_name: z.string(),
  product_id: z.number(),
});

export const initCatalogSchema = z.array(productInfoSchema);

const orderItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().nonnegative(),
});

export const processOrderSchema = z.object({
  order_id: z.number(),
  requested: z.array(orderItemSchema),
});

const restockItemSchema = orderItemSchema; // Since both have product_id and quantity
export const processRestockSchema = z.array(restockItemSchema);
