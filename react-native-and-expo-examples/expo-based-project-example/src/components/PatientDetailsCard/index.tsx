import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";

interface PlanDetailsCardProps {
  patientId: number;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  age: string | number;
  fasting: string;
  address: string;
}

const PlanDetailsCard = ({
  patientId,
  firstName,
  lastName,
  gender,
  dateOfBirth,
  age,
  fasting,
  address,
}: PlanDetailsCardProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        marginTop: 10,
      }}>
      <View style={localStyles.planDetailsCardDiv}>
        <Text style={localStyles.textValue}>Lab Patient ID</Text>
        <Text style={[localStyles.value, { color: theme.primary }]}>
          {patientId}
        </Text>
      </View>

      <View style={localStyles.planDetailsCardDiv}>
        <Text style={localStyles.textValue}>First Name</Text>
        <Text style={[localStyles.value, { color: theme.primary }]}>
          {firstName}
        </Text>
      </View>

      <View style={localStyles.planDetailsCardDiv}>
        <Text style={localStyles.textValue}>Last Name</Text>
        <Text style={[localStyles.value, { color: theme.primary }]}>
          {lastName}
        </Text>
      </View>

      <View style={localStyles.planDetailsCardDiv}>
        <Text style={localStyles.textValue}>Gender</Text>
        <Text style={localStyles.valueSecond}>{gender}</Text>
      </View>

      <View style={localStyles.planDetailsCardDiv}>
        <Text style={localStyles.textValue}>Date of Birth</Text>
        <Text style={localStyles.valueSecond}>{dateOfBirth}</Text>
      </View>

      <View style={localStyles.planDetailsCardDiv}>
        <Text style={localStyles.textValue}>Age</Text>
        <Text style={localStyles.valueSecond}>{age}</Text>
      </View>

      <View style={localStyles.planDetailsCardDiv}>
        <Text style={localStyles.textValue}>Fasting</Text>
        <Text style={[localStyles.value, { color: theme.primary }]}>
          {fasting}
        </Text>
      </View>

      <View style={localStyles.planDetailsCardDiv}>
        <Text style={localStyles.textValue}>Address</Text>
        <Text style={localStyles.addressValue}>{address}</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  planDetailsCardDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  textValue: {
    ...textStyles.littleRegular,
    color: "#494642",
  },
  value: {
    ...textStyles.littleBold,
  },
  valueSecond: {
    ...textStyles.littleBold,
    color: "#111",
  },
  addressValue: {
    ...textStyles.littleBold,
    color: "#111",
    width: 200,
    left: 10,
  },
});

export default PlanDetailsCard;
