import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  StyleProp,
  ViewStyle,
} from "react-native";
import ChevronDownIcon from "../../../assets/images/svg/chevronDown.svg";
import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";

interface DropDownInputProps {
  value: string;
  placeholder: string;
  onChangeText: Function;
  customFullWrapperStyles?: StyleProp<ViewStyle>;
  customIconStyles?: StyleProp<ViewStyle>;
}

const DropDownInput = ({
  value,
  placeholder,
  onChangeText,
  customFullWrapperStyles,
  customIconStyles,
}: DropDownInputProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        localStyles.searchInputDiv,
        customFullWrapperStyles,
        { backgroundColor: theme.secondary },
      ]}>
      <TextInput
        style={localStyles.searchInput}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor="#494642"
      />
      <View style={[localStyles.searchIconDiv, customIconStyles]}>
        <ChevronDownIcon />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  searchInputDiv: {
    width: "90%",
    borderRadius: 5,
    flexDirection: "row",
    height: 35,
    alignItems: "center",
    marginTop: 25,
    justifyContent: "space-between",
  },
  searchIconDiv: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: "100%",
    width: "80%",
    ...textStyles.littleRegular,
    paddingLeft: 15,
  },
});

export default DropDownInput;
