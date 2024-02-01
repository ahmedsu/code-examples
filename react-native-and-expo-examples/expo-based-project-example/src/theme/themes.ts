import { ThemeContextProps } from "./ThemeContext";

//TODO: FIRSTLY, ADD THE NAME OF YOUR THEME TO Themes enum, and then to Theme type with | "themeName"
export enum Themes {
  light = "light",
  dark = "dark",
}
export type ThemeType = "light" | "dark";

//TODO: ADD ALL OF THE COLORS YOU WANT TO HAVE IN YOUR THEME
export enum ThemeAttributes {
  primary = "primary",
  secondary = "secondary",
  darkGreyText = "darkGreyText",
  lightGreyBorder = "lightGreyBorder",
  lightGreyBackground = "lightGreyBackground",
  pressableGreen = "pressableGreen",
  moneyGreen = "moneyGreen",
  problemRed = "problemRed",
  borderLightGrey = "borderLightGrey",
}

const textColors = {
  darkGreyText: "#494642",
};

//TODO: ADD YOUR THEMES INSIDE THE themes object, TYPESCRIPT WILL WARN YOU IF YOU MESS UP
export const themes: ThemeContextProps = {
  light: {
    primary: "#0080B8",
    secondary: "white",
    pressableGreen: "#009988",
    moneyGreen: "#069D19",
    lightGreyBorder: "#ECEBEB",
    lightGreyBackground: "#F5F5F5",
    problemRed: "#E23C3C",
    borderLightGrey: "rgba(73, 70, 66, 0.2)",
    ...textColors,
  },
  dark: {
    primary: "purple",
    secondary: "white",
    pressableGreen: "#009988",
    moneyGreen: "#069D19",
    lightGreyBorder: "#ECEBEB",
    lightGreyBackground: "#F5F5F5",
    problemRed: "#E23C3C",
    borderLightGrey: "rgba(73, 70, 66, 0.2)",
    ...textColors,
  },
};
