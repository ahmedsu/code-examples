import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Animated, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";

import checkMark from "../../assets/images/checkMark.png";

/**
 * @description Animated checkbox component
 * @author Ahmed Suljic
 */
function Checkbox({ selected }) {
  const mounted = useRef(false);

  const [scaleIn] = useState(new Animated.Value(0));
  const [drawIn] = useState(new Animated.Value(0));

  const { colors } = useTheme();

  // Make sure animation effects do not get triggered on initial component mounting
  useEffect(() => {
    mounted.current = true;
  }, []);

  const animateCheckbox = (toValue) => {
    Animated.sequence([
      Animated.timing(scaleIn, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(drawIn, {
        toValue,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // If selected prop is true - animate select animation
  if (selected && mounted) {
    animateCheckbox(1);
  }

  // If selected prop is false - deselect animation
  if (!selected && mounted) {
    animateCheckbox(0);
  }

  return (
    <View
      style={[styles.checkboxStyle, { borderColor: colors.blackSecondary8 }]}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: colors.secondary,
            transform: [
              {
                scale: scaleIn.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 24],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.Image
        source={checkMark}
        style={{
          width: drawIn.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 14],
          }),
        }}
      />
    </View>
  );
}
export default React.memo(Checkbox);

Checkbox.propTypes = {
  selected: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  checkboxStyle: {
    width: Platform.OS === "android" ? 25 : 24,
    height: Platform.OS === "android" ? 25 : 24,
    borderRadius: 12,
    borderStyle: "solid",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  overlay: {
    width: 1,
    height: 1,
    borderRadius: 12,
    position: "absolute",
  },
});
