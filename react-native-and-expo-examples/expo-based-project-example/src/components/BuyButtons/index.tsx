import React, { useEffect, useState } from "react";
import { View } from "react-native";

import TestButton from "components/TestButton";
import { ProductDataInterface } from "types/products";
import { StyleSheet } from "react-native";
import { textStyles } from "globalStyles";
import { useDispatch, useSelector } from "hooks/reduxHooks";
import {
  flashAddedProductModal,
  formatVariationData,
} from "utils/helperFunctions/simpleHelpers";
import { addProduct } from "redux/actions/cartActions";
import useTheme from "hooks/useTheme";
import Divider from "components/Divider";
import ProviderDisabledModal from "components/ProviderDisabledModal";

interface BuyButtonsProps {
  isCentered?: boolean;
  isColumn?: boolean;
  isSlimButtons?: boolean;
  product: ProductDataInterface;
  fullWidth?: boolean;
}

/**
 * @description Renders the buy buttons for each supported provider
 * @author Ahmed Suljic
 */
const BuyButtons = ({
  isCentered,
  isColumn,
  isSlimButtons,
  product,
  fullWidth,
}: BuyButtonsProps) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const cartProvider = useSelector((state) => state.cart.cartProvider);
  const [showProviderDisabledModal, setShowProviderDisabledModal] =
    useState<boolean>(false);

  product.variations.sort((a, b) => {
    if (a.provider === "quest") {
      return -1;
    }
    if (b.provider === "quest") {
      return 1;
    } else return 0;
  });

  return (
    <>
      <View
        style={[
          localStyles.priceButtonContainer,
          {
            justifyContent: isCentered ? "center" : "space-between",
            flexDirection: isColumn ? "column" : "row",
          },
        ]}>
        {product.variations.map((item, i) => {
          const getIsProviderDisabled = () =>
            item.provider !== cartProvider && cartProvider !== undefined;
          return (
            <>
              <TestButton
                buttonText={formatVariationData(product, item.provider)}
                buttonColor={
                  item.provider === "quest"
                    ? theme.primary
                    : theme.pressableGreen
                }
                onPress={() => {
                  if (getIsProviderDisabled()) {
                    setShowProviderDisabledModal(true);
                  } else {
                    dispatch(addProduct(product, item.provider));
                    flashAddedProductModal();
                  }
                }}
                providerDisabled={getIsProviderDisabled()}
                buttonHeight={isSlimButtons ? 32 : 48}
                buttonWidth={
                  isSlimButtons && product.variations.length < 2
                    ? 143.5
                    : isSlimButtons
                    ? undefined
                    : 156
                }
                fullWidth={fullWidth}
                textStyle={
                  isSlimButtons
                    ? localStyles.priceButtonTextSlim
                    : localStyles.priceButtonText
                }
              />
              {/* This divider only shows if the button is not the last in the list */}
              {i + 1 < product.variations.length && (
                <>
                  <Divider size={8} direction={"v"} />
                  <Divider size={8} direction={"h"} />
                </>
              )}
            </>
          );
        })}
      </View>
      {showProviderDisabledModal && (
        <ProviderDisabledModal
          onPressClose={() => setShowProviderDisabledModal(false)}
        />
      )}
    </>
  );
};

export default BuyButtons;

const localStyles = StyleSheet.create({
  priceButtonContainer: {},
  priceButtonText: {
    ...textStyles.mainBold,
  },
  priceButtonTextSlim: {
    ...textStyles.littleBold,
  },
  priceButtonTextQuest: {
    justifyContent: "center",
    marginLeft: 8,
  },
});
