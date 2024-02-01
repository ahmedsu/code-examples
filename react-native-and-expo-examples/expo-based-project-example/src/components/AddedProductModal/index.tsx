import useTheme from "hooks/useTheme";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import TestButton from "components/TestButton";

import { textStyles } from "globalStyles";
import BlackCrossIcon from "../../../assets/images/svg/blackCross.svg";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "hooks/reduxHooks";
import { setShowAddedProductModal } from "redux/actions/cartActions";

interface AddedProductModalProps {
  yOffset?: number;
}

/**
 * @description Displays a modal notifying the user that the product was added to the cart
 * 
 * @author Ahmed Suljic
 */
const AddedProductModal = ({ yOffset }: AddedProductModalProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}>
      <View
        style={[
          localStyles.mainContainer,
          { bottom: yOffset || 90, backgroundColor: theme.secondary },
        ]}>
        <Text style={localStyles.addedText}>Added</Text>
        <TestButton
          buttonText={"Go to cart"}
          buttonColor={theme.pressableGreen}
          onPress={() => navigation?.navigate("shop", { screen: "CartScreen" })}
          buttonHeight={30}
          buttonWidth={101}
        />
        <TouchableOpacity
          onPress={() => {
            dispatch(setShowAddedProductModal(false));
          }}
          style={localStyles.exitButton}>
          <BlackCrossIcon />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    height: 38,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5000,
    flexDirection: "row",
    alignSelf: "center",
    width: 327,
    marginTop: "auto",
    zIndex: 10000,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  addedText: {
    ...textStyles.littleBold,
    marginLeft: 16,
  },
  exitButton: {
    marginRight: 16,
  },
});

export default AddedProductModal;
