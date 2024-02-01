import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ProcedureStepProps {
  firstStepIcon: React.ReactNode;
  firstStepText: string;
  firstStepOnPress: () => void;
  secondStepIcon: React.ReactNode;
  secondStepText: string;
  secondStepOnPress: () => void;
  thirdStepIcon: React.ReactNode;
  thirdStepText: string;
  thirdStepOnPress: () => void;
  customShadowViewStyles?: StyleProp<ViewStyle>;
}

const ProcedureStep = ({
  firstStepIcon,
  firstStepText,
  firstStepOnPress,
  secondStepIcon,
  secondStepText,
  secondStepOnPress,
  thirdStepIcon,
  thirdStepText,
  thirdStepOnPress,
  customShadowViewStyles,
}: ProcedureStepProps) => {
  const { theme } = useTheme();
  return (
    <View style={localStyles.optionIconDiv}>
      <View style={localStyles.optionIconDivFirst}>
        <View style={[customShadowViewStyles]}>
          <TouchableOpacity onPress={firstStepOnPress}>
            {firstStepIcon}
          </TouchableOpacity>
        </View>
        <Text
          style={[
            localStyles.optionIconDivText,
            { color: theme.darkGreyText },
          ]}>
          {firstStepText}
        </Text>
      </View>

      <View style={[localStyles.optionIconDivFirst]}>
        <View
          style={[
            customShadowViewStyles,
            { height: 80, width: 80, top: "-20%" },
          ]}>
          <TouchableOpacity onPress={secondStepOnPress}>
            {secondStepIcon}
          </TouchableOpacity>
        </View>
        <Text
          style={[
            localStyles.optionIconDivSecondText,
            { color: theme.darkGreyText },
          ]}>
          {secondStepText}
        </Text>
      </View>

      <View style={localStyles.optionIconDivFirst}>
        <View style={[customShadowViewStyles]}>
          <TouchableOpacity onPress={thirdStepOnPress}>
            {thirdStepIcon}
          </TouchableOpacity>
        </View>
        <Text
          style={[
            localStyles.optionIconDivText,
            { color: theme.darkGreyText },
          ]}>
          {thirdStepText}
        </Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  optionIconDiv: {
    flexDirection: "row",
    width: "100%",
    height: 80,
    position: "absolute",
    top: "-20%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  optionIconDivFirst: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 110,
  },
  optionIconDivText: {
    ...textStyles.littleRegular,
    marginTop: 8,
    // top: -10,
  },
  optionIconDivSecondText: {
    ...textStyles.littleRegular,
    top: -3,
  },
});

export default ProcedureStep;
