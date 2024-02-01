import { StyleSheet } from "react-native";

export const textStyles = StyleSheet.create({
  // Open Sans

  h4: {
    fontFamily: "open-sans-regular",
    fontSize: 25,
    lineHeight: 30,
  },
  mainText: {
    fontFamily: "open-sans-regular",
    fontSize: 16,
    lineHeight: 25,
  },
  mainBold: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    lineHeight: 25,
  },
  littleRegular: {
    fontFamily: "open-sans-regular",
    fontSize: 14,
    lineHeight: 20,
  },
  littleBold: {
    fontFamily: "open-sans-bold",
    fontSize: 14,
    lineHeight: 20,
  },
  littleItalic: {
    fontStyle: "italic",
  },

  // Montserrat

  bodyLarge: {
    fontFamily: "montserrat-semiBold",
    fontSize: 18,
    lineHeight: 25,
  },
});
