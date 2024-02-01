import { t } from "i18n-js";
import React, { useCallback, useRef, useState, useMemo } from "react";
import { StyleSheet, FlatList, useColorScheme, Platform } from "react-native";
import { Text, View, Center } from "native-base";
import { textStyles } from "../../../globalStyles";
import { useInitialFormStore } from "../../../zustand/useInitialFormStore";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../../../components";

/**
 * @description Your Weight Page
 */

interface SegmentProps {
  index: number;
}

const YourWeight = () => {
  const colorScheme = useColorScheme();

  const { weightInfo, setWeightInfo, goalWeight, setGoalWeight } =
    useInitialFormStore();
  const [currentPosition, setCurrentPosition] = useState(
    weightInfo.weight !== 60 ? weightInfo.weight : 60
  );
  const flatListRef = useRef<FlatList>(null);
  const kgData = useMemo(
    () => Array.from({ length: 201 }, (_, index) => index + 1),
    []
  );

  const lbsData = useMemo(
    () =>
      Array.from({ length: kgData.length * 2.20462 }, (_, index) => index + 1),
    []
  );

  /**
   * @description Scroll to the current position
   */
  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.floor(offsetX / localStyles.segment.width);
      setWeightInfo({
        ...weightInfo,
        weight: index,
      });
      setGoalWeight({
        ...goalWeight,
        goalWeight: index,
      });
      setCurrentPosition(index);
    },
    [weightInfo, setWeightInfo, goalWeight, setGoalWeight]
  );

  /**
   * @description Memoized segment component
   */
  const MemoizedSegment = React.memo(({ index }: SegmentProps) => (
    <View style={localStyles.segment}>
      {index % 5 === 0 ? (
        <View style={localStyles.bigTick} />
      ) : (
        <View style={localStyles.tick} />
      )}
    </View>
  ));

  /**
   * @description Render current segment
   */
  const renderSegment = useCallback(
    ({ index }: SegmentProps) => <MemoizedSegment index={index} />,
    [
      localStyles.segment,
      localStyles.bigTick,
      localStyles.tick,
      weightInfo.unit,
    ]
  );

  /**
   * @description Midline for the current position
   */
  const renderMidline = () => (
    <View
      style={[
        localStyles.midline,
        {
          left: currentPosition === 200 ? "49%" : "50%",
        },
      ]}
    ></View>
  );

  /**
   * @description Validate the current position and return the formatted value
   */
  const formattedCurrentPosition = useMemo(() => {
    if (currentPosition < 0) return 0;

    return currentPosition;
  }, [currentPosition]);

  /**
   * @description Convert kg to lbs
   */
  const kgToLbs = useCallback((kg: number): number => {
    return kg * 2.20462;
  }, []);

  /**
   * @description Convert lbs to kg
   */
  const lbsToKg = useCallback((lbs: number): number => {
    return lbs / 2.20462;
  }, []);

  /**
   * @description Change the unit to lbs
   */
  const onPressLbs = useCallback(() => {
    const lbsValue = kgToLbs(weightInfo.weight);
    setWeightInfo({
      ...weightInfo,
      unit: "lbs",
      weight: lbsValue,
    });
    setGoalWeight({
      ...goalWeight,
      unit: "lbs",
      goalWeight: lbsValue,
    });

    const lbsIndex = Math.round(lbsValue);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ animated: true, index: lbsIndex });
    }, 50);
  }, [weightInfo, flatListRef]);

  /**
   * @description Change the unit to kg
   */
  const onPressKg = useCallback(() => {
    const kgValue = lbsToKg(weightInfo.weight);
    setWeightInfo({
      ...weightInfo,
      unit: "kg",
      weight: kgValue,
    });
    setGoalWeight({
      ...goalWeight,
      unit: "kg",
      goalWeight: kgValue,
    });

    const kgIndex = Math.round(kgValue);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ animated: true, index: kgIndex });
    }, 50);
  }, [weightInfo, flatListRef]);

  return (
    <Center style={localStyles.componentDiv}>
      <View style={localStyles.subjectDiv}>
        <View style={localStyles.subject}>
          <Text style={[textStyles.subject]}>{t("whatIsYourWeight")} </Text>
        </View>
        <Text color={"colors.gray.50"} style={textStyles.regular}>
          {t("whatIsYourWeightText")}
        </Text>
      </View>

      <View style={[localStyles.contentDiv]}>
        <View style={localStyles.boxContainer}>
          <Text
            color={"colors.orange.50"}
            style={[localStyles.overlayText, textStyles.largeNumberOpenSans]}
          >
            {formattedCurrentPosition}
            <Text
              color={"colors.orange.50"}
              style={[textStyles.openSansMedium]}
            >
              {" " + weightInfo.unit}
            </Text>
          </Text>

          {renderMidline()}
          <FlatList
            ref={flatListRef}
            data={weightInfo.unit === "kg" ? kgData : lbsData}
            windowSize={5}
            removeClippedSubviews={false}
            renderItem={renderSegment}
            keyExtractor={(index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.flatListContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialScrollIndex={weightInfo.weight}
            getItemLayout={(data, index) => ({
              length: localStyles.segment.width,
              offset: localStyles.segment.width * index,
              index,
            })}
            overScrollMode="never"
            decelerationRate="fast"
            disableVirtualization={false}
            initialNumToRender={
              weightInfo.unit === "kg" ? kgData.length : lbsData.length
            }
            style={localStyles.flatlistStyle}
          />
        </View>
        {colorScheme === "light" && (
          <>
            <LinearGradient
              colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={localStyles.gradientStyleLeft}
            ></LinearGradient>
            <LinearGradient
              colors={["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={localStyles.gradientStyleRight}
            ></LinearGradient>
          </>
        )}
      </View>

      <Center style={localStyles.buttonsDiv}>
        <Button
          text={"kg"}
          onBtnPress={onPressKg}
          isDisabled={weightInfo.unit === "kg"}
          textColor={weightInfo.unit === "kg" ? "#FFFFFF" : "#000000"}
          backgroundColor={weightInfo.unit === "kg" ? "#FFC659" : "#F7F8F8"}
          textStyle={textStyles.boldLess}
          icon={undefined}
          withoutText={false}
          fontSize={0}
          width={76}
          height={40}
          borderColor={""}
          borderWidth={0}
          borderRadius={24}
          buttonStyle={undefined}
        />
        <Button
          text={"lbs"}
          onBtnPress={onPressLbs}
          isDisabled={weightInfo.unit === "lbs"}
          backgroundColor={weightInfo.unit === "lbs" ? "#FFC659" : "#F7F8F8"}
          textColor={weightInfo.unit === "lbs" ? "#FFFFFF" : "#000000"}
          textStyle={textStyles.boldLess}
          icon={undefined}
          withoutText={false}
          fontSize={0}
          width={76}
          height={40}
          borderColor={""}
          borderWidth={0}
          borderRadius={24}
          buttonStyle={undefined}
        />
      </Center>
    </Center>
  );
};

const localStyles = StyleSheet.create({
  componentDiv: {
    width: "100%",
  },
  subjectDiv: {
    justifyContent: "space-between",
    height: 100,
    width: "90%",
    marginTop: 30,
  },
  subject: {
    height: 60,
    flexDirection: "row",
  },
  contentDiv: {
    width: "100%",
    marginTop: Platform.OS === "ios" ? 10 : 0,
    height: Platform.OS === "ios" ? 370 : 355,
    justifyContent: "center",
    alignItems: "center",
  },
  boxContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  flatlistStyle: {
    width: "100%",
  },
  flatListContainer: {
    alignItems: "center",
    paddingHorizontal: "49%",
  },
  segment: {
    width: 12,
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 10,
  },
  bigTick: {
    height: 49,
    width: 2,
    backgroundColor: "#FFC659",
    top: 5,
  },
  tick: {
    height: 28,
    width: 2,
    backgroundColor: "#FFC659",
  },
  midline: {
    position: "absolute",
    bottom: 0,
    width: 3.5,
    backgroundColor: "#FFC659",
    zIndex: 1,
    height: 92,
  },
  overlayText: {
    textAlign: "center",
    top: 25,
  },
  gradientStyleLeft: {
    position: "absolute",
    left: 0,
    width: 30,
    height: "100%",
  },
  gradientStyleRight: {
    position: "absolute",
    right: 0,
    width: 30,
    height: "100%",
  },
  buttonsDiv: {
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default YourWeight;
