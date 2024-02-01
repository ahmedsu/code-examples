import { t } from "i18n-js";
import useTheme from "hooks/useTheme";
import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "react-query";

import { textStyles } from "globalStyles";
import { Navigation } from "types";

import {
  Divider,
  Header,
  PrimaryButton,
  YourOrderCard,
} from "../../components";
import { getAllOrders } from "services/customer";
import { OrderDataInterface } from "types/orders";

interface YourOrdersScreenProps {
  navigation: Navigation;
}

/**
 * @description This screen displays all orders for current logged user
 * 
 */

const YourOrdersScreen: FC<YourOrdersScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    isError,
    isLoading: isLoadingOrders,
    data: ordersData = [],
  } = useQuery<Array<OrderDataInterface>>(["orders"], getAllOrders);

  const lastPage = Math.ceil(ordersData.length / 5);

  const displayItems = ordersData?.slice(
    (currentPage - 1) * 5,
    currentPage * 5,
  );
  const handlePaginationNextItems = () => {
    if (currentPage === lastPage) return;
    setCurrentPage(currentPage + 1);
  };

  const handlePaginationPreviousItems = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  /**
   * @description Rendering orders for current logged user, using YourOrderCard component
   * 
   */
  const renderYourOrdersCards = ({ item }: any) => {
    return (
      <>
        <YourOrderCard key={item.id} order={item} />
      </>
    );
  };
  return (
    <ScrollView
      style={[localStyles.container, { backgroundColor: theme.secondary }]}>
      <Header
        onDrawerPress={() =>
          navigation.navigate("shop", { screen: "ShopScreen" })
        }
        onSettingsPress={() =>
          navigation.navigate("healthReport", { screen: "EditAccountScreen" })
        }
        onLogoPress={() => {
          navigation.navigate("HomeScreen");
        }}
      />
      <View
        style={[
          localStyles.yourOrdersTitleContainer,
          { backgroundColor: theme.primary },
        ]}>
        <Text
          style={[localStyles.yourOrdersTitleText, { color: theme.secondary }]}>
          Your Orders
        </Text>
      </View>
      {isLoadingOrders ? (
        <>
          <Divider size={20} />
          <ActivityIndicator />
        </>
      ) : (
        <FlatList
          data={displayItems}
          renderItem={renderYourOrdersCards}
          showsHorizontalScrollIndicator={false}
        />
      )}
      {ordersData.length > 5 ? (
        <View style={localStyles.paginationContainer}>
          <PrimaryButton
            containerStyle={[
              { borderColor: theme.lightGreyBorder, height: 48 },
            ]}
            wrapperStyle={[
              {
                borderColor: theme.borderLightGrey,
                borderWidth: 1,
                width: 48,
              },
            ]}
            disabled={currentPage === 1}
            children={
              <Image
                source={require("../../../assets/images/png/previous.png")}
              />
            }
            onPress={handlePaginationPreviousItems}
          />
          <PrimaryButton
            containerStyle={[
              { borderColor: theme.lightGreyBorder, height: 48 },
            ]}
            wrapperStyle={[
              {
                borderColor: theme.borderLightGrey,
                borderWidth: 1,
                width: 48,
              },
            ]}
            children={
              <Image source={require("../../../assets/images/png/next.png")} />
            }
            onPress={handlePaginationNextItems}
            disabled={currentPage === lastPage}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  yourOrdersTitleContainer: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  yourOrdersTitleText: {
    ...textStyles.h4,
  },
  paginationContainer: {
    flexDirection: "row",
    marginTop: 40,
    justifyContent: "space-between",
    alignSelf: "center",
    width: 155,
  },
});
export default YourOrdersScreen;
