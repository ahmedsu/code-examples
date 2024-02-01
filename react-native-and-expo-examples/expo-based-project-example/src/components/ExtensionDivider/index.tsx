import { StyleSheet, View, Text } from "react-native";
import CheckIcon from "../../../assets/images/svg/HomeIcons/checkIcon.svg";
import NotCheckedIcon from "../../../assets/images/svg/HomeIcons/notCheckedIcon.svg";

interface StepperProps {
  width: string | number;
  height: string | number;
}

const ExtensionDivider = ({ width, height }: StepperProps) => {
  return (
    <View
      style={[
        localStyles.divider,
        {
          width: width ? width : "90%",
          height: height ? height : 2,
        },
      ]}></View>
  );
};

const localStyles = StyleSheet.create({
  divider: {
    backgroundColor: "#ECEBEB",
  },
});

export default ExtensionDivider;
