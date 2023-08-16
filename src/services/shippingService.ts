/**
 * Simulate shipping of a package.
 * 
 * @param shipment - The package to be shipped.
 */
export async function shipPackage(shipment: { order_id: number; shipped: { product_id: number, quantity: number }[] }): Promise<void> {
  // In a real-world application, you might update the database to note that these products have been shipped,
  // or trigger some external system or notification. Here, it just logs the shipment.
  console.log('Shipping:', shipment);

  // If you had the OrderManager integrated:
  // await OrderManager.markOrderAsShipped(shipment.order_id, shipment.shipped);
}