import {
  AddProduct,
  RemoveProduct,
  ClearCart,
  SetShowAddedProductModal,
} from "redux/actions/cartActions";

export type CartInterface =
  | AddProduct
  | RemoveProduct
  | ClearCart
  | SetShowAddedProductModal;

export interface CartItem {
  productId: number;
  variationId: number | null;
  cartUID?: string; // this is a unique identifier used for removing specific products from the redux cart state (16-digit hex code)
}

export type CartProviderType = "quest" | "labcorp" | "general" | undefined;
