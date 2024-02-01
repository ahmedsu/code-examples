import { CarouselItem } from "components";
import { Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { ProductDataInterface } from "types/products";

interface ProductCarouselInterface {
  products: Array<ProductDataInterface>;
}

const ProductCarousel = ({ products }: ProductCarouselInterface) => {
  return (
    <Carousel
      loop
      data={products}
      renderItem={({ item }) => <CarouselItem product={item} />}
      width={Dimensions.get("window").width}
      height={270}
      style={localStyles.carousel}
      mode="parallax"
      modeConfig={{
        parallaxAdjacentItemScale: 0.78,
        parallaxScrollingScale: 1,
        parallaxScrollingOffset: 200,
      }}
    />
  );
};

const localStyles = StyleSheet.create({
  carousel: {
    marginBottom: 50,
    alignContent: "space-between",
    marginTop: "-63%",
  },
});

export default ProductCarousel;
