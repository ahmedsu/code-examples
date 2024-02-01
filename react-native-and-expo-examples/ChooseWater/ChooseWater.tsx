import { t } from "i18n-js";
import React, { FC, useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
} from "react-native";
import { Center, Text, View } from "native-base";
import { Navigation } from "../../types";
import { textStyles } from "../../globalStyles";
import { useUserStore } from "../../zustand/useUserStore";
import { useLanguageStore } from "../../zustand/useLanguageStore";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import {
  MainPageBackground,
  DrawerIconSvg,
  StatsIconSvg,
  DailyWaterFullSvg,
  DailyWaterEmptySvg,
} from "../../../assets/images/svg";
import { AnimatedCircularProgress } from "react-native-circular-progress";

interface WaterScreenProps {
  navigation: Navigation;
}

const ChooseWaterScreen: FC<WaterScreenProps> = ({ navigation }) => {
  const currentDate = new Date();
  const user = auth?.currentUser;
  const { userData } = useUserStore();
  const { language } = useLanguageStore();
  const totalGlass = 12;

  const weightTextOnly = userData?.body_info?.weight.match(/\D+/g);
  const weightType = weightTextOnly ? weightTextOnly.join("").trim() : null;
  /**
   * @description Convert lbs to kg
   */
  const convertLbsToKg = (lbs: number) => lbs * 0.45359237;

  const weightValue = useMemo(() => {
    const lbs = parseInt(userData?.body_info?.weight, 10);
    return weightType === "lbs" ? convertLbsToKg(lbs) : lbs;
  }, [userData?.body_info?.weight, weightType]);

  const recommendedWater = useMemo(() => weightValue * 0.045, []);
  const [currentGlass, setCurrentGlass] = useState(0);
  const [glassValueLiters, setGlassValueLiters] = useState(0);
  const [lastDays, setLastDays] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * @description Glass data
   */
  const initialGlassesData = useMemo(() => {
    return Array.from({ length: totalGlass }, (_, index) => ({
      key: String(index + 1),
      completed: index === 1,
    }));
  }, []);

  const [glassData, setGlassData] = useState(initialGlassesData);

  /**
   * @description Add water to the database
   */
  const addWater = useCallback(async () => {
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      const userDocRef = doc(db, "usersData", user?.uid);
      const waterDataDocRef = doc(
        collection(userDocRef, "waterData"),
        formattedDate
      );
      const waterDataSnapshot = await getDoc(waterDataDocRef);
      if (waterDataSnapshot.exists()) {
        await updateDoc(waterDataDocRef, {
          waterAmount: glassValueLiters,
          glassCount: currentGlass,
        });
      } else {
        await setDoc(waterDataDocRef, {
          waterAmount: glassValueLiters,
          glassCount: currentGlass,
        });
      }
    } catch (err) {
      console.log("Error issue", err);
    }
  }, [user?.uid, db, glassValueLiters, currentGlass]);

  /**
   * @description Change glass handler
   */
  const nextStep = useCallback(
    (index: number) => {
      if (currentGlass < totalGlass) {
        const updatedGlassData = Array.from({ length: totalGlass }, (_, i) => ({
          key: String(i),
          completed: i < currentGlass,
        }));
        setGlassData(updatedGlassData);
        setCurrentGlass(index + 1);
        setGlassValueLiters(glassValueLiters + 0.5);
      } else if (currentGlass === 0) {
        setGlassValueLiters(0.5);
        setCurrentGlass(1);
      }
    },
    [
      currentGlass,
      glassData,
      totalGlass,
      setCurrentGlass,
      setGlassData,
      glassValueLiters,
      setGlassValueLiters,
    ]
  );
  useEffect(() => {
    if (glassValueLiters > 0) {
      addWater();
    }
  }, [glassValueLiters, addWater]);

  /**
   * @description Change glass handler
   */
  const previousStep = useCallback(
    (index: number) => {
      if (currentGlass > 1 && currentGlass !== index + 1) {
        const updatedGlassData = [...glassData];
        for (let i = currentGlass - 1; i >= totalGlass; i--) {
          updatedGlassData[i].completed = false;
        }
        setGlassData(updatedGlassData);
        setCurrentGlass(index + 1);
        setGlassValueLiters(glassValueLiters - 0.5);
      } else if (currentGlass === 1) {
        setGlassValueLiters(0);
        setCurrentGlass(0);
      }
    },
    [
      currentGlass,
      glassData,
      totalGlass,
      setGlassData,
      setCurrentGlass,
      glassValueLiters,
      setGlassValueLiters,
    ]
  );

  useEffect(() => {
    if (currentGlass > 0 && currentGlass <= totalGlass) {
      const updatedGlassData = Array.from(
        { length: totalGlass },
        (_, index) => ({
          key: String(index),
          completed: index < currentGlass,
        })
      );
      setGlassData(updatedGlassData);
      setGlassValueLiters(currentGlass * 0.5);
    }
  }, [currentGlass, totalGlass, setGlassData, setGlassValueLiters]);

  const renderItem = useCallback(
    ({
      item,
    }: {
      id: string | number | Date;
      waterAmount: string | number;
    }) => {
      const tolerance = 0.5;
      const date = new Date(item.id);
      let dayName = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .substring(0, 3);
      if (language === "ba") {
        const bosnianDays = {
          Mon: t("Mon"),
          Tue: t("Tue"),
          Wed: t("Wed"),
          Thu: t("Thu"),
          Fri: t("Fri"),
          Sat: t("Sat"),
          Sun: t("Sun"),
        };
        dayName = bosnianDays[dayName];
      }

      return (
        <View style={localStyles.fullDateDiv}>
          <View
            style={[
              localStyles.dateDiv,
              {
                backgroundColor:
                  item.waterAmount > recommendedWater
                    ? "#FD6C75"
                    : Math.abs(recommendedWater - item.waterAmount) <= tolerance
                    ? "#FCC659"
                    : "#85CCC6",
              },
            ]}
          >
            <Text style={localStyles.dateText}>{dayName}</Text>
            <Text style={localStyles.date}>{date?.getDate()}</Text>
          </View>
          <Text style={localStyles.litText}>
            {item.waterAmount > 0 ? item.waterAmount.toFixed(1) : 0} l
          </Text>
        </View>
      );
    },
    []
  );

  const maxGlassValueLiters = 0.5 * 12;
  const roundedNumber = parseFloat(glassValueLiters.toFixed(2));

  useEffect(() => {
    const userDocRef = doc(db, "usersData", user?.uid);
    const mealDataRef = collection(userDocRef, "waterData");
    const unsubscribe = onSnapshot(mealDataRef, (snapshot) => {
      const waterData = [];
      snapshot.forEach((doc) => {
        waterData.push({ id: doc.id, ...doc.data() });
      });
      setLastDays(waterData);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${(
          currentDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;
        const userDocRef = doc(db, "usersData", user?.uid);
        const waterDataDocRef = doc(
          collection(userDocRef, "waterData"),
          formattedDate
        );
        const waterDataSnapshot = await getDoc(waterDataDocRef);
        if (waterDataSnapshot.exists()) {
          const currentWaterData = waterDataSnapshot.data();
          setGlassValueLiters(currentWaterData.waterAmount);
          setCurrentGlass(currentWaterData.glassCount);
        }
        setLoading(false);
      } catch (err) {
        console.log("Error fetching water data", err);
      }
    };
    fetchWaterData();
  }, [user?.uid, db, setGlassValueLiters]);

  /**
   * @description Appropiete color
   */
  const appropieteColor = useMemo(() => {
    const tolerance = 0.5;
    if (glassValueLiters > recommendedWater) {
      return "#FD6C75";
    } else if (glassValueLiters === recommendedWater) {
      return "#FFC659";
    } else if (Math.abs(recommendedWater - glassValueLiters) <= tolerance) {
      return "#FFC659";
    } else {
      return "#85CCC6";
    }
  }, [glassValueLiters, maxGlassValueLiters, roundedNumber, recommendedWater]);

  /**
   * @description Appropiete text
   */
  const appropieteText = useMemo(() => {
    const tolerance = 0.5;
    if (glassValueLiters > recommendedWater) {
      return (
        <Text style={[localStyles.appropriateText, textStyles.lesserItalic]}>
          {t("youHave")}
          <Text style={[textStyles.lesserBold]}> {t("exceded")} </Text>
          {t("your")}
          <Text style={[textStyles.lesserBold]}> {t("recommended")} </Text>
          {t("dailyLimitWaterIntake")}!
        </Text>
      );
    } else if (glassValueLiters === recommendedWater) {
      return (
        <Text style={[localStyles.appropriateText, textStyles.lesserItalic]}>
          {t("youHave")}
          <Text style={[textStyles.lesserBold]}> {t("reached")} </Text>
          {t("your")}
          <Text style={[textStyles.lesserBold]}> {t("recommended")} </Text>
          {t("dailyLimitWaterIntake")}!
        </Text>
      );
    } else if (Math.abs(recommendedWater - glassValueLiters) <= tolerance) {
      return (
        <Text style={[localStyles.appropriateText, textStyles.lesserItalic]}>
          {t("youHave")}
          <Text style={[textStyles.lesserBold]}> {t("almost")} </Text>
          {t("reachedYour")}
          <Text style={[textStyles.lesserBold]}> {t("recommended")} </Text>
          {t("dailyLimitWaterIntake")}!
        </Text>
      );
    } else {
      return (
        <Text
          style={[localStyles.appropriateText, textStyles.lesserItalic]}
        ></Text>
      );
    }
  }, [glassValueLiters, roundedNumber, recommendedWater]);

  /**
   * @description Last five days array data
   */
  const generateLastFiveDaysWithData = (
    data: any[],
    currentDate: string | number | Date
  ) => {
    const lastFiveDays = Array.from({ length: 5 }, (_, index) => {
      const day = new Date(currentDate);
      day.setDate((currentDate as Date).getDate() - index);
      const formattedDate = day.toISOString().split("T")[0];

      const dataForDate = data.find(
        (item: { id: string }) => item.id === formattedDate
      );

      return dataForDate || { id: formattedDate, totalCalories: 0 };
    });

    return lastFiveDays;
  };

  const lastFiveDaysWithData = generateLastFiveDaysWithData(
    lastDays,
    currentDate
  );

  return loading ? (
    <Center flex={1}>
      <ActivityIndicator
        size="large"
        color={"#FFC659"}
        style={localStyles.activityIndicatorStyle}
      />
    </Center>
  ) : (
    <ScrollView
      style={localStyles.container}
      contentContainerStyle={localStyles.contentStyle}
      overScrollMode={"never"}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={localStyles.backgroundDiv}>
        <View style={localStyles.backgroundDivBar}></View>
        <MainPageBackground width={"100%"} height={140} />
        <View style={localStyles.buttonsDivBar}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <DrawerIconSvg />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("StatisticsScreen")}
          >
            <StatsIconSvg />
          </TouchableOpacity>
        </View>
      </View>

      <Center>
        <AnimatedCircularProgress
          size={242}
          width={13}
          fill={(glassValueLiters / maxGlassValueLiters) * 100}
          tintColor={appropieteColor}
          onAnimationComplete={() => console.log("Animation complete")}
          backgroundColor={"#D9D9D9"}
          rotation={0}
          prefill={9}
          arcSweepAngle={180}
          tintTransparency={false}
          lineCap={"round"}
          dashedTint={{ width: 0, gap: 1 }}
          dashedBackground={{ width: 0, gap: 1 }}
          style={{
            transform: [{ rotate: `${-90}deg` }, { scaleY: 1 }],
          }}
          childrenContainerStyle={{
            transform: [{ rotate: `${90}deg` }, { scaleX: 1 }],
          }}
        >
          {(fill) => (
            <View style={localStyles.childProgress}>
              <Text
                style={[
                  localStyles.remaingTime,
                  {
                    color: appropieteColor,
                  },
                ]}
              >
                {glassValueLiters.toFixed(1)}
                <Text
                  style={[
                    textStyles.bangersMedium,
                    localStyles.throughLitersText,
                  ]}
                >
                  /{recommendedWater.toFixed(1)}
                </Text>
              </Text>
              <Text style={[textStyles.bangersMedium, localStyles.litersText]}>
                {t("liters")}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
        {appropieteText}
      </Center>

      <Center style={localStyles.flatlistDiv}>
        <FlatList
          data={glassData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.flatListContainer}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) =>
            !item.completed || currentGlass === 0 ? (
              <TouchableOpacity
                onPress={() => nextStep(index)}
                style={localStyles.glassButton}
              >
                <Text style={[localStyles.glassButtonText]}>0.5L</Text>
                <DailyWaterEmptySvg width={72} height={72} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => previousStep(index)}
                style={localStyles.glassButton}
              >
                <Text style={[localStyles.glassButtonText]}>0.5L</Text>
                <DailyWaterFullSvg width={72} height={72} />
              </TouchableOpacity>
            )
          }
        />
      </Center>

      <Center style={[localStyles.lastFiveDaysContainer]}>
        <View style={localStyles.lastFiveDaysDiv}>
          <Text style={localStyles.bangersMediumLess}>{t("lastFiveDays")}</Text>
          <View style={localStyles.lastFiveDaysCircleDiv}>
            <FlatList
              data={lastFiveDaysWithData.reverse()}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    marginHorizontal: 10,
                  }}
                />
              )}
            />
          </View>
        </View>
      </Center>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentStyle: {
    flexGrow: 1,
  },
  backgroundDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundDivBar: {
    width: "100%",
    height: Platform.OS === "ios" ? 30 : 10,
    top: 0,
    backgroundColor: "#FFC659",
  },
  buttonsDivBar: {
    flexDirection: "row",
    width: "90%",
    bottom: Platform.OS === "ios" ? "40%" : "45%",
    position: "absolute",
    justifyContent: "space-between",
  },
  childProgress: {
    justifyContent: "center",
    alignItems: "center",
    top: -25,
  },
  remaingTime: {
    color: "#85CCC6",
    fontFamily: "BangersRegular",
    fontSize: 36,
    lineHeight: 39,
    paddingRight: 2,
    minWidth: 100,
    textAlign: "center",
  },
  centerDiv: {
    width: "100%",
    marginTop: 20,
    top: 20,
  },
  lastFiveDaysDiv: {
    width: "90%",
  },
  lastFiveDaysContainer: {
    bottom: 0,
    width: "100%",
    paddingBottom: 30,
    height: 90,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  lastFiveDaysCircleDiv: {
    top: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  dateDiv: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#85CCC6",
    width: 48,
    height: 48,
  },
  fullDateDiv: {
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    top: 1,
    left: 0.5,
    color: "#FFFFFF",
  },
  date: {
    fontSize: 16,
    bottom: 4,
    color: "#FFFFFF",
    left: 0.5,
  },
  throughLitersText: {
    minWidth: 100,
    textAlign: "center",
    color: "#111111",
  },
  litersText: {
    minWidth: 100,
    textAlign: "center",
  },
  flatlistDiv: {
    marginTop: -40,
    paddingBottom: 80,
  },
  appropriateText: {
    position: "absolute",
    top: "65%",
    width: 267,
    textAlign: "center",
    lineHeight: 13,
  },
  flatListContainer: {
    alignItems: "center",
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  litText: {
    fontWeight: "600",
    fontSize: 8,
    fontFamily: "Inter",
  },
  glassButton: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 5,
  },
  glassButtonText: {
    position: "absolute",
    top: "33%",
    left: "21%",
    zIndex: 1,
    fontFamily: "BangersRegular",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
  },
  bangersMediumLess: {
    fontFamily: "BangersRegular",
    fontSize: 18,
  },
  activityIndicatorStyle: {
    top: 40,
  },
});

export default ChooseWaterScreen;
