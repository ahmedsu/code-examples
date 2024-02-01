import * as actions from "redux/actions/cartActions";
import { Action } from "redux/interfaces";
import { CartItem, CartProviderType } from "redux/interfaces/cartInterface";
import { ProductDataInterface } from "types/products";

import {
  generateRandomHex,
  removeObjectOnce,
} from "utils/helperFunctions/simpleHelpers";

interface CartState {
  products: Array<CartItem>;
  showAddedProductModal: boolean;
  cartProvider: CartProviderType;
}

/**
 * @description Returns a new state with a new CartItem in it
 * @author Ahmed Suljic
 */
const addProductHandler = (
  product: ProductDataInterface,
  provider: CartProviderType,
  state: CartState,
) => {
  let newState: CartState = state;
  if (product.price) {
    newState = {
      ...state,
      products: [
        ...state.products,
        {
          productId: product.id,
          variationId: null,
          cartUID: generateRandomHex(16),
        },
      ],
      cartProvider: provider,
    };
  } else if (product.variations.length) {
    newState = {
      ...state,
      products: [
        ...state.products,
        {
          productId: product.id,
          variationId:
            product.variations.find((item) => item.provider === provider)
              ?.variation_id || 0,
          cartUID: generateRandomHex(16),
        },
      ],
      cartProvider: provider,
    };
  }
  return newState;
};

/**
 * @description Returns a new state with a CartItem removed from it
 * @author Ahmed Suljic
 */
const removeProductHandler = (cartUID: string, state: CartState) => {
  return {
    ...state,
    products: removeObjectOnce(state.products, cartUID, "cartUID"),
    cartProvider: state.products.length > 1 ? state.cartProvider : undefined,
  };
};

const initialState: CartState = {
  products: [],
  showAddedProductModal: false,
  cartProvider: undefined,
};
const cartReducer = (state = initialState, action: Action): CartState => {
  switch (action.type) {
    case actions.ADD_PRODUCT:
      return addProductHandler(action.product, action.provider, state);
    case actions.REMOVE_PRODUCT:
      return removeProductHandler(action.cartUID, state);
    case actions.CLEAR_CART:
      return {
        ...state,
        products: [],
      };
    case actions.SET_SHOW_ADDED_PRODUCT_MODAL:
      return {
        ...state,
        showAddedProductModal: action.showModal,
      };
    default:
      return state;
  }
};

export default cartReducer;
