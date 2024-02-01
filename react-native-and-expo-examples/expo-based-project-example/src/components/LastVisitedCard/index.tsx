import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { t } from "i18n-js";
import useTheme from "hooks/useTheme";
import { textStyles } from "globalStyles";

/**
 * @descriptionDisplays Displays LastVisitedItems as list
 * 
 */
import { LastVisitedItem } from "../../components";

interface LastVisitedItemArrayProps {
  id: number;
  title: string;
}
interface LastVisitedCardProps {
  lastVisitedData: Array<LastVisitedItemArrayProps>;
}

const LastVisitedCard = ({ lastVisitedData }: LastVisitedCardProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        localStyles.lastVisitedCard,
        { backgroundColor: theme.secondary },
      ]}>
      <View style={localStyles.lastVisitedCardDiv}>
        <Text
          style={[
            localStyles.lastVisitedSubjectText,
            { color: theme.primary },
          ]}>
          {t("sinceLastVisit")}
        </Text>
        {lastVisitedData.map((item: any, index: any) => {
          return index + 1 === lastVisitedData.length ? (
            <LastVisitedItem
              key={item.id}
              title={item.title}
              textWidth={245}
              itemIsChecked={true}
            />
          ) : (
            <LastVisitedItem title={item.title} itemIsChecked={true} />
          );
        })}
        <Text style={localStyles.visitText}>{t("visitNotificationsTab")}</Text>
      </View>
    </View>
  );
};
export default LastVisitedCard;
const localStyles = StyleSheet.create({
  lastVisitedCard: {
    borderRadius: 16,
    shadowColor: "#111",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    width: 327,
    height: 285,
    position: "absolute",
    top: "-15%",
    alignItems: "center",
  },
  lastVisitedCardDiv: {
    width: "90%",
    marginTop: 20,
  },
  lastVisitedSubjectText: {
    ...textStyles.littleRegular,
  },
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
  visitText: {
    ...textStyles.littleItalic,
    color: "#494642",
    top: "15%",
  },
});
