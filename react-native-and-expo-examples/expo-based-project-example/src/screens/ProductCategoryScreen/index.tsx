import { t } from "i18n-js";
import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "react-query";

import {
  SearchTextInput,
  DropDownInput,
  ProductCard,
  Header,
  Divider,
  AddedProductModal,
} from "../../components";

import LeftChevronIcon from "../../../assets/images/svg/leftChevron.svg";

import { CATEGORY_DATA, CATEGORY_DATA_INTERFACE } from "utils/constants";
import {
  flashAddedProductModal,
  formatVariationData,
} from "utils/helperFunctions/simpleHelpers";
import { getAllProducts } from "services/products";
import { ProductDataInterface } from "types/products";
import { Navigation } from "types";
import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import { useDispatch, useSelector } from "hooks/reduxHooks";
import { addProduct } from "redux/actions/cartActions";

interface ProductCategoryScreenProps {
  navigation: Navigation;
  route: RouteProp<{ params: { category: string } }>;
}

/**
 * @description ProductCategoryScreen shows the products which match a specific product category
 * @author Dino Emso
 * @author Ahmed Suljic
 */

const ProductCategoryScreen: FC<ProductCategoryScreenProps> = ({
  route,
  navigation,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropDownInput, setDropDownInput] = useState("");
  const showAddedProductModal = useSelector(
    (state) => state.cart.showAddedProductModal,
  );

  const dispatch = useDispatch();

  const { category } = route.params;
  const categoryData = CATEGORY_DATA[category as keyof CATEGORY_DATA_INTERFACE];

  const {
    isError,
    isLoading: isLoadingProducts,
    data: productData,
  } = useQuery<Array<ProductDataInterface> | any[]>(
    ["products"],
    getAllProducts,
  );

  const renderTestCard = ({ item }: any) => {
    return (
      <>
        <Divider size={16} />
        <ProductCard
          key={item.id}
          product={item}
          onCardPress={() =>
            navigation.navigate("shop", {
              screen: "ProductShowScreen",
              params: { productId: item.id },
            })
          }
        />
      </>
    );
  };

  /**
   * @description Filters the productData array for products that belong to the selected category
   * @author Ahmed Suljic
   */
  const categoryFilter = (
    categoryName: string,
    products: Array<ProductDataInterface>,
  ) => {
    if (products) {
      return products.filter((item) => item.group === categoryName);
    }
    return [];
  };

  /**
   * @description Filters the productData array for products whose title partially or fully matches the searchQuery
   * @author Ahmed Suljic
   */
  const searchFilter = (
    searchQuery: string,
    products: Array<ProductDataInterface>,
  ) => {
    if (products) {
      return products.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return [];
  };

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

        <View style={localStyles.searchDiv}>
          <View style={localStyles.healthBackgroundContainer}>
            <Image
              source={
                CATEGORY_DATA[category as keyof CATEGORY_DATA_INTERFACE]
                  .image as ImageSourcePropType
              }
              style={localStyles.healthBackgroundStyle}
            />
            <View
              style={[
                localStyles.backgroundOverlay,
                {
                  backgroundColor:
                    CATEGORY_DATA[category as keyof CATEGORY_DATA_INTERFACE]
                      .color,
                },
              ]}
            />
          </View>

          <View style={localStyles.backBtnDiv}>
            <TouchableOpacity
              style={localStyles.backBtn}
              onPress={() =>
                navigation.navigate("shop", { screen: "ShopScreen" })
              }>
              <LeftChevronIcon />
              <Text style={[textStyles.mainBold, { color: theme.secondary }]}>
                {t("back")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={localStyles.shopTextDiv}>
            <Text style={[textStyles.h4, { color: theme.secondary }]}>
              {t(categoryData.localizedTitleKey)}
            </Text>
          </View>
          <SearchTextInput
            value={searchQuery}
            placeholder={t("search")}
            onChangeText={setSearchQuery}
            withSearchIcon
          />
          <DropDownInput
            value={dropDownInput}
            placeholder={t("dropDownPlaceholder")}
            onChangeText={setDropDownInput}
          />
        </View>

        <View style={localStyles.productContainer}>
          {!isLoadingProducts ? (
            <FlatList
              data={categoryFilter(
                category,
                searchFilter(
                  searchQuery,
                  productData as Array<ProductDataInterface>,
                ),
              )}
              renderItem={renderTestCard}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={localStyles.flatListItemSeparator} />
              )}
            />
          ) : (
            <>
              <Divider size={50} />
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
  headerDiv: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 91,
    flexDirection: "row",
  },
  centerDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#111",
  },
  searchDiv: {
    width: "100%",
    alignItems: "center",
    height: 248,
  },
  backgroundVectorStyle: {
    position: "absolute",
    top: -89,
  },
  cardDiv: {
    width: "100%",
    alignItems: "center",
    height: "25%",
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
  productContainer: {
    marginTop: 8,
    paddingBottom: 70,
    paddingHorizontal: 20,
  },
  flatListItemSeparator: {
    width: 20,
  },
  healthBackgroundContainer: {
    position: "absolute",
    height: 248,
    width: "100%",
  },
  healthBackgroundStyle: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    opacity: 0.9,
  },
  backBtnDiv: {
    width: "90%",
    top: 20,
  },
  backBtn: {
    width: 70,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default ProductCategoryScreen;
