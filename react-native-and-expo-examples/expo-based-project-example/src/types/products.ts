import { CartProviderType } from "redux/interfaces/cartInterface";

export interface ProductDataVariation {
  variation_id: number;
  sku: string;
  price: number;
  provider: CartProviderType;
}

export interface ProductDataInterface {
  id: number;
  title: string;
  price: string | null;
  variations: Array<ProductDataVariation>;
  group: string;
  cartUID?: string;
}
