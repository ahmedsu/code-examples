import React, { FC, useMemo, useState } from "react";
import { t } from "i18n-js";
import useTheme from "hooks/useTheme";
import { useQuery } from "react-query";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageSourcePropType,
  Image,
  ActivityIndicator,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useDispatch, useSelector } from "hooks/reduxHooks";

import {
  ExpandableInfoCard,
  TestButton,
  CustomRatingBar,
  ProductHorizontalCard,
  Header,
  Divider,
  AddedProductModal,
  BuyButtons,
} from "../../components";

import TestVials from "../../../assets/images/svg/testVials.svg";
import HealthBackground from "../../../assets/images/png/sexualHealthBackground.png";
import FastingIcon from "../../../assets/images/svg/fasting.svg";
import TimeIcon from "../../../assets/images/svg/time.svg";
import SampleTypeIcon from "../../../assets/images/svg/sampleType.svg";
import LocationIcon from "../../../assets/images/svg/location.svg";
import LeftChevronIcon from "../../../assets/images/svg/leftChevron.svg";
import { textStyles } from "globalStyles";
import { getAllProducts } from "services/products";
import { ProductDataInterface } from "types/products";
import { Navigation } from "types";

const placeholderExpandableCardData = [
  {
    title: "Use",
    text: "This panel includes testing for the most common sexually transmitted diseases: HIV, Hepatitis, Syphilis, Herpes, Chlamydia and Gonorrhea. If you recently had unprotected sex and think you may have been exposed to an STD, Personalabs offers this low-cost online STD Screening so you can know your status and be at ease. Many people who have STDs show no symptoms at all. Early detection can prevent transmitting the disease to your partner and further development of more serious medical problems if not treated immediately.",
  },
  {
    title: "Recommended For",
    text: "This panel includes testing for the most common sexually transmitted diseases: HIV, Hepatitis, Syphilis, Herpes, Chlamydia and Gonorrhea. If you recently had unprotected sex and think you may have been exposed to an STD, Personalabs offers this low-cost online STD Screening so you can know your status and be at ease. Many people who have STDs show no symptoms at all. Early detection can prevent transmitting the disease to your partner and further development of more serious medical problems if not treated immediately.",
  },
  {
    title: "Special Notes",
    text: "This panel includes testing for the most common sexually transmitted diseases: HIV, Hepatitis, Syphilis, Herpes, Chlamydia and Gonorrhea. If you recently had unprotected sex and think you may have been exposed to an STD, Personalabs offers this low-cost online STD Screening so you can know your status and be at ease. Many people who have STDs show no symptoms at all. Early detection can prevent transmitting the disease to your partner and further development of more serious medical problems if not treated immediately.",
  },
  {
    title: "Quest Tests Included",
    text: "This panel includes testing for the most common sexually transmitted diseases: HIV, Hepatitis, Syphilis, Herpes, Chlamydia and Gonorrhea. If you recently had unprotected sex and think you may have been exposed to an STD, Personalabs offers this low-cost online STD Screening so you can know your status and be at ease. Many people who have STDs show no symptoms at all. Early detection can prevent transmitting the disease to your partner and further development of more serious medical problems if not treated immediately.",
  },
];

const placeholderDetailsData = [
  {
    icon: FastingIcon,
    label: "Fasting required",
    value: "No",
  },
  {
    icon: TimeIcon,
    label: "Turnaround time",
    value: "72 hours",
  },
  {
    icon: SampleTypeIcon,
    label: "Sample type",
    value: "Blood",
  },
  {
    icon: LocationIcon,
    label: "Location",
    value: "NYC",
  },
];

interface TestDetailsRowProps {
  Icon: FC;
  label: string;
  value: string;
}

const TestDetailsRow: FC<TestDetailsRowProps> = ({ Icon, label, value }) => {
  const { theme } = useTheme();

  return (
    <View style={localStyles.testDetailsRow}>
      <View
        style={[
          localStyles.testDetailsIconContainer,
          { borderWidth: 1, borderColor: theme.lightGreyBorder },
        ]}>
        <Icon />
      </View>
      <View style={localStyles.testDetailsTextContainer}>
        <View>
          <Text style={localStyles.testDetailsLabelText}>{label}</Text>
        </View>
        <View>
          <Text style={localStyles.testDetailsValueText}>{value}</Text>
        </View>
      </View>
    </View>
  );
};

interface ProductShowScreenProps {
  navigation: Navigation;
  route: RouteProp<{ params: { productId: number } }>;
}

/**
 * @description Shows the page for an individual product
 * @author Ahmed Suljic
 */
const ProductShowScreen: FC<ProductShowScreenProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useTheme();
  const { productId } = route.params;

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

  /**
   * @description Returns a product from productData that matches the provided id
   * @author Ahmed Suljic
   */
  const getProductDataById = (id: number) => {
    return productData?.find((item) => item.id === id);
  };

  const selectedProduct: ProductDataInterface = useMemo(
    () => getProductDataById(productId),
    [productId],
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
        <View style={localStyles.searchDiv}>
          <Image
            source={HealthBackground as ImageSourcePropType}
            style={localStyles.healthBackgroundStyle}
            resizeMode={"cover"}
          />
          <View style={localStyles.backBtnDiv}>
            <TouchableOpacity
              style={localStyles.backBtn}
              onPress={() => navigation.goBack()}>
              <LeftChevronIcon />
              <Text
                style={[localStyles.backBtnText, { color: theme.secondary }]}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
          <View style={localStyles.shopTextDiv}>
            <Text style={[localStyles.shopText, { color: theme.secondary }]}>
              {selectedProduct.title}
            </Text>
          </View>
          <View style={localStyles.ratingContainer}>
            <View style={localStyles.starsContainer}>
              <CustomRatingBar
                rating={3.5}
                color="white"
                onStarPress={() => {}}
              />
            </View>

            <Text style={[localStyles.reviewText, { color: theme.secondary }]}>
              31 {t("reviews")}
            </Text>
          </View>
          <Divider size={28} />
          <View style={localStyles.buyButtonsContainer}>
            <BuyButtons
              product={selectedProduct}
              isCentered={selectedProduct.variations.length < 2}
              isColumn={false}
            />
          </View>

          <View style={localStyles.testIconContainer}>
            <TestVials />
          </View>
        </View>

        <View style={localStyles.testDetailsContainer}>
          {placeholderDetailsData.map((item) => (
            <TestDetailsRow
              Icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
          <View style={localStyles.testDetailsTabContainer}>
            <TouchableOpacity
              style={[
                localStyles.testDetailsTab,
                { borderColor: theme.primary },
              ]}>
              <Text
                style={[
                  localStyles.testDetailsTabText,
                  { color: theme.primary },
                ]}>
                {t("description")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                localStyles.testDetailsTab,
                { borderColor: theme.darkGreyText },
              ]}>
              <Text
                style={[
                  localStyles.testDetailsTabText,
                  { color: theme.darkGreyText },
                ]}>
                {t("howItWorks")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={localStyles.expandableCardsContainer}>
          {placeholderExpandableCardData.map((item) => (
            <ExpandableInfoCard title={item.title} text={item.text} />
          ))}
        </View>
        <View style={localStyles.relatedTestsDiv}>
          <View style={localStyles.relatedTests}>
            <Text
              style={[
                localStyles.relatedTestsText,
                { color: theme.darkGreyText },
              ]}>
              {t("relatedTests")}
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
              <ActivityIndicator />
            )}
          </View>
        </View>
      </ScrollView>
      {showAddedProductModal && <AddedProductModal yOffset={86} />}

      <View
        style={[
          localStyles.bottomTabBuyBtnsContainer,
          { backgroundColor: theme.secondary },
        ]}>
        <View
          style={[
            localStyles.priceButtonContainerBottomtab,
            localStyles.priceButtonTextQuest,
            { backgroundColor: theme.secondary },
          ]}>
          <Divider size={12} />
          <BuyButtons
            product={selectedProduct}
            isCentered={selectedProduct.variations.length < 2}
            isColumn={false}
          />
        </View>
      </View>
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
    width: 327,
    textAlign: "center",
  },
  searchDiv: {
    width: "100%",
    alignItems: "center",
    height: 300,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  starsContainer: {
    marginTop: 10,
  },
  reviewText: {
    ...textStyles.mainText,
    marginTop: 7,
    marginLeft: 10,
  },
  priceButtonContainer: {
    flexDirection: "row",
    marginTop: 18,
    marginBottom: 48,
    width: 328,
  },
  priceButtonContainerBottomtab: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 26,
    width: 328,
  },
  priceButtonText: {
    ...textStyles.mainBold,
  },
  priceButtonTextQuest: {
    justifyContent: "center",
    marginLeft: 8,
  },
  testIconContainer: {
    position: "absolute",
    bottom: -10,
    right: 30,
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
  healthBackgroundStyle: {
    position: "absolute",
    height: 300,
    width: "100%",
  },
  testDetailsContainer: {
    marginTop: 24,
  },
  testDetailsRow: {
    flexDirection: "row",
    height: 40,
    marginVertical: 6,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  testDetailsIconContainer: {
    height: 40,
    width: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  testDetailsTextContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 12,
  },
  testDetailsLabelText: {
    ...textStyles.mainText,
  },
  testDetailsValueText: {
    ...textStyles.mainBold,
  },
  testDetailsTabContainer: {
    flexDirection: "row",
    width: "100%",
    height: 40,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  testDetailsTab: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 2,
  },
  testDetailsTabText: {
    ...textStyles.mainBold,
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
  backBtnText: {
    ...textStyles.mainBold,
  },
  expandableCardsContainer: {
    paddingHorizontal: 24,
  },
  relatedTestsDiv: {
    marginTop: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 70,
  },
  relatedTests: {
    width: "100%",
  },
  relatedTestsText: {
    ...textStyles.bodyLarge,
    color: "#494642",
    marginLeft: 20,
  },
  flatListItemSeparator: {
    width: 20,
  },
  buyButtonsContainer: {
    width: 328,
  },
  bottomTabBuyBtnsContainer: {
    flex: 1,
    flexDirection: "row",
    zIndex: 10000,
    position: "absolute",
    bottom: 0,
    height: 69,
    width: "100%",
    paddingHorizontal: 24,
    marginTop: "auto",
  },
  bottomTabBuyButton: {
    marginHorizontal: 8,
  },
});

export default ProductShowScreen;
