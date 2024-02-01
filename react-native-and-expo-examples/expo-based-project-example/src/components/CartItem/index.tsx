import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Easing } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import CloseIcon from "../../../assets/images/svg/blackCross.svg";

interface CartItemProps {
  onPress: () => void;
  onPressX: () => void;
  productName: string;
  productGroup: string;
  groupColor: string;
  priceText: string;
}

/**
 * @description Touchable card that displays products in the cart, on the CartScreen
 * @author Ahmed Suljic
 */
const CartItem = ({
  onPress,
  onPressX,
  productName,
  productGroup,
  groupColor,
  priceText,
}: CartItemProps) => {
  const { theme } = useTheme();

  const CLOSE_ANIMATION_TIME = 400; // ms

  const animation = useSharedValue({ height: 147, marginTop: 12, opacity: 1 });

  const animationStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(animation.value.height, {
        duration: CLOSE_ANIMATION_TIME,
      }),
      marginTop: withTiming(animation.value.marginTop, {
        duration: CLOSE_ANIMATION_TIME,
      }),
      opacity: withTiming(animation.value.opacity, {
        duration: CLOSE_ANIMATION_TIME,
      }),
    };
  });

  return (
    <TouchableOpacity style={localStyles.cartItem} onPress={onPress}>
      <Animated.View
        style={[
          localStyles.animatedWrapper,
          { backgroundColor: theme.secondary },
          animationStyle,
        ]}>
        <TouchableOpacity
          onPress={() => {
            animation.value = { height: 0, marginTop: 0, opacity: 0 };
            setTimeout(() => {
              onPressX();
            }, CLOSE_ANIMATION_TIME);
          }}
          style={localStyles.closeIconContainer}>
          <CloseIcon />
        </TouchableOpacity>
        <View style={localStyles.marginWrapper}>
          <View style={localStyles.cartItemContent}>
            <Text style={localStyles.cartItemName}>{productName}</Text>
            <View style={localStyles.groupAndPriceContainer}>
              <View
                style={[
                  localStyles.productGroupContainer,
                  { backgroundColor: groupColor },
                ]}>
                <Text
                  style={[
                    localStyles.productGroupText,
                    { color: theme.secondary },
                  ]}>
                  {productGroup}
                </Text>
              </View>
              <Text
                style={[localStyles.priceText, { color: theme.moneyGreen }]}>
                {priceText}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  animatedWrapper: {
    borderRadius: 16,
    width: "100%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  cartItem: {},
  marginWrapper: { margin: 24, overflow: "hidden" },
  closeIconContainer: {
    position: "absolute",
    top: 14,
    right: 14,
  },
  cartItemContent: {},
  cartItemName: {
    ...textStyles.mainBold,
  },
  groupAndPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12.5,
  },
  productGroupContainer: {
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  productGroupText: {
    ...textStyles.littleBold,
  },
  priceText: {
    ...textStyles.mainText,
  },
});

export default CartItem;
