import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";

import useTheme from "hooks/useTheme";

interface NewActivityBubbleProps {
  number: string;
  customStyles?: StyleProp<ViewStyle>;
}

/**
 * @description Green bubble shown in the top right corner of various icons that indicates new activity in the relevant stack/screen
 * @author Ahmed Suljic
 */
const NewActivityBubble = ({
  number,
  customStyles,
}: NewActivityBubbleProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        localStyles.container,
        customStyles,
        { backgroundColor: theme.moneyGreen, borderColor: theme.secondary },
      ]}>
      <Text style={{ color: theme.secondary }}>{number}</Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});

export default NewActivityBubble;
