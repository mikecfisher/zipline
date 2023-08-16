import express from 'express';

export const apiRouter = express.Router();

apiRouter.post('/init_catalog', (req, res) => {});

apiRouter.post('/process_order', (req, res) => {});

apiRouter.post('/process_restock', (req, res) => {});
