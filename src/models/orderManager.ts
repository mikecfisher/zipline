import { PrismaClient, Order as PrismaOrder } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderManager {

  async addOrder(order: PrismaOrder): Promise<PrismaOrder> {
    return prisma.order.create({
      data: order,
    });
  }

  async getPendingOrders(): Promise<PrismaOrder[]> {
    // Depending on how you identify pending orders, you might need a filter here
    return prisma.order.findMany();
  }

  async removeOrder(orderId: number): Promise<void> {
    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });
  }
}
