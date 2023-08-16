import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

export type ProductWithoutID = Omit<Product, 'id'>;

export class Catalog {
  async clear() {
    await prisma.product.deleteMany({});
  }

  async init_catalog(product_info: any[]): Promise<void> {
    for (const product of product_info) {
      await prisma.product.create({
        data: {
          mass_g: product.mass_g,
          product_name: product.product_name,
          product_id: product.product_id,
          inventoryCount: 0,
        },
      });
    }
  }

  async getProductDetails(productId: number): Promise<{ mass_g: number, product_name: string, product_id: number } | null> {
    const details = await prisma.product.findUnique({
      where: {
        product_id: productId,
      },
    });
    return details;
  }

  async hasProduct(productId: number): Promise<boolean> {
    const productCount = await prisma.product.count({
      where: {
        product_id: productId,
      },
    });
    return productCount > 0;
  }
}
