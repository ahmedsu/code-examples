import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  ImageSourcePropType,
  Image,
  ActivityIndicator,
} from "react-native";
import { t } from "i18n-js";
import { useQuery } from "react-query";

import {
  SearchTextInput,
  HealthCard,
  Header,
  Divider,
  AddedProductModal,
} from "components";
import ProductHorizontalCard from "components/ProductHorizontalCard";

import BackgroundVector from "../../../assets/images/svg/ShopIcons/vectorCircle.svg";
import HealthPotionPurple from "../../../assets/images/svg/ShopIcons/healthPotionPurple.svg";
import HealthPotionRed from "../../../assets/images/svg/ShopIcons/healthPotionRed.svg";
import HealthPotionBlue from "../../../assets/images/svg/ShopIcons/healthPotionBlue.svg";
import HealthPotionYellow from "../../../assets/images/svg/ShopIcons/healthPotionYellow.svg";
import sexualHealthBackground from "../../../assets/images/png/sexualHealth.png";
import femaleHealthBackground from "../../../assets/images/png/femaleHealth.png";
import maleHealthBackground from "../../../assets/images/png/maleHealth.png";
import generalHealthBackground from "../../../assets/images/png/generalHealth.png";

import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import { Navigation } from "types";
import { ProductDataInterface } from "types/products";
import { getAllProducts } from "services/products";
import {
  flashAddedProductModal,
  formatVariationData,
} from "utils/helperFunctions/simpleHelpers";
import { useDispatch, useSelector } from "hooks/reduxHooks";
import { addProduct } from "redux/actions/cartActions";

interface ShopScreenProps {
  navigation: Navigation;
}

/**
 * @description Base screen in the shop stack, renders 4 product category cards and a popular test horizontal list
 * @author Ahmed Suljic
 */
const ShopScreen: FC<ShopScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();

  const showAddedProductModal = useSelector(
    (state) => state.cart.showAddedProductModal,
  );

  const renderTestCards = ({ item }: any) => {
    return (
      <>
        <ProductHorizontalCard
          key={item.id}
          product={item}
          onCardPress={() =>
            navigation.navigate("shop", {
              screen: "ProductShowScreen",
              params: { productId: item.id },
            })
          }
        />
        <Divider direction="h" size={20} />
      </>
    );
  };

  const {
    isError,
    isLoading: isLoadingProducts,
    data: productData,
  } = useQuery<Array<ProductDataInterface> | any[]>(
    ["products"],
    getAllProducts,
  );

  return (
    <>
      <ScrollView
        style={[localStyles.container, { backgroundColor: theme.secondary }]}>
        <Header
          onDrawerPress={() =>
            navigation.navigate("shop", { screen: "CartScreen" })
          }
          onSettingsPress={() =>
            navigation.navigate("healthReport", { screen: "EditAccountScreen" })
          }
          onLogoPress={() => navigation.navigate("HomeScreen")}
        />

        <View
          style={[localStyles.searchDiv, { backgroundColor: theme.primary }]}>
          <View style={localStyles.shopTextDiv}>
            <Text style={[localStyles.shopText, { color: theme.secondary }]}>
              Shop
            </Text>
          </View>
          <SearchTextInput
            value={searchInput}
            placeholder="Search"
            onChangeText={setSearchInput}
            withSearchIcon
          />
        </View>

        <View style={localStyles.cardDiv}>
          <BackgroundVector
            width={"100%"}
            height={120}
            style={localStyles.backgroundVectorStyle}
          />
          <View style={localStyles.cardHealthDiv}>
            <HealthCard
              cardColor={"#7C5380"}
              cardText={"Sexual Health"}
              mainImage={
                <Image
                  source={sexualHealthBackground as ImageSourcePropType}
                  style={localStyles.categoryImage}
                />
              }
              secImage={
                <HealthPotionPurple style={localStyles.potionCardIcon} />
              }
              onPress={() =>
                navigation.navigate("shop", {
                  screen: "ProductCategoryScreen",
                  params: {
                    category: "sexual-health",
                  },
                })
              }
            />
            <HealthCard
              cardColor={"#B15477"}
              cardText={"Female Health"}
              mainImage={
                <Image
                  source={femaleHealthBackground as ImageSourcePropType}
                  style={localStyles.categoryImage}
                />
              }
              secImage={<HealthPotionRed style={localStyles.potionCardIcon} />}
              onPress={() =>
                navigation.navigate("shop", {
                  screen: "ProductCategoryScreen",
                  params: {
                    category: "womens-health",
                  },
                })
              }
            />
          </View>

          <View style={localStyles.cardHealthDiv}>
            <HealthCard
              cardColor={theme.primary}
              cardText={"Male Health"}
              mainImage={
                <Image
                  source={maleHealthBackground as ImageSourcePropType}
                  style={localStyles.categoryImage}
                />
              }
              secImage={<HealthPotionBlue style={localStyles.potionCardIcon} />}
              onPress={() =>
                navigation.navigate("shop", {
                  screen: "ProductCategoryScreen",
                  params: {
                    category: "mens-health",
                  },
                })
              }
            />
            <HealthCard
              cardColor={"#C18024"}
              cardText={"General Health"}
              mainImage={
                <Image
                  source={generalHealthBackground as ImageSourcePropType}
                  style={localStyles.categoryImage}
                />
              }
              secImage={
                <HealthPotionYellow style={localStyles.potionCardIcon} />
              }
              onPress={() =>
                navigation.navigate("shop", {
                  screen: "ProductCategoryScreen",
                  params: {
                    category: "general-health",
                  },
                })
              }
            />
          </View>
        </View>

        <View style={localStyles.popularTestsDiv}>
          <Text
            style={[
              localStyles.popularTestsText,
              { color: theme.darkGreyText },
            ]}>
            {t("popularTests")}
          </Text>
          <Divider size={16} />
          {!isLoadingProducts ? (
            <FlatList
              data={productData?.slice(0, 5)}
              renderItem={renderTestCards}
              showsHorizontalScrollIndicator={false}
              horizontal
              ListHeaderComponent={() => (
                <View style={localStyles.flatListItemSeparator} />
              )}
            />
          ) : (
            <>
              <Divider size={20} />
              <ActivityIndicator />
            </>
          )}
        </View>
      </ScrollView>
      {showAddedProductModal && <AddedProductModal yOffset={16} />}
    </>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shopTextDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  shopText: {
    ...textStyles.h4,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  searchDiv: {
    width: "100%",
    alignItems: "center",
    height: 274,
  },
  cardDiv: {
    width: "100%",
    alignItems: "center",
    height: 280,
  },
  backgroundVectorStyle: {
    position: "absolute",
    top: -89,
  },
  cardHealthDiv: {
    width: "85%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    top: "-27%",
    marginTop: 20,
  },
  potionCardIcon: {
    position: "absolute",
    bottom: -10,
    right: 10,
  },
  popularTestsDiv: {
    width: "100%",
    paddingBottom: 70,
  },
  popularTestsText: {
    ...textStyles.bodyLarge,
    marginLeft: 20,
  },
  flatListItemSeparator: {
    width: 20,
  },
});

export default ShopScreen;
