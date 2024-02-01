import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import { PotionIcon, AddIcon } from "../../../assets/images/svg";
import { ProductDataInterface } from "types/products";

interface CarouselItemProps {
  product: ProductDataInterface;
}

const CarouselItem = ({ product }: CarouselItemProps) => {
  const { theme } = useTheme();

  return (
    <View style={localStyles.wrapper}>
      <View style={localStyles.labTestDiv}>
        <PotionIcon width={98} height={110} />
        <Text style={[localStyles.labTestsText, { color: theme.darkGreyText }]}>
          {product.title}
        </Text>
        <View style={localStyles.pricingDiv}>
          <Text
            style={{
              ...textStyles.mainBold,
              color: theme.darkGreyText,
            }}>
            ${product.variations[0].price}
          </Text>
          <TouchableOpacity>
            <AddIcon width={40} height={40} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  labTestDiv: {
    width: 191,
    height: 270,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  labTestsText: {
    ...textStyles.littleRegular,
    width: 155,
  },
  pricingDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },
});

export default CarouselItem;
