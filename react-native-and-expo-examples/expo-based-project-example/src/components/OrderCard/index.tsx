import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";

import DetailsIcon from "../../../assets/images/svg/HomeIcons/detailsIcon.svg";
import DownloadIcon from "../../../assets/images/svg/HomeIcons/downloadIcon.svg";

interface OrderCardProps {
  onPress: () => void;
  requisitionNum: string;
  specimen: string;
  dateCollected: string;
  dateReported: string;
  onPressDownload: () => void;
  isDownloading: boolean;
}

const OrderCard = ({
  onPress,
  requisitionNum,
  specimen,
  dateCollected,
  dateReported,
  onPressDownload,
  isDownloading,
}: OrderCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={localStyles.cardContainer}>
      <View style={localStyles.cardHeader}>
        <Text>Req #</Text>
        <Text>{requisitionNum}</Text>
      </View>

      <View style={localStyles.cardContent}>
        <View style={localStyles.cardProperty}>
          <Text>Specimen #</Text>
          <Text>{specimen}</Text>
        </View>

        <View style={localStyles.cardProperty}>
          <Text>Collected</Text>
          <Text>{dateCollected.split(" ")[0]}</Text>
        </View>

        <View style={localStyles.cardProperty}>
          <Text>Reported</Text>
          <Text>{dateReported.split(" ")[0]}</Text>
        </View>
      </View>

      <View style={localStyles.cardIconsContainer}>
        <Pressable onPress={onPressDownload} disabled={isDownloading}>
          <View style={localStyles.iconContainer}>
            {isDownloading ? (
              <ActivityIndicator />
            ) : (
              <DownloadIcon width={24} height={24} />
            )}
          </View>
        </Pressable>
        <TouchableOpacity>
          <View style={localStyles.iconContainer}>
            <DetailsIcon width={24} height={24} />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

const localStyles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    height: 237,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#111",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: "#ffffff",
    marginTop: 20,
  },
  cardHeader: {
    flexDirection: "row",
    height: 50,
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#ECEBEB",
    top: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    top: 20,
    width: "90%",
  },
  cardProperty: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cardIconsContainer: {
    width: "90%",
    top: 44,
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#ECEBEB",
    justifyContent: "center",
    alignItems: "center",
  },
});
