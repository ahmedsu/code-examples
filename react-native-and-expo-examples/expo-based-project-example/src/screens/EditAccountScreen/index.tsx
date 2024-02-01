import { t } from "i18n-js";
import useTheme from "hooks/useTheme";
import React, { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Checkbox from "expo-checkbox";

import { textStyles } from "globalStyles";
import { Navigation } from "types";

import {
  Header,
  DropDownInput,
  PrimaryButton,
  Divider,
  Dropdown,
} from "../../components";

import ShowPasswordEye from "../../../assets/images/svg/showPasswordEye.svg";

import LabeledInput from "components/Input/types/LabeledInput";
import { updateAccount } from "services/customer";

import { useDispatch, useSelector } from "hooks/reduxHooks";

interface EditAccountScreenProps {
  navigation: Navigation;
}

/**
 * @description Edit account screen
 * 
 * @author Ahmed Suljic
 */

const EditAccountScreen: FC<EditAccountScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [isPersonalabsRxChecked, setIsPersonalabsRxChecked] = useState(false);

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const emailState = useSelector((state: any) => state.login.email);
  const firstNameState = useSelector((state: any) => state.login.firstName);
  const lastNameState = useSelector((state: any) => state.login.lastName);
  const displayNameState = useSelector((state: any) => state.login.displayName);

  const dispatch = useDispatch();

  useEffect(() => {
    setFirstName(firstNameState);
    setLastName(lastNameState);
    setDisplayName(displayNameState);
    setEmail(emailState);
  }, [emailState, firstNameState, lastNameState, displayNameState]);

  return (
    <ScrollView
      style={[localStyles.container, { backgroundColor: theme.secondary }]}>
      <Header
        onDrawerPress={() =>
          navigation.navigate("shop", { screen: "CartScreen" })
        }
        onSettingsPress={() =>
          navigation.navigate("healthReport", { screen: "EditAccountScreen" })
        }
        onLogoPress={() => navigation.navigate("HomeScreen")}
      />
      <View
        style={[
          localStyles.accountTitleContainer,
          { backgroundColor: theme.primary },
        ]}>
        <Text
          style={[localStyles.accountTitleText, { color: theme.secondary }]}>
          {t("yourAccount")}
        </Text>
      </View>
      <View style={localStyles.orderSection}>
        <LabeledInput
          label={t("firstName")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={firstName}
          onChangeValue={setFirstName}
          customInputContainerStyles={localStyles.inputContainerStyles}
        />
        <LabeledInput
          label={t("lastName")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={lastName}
          onChangeValue={setLastName}
          customInputContainerStyles={localStyles.inputContainerStyles}
        />
        <LabeledInput
          label={t("displayName")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={displayName}
          onChangeValue={setDisplayName}
          customInputContainerStyles={localStyles.inputContainerStyles}
        />

        <Divider size={12} />

        <Text style={[localStyles.mainText, { color: theme.darkGreyText }]}>
          {t("displayNameDesc")}
        </Text>
        <LabeledInput
          label={t("emailAddress")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={email}
          onChangeValue={setEmail}
          customInputContainerStyles={localStyles.inputContainerStyles}
        />
        <LabeledInput
          label={t("newPassword")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={newPassword}
          onChangeValue={setNewPassword}
          customInputContainerStyles={localStyles.inputContainerStyles}
          secureTextEntry={!showNewPassword}
          onRightIconPress={() => setShowNewPassword(!showNewPassword)}
          RightIcon={ShowPasswordEye}
        />

        <Divider size={12} />

        <Text style={[localStyles.mainText, { color: theme.darkGreyText }]}>
          {t("newPasswordDesc")}
        </Text>
        <LabeledInput
          label={t("confirmNewPassword")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={confirmNewPassword}
          onChangeValue={setConfirmNewPassword}
          customInputContainerStyles={localStyles.inputContainerStyles}
          secureTextEntry={!showConfirmNewPassword}
          onRightIconPress={() =>
            setShowConfirmNewPassword(!showConfirmNewPassword)
          }
          RightIcon={ShowPasswordEye}
        />

        <Divider size={24} direction="v" />

        <View style={localStyles.personalabsRxSignup}>
          <View style={localStyles.checkboxContainer}>
            <Checkbox
              style={[
                localStyles.checkbox,
                { borderColor: theme.borderLightGrey },
              ]}
              value={isPersonalabsRxChecked}
              onValueChange={setIsPersonalabsRxChecked}
            />
          </View>

          <Divider size={0} direction="h" />
          <Text style={localStyles.checkboxDesc}>
            <Text style={[localStyles.mainText, { color: theme.darkGreyText }]}>
              {t("personalabsRxSignup")}
            </Text>
            <Text style={[localStyles.blueText, { color: theme.primary }]}>
              {t("termsOfService")}
            </Text>
            <Text style={[localStyles.mainText, { color: theme.darkGreyText }]}>
              {" " + t("and") + " "}
            </Text>
            <Text style={[localStyles.blueText, { color: theme.primary }]}>
              {t("privacyPolicy") + "."}
            </Text>
          </Text>
        </View>

        <Divider size={36} />

        <View>
          <PrimaryButton
            label={t("saveChanges")}
            containerStyle={[
              localStyles.generateLabOrderButton,
              { backgroundColor: theme.primary },
            ]}
            textStyle={{ color: theme.secondary }}
            onPress={() => {
              setIsLoadingUpdate(true);
              updateAccount({
                first_name: firstName,
                last_name: lastName,
                email,
              }).then((res) => {
                setIsLoadingUpdate(false);
                console.log(res?.user);
                if (res?.user) {
                  dispatch({
                    type: "SET_USER_DATA",
                    payload: {
                      firstName: res?.user?.first_name,
                      lastName: res?.user?.last_name,
                      email: res?.user?.email,
                    },
                  });
                }
                navigation.navigate("home", { screen: "HomeScreen" });
              });
            }}>
            {isLoadingUpdate ? <ActivityIndicator /> : null}
          </PrimaryButton>
        </View>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountTitleContainer: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  accountTitleText: {
    ...textStyles.h4,
  },
  orderSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputContainerStyles: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(73, 70, 66, 0.2)",
  },
  labelText: {
    ...textStyles.littleBold,
    marginBottom: 0,
  },
  generateLabOrderButton: {
    height: 48,
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
});
export default EditAccountScreen;
