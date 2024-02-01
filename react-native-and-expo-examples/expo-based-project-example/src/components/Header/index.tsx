import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import useTheme from "hooks/useTheme";
import NewActivityBubble from "components/NewActivityBubble";
import { useSelector } from "hooks/reduxHooks";
import PersonalabsLogoHeader from "../../../assets/images/svg/HomeIcons/personalabsHeaderLogo.svg";
import { CartIcon, SettingsIcon } from "../../../assets/images/svg";

interface HeaderProps {
  onDrawerPress(event: GestureResponderEvent): void;
  onSettingsPress(event: GestureResponderEvent): void;
  onLogoPress(event: GestureResponderEvent): void;
}

const Header = ({
  onDrawerPress,
  onSettingsPress,
  onLogoPress,
}: HeaderProps) => {
  const { theme } = useTheme();
  const cartItemAmount = useSelector((state) => state.cart.products.length);

  return (
    <>
      <StatusBar style="auto" backgroundColor="#ffffff" />
      <View
        style={[localStyles.centerDiv, { backgroundColor: theme.secondary }]}>
        <View
          style={[localStyles.headerDiv, { backgroundColor: theme.secondary }]}>
          <TouchableOpacity onPress={onSettingsPress}>
            <SettingsIcon width={19} height={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogoPress}>
            <PersonalabsLogoHeader width={120} height={120} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDrawerPress}>
            <CartIcon width={22} height={20} />
            {cartItemAmount > 0 ? (
              <NewActivityBubble
                number={cartItemAmount.toString()}
                customStyles={localStyles.activityBubble}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const localStyles = StyleSheet.create({
  headerDiv: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 91,
    flexDirection: "row",
    position: "relative",
  },
  centerDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#111",
  },
  activityBubble: {
    position: "absolute",
    top: -5,
    right: -12,
    height: 20,
    width: 20,
  },
});

export default Header;
