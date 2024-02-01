import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from "react-native";
import { SvgProps } from "react-native-svg";
import { Input } from "../..";
import PrimaryButton from "../../Button/types/PrimaryButton";

interface InputProps {
  value: string | undefined;
  buttonText: string;
  onChangeValue: Function;
  onButtonPress: (event: GestureResponderEvent) => any;
  editable?: boolean;
  multiline?: boolean;
  placeholder?: string;
  customFullWrapperStyles?: StyleProp<ViewStyle>;
  customLabelContainerStyles?: StyleProp<ViewStyle>;
  customLabelStyles?: StyleProp<ViewStyle>;
  customInputContainerStyles?: StyleProp<ViewStyle>;
  customInputStyles?: StyleProp<TextStyle>;
}

const LabeledInput = ({
  value,
  onChangeValue,
  onButtonPress,
  editable = true,
  multiline = false,
  placeholder,
  buttonText = "button",
  customFullWrapperStyles,
  customLabelContainerStyles,
  customLabelStyles,
  customInputContainerStyles,
  customInputStyles,
}: InputProps) => {
  const { theme } = useTheme();

  const innerButton = (
    <PrimaryButton
      label={buttonText}
      onPress={onButtonPress}
      wrapperStyle={[
        localStyles.inputButtonWrapper,
        { backgroundColor: theme.primary },
      ]}
      textStyle={[localStyles.inputButtonText, { color: theme.secondary }]}
    />
  );

  return (
    <View style={[localStyles.fullWrapper, customFullWrapperStyles]}>
      <Input
        value={value}
        onChangeValue={onChangeValue}
        editable={editable}
        multiline={multiline}
        InnerChild={innerButton}
        placeholder={placeholder}
        placeholderTextColor={theme.darkGreyText}
        customInputContainerStyles={[
          customInputContainerStyles,
          localStyles.inputContainer,
          {
            borderColor: theme.lightGreyBorder,
            borderWidth: 1,
            backgroundColor: theme.lightGreyBackground,
          },
        ]}
        customInputStyles={[
          customInputStyles,
          localStyles.input,
          { color: theme.darkGreyText },
        ]}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  fullWrapper: {},

  inputContainer: {
    paddingLeft: 24,
    paddingVertical: 8,
    paddingRight: 8,
    borderRadius: 999,
    height: 64,
  },
  input: {
    ...textStyles.mainText,
  },
  inputButtonWrapper: {
    width: 120,
    height: 48,
  },
  inputButtonText: {
    ...textStyles.mainBold,
  },
});

export default LabeledInput;
