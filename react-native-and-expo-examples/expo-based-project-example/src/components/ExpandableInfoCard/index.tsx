import React, { useState } from "react";
import Animated from "react-native-reanimated";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { textStyles } from "globalStyles";

import ChevronDownIcon from "../../../assets/images/svg/chevronDown.svg";
import ChevronUpIcon from "../../../assets/images/svg/chevronUp.svg";
import useTheme from "hooks/useTheme";

interface ExpandableInfoCardProps {
  title: string;
  text: string;
}

const ExpandableInfoCard = ({ title, text }: ExpandableInfoCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        localStyles.expandableCardContainer,
        {
          borderColor: theme.lightGreyBorder,
          backgroundColor: expanded ? theme.lightGreyBorder : theme.secondary,
        },
      ]}
      onPress={() => setExpanded(!expanded)}>
      <View style={localStyles.titleContainer}>
        <Text style={localStyles.titleText}>{title}</Text>
        <View style={localStyles.chevronContainer}>
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </View>
      </View>
      {expanded && (
        <View>
          <Text style={localStyles.contentText}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  expandableCardContainer: {
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 16,
    padding: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    ...textStyles.mainBold,
  },
  chevronContainer: {
    marginRight: 6,
  },
  contentText: {
    marginTop: 16,
    ...textStyles.mainText,
  },
});

export default ExpandableInfoCard;
