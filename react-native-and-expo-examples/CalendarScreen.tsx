import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { t } from "i18n-js";
import {
  Header,
  Calendar,
  Divider,
  FilterModal,
  ProductPopup,
  LoadingProductCard,
} from "components";
import ProductCard from "components/ProductCard";
import TabSelect from "components/TabSelect";
import { globalStyles, textStyles } from "globalStyles";
import { setSelectedDay } from "redux/actions/productActions";
import useTheme from "hooks/useTheme";
import Constants from "expo-constants";

import {
  Animated,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  FlatList,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Navigation } from "types";
import { PlaceholderShoe } from "../../../assets/images/png";
import {
  CalendarThickBorderIcon,
  InfoIcon,
  CloseIcon,
  BackleftIcon,
} from "../../../assets/images/svg";
import { useQuery, useQueryClient } from "react-query";
import {
  CalendarProductInterface,
  GetCalendarProductsInterface,
} from "types/calendar";
import {
  getWarehouseProducts,
  getCalendarProducts,
  getAvailableProducts,
} from "services/calendar";
import moment from "moment";

import { useSelector, useDispatch } from "hooks/reduxHooks";
import { debounce } from "lodash";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import * as Analytics from "expo-firebase-analytics";

const calendarTabs = [
  {
    id: 0,
    title: "upcoming",
  },
  {
    id: 1,
    title: "available",
  },
  {
    id: 2,
    title: "warehouse",
  },
];

const calendarGuideData = [
  {
    title: "Upcoming Section:",
    data: [
      "Preview the latest sneaker releases on a week-by-week layout.",
      "Covers all releases in the Nike website, Nike app, and SNKRS app.",
      "Know of Exclusive Access and Shock Drops before they are live.",
      "Prepare the drops you want ahead of time!",
    ],
  },
  {
    title: "Available Now Section:",
    data: [
      "Find sneakers available for purchase right now.",
      "Feed sorted by most recently inventory updated.",
      "Act fast! Sought-after pairs might sell out quickly.",
      "Keep an eye out: restocks appear at the top!",
    ],
  },
  {
    title: "Warehouse Section:",
    data: [
      "Get an exclusive peek at Nike's warehouse inventory.",
      "Track potential future releases and restocks as items are scanned in.",
      "Stay a step ahead of the sneaker game with this insider info.",
    ],
  },
];

interface CalendarData {
  products: Array<CalendarProductInterface>;
}

type ProductSectionListFormat = {
  date: number;
  data: Array<CalendarProductInterface>;
};

const CalendarScreen = () => {
  const { theme } = useTheme();
  const country = useSelector((state) => state?.product?.country);
  const scrollRef = useRef(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useDispatch();
  const selectedDay = useSelector((state) => state?.product?.selectedDay);

  const [selectedProduct, setSelectedProduct] =
    useState<CalendarProductInterface | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const calendarContainerRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(0);

  const productFilter = useMemo(() => {
    const newFilter: GetCalendarProductsInterface = {
      country: country,
      timestamp: moment(selectedDay)?.startOf("week")?.unix(),
    };
    return newFilter;
  }, [country, selectedTab, selectedDay]);

  Analytics.logEvent("CalendarScreen_opened", {
    // user: uid,
    screen: "CalendarScreen",
    purpose: "To view the calendar of upcoming releases",
    country: country,
    appVersion: Constants?.expoConfig.extra?.APP_VERSION,
  });

  const onWeekChanged = (date: string) => {
    dispatch(
      setSelectedDay(moment(date)?.startOf("week")?.format("YYYY-MM-DD"))
    );
    // setSelectedDate(moment(date).startOf("week").format("YYYY-MM-DD"));
    if (productData || productData?.items) {
      scrollToTop();
    }
    Analytics.logEvent("CalendarScreen_week_changed", {
      // user: uid,
      screen: "CalendarScreen",
      purpose: "Change the week displayed on the calendar",
      country: country,
      appVersion: Constants?.expoConfig.extra?.APP_VERSION,
    });
  };

  const fetchProductData = async (selectedTab: number, productFilter: any) => {
    switch (selectedTab) {
      case 0:
        Analytics.logEvent("CalendarScreen_upcoming_tab_selected", {
          // user: uid,
          screen: "CalendarScreen",
          purpose: "To view the upcoming tab",
          country: country,
          appVersion: Constants?.expoConfig.extra?.APP_VERSION,
        });
        return getCalendarProducts(productFilter);
      case 1:
        Analytics.logEvent("CalendarScreen_available_tab_selected", {
          // user: uid,
          screen: "CalendarScreen",
          purpose: "To view the available tab",
          country: country,
          appVersion: Constants?.expoConfig.extra?.APP_VERSION,
        });
        return getAvailableProducts(productFilter);
      case 2:
        Analytics.logEvent("CalendarScreen_warehouse_tab_selected", {
          // user: uid,
          screen: "CalendarScreen",
          purpose: "To view the warehouse tab",
          country: country,
          appVersion: Constants?.expoConfig.extra?.APP_VERSION,
        });
        return getWarehouseProducts(productFilter);
      default:
        throw new Error("Invalid tab selected");
    }
  };

  const {
    isLoading: isLoadingProducts,
    data: productData,
    refetch: refetchData,
  } = useQuery<CalendarData>(
    ["products", productFilter, selectedTab],
    () => fetchProductData(selectedTab, productFilter),
    {
      enabled: false,
    }
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchData().then(() => setRefreshing(false));
  }, [refetchData]);

  useEffect(() => {
    refetchData();
  }, [
    selectedTab,
    country,
    moment(selectedDay)?.startOf("week")?.format("YYYY-MM-DD"),
  ]);

  const getFormattedProductData = (
    productData: Array<CalendarProductInterface>
  ) => {
    let formattedProducts: Array<ProductSectionListFormat> = [];

    const uniqueDates = Array(7)
      ?.fill(null)
      ?.map((_, i) =>
        moment(selectedDay)?.startOf("week")?.add(i, "days")?.unix()
      )
      ?.filter((date) => date >= moment()?.startOf("day")?.unix());

    uniqueDates.forEach((date) => {
      const productsForTheDay = productData?.filter(
        (product) =>
          moment?.unix(product.launch_date)?.startOf("day")?.unix() === date
      );

      if (productsForTheDay.length > 0) {
        const groupedByTime = {};
        productsForTheDay.forEach((product) => {
          const launchTime = product.launch_date;
          if (!groupedByTime[launchTime]) {
            groupedByTime[launchTime] = [];
          }
          groupedByTime[launchTime].push(product);
        });

        for (let launchTime in groupedByTime) {
          formattedProducts.push({
            date: Number(launchTime),
            data: groupedByTime[launchTime],
          });
        }
      } else {
        formattedProducts.push({
          date: date,
          data: [],
        });
      }
    });

    return formattedProducts;
  };

  const scrollToTop = () => {
    scrollRef?.current?.scrollToLocation({
      animated: true,
      sectionIndex: 0,
      itemIndex: 0,
      viewPosition: 0,
    });
  };

  const scrollToSection = (sectionIndex: number) => {
    scrollRef?.current?.scrollToLocation({
      animated: true,
      sectionIndex: sectionIndex,
      itemIndex: 1,
      viewPosition: 0,
    });
  };

  const handleDatePress = (dateString: string) => {
    const targetDateTimestamp = moment(dateString).startOf("day").unix();

    const sectionIndex = formattedProductData?.findIndex(
      (section) =>
        moment.unix(section?.date)?.startOf("day")?.unix() ===
        targetDateTimestamp
    );
    if (sectionIndex !== -1) {
      scrollToSection(sectionIndex);
    }
  };

  const formattedProductData = useMemo(() => {
    return productData
      ? getFormattedProductData(productData.items.flat(1))
      : [];
  }, [productData, selectedDay]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, calendarHeight],
    outputRange: [0, -calendarHeight],
    extrapolate: "clamp",
  });

  const onViewableItemsChanged = useCallback(
    debounce(({ viewableItems }) => {
      if (viewableItems.length > 0) {
        dispatch(
          setSelectedDay(
            moment?.unix(viewableItems[0]?.section?.date)?.format("YYYY-MM-DD")
          )
        );
        // setSelectedDate(
        //   moment.unix(viewableItems[0].section.date).format("YYYY-MM-DD"),
        // );
      }
    }, 50),
    []
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setSelectedDay(moment().format("YYYY-MM-DD")));
      if (productData || productData?.items) {
        scrollToTop();
      }
    }, [])
  );

  useEffect(() => {
    if (selectedDay === moment().format("YYYY-MM-DD")) {
      if (productData || productData?.length) {
        scrollToTop();
      }
    }
  }, [selectedDay]);

  return (
    <SafeAreaView
      style={[
        localStyles.container,
        globalStyles.androidSafeArea,
        { backgroundColor: theme.whiteGrey },
      ]}
    >
      <Animated.View
        style={[
          { transform: [{ translateY: headerTranslate }] },
          localStyles.headerDiv,
        ]}
      >
        <Header title="calendar" />
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={localStyles.findMoreBtn}
        >
          <InfoIcon />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={localStyles.modalDiv}>
          <View style={localStyles.modalView}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.calendarGuide}>Calendar Guide</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={localStyles.closeModalBtn}
              >
                <Text style={localStyles.closeIcon}>
                  <BackleftIcon />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={localStyles.modalText}>
              <SectionList
                sections={calendarGuideData}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                  <Text style={localStyles.item}>{item}</Text>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={localStyles.sectionTitle}>{title}</Text>
                )}
                stickySectionHeadersEnabled={false}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={localStyles.mainContentContainer}>
        <Animated.View style={{ transform: [{ translateY: headerTranslate }] }}>
          <View style={localStyles.tabSelectContainer}>
            <TabSelect
              tabSelected={selectedTab}
              setSelectedTab={setSelectedTab}
              tabs={calendarTabs}
              customTabStyles={{ marginBottom: 0 }}
            />
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: headerTranslate }] }}>
          {selectedTab === 0 && (
            <>
              <View
                ref={calendarContainerRef}
                onLayout={(event) =>
                  setCalendarHeight(event.nativeEvent.layout.height)
                }
                style={localStyles.calendarContainer}
              >
                <Divider size={24} />
                <Calendar
                  handleDatePress={handleDatePress}
                  onWeekChanged={onWeekChanged}
                  productData={productData?.items}
                  isLoading={isLoadingProducts}
                  selectedDate={selectedDay}
                />
              </View>

              <SectionList
                ref={scrollRef}
                style={[localStyles.productCardContainer]}
                contentContainerStyle={localStyles.sectionContainer}
                scrollEventThrottle={16}
                onScroll={(e) => {
                  scrollY.setValue(e.nativeEvent.contentOffset.y);
                }}
                onViewableItemsChanged={onViewableItemsChanged}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    progressViewOffset={12}
                  />
                }
                sections={productData ? formattedProductData : []}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={({ section }) => {
                  const { date, data } = section;
                  if (selectedTab === 0) {
                    return (
                      <>
                        <Divider size={8} />
                        <View style={localStyles.listDateContainer}>
                          <CalendarThickBorderIcon />
                          <Divider direction="h" size={8} />
                          <Text style={localStyles.listDateText}>
                            {moment.unix(date).format("MMMM DD, yyyy hh:mm A")}
                          </Text>
                        </View>
                        {data.length === 0 && (
                          <Text style={localStyles.noReleaseText}>
                            Nothing Dropping
                          </Text>
                        )}
                        <Divider size={isLoadingProducts ? 18 : 24} />
                      </>
                    );
                  }
                  return null;
                }}
                ListFooterComponent={
                  isLoadingProducts ? (
                    <View>
                      {Array.of(1, 2, 3, 4, 5, 6).map(() => (
                        <LoadingProductCard />
                      ))}
                    </View>
                  ) : (
                    <>
                      <Divider size={200} />
                      <View style={localStyles.loadNextWeekDiv}>
                        <TouchableOpacity
                          onPress={() => {
                            if (productData || productData?.items) {
                              scrollToTop();
                            }
                            onWeekChanged(
                              moment(selectedDay)
                                .add(1, "week")
                                .format("YYYY-MM-DD")
                            );
                          }}
                        >
                          <Text
                            style={[
                              textStyles.mediumGilroy18,
                              localStyles.nextWeekBtn,
                            ]}
                          >
                            {t("loadNextWeek")}
                          </Text>
                        </TouchableOpacity>
                        <Divider size={0} />
                      </View>
                    </>
                  )
                }
                renderItem={({ item }) => {
                  return (
                    <>
                      <ProductCard
                        onPress={() => {
                          setShowProductModal(true);
                          setSelectedProduct(item);
                        }}
                        productImage={PlaceholderShoe}
                        access={item.access.toUpperCase()}
                        time={moment.unix(item?.launch_date).format("hh:mm A")}
                        productName={item.title.toUpperCase()}
                        sku={item.sku}
                        stock={item.stock}
                        retail={`${item.price} ${item.currency}`}
                        updateDate={item.update_date}
                      />
                      <Divider size={12} />
                    </>
                  );
                }}
              />
            </>
          )}

          {selectedTab !== 0 && (
            <FlatList
              style={[localStyles.productCardContainer]}
              scrollEventThrottle={16}
              //onScroll={(e) => {scrollY.setValue(e.nativeEvent.contentOffset.y);}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  progressViewOffset={12}
                />
              }
              data={productData?.items?.flat(1)}
              ListFooterComponent={
                isLoadingProducts ? (
                  <View>
                    {Array.of(1, 2, 3, 4, 5, 6).map(() => (
                      <LoadingProductCard />
                    ))}
                  </View>
                ) : (
                  <Divider size={40} />
                )
              }
              renderItem={({ item }) => {
                return (
                  <>
                    <ProductCard
                      onPress={() => {
                        setShowProductModal(true);
                        setSelectedProduct(item);
                      }}
                      productImage={PlaceholderShoe}
                      access={item.access.toUpperCase()}
                      time={moment.unix(item?.launch_date).format("hh:mm A")}
                      productName={item.title.toUpperCase()}
                      sku={item.sku}
                      stock={item.stock}
                      retail={`${item.price} ${item.currency}`}
                      updateDate={item.update_date}
                    />
                    <Divider size={12} />
                  </>
                );
              }}
            />
          )}
        </Animated.View>
      </View>

      <ProductPopup
        show={showProductModal}
        onBackPress={() => setShowProductModal(false)}
        product={selectedProduct}
        selectedTab={selectedTab}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alignItems: {
    alignItems: "center",
  },
  mainContentContainer: {
    flex: 1,
  },
  calendarContainer: {
    paddingHorizontal: 16,
    minHeight: 180,
  },
  listDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listDateText: {
    ...textStyles.mediumGilroy14,
  },
  productCardContainer: {
    padding: 16,
  },
  tabSelectContainer: {
    marginHorizontal: 16,
  },
  noReleaseText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    color: "#414141",
  },
  headerDiv: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  nextWeekBtn: {
    color: "red",
    textDecorationLine: "underline",
  },
  loadNextWeekDiv: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    top: 0,
    position: "absolute",
  },
  modalDiv: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "white",
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  closeModalBtn: {
    position: "absolute",
    left: -10,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 20,
    marginTop: 10,
    marginRight: 10,
  },
  modalText: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: "500",
    color: "black",
    top: 60,
  },
  findMoreBtn: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 25,
  },
  modalHeader: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    top: 40,
  },
  calendarGuide: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
    top: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 16,
  },
  item: {
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContainer: {
    paddingBottom: 200,
  },
});
export default CalendarScreen;
