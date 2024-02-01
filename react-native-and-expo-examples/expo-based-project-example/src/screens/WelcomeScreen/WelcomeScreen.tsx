import useTheme from "hooks/useTheme";
import React, { FC } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  ImageSourcePropType,
} from "react-native";
import { t } from "i18n-js";

import PrimaryButton from "components/Button/types/PrimaryButton";
import { Divider } from "components";
import { textStyles } from "globalStyles";

import PersonalabsLogo from "../../../assets/images/svg/personalabsLogo.svg";
import PersonalabsFullLogo from "../../../assets/images/png/personalabsFullLogo.png";

import { Navigation } from "types";

interface WelcomeScreenProps {
  navigation: Navigation;
}

const windowHeight = Dimensions.get("window").height;

/**
 * @description WelcomeScreen, the first screen the user sees after the splash screen
 * @author Ahmed Suljic
 */
const WelcomeScreen: FC<WelcomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={[localStyles.container, { backgroundColor: theme.primary }]}>
      <Divider size={windowHeight / 8} />
      <PersonalabsLogo width={120} height={120} />
      <Divider size={30} />
      <Text style={[textStyles.h4, localStyles.titleText]}>
        {t("welcomeScreenTitle")}
      </Text>
      <Divider size={16} />
      <Text style={[textStyles.mainText, localStyles.contentText]}>
        {t("welcomeScreenContent")}
      </Text>
      <Divider size={48} />
      <PrimaryButton
        onPress={() => navigation.navigate("LoginScreen")}
        label={t("logIn")}
        wrapperStyle={[
          localStyles.loginButtonWrapper,
          { backgroundColor: theme.secondary },
        ]}
        textStyle={{ color: theme.primary }}
      />
      <Divider size={16} />
      <PrimaryButton
        onPress={() => navigation.navigate("RegisterScreen")}
        label={t("signUp")}
        wrapperStyle={[
          localStyles.signupButtonWrapper,
          { backgroundColor: theme.primary, borderColor: theme.secondary },
        ]}
        textStyle={{ color: theme.secondary }}
      />
      <View style={localStyles.bottomLogoContainer}>
        <Image
          source={PersonalabsFullLogo as ImageSourcePropType}
          style={localStyles.fullLogoImageStyle}
        />
        <Divider size={40} />
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  alignItems: {
    alignItems: "center",
  },
  titleText: {
    color: "white",
    textAlign: "center",
  },
  contentText: {
    color: "white",
    width: 250,
    textAlign: "center",
  },
  loginButtonWrapper: {
    width: 247,
    height: 48,
  },
  signupButtonWrapper: {
    borderWidth: 1,
    width: 247,
    height: 48,
  },
  bottomLogoContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  fullLogoImageStyle: {
    width: 133,
    height: 41,
  },
});
export default WelcomeScreen;
