import { PrismaClient } from '@prisma/client';
import { ProductInfo } from './types';

const prisma = new PrismaClient();

export class Catalog {
  async init(products: ProductInfo[]): Promise<void> {
    for (const product of products) {
      // Prisma createMany() is not supported by sqlLite so we have to use a loop 
      await prisma.product.create({
        data: product,
      });
    }
  }
}