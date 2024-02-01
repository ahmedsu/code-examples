import { CartProviderType } from "redux/interfaces/cartInterface";
import { ProductDataInterface } from "types/products";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const CLEAR_CART = "CLEAR_CART";
export const SET_SHOW_ADDED_PRODUCT_MODAL = "SET_SHOW_ADDED_PRODUCT_MODAL";

export interface AddProduct {
  type: typeof ADD_PRODUCT;
  product: ProductDataInterface;
  provider: CartProviderType;
}

export interface RemoveProduct {
  type: typeof REMOVE_PRODUCT;
  cartUID: string;
}

export interface ClearCart {
  type: typeof CLEAR_CART;
}

export interface SetShowAddedProductModal {
  type: typeof SET_SHOW_ADDED_PRODUCT_MODAL;
  showModal: boolean;
}

export const addProduct = (
  product: ProductDataInterface,
  provider: CartProviderType,
): AddProduct => ({
  type: ADD_PRODUCT,
  product,
  provider,
});

export const removeProduct = (cartUID: string): RemoveProduct => ({
  type: REMOVE_PRODUCT,
  cartUID,
});

export const clearCart = (): ClearCart => ({
  type: CLEAR_CART,
});

export const setShowAddedProductModal = (
  showModal: boolean,
): SetShowAddedProductModal => ({
  type: SET_SHOW_ADDED_PRODUCT_MODAL,
  showModal,
});
