import { t } from "i18n-js";
import React, { useCallback, useRef, useState, useMemo } from "react";
import { StyleSheet, FlatList, Platform } from "react-native";
import { Text, View, Center } from "native-base";
import { textStyles } from "../../../globalStyles";
import { useInitialFormStore } from "../../../zustand/useInitialFormStore";

/**
 * @description Your Ages Page
 */

interface SegmentProps {
  item: number;
}

const AgeSlider = () => {
  const { years, setYears } = useInitialFormStore();
  const [currentPosition, setCurrentPosition] = useState(
    years != 20 ? years : 20
  );
  const flatListRef = useRef<FlatList>(null);
  const yearData = useMemo(
    () => Array.from({ length: 200 }, (_, index) => index + 1),
    []
  );

  /**
   * @description Scroll to the current position
   */
  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number; x: number } } }) => {
      const offsetY = event.nativeEvent.contentOffset.y + 10;
      const index = Math.floor(offsetY / 70);
      setCurrentPosition(index + 1);
      setYears(index + 1);
    },
    [years, setYears]
  );

  /**
   * @description Memoized segment component
   */
  const MemoizedSegment = React.memo(({ item }: SegmentProps) => (
    <View style={localStyles.segment}>
      <Text color={"colors.gray.100"} style={[textStyles.lessNumberOpenSans]}>
        {item}
      </Text>
    </View>
  ));

  /**
   * @description Render current segment
   */
  const renderSegment = useCallback(
    ({ item }: SegmentProps) => {
      return <MemoizedSegment item={item} />;
    },
    [currentPosition, localStyles.segment.height]
  );

  /**
   * @description Validate the current position and return the formatted value
   */
  const formattedCurrentPosition = useMemo(() => {
    if (currentPosition < 1) return 1;
    return currentPosition;
  }, [currentPosition, yearData.length]);

  // useEffect(() => {
  //   setInitialBodyMeasurementsCurrentPage(1);
  //   setWeightInfo({
  //     ...weightInfo,
  //     weight: 50,
  //     unit: "kg",
  //   });
  // }, []);

  return (
    <Center style={localStyles.componentDiv}>
      <View style={localStyles.subjectDiv}>
        <View style={localStyles.subject}>
          <Text style={[textStyles.subject]}>{t("howOldAreYou")} </Text>
        </View>
        <Text color={"colors.gray.50"} style={textStyles.regular}>
          {t("howOldAreYouText")}
        </Text>
      </View>

      <View style={[localStyles.contentDiv]}>
        <View style={localStyles.boxContainer}>
          <View style={localStyles.overlapDiv}>
            <Text
              color={"colors.orange.50"}
              style={[localStyles.overlayText, textStyles.mediumNumberOpenSans]}
            >
              {formattedCurrentPosition}
            </Text>
          </View>
          <FlatList
            ref={flatListRef}
            data={yearData}
            windowSize={5}
            renderItem={renderSegment}
            keyExtractor={(index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={localStyles.flatListContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialScrollIndex={years - 1}
            initialNumToRender={yearData.length}
            getItemLayout={(data, index) => ({
              length: localStyles.segment.height,
              offset: localStyles.segment.height * index,
              index,
            })}
            decelerationRate="fast"
            inverted
            disableVirtualization={false}
            //snapToInterval={localStyles.segment.height + 5}
            style={localStyles.flatlistStyle}
          />
        </View>
      </View>
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
    marginTop: Platform.OS === "ios" ? 30 : 20,
    height: 370,
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
    paddingVertical: "49%",
    paddingTop: 140,
    paddingBottom: 140,
    marginTop: -5,
  },
  segment: {
    width: 120,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  tick: {
    height: 28,
    width: 2,
    backgroundColor: "#FFC659",
  },
  overlayText: {
    top: 8,
  },
  overlapDiv: {
    top: "50%",
    width: 150,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#FFC659",
    zIndex: 1,
  },
});

export default AgeSlider;
