import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

export type ProductWithoutID = Omit<Product, 'id'>;

export class Catalog {
  async clear() {
    await prisma.product.deleteMany({});
  }

  async init(products: ProductWithoutID[]): Promise<void> {
    for (const product of products) {
      // Prisma createMany() is not supported by sqlLite so we have to use a loop 
      await prisma.product.create({
        data: product,
      });
    }
  }

  async getProductDetails(productId: number): Promise<{ mass_g: number, product_name: string, product_id: number } | null> {
    const details = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    return details;
  }

  async hasProduct(productId: number): Promise<boolean> {
    const productCount = await prisma.product.count({
      where: {
        id: productId,
      },
    });
    return productCount > 0;
  }
}
