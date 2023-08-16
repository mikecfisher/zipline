import { PrismaClient, Order as PrismaOrder } from '@prisma/client';

const prisma = new PrismaClient();

export class Order {

  async addOrder(order: PrismaOrder): Promise<PrismaOrder> {
    return prisma.order.create({
      data: order,
    });
  }

  async getPendingOrders(): Promise<PrismaOrder[]> {
    return prisma.order.findMany();
  }

  async removeOrder(orderId: number): Promise<void> {
    await prisma.order.delete({
      where: {
        order_id: orderId,
      },
    });
  }
}
