import React, { FC } from "react";
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
  TextStyle,
} from "react-native";

import Button from "../Button";

import { textStyles } from "globalStyles";

interface PrimaryButtonProps {
  label?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress(event: GestureResponderEvent): void;
  children?: React.ReactNode;
  rightIcon?: boolean;
  disabled?: boolean;
}

/**
 * @description Primary button which displays our default button
 * @author Ahmed Suljic
 */
const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  label,
  wrapperStyle,
  containerStyle = {},
  textStyle,
  onPress,
  rightIcon,
  disabled,
}) => {
  return (
    <Button
      label={label}
      onPress={onPress}
      ripple
      rippleColor={"white"}
      disabled={disabled}
      wrapperStyle={[styles.wrapper, wrapperStyle]}
      containerStyle={[styles.containerStyle, containerStyle]}
      textStyle={[styles.label, textStyle]}>
      {children}
    </Button>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  label: {
    ...textStyles.mainBold,
    color: "black",
  },
  wrapper: {
    backgroundColor: "white",
    overflow: "hidden",
    borderRadius: 999,
    justifyContent: "center",
  },
  containerStyle: {
    paddingHorizontal: 16,
  },
});
