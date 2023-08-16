import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Inventory {
  /**
   * Add products to the inventory (restocking).
   * @param products Array of products with their id and quantity.
   */
  async addProducts(products: { product_id: number, quantity: number }[]): Promise<void> {
    for (const product of products) {
      // Check if the product is already in the inventory
      const existingProduct = await prisma.order.findFirst({
        where: {
          product_id: product.product_id,
        },
      });

      if (existingProduct) {
        // Update the quantity of the existing product
        await prisma.order.update({
          where: {
            id: existingProduct.id,
          },
          data: {
            quantity: existingProduct.quantity + product.quantity,
          },
        });
      } else {
        // Add new product to the inventory
        await prisma.order.create({
          data: {
            product_id: product.product_id,
            quantity: product.quantity,
            order_id: 0, // Placeholder. Ideally we should update this logic if `order_id` has a special meaning.
          },
        });
      }
    }
  }

  /**
   * Reduce the quantity of products in the inventory (for shipments).
   * @param products Array of products with their id and quantity to be reduced.
   */
  async reduceProducts(products: { product_id: number, quantity: number }[]): Promise<void> {
    for (const product of products) {
      const inventoryItem = await prisma.order.findFirst({
        where: {
          product_id: product.product_id,
        },
      });
      if (inventoryItem && inventoryItem.quantity >= product.quantity) {
        await prisma.order.update({
          where: {
            id: inventoryItem.id,
          },
          data: {
            quantity: inventoryItem.quantity - product.quantity,
          },
        });
      }
      // TODO: Handle scenarios where there isn't enough stock or the item doesn't exist in the inventory.
    }
  }

  /**
   * Get the current quantity of a product in the inventory.
   * @param productId The id of the product.
   * @returns The quantity of the product in the inventory.
   */
  async getProductQuantity(productId: number): Promise<number> {
    const inventoryItem = await prisma.order.findFirst({
      where: {
        product_id: productId,
      },
    });
    return inventoryItem?.quantity || 0;
  }
}
