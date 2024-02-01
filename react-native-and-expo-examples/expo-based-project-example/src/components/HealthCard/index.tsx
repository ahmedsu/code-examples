import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

interface HealthCardProps {
  cardText: string;
  mainImage: any;
  secImage: any;
  cardColor: string;
  onPress: () => void;
}

const HealthCard = ({
  cardText,
  mainImage,
  secImage,
  cardColor,
  onPress,
}: HealthCardProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        localStyles.cardDivFirst,
        {
          backgroundColor: cardColor,
        },
      ]}>
      <View style={localStyles.imageContainer}>
        {mainImage}
        {secImage}
      </View>
      <View style={localStyles.cardTextDiv}>
        <Text style={[localStyles.cardText, { color: theme.secondary }]}>
          {cardText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  cardDivFirst: {
    width: 156,
    height: 154,
    borderRadius: 16,
  },
  imageContainer: {
    height: "73%",
  },
  cardTextDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "27%",
    borderRadius: 16,
  },
  cardText: {
    ...textStyles.littleBold,
  },
  potionCardIcon: {
    position: "absolute",
    bottom: -10,
    right: 10,
  },
});

export default HealthCard;
