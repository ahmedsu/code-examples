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
} from "react-native";
import { SvgProps } from "react-native-svg";
import { Input } from "../..";

interface InputProps {
  label: string;
  value: string | undefined;
  onChangeValue: Function;
  onRightIconPress?: Function;
  editable?: boolean;
  multiline?: boolean;
  secureTextEntry?: boolean;
  placeholder?: string;
  RightIcon?: FC<SvgProps>;
  customFullWrapperStyles?: StyleProp<ViewStyle>;
  customLabelContainerStyles?: StyleProp<ViewStyle>;
  customLabelStyles?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  customInputContainerStyles?: StyleProp<ViewStyle>;
  customInputStyles?: StyleProp<TextStyle>;
  starIconText?: string;
}

const LabeledInput = ({
  label = "",
  value,
  onChangeValue,
  onRightIconPress,
  editable = true,
  multiline = false,
  secureTextEntry = false,
  RightIcon,
  customFullWrapperStyles,
  customLabelContainerStyles,
  customLabelStyles,
  customInputContainerStyles,
  customInputStyles,
  starIconText,
}: InputProps) => {
  const { theme } = useTheme();
  return (
    <View style={[localStyles.fullWrapper, customFullWrapperStyles]}>
      {!starIconText ? (
        <View style={[localStyles.labelContainer, customLabelContainerStyles]}>
          <Text
            style={[
              localStyles.label,
              customLabelStyles,
              // { color: theme.secondary },
            ]}>
            {label}
          </Text>
        </View>
      ) : (
        <View
          style={[
            localStyles.labelContainer,
            customLabelContainerStyles,
            { flexDirection: "row" },
          ]}>
          <Text style={[localStyles.label, customLabelStyles]}>{label}</Text>
          <Text
            style={[localStyles.label, customLabelStyles, { color: "red" }]}>
            {starIconText}
          </Text>
        </View>
      )}
      <Input
        value={value}
        onChangeValue={onChangeValue}
        onRightIconPress={onRightIconPress}
        editable={editable}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        RightIcon={RightIcon}
        customInputContainerStyles={[
          customInputContainerStyles,
          localStyles.inputContainer,
          { paddingRight: RightIcon ? 16 : 24 },
        ]}
        customInputStyles={[customInputStyles, { color: theme.darkGreyText }]}
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
  labelContainer: {
    marginBottom: 12,
  },
  label: { ...textStyles.mainText },
  inputContainer: {
    paddingLeft: 24,
  },
});

export default LabeledInput;
