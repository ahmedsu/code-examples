import { setShowAddedProductModal } from "redux/actions/cartActions";
import { store } from "redux/store";
import { ProductDataInterface } from "types/products";
import { ADDED_PRODUCT_MODAL_DURATION } from "utils/constants";

export const capitalizeFirstLetter = (string?: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return "";
};

/**
 * @description Takes a product and a test provider name (quest, labcorp or general - for when there is no provider) and returns a string for the button (example: $1,200 - Quest)
 * @author Ahmed Suljic
 */
export const formatVariationData = (
  product: ProductDataInterface,
  provider: string | undefined,
) => {
  if (provider === "general" && product.price !== null) {
    return `$${product.price} - General`;
  }
  const desiredVariation = product.variations.find(
    (item) => item.provider === provider,
  );
  if (desiredVariation) {
    return `$${desiredVariation?.price} - ${capitalizeFirstLetter(
      desiredVariation?.provider,
    )}`;
  }
  return "";
};

/**
 * @description Filters out one specific object from array by one of its properties, and returns the new array. Does not modify the original array.
 * @author Ahmed Suljic
 */
export const removeObjectOnce = (
  arr: Array<any>,
  value: any,
  property: string,
) => {
  const filteredArray = arr.filter((item) => item[property] !== value);
  return filteredArray;
};

/**
 * @description Generates a random hex number of a given length based on the size parameter
 * @author Ahmed Suljic
 */
export const generateRandomHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

/**
 * @description Shows the AddedProductModal for a set duration, then hides it
 * @author Ahmed Suljic
 */
export const flashAddedProductModal = () => {
  const isAlreadyShowingModal = store.getState().cart.showAddedProductModal;
  if (!isAlreadyShowingModal) {
    setTimeout(() => {
      store.dispatch(setShowAddedProductModal(false));
    }, ADDED_PRODUCT_MODAL_DURATION);
  }
  store.dispatch(setShowAddedProductModal(true));
};
