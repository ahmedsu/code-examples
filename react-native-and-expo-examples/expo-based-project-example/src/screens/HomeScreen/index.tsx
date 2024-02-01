import { t } from "i18n-js";
import useTheme from "hooks/useTheme";
import React, { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "react-query";

import { textStyles } from "globalStyles";
import { Navigation } from "types";
import { ProductDataInterface } from "types/products";
import { getAllProducts } from "services/products";
import { getPromos } from "services/other";

import {
  Header,
  DiscountSection,
  ProcedureStep,
  LastVisitedCard,
  CarouselItem,
  Carousel,
} from "../../components";

import {
  ProgressCheckBackground,
  ResultIcon,
  OrdersIcon,
  ShopIcon,
  MessageIcon,
  GrayCircleBackground,
  CheckIcon,
  GreenCircleBackground,
  PotionIcon,
  AddIcon,
} from "../../../assets/images/svg";
import { PromoDataInterface } from "types/promos";

interface HomeScreenProps {
  navigation: Navigation;
}

/**
 * @description HomeScreen, the first screen after the user is authenticated
 * @author Ahmed Suljic
 */
const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const PLACEHOLDER_LASTVISITED_DATA = [
    { id: 1, title: `${t("testResultsArrived")}` },
    { id: 2, title: `${t("appointmentConfirmed")}` },
    { id: 3, title: `${t("appointmentConfirmed")}` },
    { id: 4, title: `${t("appointmentConfirmed")}` },
    { id: 5, title: `${t("symptomCheckerTranscript")}` },
  ];
  const {
    isError: isProductsError,
    isLoading: isLoadingProducts,
    data: productData = [],
  } = useQuery<Array<ProductDataInterface>>(["products"], getAllProducts);

  const {
    isError: isPromosError,
    isLoading: isLoadingPromos,
    data: promoData = [],
  } = useQuery<Array<PromoDataInterface>>(["promos"], getPromos);

  return (
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
      <DiscountSection
        text={promoData[0]?.text}
        pressLearnMore={() => console.log("Learn More!")}
      />

      <View
        style={[localStyles.welcomeDiv, { backgroundColor: theme.primary }]}>
        {/* <Image
          source={require("../../../assets/profilePic.png")}
          style={localStyles.profileImage}
        /> */}
        <Text
          style={[
            localStyles.welcomeTextFirst,
            textStyles.h4,
            { color: theme.secondary },
          ]}>
          {t("homeScreenTitle")}
        </Text>
        <Text
          style={[
            localStyles.welcomeTextSecond,
            textStyles.mainText,
            { color: theme.secondary },
          ]}>
          {t("homeScreenSubtitle")}
        </Text>
      </View>

      <View style={localStyles.procedureDiv}>
        <ProgressCheckBackground
          width={"100%"}
          height={"100%"}
          style={localStyles.circleBackground}
        />
        <ProcedureStep
          firstStepIcon={
            <ResultIcon
              width={47}
              height={22}
              style={{ alignSelf: "center" }}
            />
          }
          firstStepText={t("homeMainButtonLeft")}
          firstStepOnPress={() =>
            navigation.navigate("results", { screen: "OrdersScreen" })
          }
          secondStepIcon={
            <ShopIcon width={45} height={44} style={{ alignSelf: "center" }} />
          }
          secondStepText={t("homeMainButtonCenter")}
          secondStepOnPress={() =>
            navigation.navigate("shop", { screen: "ShopScreen" })
          }
          thirdStepIcon={
            <OrdersIcon
              width={27}
              height={40}
              style={{ alignSelf: "center" }}
            />
          }
          thirdStepText={t("homeMainButtonRight")}
          thirdStepOnPress={() =>
            navigation.navigate("healthReport", { screen: "YourOrdersScreen" })
          }
          customShadowViewStyles={[localStyles.shadowDiv]}
        />

        <View style={localStyles.checkMySimptomsDiv}>
          {/* <PrimaryButton
            onPress={() => console.log("Check My Symptopms")}
            label={"Check my symptopms"}
            wrapperStyle={[
              localStyles.loginButtonWrapper,
              { backgroundColor: theme.primary },
            ]}
            textStyle={{
              color: theme.secondary,
              fontFamily: "Open Sans Bold",
              fontSize: 16,
            }}
          /> */}
          <TouchableOpacity
            style={[
              localStyles.checkButton,
              { backgroundColor: theme.primary },
            ]}
            onPress={() =>
              navigation.navigate("home", {
                screen: "WebViewScreen",
                params: {
                  link: "https://legacy.personalabs.com/isabel/symptom-checker",
                },
              })
            }>
            <Text style={[textStyles.mainBold, { color: theme.secondary }]}>
              {t("symptomCheckButton")}
            </Text>
            <MessageIcon />
          </TouchableOpacity>
          {/* <Text
            style={[textStyles.littleRegular, { color: theme.darkGreyText }]}>
            last check: 10/20/2021
          </Text> */}
        </View>
      </View>

      <View style={localStyles.lastVisitedDiv}>
        <GrayCircleBackground width={"100%"} height={"100%"} />
        <LastVisitedCard lastVisitedData={PLACEHOLDER_LASTVISITED_DATA} />
        <Text
          style={[
            localStyles.recommendedText,
            { color: theme.pressableGreen },
          ]}>
          {t("carouselTitle")}
        </Text>
      </View>

      <View style={localStyles.recommendationDiv}>
        <View style={{ width: "100%", position: "absolute", top: -60 }}>
          <GreenCircleBackground
            width={"100%"}
            height={390}
            style={localStyles.circleBackground}
          />
        </View>

        <Carousel products={productData?.slice(0, 3)} />
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alignItems: {
    alignItems: "center",
  },
  welcomeDiv: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 325,
  },
  welcomeTextFirst: {
    top: -20,
  },
  welcomeTextSecond: {
    top: -15,
  },
  profileImage: {
    marginTop: 30,
  },
  procedureDiv: {
    height: 300,
  },
  circleBackground: {
    top: "-26%",
  },
  shadowDiv: {
    height: 67,
    width: 67,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 100,
    shadowColor: "#111",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 5,
  },
  checkMySimptomsDiv: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
    top: "25%",
    height: 75,
    justifyContent: "space-between",
  },
  checkButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 247,
    height: 48,
    borderRadius: 50,
  },
  lastVisitedDiv: {
    height: 600,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedText: {
    ...textStyles.bodyLarge,
    position: "absolute",
  },
  recommendationDiv: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonWrapper: {
    width: 247,
    height: 48,
  },
  labTestDiv: {
    width: 191,
    height: 270,
    backgroundColor: "#ffffff",
    position: "absolute",
    borderRadius: 16,
    top: "-25%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  labTestsText: {
    ...textStyles.littleRegular,
    width: 155,
  },
  pricingDiv: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});
export default HomeScreen;
