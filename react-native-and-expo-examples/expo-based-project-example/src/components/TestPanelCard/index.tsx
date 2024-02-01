import { StyleSheet, View, Text } from "react-native";
import { ExtensionDivider } from "../../components";
import RedFlag from "../../../assets/images/svg/HealthRecordIcons/redFlag.svg";
import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import { useRef } from "react";

interface TestPanelCardProps {
  cardSubject: string;
  result: string | number;
  refRange: string;
  resultType: string;
}

const TestPanelCard = ({
  cardSubject,
  result,
  refRange,
  resultType,
}: TestPanelCardProps) => {
  const { theme } = useTheme();

  const isNormalRef = useRef(resultType === "NORMAL");

  return (
    <View
      style={[
        localStyles.testCard,
        {
          borderWidth: 1,
          borderColor: isNormalRef.current
            ? "rgba(0, 0, 0, 0)"
            : theme.problemRed,
        },
      ]}>
      <View style={localStyles.testCardDivFirst}>
        <Text style={[localStyles.testSubject, { color: theme.darkGreyText }]}>
          {cardSubject}
        </Text>
        {!isNormalRef.current && <RedFlag style={localStyles.redFlagStyle} />}
      </View>
      <ExtensionDivider width={"90%"} height={1} />
      <View style={localStyles.testCardDivSecond}>
        <Text style={[localStyles.result, { color: theme.darkGreyText }]}>
          Result
        </Text>
        <Text
          style={[
            localStyles.measuringUnitText,
            {
              color: isNormalRef.current ? theme.moneyGreen : theme.problemRed,
            },
          ]}>
          {result + " " + resultType}
        </Text>
      </View>
      <View style={localStyles.testCardDivThird}>
        <Text>Reference range: {refRange}</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  testCard: {
    width: "100%",
    height: 142,
    overflow: "visible",
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#111",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  testCardDivFirst: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: 35,
  },
  testSubject: {
    ...textStyles.bodyLarge,
    color: "#494642",
  },
  redFlagStyle: {
    left: 0,
  },
  testCardDivSecond: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    marginTop: 15,
  },
  result: {
    ...textStyles.mainBold,
  },
  measuringUnitText: {
    ...textStyles.mainBold,
  },
  testCardDivThird: {
    width: "90%",
  },
});

export default TestPanelCard;
