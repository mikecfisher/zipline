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
      const existingProduct = await prisma.product.findFirst({
        where: {
          product_id: product.product_id,
        },
      });

      if (existingProduct) {
        // Update the quantity of the existing product
        await prisma.product.update({
          where: {
            product_id: existingProduct.product_id,
          },
          data: {
            inventoryCount: existingProduct.inventoryCount + product.quantity,
          },
        });
      } else {
        // Add new product to the inventory
      }
    }
  }

  /**
   * Reduce the quantity of products in the inventory (for shipments).
   * @param products Array of products with their id and quantity to be reduced.
   */
  async reduceProducts(products: { product_id: number, quantity: number }[]): Promise<void> {
    for (const product of products) {
      const inventoryItem = await prisma.product.findFirst({
        where: {
          product_id: product.product_id,
        },
      });
      if (inventoryItem && inventoryItem.inventoryCount >= product.quantity) {
        await prisma.product.update({
          where: {
            product_id: inventoryItem.product_id,
          },
          data: {
            inventoryCount: inventoryItem.inventoryCount - product.quantity,
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
    const inventoryItem = await prisma.product.findFirst({
      where: {
        product_id: productId,
      },
    });
    return inventoryItem?.inventoryCount || 0;
  }
}
