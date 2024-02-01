import React, { useRef, FC } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  ColorValue,
  Animated,
  Platform,
} from "react-native";

export interface ButtonProps {
  label?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
  rippleColor?: ColorValue;
  ripple?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onPress(event: GestureResponderEvent): void;
}

/**
 * @description Customizable base button component, which does not allow the button to be
 * accidentally double tapped within 200 ms.
 * @author Ahmed Suljic
 */
const Button: FC<ButtonProps> = ({
  children,
  label,
  wrapperStyle,
  containerStyle,
  textStyle,
  ripple,
  rippleColor,
  disabled,
  onPress,
}) => {
  const fadeAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

  /**
   * @description Executes a fade in animation
   * @author Ahmed Suljic
   */
  const fadeInOut = (pressed: boolean) => {
    if (Platform.OS === "ios") {
      Animated.timing(fadeAnim, {
        toValue: pressed ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const throttled = useRef<boolean>(false);

  /**
   * @description Makes sure the onPress event cannot be fired twice within 200 ms
   * @author Ahmed Suljic
   */
  const onButtonPress = (event: GestureResponderEvent): void => {
    if (!throttled?.current) {
      throttled.current = true;

      setTimeout(() => {
        throttled.current = false;
      }, 200);

      if (onPress) {
        return onPress(event);
      }
    }
  };

  const buttonLabel = <Text style={textStyle}>{label}</Text>;

  return (
    <Animated.View
      style={[
        wrapperStyle,
        {
          opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.7],
          }),
        },
      ]}>
      <Pressable
        onPressIn={() => fadeInOut(true)}
        onPressOut={() => fadeInOut(false)}
        onPress={onButtonPress}
        disabled={disabled}
        android_ripple={
          ripple ? { color: rippleColor, borderless: true } : null
        }
        style={[styles.container, containerStyle]}>
        {children || buttonLabel}
      </Pressable>
    </Animated.View>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
