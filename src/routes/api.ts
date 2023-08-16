import express from 'express';
import { initCatalogSchema, processOrderSchema, processRestockSchema } from '../validation/schemas';
import { processOrder } from '../services/orderService';
import { processRestock } from '../services/inventoryService';
import { Catalog } from '../models/catalog';
import catalogData from '../../catalog_data.json';

const catalog = new Catalog();

export const apiRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/naming-convention
function init_catalog(data: { mass_g: number, product_name: string, product_id: number }[]) {
  const validatedData = initCatalogSchema.parse(data);
  catalog.init_catalog(validatedData);
}

init_catalog(catalogData);

apiRouter.post('/process_order', (req, res) => {
  try {
    const validatedData = processOrderSchema.parse(req.body);
    processOrder(validatedData);
    res.send({ success: true, message: 'Order Processed Successfully' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send({ error: err.message });
    } else {
      res.status(500).send({ error: 'An unexpected error occurred.' });
    }  
  }
});

apiRouter.post('/process_restock', (req, res) => {
  try {
    const validatedData = processRestockSchema.parse(req.body);
    processRestock(validatedData);
    res.send({ success: true, message: 'Order Processed Successfully' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send({ error: err.message });
    } else {
      res.status(500).send({ error: 'An unexpected error occurred.' });
    }  
  }
});
