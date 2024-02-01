import { t } from "i18n-js";
import useTheme from "hooks/useTheme";
import React, { FC, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";

import { textStyles } from "globalStyles";
import { Navigation } from "types";

import {
  Header,
  DropDownInput,
  PrimaryButton,
  Divider,
  Dropdown,
} from "../../components";

import LabeledInput from "components/Input/types/LabeledInput";

interface AccountScreenProps {
  navigation: Navigation;
}

/**
 * @description Checkout screen
 * 
 * @author Ahmed Suljic
 */

const dropdownGenderItems = [
  { label: "-", value: "-" },
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];
const dropdownMonthItems = [
  { label: "Month" },
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];
const dropdownDayItems = [
  { label: "Day" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
  { label: "13", value: "13" },
  { label: "14", value: "14" },
  { label: "15", value: "15" },
  { label: "16", value: "16" },
  { label: "17", value: "17" },
  { label: "18", value: "18" },
  { label: "19", value: "19" },
  { label: "20", value: "20" },
  { label: "21", value: "21" },
  { label: "22", value: "22" },
  { label: "23", value: "23" },
  { label: "24", value: "24" },
  { label: "25", value: "25" },
  { label: "26", value: "26" },
  { label: "27", value: "27" },
  { label: "28", value: "28" },
  { label: "29", value: "29" },
  { label: "30", value: "30" },
  { label: "31", value: "231" },
];
const dropdownHowDidYouHearAboutUsItems = [
  { label: "-" },
  { label: "From a friend", value: "From a friend" },
  { label: "Through ads", value: "Through ads" },
];
const AccountScreen: FC<AccountScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [desiredTestDate, setDesiredTestDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAdress, setStreetAdress] = useState("");
  const [zip, setzip] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [howDidYouHearAboutUs, setHowDidYouHearAboutUs] = useState("");

  const [monthOpen, setMonthOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);

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
        <Text style={[localStyles.generateText, { color: theme.darkGreyText }]}>
          {t("generateLabOrder")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 16,
          }}>
          <Text style={[localStyles.orderText, { color: theme.darkGreyText }]}>
            Order
          </Text>
          <Text style={[localStyles.orderNumber, { color: theme.primary }]}>
            {" "}
            #135522
          </Text>
        </View>
        <View style={localStyles.testsIncludedContainer}>
          <Text
            style={[
              localStyles.testsIncludedHeaderText,
              { color: theme.darkGreyText },
            ]}>
            {t("testsIncldued")}
          </Text>
          <Text
            style={[
              localStyles.testIncludedMainText,
              { color: theme.darkGreyText },
            ]}>
            Lorem Ipsum is simply dummy text of the printing and type setting
            industry. Lorem Ipsum has been the industry's standard
          </Text>
        </View>

        <View
          style={[
            localStyles.lightGreyBorderContainer,
            { backgroundColor: theme.lightGreyBackground },
          ]}>
          <Text
            style={[
              localStyles.lightGreyBorderHeaderText,
              { color: theme.darkGreyText },
            ]}>
            Lorem ipsum dolor sit amet consectetur. Nullam pulvinar
          </Text>
          <Text
            style={[
              localStyles.lightGreyBorderContentText,
              { color: theme.darkGreyText },
            ]}>
            Lorem ipsum dolor sit amet consectetur. Aliquet platea libero vel
            sed dictum. Metus nisi proin arcu iaculis. Id at id mollis
            scelerisque turpis lectus semper. Proin etiam libero sed mattis
            egestas aliquam vestibulum mi. Tellus at porta consequat amet donec
            senectus posuere urna.
          </Text>
        </View>
        <Divider size={68} direction={"v"} />
        <LabeledInput
          label={t("desiredTestDate")}
          customLabelStyles={[
            localStyles.labelText,
            { color: theme.darkGreyText },
          ]}
          value={desiredTestDate}
          onChangeValue={setDesiredTestDate}
          customInputContainerStyles={localStyles.inputContainerStyles}
        />
        <Text
          style={[
            localStyles.desiredTextDateTest,
            { color: theme.darkGreyText },
          ]}>
          Your desired test date is not required but it will help us know when
          your results are overdue. In that case, we will contact the lab to
          check on the status of your results.
        </Text>
        <LabeledInput
          label={t("patientFirstName")}
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
          label={t("patientLasttName")}
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
          label={t("patientStreetAdress")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={streetAdress}
          onChangeValue={setStreetAdress}
          customInputContainerStyles={localStyles.inputContainerStyles}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}>
          <View style={{ width: "49%" }}>
            <LabeledInput
              label={t("city")}
              customLabelStyles={[
                localStyles.labelText,
                { marginTop: 24, color: theme.darkGreyText },
              ]}
              starIconText={"*"}
              value={streetAdress}
              onChangeValue={setStreetAdress}
              customInputContainerStyles={[
                localStyles.inputContainerStyles,
                { alignSelf: "stretch" },
              ]}
            />
          </View>
          <Divider size={10} direction={"h"} />
          <View style={{ width: "49%" }}>
            <LabeledInput
              label={t("state")}
              customLabelStyles={[
                localStyles.labelText,
                { marginTop: 24, color: theme.darkGreyText },
              ]}
              starIconText={"*"}
              value={streetAdress}
              onChangeValue={setStreetAdress}
              customInputContainerStyles={[
                localStyles.inputContainerStyles,
                { alignSelf: "stretch" },
              ]}
            />
          </View>
        </View>
        <LabeledInput
          label={t("zip")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={zip}
          onChangeValue={setzip}
          customInputContainerStyles={[
            localStyles.inputContainerStyles,
            { width: "49%" },
          ]}
        />
        <LabeledInput
          label={t("phone")}
          customLabelStyles={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}
          starIconText={"*"}
          value={phone}
          onChangeValue={setPhone}
          customInputContainerStyles={localStyles.inputContainerStyles}
        />
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              localStyles.labelText,
              { marginTop: 24, color: theme.darkGreyText },
            ]}>
            {t("gender")}
          </Text>
          <Text
            style={[localStyles.labelText, { marginTop: 24, color: "red" }]}>
            *
          </Text>
        </View>
        <Dropdown
          pickerState={gender}
          setPickerState={setGender}
          items={dropdownGenderItems}
          customDropDownDivStyles={{
            height: 48,
          }}
        />
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              localStyles.labelText,
              { marginTop: 24, color: theme.darkGreyText },
            ]}>
            {t("patientBirthday")}
          </Text>
          <Text
            style={[localStyles.labelText, { marginTop: 24, color: "red" }]}>
            *
          </Text>
        </View>
        <View
          style={[
            localStyles.patientBirthdayContainer,
            { zIndex: monthOpen || dayOpen ? 50 : 0 },
          ]}>
          <Dropdown
            pickerState={month}
            setPickerState={setMonth}
            open={monthOpen}
            setOpen={setMonthOpen}
            items={dropdownMonthItems}
            customDropDownDivStyles={{
              width: "40%",
              height: 48,
              marginTop: 8,
            }}
          />
          <Dropdown
            pickerState={day}
            setPickerState={setDay}
            open={dayOpen}
            setOpen={setDayOpen}
            items={dropdownDayItems}
            customDropDownDivStyles={{ width: "33%", height: 48, marginTop: 8 }}
          />
          <DropDownInput
            value={year}
            placeholder={"Year"}
            onChangeText={setYear}
            customFullWrapperStyles={[
              localStyles.dropDownInput,
              { width: "20%" },
            ]}
            customIconStyles={{ display: "none" }}
          />
        </View>
        <Text
          style={[
            localStyles.labelText,
            { marginTop: 24, color: theme.darkGreyText },
          ]}>
          {t("howDidYouHearAboutUs")}
        </Text>
        <Dropdown
          pickerState={howDidYouHearAboutUs}
          setPickerState={setHowDidYouHearAboutUs}
          items={dropdownHowDidYouHearAboutUsItems}
          customDropDownDivStyles={{
            height: 48,
          }}
        />
        <View style={{ marginTop: 24 }}>
          <PrimaryButton
            label={t("generateLabOrder")}
            containerStyle={[
              localStyles.generateLabOrderButton,
              { backgroundColor: theme.pressableGreen },
            ]}
            textStyle={{ color: theme.secondary }}
            onPress={() => {}}
          />
          <PrimaryButton
            label={t("cancel")}
            containerStyle={[
              localStyles.cancelButton,
              { borderColor: theme.pressableGreen },
            ]}
            textStyle={{ color: theme.pressableGreen }}
            wrapperStyle={[
              localStyles.wrapperCancelButton,
              {
                borderColor: theme.pressableGreen,
              },
            ]}
            onPress={() => {}}
          />
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
  generateText: {
    ...textStyles.bodyLarge,
  },
  orderText: {
    ...textStyles.mainText,
  },
  orderNumber: {
    ...textStyles.mainBold,
  },
  testsIncludedHeaderText: {
    ...textStyles.mainBold,
  },
  testIncludedMainText: {
    ...textStyles.mainText,
  },
  testsIncludedContainer: {
    marginTop: 16,
  },
  lightGreyBorderContainer: {
    borderRadius: 16,
    marginTop: 16,
  },
  lightGreyBorderHeaderText: {
    ...textStyles.mainBold,
    marginHorizontal: 24,
    alignSelf: "stretch",
    marginTop: 24,
  },
  lightGreyBorderContentText: {
    ...textStyles.mainText,
    marginHorizontal: 24,
    alignSelf: "stretch",
    marginTop: 8,
    marginBottom: 24,
  },
  inputContainerStyles: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(73, 70, 66, 0.2)",
  },

  labelText: {
    ...textStyles.littleBold,
    marginBottom: 12,
  },

  desiredTextDateTest: {
    ...textStyles.littleRegular,
    marginTop: 12,
  },
  dropDownInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(73, 70, 66, 0.2)",
    width: "100%",
    marginTop: 8,
  },
  iconStyle: {
    paddingRight: 10,
  },
  patientBirthdayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  generateLabOrderButton: {
    height: 48,
  },
  cancelButton: {
    height: 48,
  },
  wrapperCancelButton: {
    borderWidth: 1,
    marginTop: 16,
  },
});
export default AccountScreen;
