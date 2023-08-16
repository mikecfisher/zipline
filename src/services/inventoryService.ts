import { Order } from '../models/order';
import { processOrder } from './orderService';  // If this is how you've structured your order processing
import { Inventory } from '../models/inventory';

const orderManager = new Order();
const inventory = new Inventory();

/**
 * Processes the restock data, updates the inventory, and checks if any pending orders can be fulfilled.
 * 
 * @param restockData - The restock data from the API.
 */
export async function processRestock(restockData: { product_id: number, quantity: number }[]): Promise<void> {
  // 1. Update inventory with restocked items
  await inventory.addProducts(restockData);

  // 2. Check for pending orders
  const pendingOrders = await orderManager.getPendingOrders();

  for (const order of pendingOrders) {
    // Try to process each pending order again now that new stock has arrived
    await processOrder(order);
  }
}

