import { t } from "i18n-js";
import React, { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";

import { Divider } from "components";
import PrimaryButton from "components/Button/types/PrimaryButton";
import LabeledInput from "components/Input/types/LabeledInput";

import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import PersonalabsFullLogo from "../../../assets/images/png/personalabsFullLogo.png";
import ShowPasswordEye from "../../../assets/images/svg/showPasswordEye.svg";

import { Navigation } from "types";
import { logIn } from "services/auth";
import { useSelector } from "hooks/reduxHooks";

interface LoginScreenProps {
  navigation: Navigation;
}

/**
 * @description LoginScreen
 * @author Ahmed Suljic
 */
const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(false);

  const userToken = useSelector((state) => state.login.userToken);
  const isLoading = useSelector((state) => state.login.isLoading);

  /**
   * @description Call login API with email and password.
   * The API accepts a "username" property which is the user's email.
   * @author Ahmed Suljic
   */
  const onPressLogIn = async () => {
    await logIn({ username: email, password: password }).catch((e) => {
      throw new Error(e);
    });
  };

  useEffect(() => {
    if (userToken) {
      navigation.navigate("App");
    }
  }, [userToken]);

  return (
    <SafeAreaView
      style={[localStyles.container, { backgroundColor: theme.primary }]}>
      <Divider size={150} />
      <Text style={[textStyles.h4, { color: theme.secondary }]}>
        {t("login")}
      </Text>
      <Divider size={48} />
      <LabeledInput
        label={t("emailAddress") + "*"}
        value={email}
        onChangeValue={setEmail}
        customInputContainerStyles={localStyles.inputContainerStyles}
        customLabelStyles={{ color: theme.secondary }}
      />
      <Divider size={16} />
      <LabeledInput
        label={t("password") + "*"}
        value={password}
        onChangeValue={setPassword}
        customInputContainerStyles={localStyles.inputContainerStyles}
        customLabelStyles={{ color: theme.secondary }}
        secureTextEntry={!showPassword}
        onRightIconPress={() => setShowPassword(!showPassword)}
        RightIcon={ShowPasswordEye}
      />
      <Divider size={64} />
      <PrimaryButton
        onPress={onPressLogIn}
        label={t("logIn")}
        disabled={isLoading}
        wrapperStyle={[
          localStyles.loginButtonWrapper,
          { backgroundColor: theme.secondary },
        ]}
        textStyle={{ color: theme.primary }}>
        {isLoading ? <ActivityIndicator /> : null}
      </PrimaryButton>
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
  inputContainerStyles: {
    width: 288,
    height: 48,
    borderRadius: 999,
  },
  loginButtonWrapper: {
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
export default LoginScreen;
