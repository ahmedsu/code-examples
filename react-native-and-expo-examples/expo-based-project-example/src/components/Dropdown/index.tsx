import React, { Dispatch, SetStateAction, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ChevronDownIcon from "../../../assets/images/svg/chevronDown.svg";
import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";

interface PickerItem {
  label: string;
  value?: string;
}

interface InputProps {
  pickerState: string;
  setPickerState: any;
  items: Array<PickerItem>;
  customDropDownDivStyles?: StyleProp<ViewStyle>;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function Dropdown({
  pickerState,
  setPickerState,
  items,
  customDropDownDivStyles,
  open = false,
  setOpen,
}: InputProps) {
  const { theme } = useTheme();
  const [localIsOpen, setLocalIsOpen] = useState(false);
  return (
    <View
      style={[
        customDropDownDivStyles,
        localStyles.wrapper,
        { zIndex: open || localIsOpen ? 50 : 0 },
      ]}>
      <DropDownPicker
        style={localStyles.dropDownDiv}
        containerStyle={localStyles.pickerStyle}
        textStyle={{ color: theme.darkGreyText, ...textStyles.littleRegular }}
        dropDownContainerStyle={localStyles.dropdownList}
        items={items}
        placeholder={""}
        open={open ? open : localIsOpen}
        setOpen={setOpen ? setOpen : setLocalIsOpen}
        value={pickerState}
        setValue={setPickerState}
        zIndex={open || localIsOpen ? 50 : 0}
      />
    </View>
  );
}
const localStyles = StyleSheet.create({
  wrapper: {},
  dropDownDiv: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.2)",
    overflow: "hidden",
  },
  dropdownList: {
    borderColor: "rgba(100, 100, 100, 0.2)",
  },
  pickerStyle: {
    backgroundColor: "#fff",
    width: "100%",
    borderWidth: 0,
  },
  searchIconDiv: {
    height: 10,
    position: "absolute",
    bottom: 15,
    right: 10,
  },
});
