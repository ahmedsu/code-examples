import useTheme from "hooks/useTheme";
import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Navigation } from "types";
import { useDispatch, useSelector } from "hooks/reduxHooks";

import { Header } from "../../components";
import { SettingsCard } from "../../components";

import { textStyles } from "globalStyles";
import { themes } from "theme/themes";
import { signOut } from "redux/actions/loginActions";

interface AccountSettingsScreenProps {
  navigation: Navigation;
}

const AccountSettingsScreen: FC<AccountSettingsScreenProps> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const [switchValue, setSwitchValue] = useState(false);
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);

  const settingsCardPress = () => {
    setSwitchValue((prevValue) => !prevValue);
  };

  const ACCOUNT_SETTINGS_DATA = [
    {
      id: 0,
      settingsSubject: "Switch to dark mode",
      settingsText: "Lorem ipsum dolor sit amet, consectetur",
      settingsSwitch: true,
      onPress: settingsCardPress,
    },
    {
      id: 1,
      settingsSubject: "Change profile background",
      settingsText: "Lorem ipsum dolor sit amet, consectetur",
      settingsSwitch: false,
      onPress: () => console.log("Navigate to change profile background!"),
    },
    {
      id: 2,
      settingsSubject: "Change profile image",
      settingsText: "Lorem ipsum dolor sit amet, consectetur",
      settingsSwitch: false,
      onPress: () => console.log("Navigate to change profile image!"),
    },
    {
      id: 3,
      settingsSubject: "Turn off animations",
      settingsText: "Lorem ipsum dolor sit amet, consectetur",
      settingsSwitch: true,
      onPress: settingsCardPress,
    },
    {
      id: 4,
      settingsSubject: "Change font size",
      settingsText: "Lorem ipsum dolor sit amet, consectetur",
      settingsSwitch: false,
      onPress: () => console.log("Change font size!"),
    },
    {
      id: 5,
      settingsSubject: "Accessibility Options",
      settingsText: "Lorem ipsum dolor sit amet, consectetur",
      settingsSwitch: false,
      onPress: () => console.log("Accessibility Options!"),
    },
    {
      id: 6,
      settingsSubject: "Switch to colorless mode",
      settingsText: "Lorem ipsum dolor sit amet, consectetur",
      settingsSwitch: true,
      onPress: settingsCardPress,
    },
    {
      id: 7,
      settingsSubject: "Activate voice control",
      settingsText: "Lorem ipsum dolor sit amet, consectetur",
      settingsSwitch: true,
      onPress: settingsCardPress,
    },
    {
      id: 8,
      settingsSubject: "Log out",
      settingsText: `(DEBUG) - isSignout: ${
        login.isSignout
      }, !!userToken: ${!!login.userToken}`,
      settingsSwitch: false,
      onPress: () => dispatch(signOut()),
    },
  ];

  const renderAccountSettings = ({ item, index }: any) => {
    return (
      <SettingsCard
        settingsSubject={item.settingsSubject}
        text={item.settingsText}
        onPress={item.onPress}
        isSwitch={item.settingsSwitch}
        switchValue={switchValue}
        onSwitchValue={item.onPress}
      />
    );
  };

  return (
    <View
      style={[
        localStyles.container,
        { backgroundColor: theme.lightGreyBackground },
      ]}>
      <Header
        onDrawerPress={() =>
          navigation.navigate("shop", { screen: "CartScreen" })
        }
        onSettingsPress={() =>
          navigation.navigate("healthReport", { screen: "EditAccountScreen" })
        }
        onLogoPress={() => navigation.navigate("HomeScreen")}
      />

      <View style={localStyles.accountSettingsDiv}>
        <View style={localStyles.accountSettings}>
          <Text
            style={[
              localStyles.settingsSubject,
              { color: theme.darkGreyText },
            ]}>
            Account Settings
          </Text>
          <Text
            style={[
              localStyles.settingsTextGeneral,
              { color: theme.darkGreyText },
            ]}>
            General
          </Text>
        </View>

        <View style={localStyles.settingsOptions}>
          <FlatList
            data={ACCOUNT_SETTINGS_DATA}
            renderItem={renderAccountSettings}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={localStyles.flatListContainer}
          />
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountSettingsDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  accountSettings: {
    width: "90%",
    justifyContent: "space-between",
    height: 60,
    marginTop: 30,
  },
  settingsSubject: {
    ...textStyles.h4,
  },
  settingsTextGeneral: {
    ...textStyles.bodyLarge,
  },
  settingsOptions: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  flatListContainer: {
    width: "95%",
    paddingBottom: 220,
  },
});

export default AccountSettingsScreen;
