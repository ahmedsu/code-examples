import { textStyles } from "globalStyles";
import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import SearchIcon from "../../../assets/images/svg/search.svg";

interface SearchTextInputProps {
  value: string;
  placeholder: string;
  onChangeText: Function;
  withSearchIcon: boolean;
}

const SearchTextInput = ({
  value,
  placeholder,
  onChangeText,
  withSearchIcon,
}: SearchTextInputProps) => {
  return (
    <View style={localStyles.searchInputDiv}>
      {withSearchIcon ? (
        <View style={localStyles.searchIconDiv}>
          <SearchIcon />
        </View>
      ) : null}
      <TextInput
        style={localStyles.searchInput}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor="#494642"
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  searchInputDiv: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    height: 35,
    alignItems: "center",
    marginTop: 25,
  },
  searchIconDiv: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: "100%",
    ...textStyles.littleRegular,
  },
});

export default SearchTextInput;
