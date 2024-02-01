import { t } from "i18n-js";
import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Divider, MainButton, MainHeader } from "../../components";
import useTheme from "../../hooks/useTheme";
import {
  GpsPinIcon,
  GpsPinSilverIcon,
  MarkerIcon,
} from "../../../assets/images/svg";
import { Navigation } from "../../types";
import { Box, Center, Text } from "native-base";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import {
  fetchGpsCoordinates,
  addGpsCoordinates,
  deleteGpsCoordinates,
} from "@services/gpsCoordinates";
import { bodyStyles, textStyles } from "../../globalStyles";
import { useAssignmentStore } from "@hooks/zustand/useAssignmentStore";
import { RouteProp } from "@react-navigation/native";
import { useLocationStore } from "../../hooks/zustand/useLocationStore";
import { getById } from "@utils/helperFunctions";
import { TouchableOpacity } from "react-native-gesture-handler";

interface FarmMappingScreenProps {
  navigation: Navigation;
  route: RouteProp<{ params: { selectedAssignmentId: string } }>;
}
/**
 * @description Farm Mapping Screen
 */

const FarmMappingScreen: FC<FarmMappingScreenProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useTheme();
  const { assignments } = useAssignmentStore();
  const selectedAssignmentId = route?.params?.selectedAssignmentId;
  const [regionCoords, setRegionCoords] = useState<number>();
  const [changeResetBtn, setChangeResetBtn] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [resetModalVisible, setResetModalVisible] = useState<boolean>(false);
  const [location, setLocation] = useState<string | number>();
  const [errorMsg, setErrorMsg] = useState<string | number>();
  const [markerCoords, setMarkerCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: 0, longitude: 0 });
  const [storeButtonText, setStoreButtonText] = useState<string>(
    t("storeLocation")
  );
  const [locationButtonText, setLocationButtonText] = useState<string>(
    location ? t("locationFetched") : t("fetchLocation")
  );
  const [isGpsStored, setIsGpsStored] = useState<boolean>(false);
  const [isGpsStoredFirst, setIsGpsStoredFirst] = useState<boolean>(true);
  const [isGpsStoredSecond, setIsGpsStoredSecond] = useState<boolean>(false);
  const [isGpsStoredThird, setIsGpsStoredThird] = useState<boolean>(false);
  const [isGpsStoredFourth, setIsGpsStoredFourth] = useState<boolean>(false);
  const [isGpsStoredFifth, setIsGpsStoredFifth] = useState<boolean>(false);
  const {
    coordinates,
    gpsLocationFirst,
    gpsLocationSecond,
    gpsLocationThird,
    gpsLocationFourth,
    gpsStepFirst,
    gpsStepSecond,
    gpsStepThird,
    gpsStepFourth,
    setGpsLocationFirst,
    setGpsLocationSecond,
    setGpsLocationThird,
    setGpsLocationFourth,
    setGpsStepSecond,
    setGpsStepThird,
    setGpsStepFourth,
    setGpsStepFifth,
    setCoordinates,
  } = useLocationStore();

  const [region, setRegion] = useState({
    latitude: -1.286389,
    longitude: 36.817223,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const selectedAssignment = getById(assignments, selectedAssignmentId);

  const latitude = markerCoords?.latitude
    ? markerCoords?.latitude
    : region?.latitude;
  const longitude = markerCoords?.longitude
    ? markerCoords?.longitude
    : region?.longitude;

  /**
   * @description Formats the coordinates to a readable format
   */
  const getFormattedCoordinates = useCallback(
    (latitude: number, longitude: number) => {
      const formatCoordinate = (coordinate: number, label: string) => {
        const roundedCoordinate = coordinate.toFixed(6); // or 8 for 8 decimal places
        return `${label}: ${roundedCoordinate}`;
      };

      const latDegrees = Math.floor(Math.abs(latitude));
      const latMinutes = Math.floor((Math.abs(latitude) - latDegrees) * 60);
      const latSeconds = Math.abs(
        (Math.abs(latitude) - latDegrees - latMinutes / 60) * 3600
      );
      const longDegrees = Math.floor(Math.abs(longitude));
      const longMinutes = Math.floor((Math.abs(longitude) - longDegrees) * 60);
      const longSeconds = Math.abs(
        (Math.abs(longitude) - longDegrees - longMinutes / 60) * 3600
      );

      const formattedCoordinates = `${formatCoordinate(
        latitude,
        "Latitude"
      )} ,\n${formatCoordinate(longitude, "Longitude")}`;

      return latitude && longitude ? formattedCoordinates : t("selectLocation");
    },

    [t]
  );

  /**
   * @description Fetches the current location of the user and sets the region to the current location of the user
   */
  const fetchLocation = useCallback(async () => {
    try {
      const locationOptions = {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      };

      const locationSubscription = await Location.watchPositionAsync(
        locationOptions,
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation(newLocation);
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          });

          setMarkerCoords({ latitude, longitude });
        }
      );

      const cleanup = () => {
        locationSubscription && locationSubscription.remove();
      };

      return cleanup;
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  }, [setLocation, setRegion, setMarkerCoords, setLocationButtonText]);

  /**
   * @description Calculates the angle between two points on the map
   */
  const calculateAngle = useCallback(
    (
      center: { latitude: number; longitude: number },
      point: { latitude: number; longitude: number }
    ) => {
      const dy = point.latitude - center.latitude;
      const dx = point.longitude - center.longitude;
      let angleRad = Math.atan2(dy, dx);
      if (angleRad < 0) {
        angleRad += 2 * Math.PI;
      }
      return (angleRad * 180) / Math.PI;
    },
    []
  );

  /**
   * @description Sorts the coordinates of the polygon by angles relative to the center point
   */
  const sortPolygonCoordinates = useCallback(
    (coordinates: any[]) => {
      const center = coordinates.reduce(
        (acc, coord) => {
          acc.latitude += coord.latitude;
          acc.longitude += coord.longitude;
          return acc;
        },
        { latitude: 0, longitude: 0 }
      );

      center.latitude /= coordinates.length;
      center.longitude /= coordinates.length;

      coordinates.sort((a, b) => {
        const angleA = calculateAngle(center, a);
        const angleB = calculateAngle(center, b);
        return angleA - angleB;
      });

      return coordinates;
    },
    [calculateAngle]
  );

  const callApiForLocations = async (locations: any[]) => {
    const locationPromises = locations.map((e) => {
      const requestBody = {
        latitude: e.latitude,
        longitude: e.longitude,
      };
      return addGpsCoordinates(selectedAssignment?.premises_id, requestBody);
    });

    const results = await Promise.allSettled(locationPromises);
    if (results.every((result) => result.status === "fulfilled")) {
      fetchCoords();
    }
  };

  const clearLocations = async () => {
    setChangeResetBtn(true);
    setGpsLocationFirst({ latitude: 0, longitude: 0 });
    setGpsLocationSecond({ latitude: 0, longitude: 0 });
    setGpsLocationThird({ latitude: 0, longitude: 0 });
    setGpsLocationFourth({ latitude: 0, longitude: 0 });

    const locationPromises = coordinates.map((e) => deleteGpsCoordinates(e.id));
    const results = await Promise.allSettled(locationPromises);

    if (results.some((result) => result.status === "fulfilled")) {
      fetchCoords();
    } else {
      navigation.navigate("PremiseDetailsScreen", {
        selectedAssignmentId,
      });
    }
  };

  /**
   * @description Calculates the area of the polygon using the coordinates of the polygon and the radius of the earth
   */
  const squareCoordinates = useMemo(
    () =>
      sortPolygonCoordinates([
        {
          latitude: gpsLocationFirst?.latitude,
          longitude: gpsLocationFirst?.longitude,
        },
        {
          latitude: gpsLocationSecond?.latitude,
          longitude: gpsLocationSecond?.longitude,
        },
        {
          latitude: gpsLocationThird?.latitude
            ? gpsLocationThird?.latitude
            : gpsLocationSecond?.latitude,
          longitude: gpsLocationThird?.longitude
            ? gpsLocationThird?.longitude
            : gpsLocationSecond?.longitude,
        },
        {
          latitude: gpsLocationFourth?.latitude
            ? gpsLocationFourth?.latitude
            : gpsLocationSecond?.latitude,
          longitude: gpsLocationFourth?.longitude
            ? gpsLocationFourth?.longitude
            : gpsLocationSecond?.longitude,
        },
      ]),
    [gpsLocationFirst, gpsLocationSecond, gpsLocationThird, gpsLocationFourth]
  );

  /**
   * @description Calculates the area of the polygon using the coordinates of the polygon and the radius of the earth
   */
  const serverCoordinates = useMemo(
    () =>
      sortPolygonCoordinates(
        coordinates.map((coords) => ({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }))
      ),
    [coordinates, sortPolygonCoordinates]
  );

  const locations = [
    {
      latitude: gpsLocationFirst?.latitude?.toFixed(6),
      longitude: gpsLocationFirst.longitude.toFixed(6),
    },
    {
      latitude: gpsLocationSecond?.latitude?.toFixed(6),
      longitude: gpsLocationSecond?.longitude?.toFixed(6),
    },
    {
      latitude: gpsLocationThird?.latitude?.toFixed(6),
      longitude: gpsLocationThird?.longitude?.toFixed(6),
    },
    {
      latitude: gpsLocationFourth?.latitude?.toFixed(6),
      longitude: gpsLocationFourth?.longitude?.toFixed(6),
    },
  ];

  /**
   * @description Fetches the coordinates of the farm from the server
   */
  const fetchCoords = useCallback(async () => {
    try {
      const coords = await fetchGpsCoordinates(selectedAssignment?.premises_id);
      setCoordinates(coords.items);
      setGpsLocationFirst({ latitude: 0, longitude: 0 });
      setGpsLocationSecond({ latitude: 0, longitude: 0 });
      setGpsLocationThird({ latitude: 0, longitude: 0 });
      setGpsLocationFourth({ latitude: 0, longitude: 0 });
      setGpsStepSecond(false);
      setGpsStepThird(false);
      setGpsStepFourth(false);
      navigation.navigate("PremiseDetailsScreen", {
        selectedAssignmentId,
      });
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  }, [
    navigation,
    selectedAssignment?.premises_id,
    selectedAssignmentId,
    setCoordinates,
    setGpsLocationFirst,
    setGpsLocationFourth,
    setGpsLocationSecond,
    setGpsLocationThird,
    setGpsStepFourth,
    setGpsStepSecond,
    setGpsStepThird,
  ]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(t("locationPermission"));
        return;
      }

      fetchLocation();
    })();
  }, []);

  useEffect(() => {
    if (location) {
      setLocationButtonText(t("locationFetched"));
    }
    if (location && !isGpsStored) {
      setLocationButtonText(t("locationFetched"));
    }
    if (isGpsStored && location && !gpsStepFourth) {
      setLocationButtonText(t("proceedToNextGpsPin"));
      setStoreButtonText(t("locationStored"));
    } else if (isGpsStored && gpsStepFourth) {
      setLocationButtonText(t("confirmMapping"));
      setStoreButtonText(t("locationsStored"));
    } else if (
      gpsLocationSecond?.latitude &&
      gpsLocationThird?.latitude &&
      gpsLocationFourth?.latitude &&
      coordinates.length === 0 &&
      !changeResetBtn
    ) {
      setLocationButtonText(t("waiting") + "...");
      setStoreButtonText(t("locationsStored"));
    } else if (changeResetBtn) {
      setLocationButtonText(t("waiting") + "...");
      setStoreButtonText("Locations are being deleted");
    } else if (
      (gpsLocationSecond?.latitude &&
        gpsLocationThird?.latitude &&
        gpsLocationFourth?.latitude) ||
      coordinates.length !== 0
    ) {
      setLocationButtonText(t("farmIsMapped"));
      setStoreButtonText(t("locationsStored"));
    } else {
      setStoreButtonText(t("storeLocation"));
    }
  }, [
    location,
    isGpsStored,
    gpsStepFourth,
    fetchLocation,
    gpsLocationSecond?.latitude,
    gpsLocationThird?.latitude,
    gpsLocationFourth?.latitude,
    coordinates.length,
    changeResetBtn,
  ]);

  useEffect(() => {
    setModalVisible(false);
    setTimeout(() => {
      setModalVisible(true);
    }, 5000);
  }, []);

  return (
    <SafeAreaView style={bodyStyles.androidSafeArea}>
      <Divider size={20} />
      {resetModalVisible ? (
        <Center style={localStyles.resetModalCenter}>
          <View style={localStyles.resetModalCenterSecond}>
            <Text style={[textStyles.mainBold, localStyles.resetModalText]}>
              {t("resetFarm")}
            </Text>
            <View style={localStyles.resetBtn}>
              <TouchableOpacity
                onPress={() => {
                  setResetModalVisible(false);
                  setIsGpsStoredFourth(false);
                  setIsGpsStored(false);
                  setGpsStepSecond(false);
                  setGpsStepThird(false);
                  setGpsStepFourth(false);
                  setGpsStepFifth(false);
                  setIsGpsStoredFirst(true);
                  setIsGpsStoredFifth(false);
                  clearLocations();
                }}
              >
                <Text color={"colors.red.50"} style={textStyles.regular}>
                  {t("reset")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setResetModalVisible(false)}>
                <Text color={"colors.green.300"} style={textStyles.regular}>
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Center>
      ) : null}
      {!location && locationButtonText === "Fetch location" && modalVisible ? (
        <Center style={localStyles.modalErrorDiv}>
          <View
            style={[
              localStyles.notificationModal,
              {
                backgroundColor: theme.yellowGreen,
              },
            ]}
          >
            <Text color={"colors.primary.50"} style={textStyles.littleRegular}>
              {t("notLocationStored")}
            </Text>
            <View style={localStyles.locationModalBtn}>
              <TouchableOpacity
                onPress={() => fetchLocation()}
                style={localStyles.fetchLocationBtn}
              >
                <Text
                  color={"colors.primary.50"}
                  style={[textStyles.mainBold, localStyles.fetchLocationTxt]}
                >
                  {t("fetchLocation").toUpperCase()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={localStyles.fetchLocationBtn}
              >
                <Text
                  color={"colors.primary.50"}
                  style={[
                    textStyles.mainBold,
                    localStyles.fetchLocationTxt,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      marginRight: 30,
                    },
                  ]}
                >
                  {t("close").toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Center>
      ) : null}
      <Center
        borderBottomColor={theme.lightGrey}
        borderBottomWidth={1}
        zIndex={1}
        marginTop={0}
        paddingTop={0}
        bg={"colors.gray.150"}
        justifyContent={"space-between"}
        paddingBottom={5}
        width="100%"
        height={130}
      >
        {(gpsLocationFirst?.latitude !== 0 &&
          gpsLocationSecond?.latitude !== 0 &&
          gpsLocationThird?.latitude !== 0 &&
          gpsLocationFourth?.latitude !== 0) ||
        coordinates.length !== 0 ? (
          <MainHeader
            profileScreen={t("farmMapping")}
            onPressBtn={() => {
              setGpsLocationFirst({ latitude: 0, longitude: 0 });
              setGpsLocationSecond({ latitude: 0, longitude: 0 });
              setGpsLocationThird({ latitude: 0, longitude: 0 });
              setGpsLocationFourth({ latitude: 0, longitude: 0 });
              navigation.goBack();
            }}
            rightText={changeResetBtn ? t("waiting") + "..." : t("reset")}
            rightButtonDisabled={false}
            rightTextColor={theme.darkGreen}
            right={changeResetBtn ? -10 : -30}
            onPressRightBtn={() => setResetModalVisible(true)}
          />
        ) : (
          <MainHeader
            profileScreen={t("farmMapping")}
            onPressBtn={() => {
              setGpsLocationFirst({ latitude: 0, longitude: 0 });
              setGpsLocationSecond({ latitude: 0, longitude: 0 });
              setGpsLocationThird({ latitude: 0, longitude: 0 });
              setGpsLocationFourth({ latitude: 0, longitude: 0 });
              setGpsStepSecond(false);
              setGpsStepThird(false);
              setGpsStepFourth(false);
              setGpsStepFifth(false);
              navigation.goBack();
            }}
          />
        )}

        <Divider size={10} />
        <Box flexDirection="row" width="99%" justifyContent="space-evenly">
          <View style={localStyles.numberOfGps}>
            <View style={localStyles.gpsIconDiv}>
              {gpsStepFirst ? <GpsPinIcon /> : <GpsPinSilverIcon />}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color: gpsStepFirst
                      ? theme.darkGreen
                      : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinOne")}
              </Text>
            </View>
            <View style={localStyles.gpsLineDiv}>
              {/* eslint-disable-next-line react/self-closing-comp */}
              <View
                style={[
                  localStyles.gpsDiv,
                  {
                    backgroundColor: gpsStepFirst
                      ? theme.darkGreen
                      : theme.rgba.lightGray,
                  },
                ]}
              ></View>
            </View>
            <View style={localStyles.gpsIconDiv}>
              {(gpsStepFirst && gpsStepSecond) || coordinates.length !== 0 ? (
                <GpsPinIcon />
              ) : (
                <GpsPinSilverIcon />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color:
                      (gpsStepFirst && gpsStepSecond) ||
                      coordinates.length !== 0
                        ? theme.darkGreen
                        : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinTwo")}
              </Text>
            </View>
            <View style={localStyles.gpsLineDiv}>
              {/* eslint-disable-next-line react/self-closing-comp */}
              <View
                style={[
                  localStyles.gpsDiv,
                  {
                    backgroundColor:
                      gpsStepFirst && gpsStepSecond
                        ? theme.darkGreen
                        : theme.rgba.lightGray,
                  },
                ]}
              ></View>
            </View>
            <View style={localStyles.gpsIconDiv}>
              {(gpsStepFirst && gpsStepSecond && gpsStepThird) ||
              coordinates.length !== 0 ? (
                <GpsPinIcon />
              ) : (
                <GpsPinSilverIcon />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color:
                      (gpsStepFirst && gpsStepSecond && gpsStepThird) ||
                      coordinates.length !== 0
                        ? theme.darkGreen
                        : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinThree")}
              </Text>
            </View>
            <View style={localStyles.gpsLineDiv}>
              {/* eslint-disable-next-line react/self-closing-comp */}
              <View
                style={[
                  localStyles.gpsDiv,
                  {
                    backgroundColor:
                      gpsStepFirst && gpsStepSecond && gpsStepThird
                        ? theme.darkGreen
                        : theme.rgba.lightGray,
                  },
                ]}
              ></View>
            </View>
            <View style={localStyles.gpsIconDiv}>
              {(gpsStepFirst &&
                gpsStepSecond &&
                gpsStepThird &&
                gpsStepFourth) ||
              coordinates.length !== 0 ? (
                <GpsPinIcon />
              ) : (
                <GpsPinSilverIcon />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color:
                      (gpsStepFirst &&
                        gpsStepSecond &&
                        gpsStepThird &&
                        gpsStepFourth) ||
                      coordinates.length !== 0
                        ? theme.darkGreen
                        : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinFour")}
              </Text>
            </View>
          </View>
        </Box>
      </Center>
      <Center>
        <MapView
          //onRegionChangeComplete={region => setRegionCoords(region)}
          provider={PROVIDER_GOOGLE}
          style={localStyles.map}
          onPress={(event) => {
            if (isGpsStored && location) {
              // eslint-disable-next-line no-console
              console.log("Proceed to the next GPS pin");
            } else {
              setMarkerCoords({
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude,
              });
            }
          }}
          region={region}
          initialRegion={{
            latitude: -1.286389,
            longitude: 36.817223,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {coordinates.length === 0 ? (
            markerCoords?.latitude !== 0 && markerCoords?.longitude !== 0 ? (
              <Marker
                coordinate={{
                  latitude:
                    markerCoords?.latitude ??
                    regionCoords?.latitude ??
                    -1.286389,
                  longitude:
                    markerCoords?.longitude ??
                    regionCoords?.longitude ??
                    36.817223,
                }}
              >
                <MarkerIcon />
              </Marker>
            ) : (
              <Marker coordinate={region}>
                <MarkerIcon />
              </Marker>
            )
          ) : null}

          {serverCoordinates.length !== 0 && (
            <>
              <Marker
                coordinate={{
                  latitude: serverCoordinates[0]?.latitude,
                  longitude: serverCoordinates[0]?.longitude,
                }}
              >
                <MarkerIcon />
              </Marker>
              <Marker
                coordinate={{
                  latitude: serverCoordinates[1]?.latitude,
                  longitude: serverCoordinates[1]?.longitude,
                }}
              >
                <MarkerIcon />
              </Marker>
              <Marker
                coordinate={{
                  latitude: serverCoordinates[2]?.latitude,
                  longitude: serverCoordinates[2]?.longitude,
                }}
              >
                <MarkerIcon />
              </Marker>
              <Marker
                coordinate={{
                  latitude: serverCoordinates[3]?.latitude,
                  longitude: serverCoordinates[3]?.longitude,
                }}
              >
                <MarkerIcon />
              </Marker>
            </>
          )}

          {gpsLocationFirst?.latitude !== 0 &&
            gpsLocationFirst?.longitude !== 0 &&
            serverCoordinates.length === 0 && (
              <Marker
                coordinate={{
                  latitude: gpsLocationFirst?.latitude,
                  longitude: gpsLocationFirst?.longitude,
                }}
              >
                <MarkerIcon />
              </Marker>
            )}

          {gpsLocationSecond?.latitude !== 0 &&
            gpsLocationSecond?.longitude !== 0 &&
            serverCoordinates.length === 0 && (
              <Marker
                coordinate={{
                  latitude: gpsLocationSecond?.latitude,
                  longitude: gpsLocationSecond?.longitude,
                }}
              >
                <MarkerIcon />
              </Marker>
            )}
          {gpsLocationThird?.latitude !== 0 &&
            gpsLocationThird?.longitude !== 0 &&
            serverCoordinates.length === 0 && (
              <Marker
                coordinate={{
                  latitude: gpsLocationThird?.latitude,
                  longitude: gpsLocationThird?.longitude,
                }}
              >
                <MarkerIcon />
              </Marker>
            )}
          {gpsLocationFourth?.latitude !== 0 &&
            gpsLocationFourth?.longitude !== 0 &&
            serverCoordinates.length === 0 && (
              <Marker
                coordinate={{
                  latitude: gpsLocationFourth?.latitude,
                  longitude: gpsLocationFourth?.longitude,
                }}
              >
                <MarkerIcon />
              </Marker>
            )}

          {gpsLocationFirst?.latitude !== 0 &&
            gpsLocationFirst?.longitude !== 0 &&
            gpsLocationSecond?.latitude !== 0 &&
            gpsLocationSecond.longitude !== 0 &&
            coordinates.length === 0 && (
              <Polygon
                coordinates={squareCoordinates}
                strokeWidth={2}
                strokeColor="#58D480"
                fillColor="#26BF81"
              />
            )}

          {coordinates.length !== 0 && (
            <Polygon
              coordinates={serverCoordinates}
              strokeWidth={2}
              strokeColor="#58D480"
              fillColor="#26BF81"
            />
          )}
        </MapView>
      </Center>
      <Center width={"100%"} style={localStyles.footerStyle} paddingTop={8}>
        <View style={[localStyles.coordinatesDiv]}>
          <View style={localStyles.yourCordinatesDiv}>
            <Text style={[textStyles.smallBold]}>
              {location ? t("yourCoordinates") : t("defaultCoordinates")}
            </Text>
            <View
              style={[
                localStyles.coordinatesTextDiv,
                {
                  borderColor: theme.lightGrey,
                },
              ]}
            >
              <Text
                color={location ? "colors.green.300" : "colors.primary.100"}
                style={[textStyles.littleRegular]}
              >
                {latitude && longitude
                  ? getFormattedCoordinates(latitude, longitude)
                  : getFormattedCoordinates(
                      location?.coords?.latitude,
                      location?.coords?.longitude
                    )}
              </Text>
            </View>
          </View>

          <MainButton
            width={"90%"}
            height={60}
            text={locationButtonText}
            gradientColorFirst={theme.gradient.lightGreen}
            gradientColorSecond={theme.gradient.darkGreen}
            colorText={theme.primary}
            radius={12}
            boldText
            isDisabled={
              locationButtonText !== "The farm is mapped" &&
              locationButtonText !== "Waiting..."
                ? false
                : true
            }
            mainOpacity={
              locationButtonText !== "The farm is mapped" &&
              locationButtonText !== "Waiting..."
                ? 1
                : 0.6
            }
            buttonStyle={localStyles.mainButtonStyle}
            onBtnPress={() => {
              if (!location && locationButtonText === "Fetch location") {
                fetchLocation();
              }

              if (gpsStepFirst && gpsLocationFirst?.latitude) {
                fetchLocation();
                setGpsStepSecond(true);
                setIsGpsStored(false);
                setMarkerCoords({
                  latitude: 0,
                  longitude: 0,
                });
              }
              if (
                gpsStepFirst &&
                gpsStepSecond &&
                gpsLocationSecond?.latitude
              ) {
                fetchLocation();
                setGpsStepThird(true);
                setIsGpsStored(false);
                setMarkerCoords({
                  latitude: 0,
                  longitude: 0,
                });
              }
              if (
                gpsStepFirst &&
                gpsStepSecond &&
                gpsStepThird &&
                gpsLocationThird?.latitude
              ) {
                fetchLocation();
                setGpsStepFourth(true);
                setIsGpsStored(false);
                setMarkerCoords({
                  latitude: 0,
                  longitude: 0,
                });
              }
              if (
                gpsStepFirst &&
                gpsStepSecond &&
                gpsStepThird &&
                gpsStepFourth &&
                gpsLocationFourth?.latitude
              ) {
                setIsGpsStoredFirst(true);
                callApiForLocations(locations);
                fetchLocation();
              }
            }}
          />
          <MainButton
            width={"90%"}
            height={60}
            text={storeButtonText}
            buttonColor={theme.rgba.buttonGray}
            borderColor={theme.rgba.borderColor}
            borderWidth={1}
            colorText={theme.darkGreen}
            isDisabled={
              storeButtonText !== "Locations stored" &&
              storeButtonText !== "Locations are being deleted"
                ? false
                : true
            }
            mainOpacity={
              storeButtonText !== "Locations stored" &&
              storeButtonText !== "Locations are being deleted"
                ? 1
                : 0.3
            }
            radius={12}
            onBtnPress={() => {
              if (gpsStepFirst && isGpsStoredFirst) {
                setIsGpsStored(true);
                setIsGpsStoredSecond(true);
                setGpsLocationFirst({
                  latitude: latitude ? latitude : 0,
                  longitude: longitude ? longitude : 0,
                });
                setIsGpsStoredFirst(false);
              }
              if (gpsStepSecond && isGpsStoredSecond) {
                setIsGpsStored(true);
                setIsGpsStoredThird(true);
                setGpsLocationSecond({
                  latitude: latitude ? latitude : 0,
                  longitude: longitude ? longitude : 0,
                });
                setIsGpsStoredSecond(false);
              }
              if (gpsStepThird && isGpsStoredThird) {
                setIsGpsStored(true);
                setIsGpsStoredFourth(true);
                setGpsLocationThird({
                  latitude: latitude ? latitude : 0,
                  longitude: longitude ? longitude : 0,
                });
                setIsGpsStoredThird(false);
              }
              if (gpsStepFourth && isGpsStoredFourth) {
                setIsGpsStored(true);
                setIsGpsStoredFifth(true);
                setGpsLocationFourth({
                  latitude: latitude ? latitude : 0,
                  longitude: longitude ? longitude : 0,
                });
              }
            }}
            buttonStyle={localStyles.mainButtonStyle}
          />
        </View>
      </Center>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  buttonStyle: {
    right: 5,
  },
  footerStyle: {
    position: "absolute",
    bottom: 40,
  },
  coordinatesDiv: {
    width: "90%",
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: "white",
  },
  fetchLocationBtn: {
    marginTop: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  fetchLocationTxt: {
    borderRadius: 12,
    justifyContent: "center",
    textDecorationLine: "underline",
  },
  coordinatesTextDiv: {
    width: "100%",
    height: 57,
    paddingLeft: 10,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 5,
  },
  yourCordinatesDiv: {
    width: "90%",
  },
  mainButtonStyle: {
    marginTop: 15,
  },
  map: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    transform: [{ translateY: -120 }],
    zIndex: 1,
  },
  numberOfGps: {
    width: "92%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  gpsIconDiv: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 50,
  },
  gpsIconDivText: {
    fontWeight: "500",
    fontSize: 10,
    fontFamily: "Poppins",
  },
  gpsLineDiv: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 50,
  },
  modalErrorDiv: {
    zIndex: 2,
    top: "10%",
    position: "absolute",
    width: "100%",
  },
  resetModalText: {
    width: 200,
    textAlign: "center",
  },
  resetBtn: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  gpsDiv: {
    width: "100%",
    height: 1,
  },
  notificationModal: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 25,
    height: 120,
    textAlign: "center",
  },
  barcodeManuallyDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationModalBtn: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
  },
  resetModalCenter: {
    position: "absolute",
    top: 240,
    zIndex: 3,
    width: "100%",
  },
  resetModalCenterSecond: {
    width: "90%",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default FarmMappingScreen;
