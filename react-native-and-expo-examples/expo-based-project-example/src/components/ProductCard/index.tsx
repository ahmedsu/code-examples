import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { ProductDataInterface } from "types/products";
import {
  TestButton,
  CustomRatingBar,
  Divider,
  BuyButtons,
} from "../../components";

interface ProductCardProps {
  product: ProductDataInterface;
  onCardPress: () => void;
}

const ProductCard = ({ product, onCardPress }: ProductCardProps) => {
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
      <Text
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
        style={[
          localStyles.productCardDescription,
          { color: theme.darkGreyText },
        ]}>
        {"Lorem ipsum dolor sit amet consectetur adipiscing elit"}
      </Text> */}
      <Divider size={8} />
      <BuyButtons
        product={product}
        isSlimButtons
        fullWidth={product.variations.length > 1}
      />
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  productCard: {
    justifyContent: "space-between",
    borderRadius: 16,
    width: "100%",
    padding: 24,
  },
  productCardTitle: {
    ...textStyles.mainBold,
  },
  productCardDescription: {
    ...textStyles.littleRegular,
    marginTop: 10,
    height: "auto",
    flex: 1,
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
  testButton: {
    flex: 1,
    width: "50%",
  },
  buttonDiv: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 32,
  },
});

export default ProductCard;
