import useTheme from "hooks/useTheme";
import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import moment from "moment";
import RenderHTML from "react-native-render-html";

import { Navigation } from "types";

import {
  HealthRecordStepper,
  ExtensionDivider,
  PatientDetailsCard,
  TestPanelCard,
  Divider,
} from "../../components";

import PersonalabsLogoHeader from "../../../assets/images/svg/HomeIcons/personalabsHeaderLogo.svg";
import DrawerIcon from "../../../assets/images/svg/HomeIcons/drawerIcon.svg";
import SettingsIcon from "../../../assets/images/svg/HomeIcons/settingsIcon.svg";
import { textStyles } from "globalStyles";
import { RouteProp } from "@react-navigation/native";
import {
  ResultDataInterface,
  TestInterface,
  TestResultInterface,
} from "types/results";

interface TestResultsScreenProps {
  navigation: Navigation;
  route: RouteProp<{ params: { resultData: ResultDataInterface } }>;
}

const TestResultsScreen: FC<TestResultsScreenProps> = ({
  navigation,
  route,
}) => {
  const [isReported, setIsReported] = useState(true);
  const { theme } = useTheme();
  const { resultData } = route.params;

  /**
   * @description Checks if the result is within the range of the refInterval. Returns either "LOW", "HIGH" or "NORMAL" depending on the result. The refInterval string MUST look like this: "1-99" (2 numbers seperated with -)
   * @author Ahmed Suljic
   */
  const checkResultRefInterval = (refInterval: string, result: number) => {
    const lowerLimit: number = Number(refInterval.split("-")[0]);
    const upperLimit: number = Number(refInterval.split("-")[1]);
    if (result < lowerLimit) {
      return "LOW";
    }
    if (result > upperLimit) {
      return "HIGH";
    }
    return "NORMAL";
  };

  const renderTestData = ({ item }: { item: TestResultInterface }) => {
    return (
      <TestPanelCard
        cardSubject={item.ObservationText}
        result={item.Result}
        refRange={`${item.RefInterval} ${item.UnitOfMeasure}`}
        resultType={checkResultRefInterval(
          item.RefInterval,
          Number(item.Result),
        )}
      />
    );
  };

  return (
    <ScrollView
      style={[
        localStyles.container,
        { backgroundColor: theme.lightGreyBackground },
      ]}>
      <View
        style={[localStyles.centerDiv, { backgroundColor: theme.secondary }]}>
        <View
          style={[localStyles.headerDiv, { backgroundColor: theme.secondary }]}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("shop", { screen: "ShopScreen" })
            }>
            <DrawerIcon width={18} height={16} />
          </TouchableOpacity>
          <PersonalabsLogoHeader width={120} height={120} />
          <TouchableOpacity
            onPress={() => navigation.navigate("AccountSettingsScreen")}>
            <SettingsIcon width={19} height={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={localStyles.pageDetailsDiv}>
        <View style={localStyles.pageDetailsTextDiv}>
          <Text
            style={[
              localStyles.subjectTextFirst,
              { color: theme.darkGreyText },
            ]}>
            Req #
          </Text>
          <Text
            style={[localStyles.subjectTextSecond, { color: theme.primary }]}>
            {resultData.RequisitionNum}
          </Text>
        </View>

        <View style={localStyles.pageDetailsTextDiv}>
          <Text
            style={[
              localStyles.subjectTextFirst,
              { color: theme.darkGreyText },
            ]}>
            Specimen #
          </Text>
          <Text
            style={[localStyles.subjectTextSecond, { color: theme.primary }]}>
            {resultData.SpecimenNumber}
          </Text>
        </View>
      </View>

      <View style={localStyles.stepperDiv}>
        <HealthRecordStepper
          firstStep={!!resultData.DateTimeCollected}
          secondStep={!!resultData.DateTimeCreated}
          thirdStep={!!resultData.DateTimeReported}
          dateCollected={resultData.DateTimeCollected?.split(" ")[0]}
          dateReceived={resultData.DateTimeCreated?.split(" ")[0]}
          dateReported={resultData.DateTimeReported?.split(" ")[0]}
        />
      </View>

      <View style={localStyles.dividerDiv}>
        <ExtensionDivider width={"90%"} height={2} />
      </View>

      <View style={localStyles.patientDetailsDiv}>
        <View style={localStyles.patientDetails}>
          <Text
            style={[
              localStyles.patientDetailsText,
              { color: theme.darkGreyText },
            ]}>
            Patient Detials
          </Text>
          <PatientDetailsCard
            patientId={resultData.PatientID}
            firstName={resultData.PatientFirstName}
            lastName={resultData.PatientLastName}
            gender={resultData.PatientSex}
            dateOfBirth={moment(resultData.PatientDOB, "YYYYMMDD").format(
              "YYYY/MM/DD",
            )}
            age={
              moment(resultData.PatientAgeYMD, "YYYYMMDD")
                .fromNow(true)
                .split(" ")[0]
            }
            fasting={resultData.PatientFasting === "Y" ? "Yes" : "No"}
            address={`${resultData.PatientAddrStreet}, ${resultData.PatientAddrCity}, ${resultData.PatientAddrState} ${resultData.PatientAddrZip}`}
          />
        </View>
      </View>

      <View style={localStyles.dividerDiv}>
        <ExtensionDivider width={"90%"} height={2} />
      </View>

      <View style={localStyles.progressDiv}>
        <View style={localStyles.progressDivText}>
          <Text
            style={[
              localStyles.progressResultsSubject,
              { color: theme.darkGreyText },
            ]}>
            {isReported
              ? "Medical Director Comments"
              : "Your Results are in Progress"}
          </Text>
          <View style={[localStyles.progressResultsText]}>
            {isReported ? (
              <RenderHTML
                baseStyle={textStyles.littleRegular}
                source={{
                  html: `<div>${resultData.MedicalDirectorComments}</div>`,
                }}
                contentWidth={useWindowDimensions().width - 48}
              />
            ) : (
              "We will notify as soon as your results are ready. Meanwhile, makesure you have your notifications turned ON from the Settings Panel and Stay Safe:)"
            )}
          </View>
        </View>
      </View>

      {isReported
        ? resultData.Tests.map((item: TestInterface) => (
            <>
              <View style={localStyles.dividerDiv}>
                <ExtensionDivider width={"90%"} height={2} />
              </View>
              <View style={localStyles.lipidPanelDiv}>
                <View style={localStyles.lipidPanel}>
                  <Text
                    style={[
                      localStyles.lipidPanelSubject,
                      { color: theme.darkGreyText },
                    ]}>
                    {item.TestName}
                  </Text>
                  <FlatList
                    data={resultData.Tests[0].TestResults}
                    renderItem={renderTestData}
                    keyExtractor={(item) =>
                      item.OrderResultTestResultsID.toString()
                    }
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </>
          ))
        : null}
      <Divider size={24} />
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alignItems: {
    alignItems: "center",
  },
  headerDiv: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 91,
    flexDirection: "row",
  },
  centerDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    shadowColor: "#111",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 20,
  },
  pageDetailsDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  pageDetailsTextDiv: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 10,
  },
  subjectTextFirst: {
    ...textStyles.bodyLarge,
  },
  subjectTextSecond: {
    ...textStyles.bodyLarge,
    left: 20,
  },
  stepperDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  dividerDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  patientDetailsDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  patientDetails: {
    width: "90%",
  },
  patientDetailsText: {
    ...textStyles.bodyLarge,
  },
  progressDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  progressDivText: {
    width: "90%",
  },
  progressResultsSubject: {
    ...textStyles.bodyLarge,
  },
  progressResultsText: {
    ...textStyles.littleRegular,
    marginTop: 20,
    maxWidth: 340,
  },
  linkText: {
    color: "#069D19",
  },
  lipidPanelDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lipidPanel: {
    width: "90%",
  },
  lipidPanelSubject: {
    ...textStyles.bodyLarge,
  },
  individualTestDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  individualTest: {
    width: "90%",
  },
  individualTestSubject: {
    ...textStyles.bodyLarge,
  },
});

export default TestResultsScreen;
