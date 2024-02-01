import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { ProductDataInterface } from "types/products";
import { CustomRatingBar, Divider, BuyButtons } from "../../components";

interface ProductHorizontalCardProps {
  product: ProductDataInterface;
  onCardPress: () => void;
}

const ProductHorizontalCard = ({
  product,
  onCardPress,
}: ProductHorizontalCardProps) => {
  const [rating, setRating] = useState(2.5);
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        localStyles.productCard,
        {
          backgroundColor: theme.lightGreyBackground,
        },
      ]}
      onPress={onCardPress}>
      <View style={localStyles.popularTestsSubject}>
        <Text
          style={[
            localStyles.popularTestsSubjectText,
            { color: theme.secondary },
          ]}>
          {
            "Sexual Health" /* replace with cardSubject when it is added to the API */
          }
        </Text>
      </View>
      <Divider size={8} />
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[
          localStyles.productCardTitle,
          {
            color: theme.darkGreyText,
          },
        ]}>
        {product.title}
      </Text>
      {/* <View style={localStyles.customRatingBarStyle}>
        <CustomRatingBar
          color="purple"
          rating={rating}
          onStarPress={setRating}
        />
      </View>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[
          localStyles.productCardDescription,
          { color: theme.darkGreyText },
        ]}>
        {
          "This panel includes testing for the most common sexually transmitted diseases: HIV, Hepatitis, Syphilis, Herpes, Chlamydia and Gonorrhea. If…"
        }
      </Text> */}
      <View style={localStyles.separatorView} />
      <BuyButtons product={product} isSlimButtons isColumn fullWidth />
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  productCard: {
    borderRadius: 16,
    width: 241,
    minHeight: 258,
    padding: 24,
    paddingTop: 0,
  },
  popularTestsSubject: {
    backgroundColor: "#7C5380",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    width: 117,
    justifyContent: "center",
    alignItems: "center",
  },
  popularTestsSubjectText: {
    ...textStyles.littleBold,
  },
  productCardTitle: {
    ...textStyles.mainBold,
  },
  productCardDescription: {
    ...textStyles.littleRegular,
    marginTop: 10,
  },
  customRatingBarStyle: {
    flexDirection: "row",
    marginTop: 2.5,
    marginLeft: 0.5,
  },
  starImageStyle: {
    width: 20,
    height: 20,
    resizeMode: "cover",
  },
  separatorView: { flex: 1 },
});

export default ProductHorizontalCard;
