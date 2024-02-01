import { FC, ReactNode } from "react";
import {
  TextInput,
  StyleSheet,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

interface InputProps {
  value: string | undefined;
  onChangeValue: Function;
  onRightIconPress?: any;
  placeholder?: string;
  placeholderTextColor?: string;
  editable?: boolean;
  multiline?: boolean;
  secureTextEntry?: boolean;
  RightIcon?: FC<SvgProps>;
  InnerChild?: ReactNode;
  customInputStyles?: StyleProp<TextStyle>;
  customInputContainerStyles?: StyleProp<ViewStyle>;
}

const Input = ({
  value,
  onChangeValue,
  onRightIconPress,
  editable = true,
  multiline = false,
  secureTextEntry = false,
  placeholder = "",
  placeholderTextColor,
  RightIcon,
  InnerChild,
  customInputStyles,
  customInputContainerStyles,
}: InputProps) => {
  return (
    <View style={[localStyles.container, customInputContainerStyles]}>
      <TextInput
        style={[localStyles.input, customInputStyles]}
        editable={editable}
        value={value}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        autoCapitalize={"none"}
        onChangeText={(newText) => {
          onChangeValue(newText);
        }}
      />
      {RightIcon ? (
        <TouchableOpacity
          style={localStyles.rightIconContainer}
          onPress={onRightIconPress}>
          <RightIcon />
        </TouchableOpacity>
      ) : InnerChild ? (
        InnerChild
      ) : null}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
  },
  input: {
    flex: 1,
  },
  rightIconContainer: {
    height: "100%",
    justifyContent: "center",
  },
});

export default Input;
