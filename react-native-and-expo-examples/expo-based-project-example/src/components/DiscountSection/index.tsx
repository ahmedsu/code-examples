import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

import { GiftIcon } from "../../../assets/images/svg";
import Divider from "components/Divider";

interface DiscountSectionProps {
  text: string;
  pressLearnMore(event: GestureResponderEvent): void;
}

const DiscountSection = ({ text, pressLearnMore }: DiscountSectionProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[localStyles.discountDiv, { backgroundColor: theme.moneyGreen }]}>
      <View style={localStyles.discountDivFirst}>
        <GiftIcon width={14} height={14} />
        <Divider size={10} direction={"h"} />
        <Text
          style={[
            localStyles.discountDivTextFirst,
            { color: theme.secondary },
          ]}>
          {text}
        </Text>
      </View>

      <TouchableOpacity
        style={localStyles.discountDivSecond}
        onPress={pressLearnMore}>
        <Text
          style={[
            localStyles.discountDivTextSecond,
            { color: theme.secondary },
          ]}>
          Learn more
        </Text>
        <Divider size={25} direction={"h"} />
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  discountDiv: {
    width: "100%",
    height: 44,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  discountDivFirst: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discountDivTextFirst: {
    ...textStyles.littleBold,
  },
  discountDivTextSecond: {
    ...textStyles.littleRegular,
  },
  discountDivTextThird: {
    ...textStyles.littleBold,
  },
  discountDivSecond: {},
});

export default DiscountSection;
