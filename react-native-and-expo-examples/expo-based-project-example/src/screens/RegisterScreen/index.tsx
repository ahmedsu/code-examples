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
import { register } from "services/auth";
import { useSelector } from "hooks/reduxHooks";
import Checkbox from "expo-checkbox";

interface RegisterScreenProps {
  navigation: Navigation;
}

/**
 * @description RegisterScreen
 * @author Ahmed Suljic
 */
const RegisterScreen: FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(false);

  const [isPersonalabsRxChecked, setIsPersonalabsRxChecked] = useState(false);

  const userToken = useSelector((state) => state.login.userToken);
  const isLoading = useSelector((state) => state.login.isLoading);

  /**
   * @description Call login API with email and password.
   * The API accepts a "username" property which is the user's email.
   * @author Ahmed Suljic
   */
  const onPressRegister = async () => {
    await register({
      firstNameField: firstName,
      lastNameField: lastName,
      passwordField: password,
      emailField: email,
    }).catch((e) => {
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
      <Divider size={40} />
      <Text style={[textStyles.h4, { color: theme.secondary }]}>
        {t("createAccountTitle")}
      </Text>
      <Divider size={48} />
      <LabeledInput
        label={t("firstName") + "*"}
        value={firstName}
        onChangeValue={setFirstName}
        customInputContainerStyles={localStyles.inputContainerStyles}
        customLabelStyles={{ color: theme.secondary }}
      />
      <Divider size={16} />
      <LabeledInput
        label={t("lastName") + "*"}
        value={lastName}
        onChangeValue={setLastName}
        customInputContainerStyles={localStyles.inputContainerStyles}
        customLabelStyles={{ color: theme.secondary }}
      />
      <Divider size={16} />
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
      <Divider size={28} />
      <View style={localStyles.personalabsRxSignup}>
        <View style={localStyles.checkboxContainer}>
          <Checkbox
            style={[localStyles.checkbox, { borderColor: theme.secondary }]}
            value={isPersonalabsRxChecked}
            onValueChange={setIsPersonalabsRxChecked}
          />
        </View>

        <Divider size={0} direction="h" />
        <Text style={localStyles.checkboxDesc}>
          <Text style={[localStyles.mainText, { color: theme.secondary }]}>
            {t("personalabsRxSignup")}
          </Text>
          <Text style={[localStyles.blueText, { color: theme.secondary }]}>
            {t("termsOfService")}
          </Text>
          <Text style={[localStyles.mainText, { color: theme.secondary }]}>
            {" " + t("and") + " "}
          </Text>
          <Text style={[localStyles.blueText, { color: theme.secondary }]}>
            {t("privacyPolicy") + "."}
          </Text>
        </Text>
      </View>
      <View style={localStyles.captchaContainer}>
        <Text style={[localStyles.captcha, { color: theme.secondary }]}>
          {t("captcha") + "*"}
        </Text>
      </View>

      <Divider size={64} />
      <PrimaryButton
        onPress={onPressRegister}
        label={t("createAccount")}
        disabled={isLoading}
        wrapperStyle={[
          localStyles.loginButtonWrapper,
          { backgroundColor: theme.secondary },
        ]}
        textStyle={{ color: theme.primary }}>
        {isLoading ? <ActivityIndicator /> : null}
      </PrimaryButton>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputContainerStyles: {
    width: "80%",
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
  mainText: {
    ...textStyles.mainText,
  },
  blueText: {
    ...textStyles.mainBold,
  },
  personalabsRxSignup: {
    flexDirection: "row",
    flex: 1,
    width: "80%",
  },
  checkboxContainer: {
    flex: 1,
  },
  checkbox: {
    borderWidth: 1,
    borderRadius: 3,
  },
  checkboxDesc: {
    flex: 9,
  },
  captcha: {
    ...textStyles.bodyLarge,
    alignSelf: "flex-start",
  },
  captchaContainer: {
    width: "80%",
  },
});
export default RegisterScreen;
