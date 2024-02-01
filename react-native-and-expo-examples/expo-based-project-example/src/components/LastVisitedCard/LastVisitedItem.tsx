import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckIcon } from "../../../assets/images/svg";

/**
 * @description reusable text with checkIcon for last visited card on home screem
 * 
 */
interface LastVisitedItemProps {
  title: string;
  textWidth?: number;
  itemIsChecked: boolean;
}
const LastVisitedItem = ({
  title,
  textWidth,
  itemIsChecked,
}: LastVisitedItemProps) => {
  return (
    <View style={localStyles.factAboutLastVisited}>
      {itemIsChecked && (
        <CheckIcon width={12} height={12} style={localStyles.checkIconStyle} />
      )}

      <Text style={[localStyles.factText, { width: textWidth }]}>{title}</Text>
    </View>
  );
};
export default LastVisitedItem;
const localStyles = StyleSheet.create({
  factAboutLastVisited: {
    flexDirection: "row",
    marginTop: 15,
  },
  factText: {
    left: 10,
  },
  checkIconStyle: {
    top: 3,
  },
});
