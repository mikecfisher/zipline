import { Catalog } from '../models/catalog';
import { Inventory } from '../models/inventory';
import { ProcessOrder } from '../validation/schemas';
import { shipPackage as ship_package } from './shippingService';

const MAX_SHIPMENT_WEIGHT = 1800; // 1.8kg in grams

const inventory = new Inventory();
const catalog = new Catalog();



export async function processOrder(order: ProcessOrder): Promise<void> {
  const itemsToShip: { product_id: number, quantity: number }[] = [];

  for (const request of order.requested) {
    const inventoryItem = await inventory.getProductQuantity(request.product_id);
    const productDetails = await catalog.getProductDetails(request.product_id);
  
    if (!productDetails) {
      throw new Error(`Product with ID ${request.product_id} not found in catalog.`);
    }
  
    const amountToShip = Math.min(request.quantity, inventoryItem);
    if (amountToShip > 0) {
      itemsToShip.push({
        product_id: request.product_id,
        quantity: amountToShip,
      });
    }
  
    // Deduct the quantity from the inventory.
    await inventory.reduceProducts([{
      product_id: request.product_id,
      quantity: amountToShip,
    }]);
  }

  // Create shipments without exceeding the max weight.
  let currentShipmentWeight = 0;
  let currentShipment: { product_id: number, quantity: number }[] = [];
  for (const item of itemsToShip) {
    const productDetails = await catalog.getProductDetails(item.product_id);

    if (!productDetails) throw new Error('no products'); 

    const productWeight = productDetails.mass_g * item.quantity;

    if (currentShipmentWeight + productWeight <= MAX_SHIPMENT_WEIGHT) {
      currentShipment.push(item);
      currentShipmentWeight += productWeight;
    } else {
      ship_package({ order_id: order.order_id, shipped: currentShipment });
      currentShipment = [item];
      currentShipmentWeight = productWeight;
    }
  }

  if (currentShipment.length > 0) {
    ship_package({ order_id: order.order_id, shipped: currentShipment });
  }
}

