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
}