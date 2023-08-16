import { Product } from '@prisma/client';
import { Catalog } from '../models/catalog';

const productCatalog = new Catalog();

type ProductWithoutID = Omit<Product, 'id'>;

export function initializeCatalog(data: ProductWithoutID[]): void {
  // Clear out existing catalog to reinitialize
  productCatalog.clear();

  // Add new products to catalog
  productCatalog.init(data);
}
