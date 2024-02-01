import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import { StyleSheet, View, Text } from "react-native";
import CheckIcon from "../../../assets/images/svg/HomeIcons/checkIcon.svg";
import NotCheckedIcon from "../../../assets/images/svg/HomeIcons/notCheckedIcon.svg";

interface StepperProps {
  firstStep: boolean;
  secondStep: boolean;
  thirdStep: boolean;
  dateCollected: string;
  dateReceived: string;
  dateReported: string;
}

const HealthRecordStepper = ({
  firstStep = false,
  secondStep = false,
  thirdStep = false,
  dateCollected = "???",
  dateReceived = "???",
  dateReported = "???",
}: StepperProps) => {
  const { theme } = useTheme();
  return (
    <View style={localStyles.container}>
      <View style={localStyles.stepperDiv}>
        {firstStep ? (
          <CheckIcon width={24} height={24} />
        ) : (
          <NotCheckedIcon width={24} height={24} />
        )}
        <View
          style={[
            localStyles.extensionLine,
            {
              backgroundColor: secondStep
                ? theme.moneyGreen
                : theme.lightGreyBorder,
            },
          ]}
        />
        {secondStep ? (
          <CheckIcon width={24} height={24} />
        ) : (
          <NotCheckedIcon width={24} height={24} />
        )}
        <View
          style={[
            localStyles.extensionLine,
            {
              backgroundColor: thirdStep
                ? theme.moneyGreen
                : theme.lightGreyBorder,
            },
          ]}
        />
        {thirdStep ? (
          <CheckIcon width={24} height={24} />
        ) : (
          <NotCheckedIcon width={24} height={24} />
        )}
      </View>

      <View style={localStyles.textDiv}>
        <View style={localStyles.textDivFirst}>
          <Text style={localStyles.textFirst}>Collected</Text>
          <Text style={localStyles.textSecond}>{dateCollected}</Text>
        </View>
        <View style={localStyles.textDivSecond}>
          <Text style={localStyles.textFirst}>Received</Text>
          <Text style={localStyles.textSecond}>{dateReceived}</Text>
        </View>
        <View style={localStyles.textDivThird}>
          <Text style={localStyles.textFirst}>Reported</Text>
          <Text style={localStyles.textSecond}>{dateReported}</Text>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "90%",
    height: 70,
    justifyContent: "space-between",
  },
  extensionLine: {
    width: "40%",
    height: 2,
  },
  stepperDiv: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  textDiv: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textDivFirst: {
    justifyContent: "center",
  },
  textDivSecond: {
    justifyContent: "center",
    alignItems: "center",
  },
  textDivThird: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textFirst: {
    ...textStyles.littleRegular,
    color: "#494642",
  },
  textSecond: {
    ...textStyles.littleBold,
    color: "#494642",
  },
});

export default HealthRecordStepper;
