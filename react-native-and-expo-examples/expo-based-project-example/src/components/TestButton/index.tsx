import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

interface TestButtonProps {
  buttonText: string;
  buttonColor: string;
  onPress: () => void;
  providerDisabled: boolean;
  buttonWidth?: string | number;
  fullWidth?: boolean;
  buttonHeight: string | number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const TestButton = ({
  buttonText,
  buttonColor,
  onPress,
  providerDisabled,
  buttonWidth,
  fullWidth,
  buttonHeight,
  containerStyle,
  textStyle,
}: TestButtonProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[
        localStyles.testButton,
        containerStyle,
        {
          backgroundColor: buttonColor,
          width: fullWidth ? "100%" : buttonWidth ? buttonWidth : "auto",
          height: buttonHeight,
          opacity: providerDisabled ? 0.55 : 1,
          flex: buttonWidth ? undefined : fullWidth ? 1 : undefined,
        },
      ]}
      onPress={onPress}>
      <Text
        style={[
          localStyles.testButtonText,
          textStyle,
          { color: theme.secondary },
        ]}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  testButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  testButtonText: {
    ...textStyles.littleBold,
  },
});

export default TestButton;
