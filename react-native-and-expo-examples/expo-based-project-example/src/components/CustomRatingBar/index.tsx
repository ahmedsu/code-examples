import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import StarFilledWhite from "../../../assets/images/svg/StarIcons/starFilledWhite.svg";
import StarHalfWhite from "../../../assets/images/svg/StarIcons/starHalfWhite.svg";
import StarEmptyWhite from "../../../assets/images/svg/StarIcons/starEmptyWhite.svg";
import StarFilledPurple from "../../../assets/images/svg/StarIcons/starFilledPurple.svg";
import StarHalfPurple from "../../../assets/images/svg/StarIcons/starHalfPurple.svg";
import StarEmptyPurple from "../../../assets/images/svg/StarIcons/starEmptyPurple.svg";

interface CustomRatingBarProps {
  onStarPress: Function;
  rating: number;
  color: string;
}

const CustomRatingBar = ({
  onStarPress,
  rating = 3,
  color = "purple",
}: CustomRatingBarProps) => {
  /**
   * @description Get Individual star depending on if its index is greater or lower than the rating
   * @author Ahmed Suljic
   */
  const getStar = (index: number) => {
    if (color === "purple") {
      if (index <= rating) {
        return <StarFilledPurple />;
      }
      if (index === Math.ceil(rating) && rating >= Math.floor(rating) + 0.5) {
        return <StarHalfPurple />;
      }
      return <StarEmptyPurple />;
    }

    if (color === "white") {
      if (index <= rating) {
        return <StarFilledWhite />;
      }
      if (index === rating + 0.5) {
        return <StarHalfWhite />;
      }
      return <StarEmptyWhite />;
    }

    return <StarEmptyPurple />;
  };

  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  return (
    <View style={localStyles.customRatingBarStyle}>
      {maxRating.map((item, key) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            key={item}
            onPress={() => onStarPress(item)}>
            {getStar(key + 1)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const localStyles = StyleSheet.create({
  customRatingBarStyle: {
    flexDirection: "row",
  },
  starImageStyle: {
    width: 20,
    height: 20,
    resizeMode: "cover",
  },
});

export default CustomRatingBar;
