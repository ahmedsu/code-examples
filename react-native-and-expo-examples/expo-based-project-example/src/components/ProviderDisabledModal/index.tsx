import Divider from "components/Divider";
import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import { t } from "i18n-js";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Easing,
  Animated,
} from "react-native";

import BlackCross from "../../../assets/images/svg/blackCross.svg";

interface ProviderDisabledModalProps {
  onPressClose: () => void;
}

/**
 * @description Modal that shows when the user tries to add a second provider type product to the cart
 * @author Ahmed Suljic
 */
const ProviderDisabledModal = ({
  onPressClose,
}: ProviderDisabledModalProps) => {
  const { theme } = useTheme();

  /**
   * @description Runs a fadeOut animation and then calls the onPressClose function from props
   * @author Ahmed Suljic
   */
  const closePressedHandler = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(() => {
      onPressClose();
    });
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * @description fadeIn animation that runs when the component is rendered
   * @author Ahmed Suljic
   */
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [fadeAnim]);

  return (
    <Modal transparent>
      <Animated.View
        style={{ ...localStyles.modalContainer, opacity: fadeAnim }}>
        <View
          style={[
            localStyles.providerDisabledContainer,
            { backgroundColor: theme.lightGreyBackground },
          ]}>
          <View style={localStyles.textContainer}>
            <Text style={localStyles.textSegment}>
              {t("providerDisabledTextUpper")}
            </Text>
            <TouchableOpacity
              style={localStyles.closeButtonContainer}
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={closePressedHandler}>
              <BlackCross />
            </TouchableOpacity>
          </View>
          <Divider size={8} />
          <Text style={localStyles.textSegment}>
            {t("providerDisabledTextLower")}
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default ProviderDisabledModal;

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  providerDisabledContainer: {
    maxWidth: 300,
    marginHorizontal: 30,
    padding: 20,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textSegment: {
    ...textStyles.littleRegular,
  },
  closeButtonContainer: {
    marginTop: 4,
    marginRight: 3,
  },
});
