import React, { FC, useMemo, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Navigation } from "types";

import { CartItem, Header, PrimaryButton, Divider } from "../../components";
import InnerButtonInput from "../../components/Input/types/InnerButtonInput";

import { textStyles } from "globalStyles";
import { t } from "i18n-js";
import useTheme from "hooks/useTheme";
import { useDispatch, useSelector } from "hooks/reduxHooks";
import { useQuery } from "react-query";
import { ProductDataInterface, ProductDataVariation } from "types/products";
import { getAllProducts } from "services/products";
import { CartItem as CartItemInterface } from "redux/interfaces/cartInterface";
import { removeProduct } from "redux/actions/cartActions";

interface CartScreenProps {
  navigation: Navigation;
}

/**
 * @description Shows all items currently in the card, the coupon input & navigation to checkout
 * @author Ahmed Suljic
 */
const CartScreen: FC<CartScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();

  const cartProducts: Array<CartItemInterface> = useSelector(
    (state) => state.cart.products,
  );

  const {
    isError,
    isLoading: isLoadingProducts,
    data: productData,
  } = useQuery<Array<ProductDataInterface> | any[]>(
    ["products"],
    getAllProducts,
  );

  /**
   * @description Returns full populated product data (but with only the selected variation) from the react query state, based on the productIds from cartProducts
   * @author Ahmed Suljic
   */
  const populatedCartProducts: Array<ProductDataInterface> = useMemo(() => {
    const populatedProducts = cartProducts.map(
      (cartProduct: CartItemInterface) => {
        const fullProduct = productData?.find(
          (fullProduct: ProductDataInterface) =>
            fullProduct.id === cartProduct.productId,
        );
        const filteredVariations = fullProduct.variations.filter(
          (item: ProductDataVariation) =>
            item.variation_id === cartProduct.variationId,
        );
        // we need a full product interface but with only a single variation so we know which variation the user selected
        const fullProductWithSingleVariation: ProductDataInterface = {
          ...fullProduct,
          variations: filteredVariations,
          cartUID: cartProduct.cartUID,
        };
        return fullProductWithSingleVariation;
      },
    );
    return populatedProducts;
  }, [cartProducts, productData]);

  /**
   * @description Returns total price of all products in cart. NOTE: the price in variations is a number, while the price in the root ProductData object is string | null. This is handled in this function however it could be a liability if the types are changed in the future
   * @author Ahmed Suljic
   */
  const subtotal: number = useMemo(() => {
    const productPrices = populatedCartProducts.map((item) => {
      if (item.price) {
        return Number(item.price);
      } else if (item.variations[0].price) {
        return item.variations[0].price;
      }
      return 0;
    });
    const totalPrice = productPrices.reduce((acc, cur) => acc + cur, 0);
    return totalPrice;
  }, [populatedCartProducts]);

  return (
    <ScrollView
      style={[localStyles.container, { backgroundColor: theme.secondary }]}>
      <Header
        onDrawerPress={() =>
          navigation.navigate("shop", { screen: "CartScreen" })
        }
        onSettingsPress={() =>
          navigation.navigate("healthReport", { screen: "EditAccountScreen" })
        }
        onLogoPress={() => navigation.navigate("HomeScreen")}
      />

      <View
        style={[
          localStyles.cartTitleContainer,
          { backgroundColor: theme.primary },
        ]}>
        <Text style={[localStyles.cartTitleText, { color: theme.secondary }]}>
          {t("cartScreenTitle")}
        </Text>
      </View>

      <View
        style={[
          localStyles.cartItemAndCouponContainer,
          { backgroundColor: theme.lightGreyBackground },
        ]}>
        {populatedCartProducts.map((item) => (
          <CartItem
            productName={item.title}
            productGroup={"Sexual Health"}
            priceText={
              item.variations.length
                ? `$${item.variations[0].price}.00`
                : item.price || "Unknown price"
            }
            onPress={() => {}}
            onPressX={() => dispatch(removeProduct(item.cartUID || ""))}
            groupColor={"#7C5380"}
            key={item.cartUID}
          />
        ))}

        <InnerButtonInput
          customFullWrapperStyles={localStyles.couponInput}
          buttonText="Apply"
          placeholder="Coupon code"
          value={couponCode}
          onChangeValue={setCouponCode}
          onButtonPress={() => {}}
        />
      </View>

      <View
        style={[
          localStyles.totalSection,
          { backgroundColor: theme.lightGreyBorder },
        ]}>
        <View style={localStyles.totalRow}>
          <Text
            style={[localStyles.subtotalText, { color: theme.darkGreyText }]}>
            {t("subtotal")}
          </Text>
          <Text
            style={[localStyles.subtotalText, { color: theme.darkGreyText }]}>
            ${subtotal.toFixed(2)}
          </Text>
        </View>
        <Divider size={16} />
        <View style={localStyles.totalRow}>
          <Text style={[localStyles.totalText, { color: theme.darkGreyText }]}>
            {t("total")}
          </Text>
          <Text style={[localStyles.totalText, { color: theme.darkGreyText }]}>
            ${subtotal.toFixed(2)}
          </Text>
        </View>
        <Divider size={32} />
        {populatedCartProducts.length !== 0 && (
          <PrimaryButton
            label={t("proceedCheckout")}
            onPress={() => {}}
            wrapperStyle={[
              localStyles.checkoutButton,
              { backgroundColor: theme.moneyGreen },
            ]}
            textStyle={{ color: theme.secondary }}
          />
        )}
        <Divider size={16} />
        <PrimaryButton
          label={t("continueShopping")}
          onPress={() => navigation.navigate("shop", { screen: "ShopScreen" })}
          wrapperStyle={[
            localStyles.continueButton,
            { backgroundColor: "transparent", borderColor: theme.moneyGreen },
          ]}
          textStyle={{ color: theme.moneyGreen }}
        />
        <Divider size={158} />
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartTitleContainer: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  cartTitleText: {
    ...textStyles.h4,
  },
  cartItemAndCouponContainer: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 56,
  },
  couponInput: {
    marginTop: 24,
  },
  totalSection: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtotalText: {
    ...textStyles.mainText,
  },
  totalText: {
    ...textStyles.h4,
  },
  checkoutButton: {
    height: 48,
  },
  continueButton: {
    height: 48,
    borderWidth: 1,
  },
});

export default CartScreen;
