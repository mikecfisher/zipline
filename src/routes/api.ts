import express from 'express';
import { initCatalogSchema, processOrderSchema, processRestockSchema } from '../validation/schemas';

export const apiRouter = express.Router();

apiRouter.post('/init_catalog', (req, res) => {
  try {
    const validatedData = initCatalogSchema.parse(req.body);
    // do something
    res.send({ success: true, message: 'Catalog initialized' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send({ error: err.message });
    } else {
      res.status(500).send({ error: 'An unexpected error occurred.' });
    }  
  }
});

apiRouter.post('/process_order', (req, res) => {});

apiRouter.post('/process_restock', (req, res) => {});
