import React, { FC, useCallback, useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  BackHandler,
  PanResponder,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Navigation } from "@types";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";
import { Spinner } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";

import useTheme from "@hooks/useTheme";

import {
  Divider,
  MainButton,
  Text,
  ImageInfo,
  CircleImageContainer,
  TitleDescriptionCard,
  RemoveImageModal,
  BackButton,
} from "../components";

import { Uploading, AddPhoto, ArrowRight } from "../../assets/images/svg";
import { bodyStyles } from "../globalStyles";

import { useProfilePicturesStore, useAppStatusStore } from "../hooks/zustand";
import { IMAGE_SIZE_LIMIT } from "@utils/constants";
import {
  getImageFileSize,
  checkIfArraysAreEqual,
  isConnected,
} from "@utils/helperFunctions";

interface QuestionContainerProps {
  profilePicture: string | null;
  additionalPictures: Array<string> | null;
  onBackPress: () => void;
  onContinuePress: (
    image: string | null,
    additionalImages: Array<string> | null
  ) => void;
  onSkipPress?: (image: string | null) => void;
  edit?: boolean;
  isLoading?: boolean;
  navigation: Navigation;
}
interface Image {
  id: number;
  source: string;
}

const QuestionContainerImageUploadCapture: FC<QuestionContainerProps> = ({
  profilePicture,
  additionalPictures,
  onBackPress,
  onContinuePress,
  onSkipPress,
  edit,
  isLoading,
  navigation,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();
  const {
    setProfilePictureObject,
    setAdditionalPicturesFull,
    additionalPicturesFull,
  } = useProfilePicturesStore();
  const { setShowAlert } = useAppStatusStore();

  const [isRemoveImageModalVisible, setIsRemoveImageModalVisible] =
    useState<boolean>(false);

  const [image, setImage] = useState<string | null>(profilePicture || null);
  const [imageToRemove, setImageToRemove] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const [additionalImages, setAdditionalImages] = useState<Array<Image>>([
    {
      id: 0,
      source: "",
    },
    {
      id: 1,
      source: "",
    },
    {
      id: 2,
      source: "",
    },
  ]);

  /**
   * @description Upload image from gallery to local storage
   * @param index
   */
  const uploadImage = async (index?: number) => {
    // No permissions request is necessary for launching the image library
    if (typeof index !== "number") setLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      // Calculate image size
      await getImageFileSize(result.assets[0].uri)
        .then((androidImageFileSize: number) => {
          if (
            result &&
            result.assets &&
            result.assets[0] &&
            (Platform.OS === "ios"
              ? result.assets[0].fileSize &&
                result.assets[0].fileSize < IMAGE_SIZE_LIMIT
              : androidImageFileSize < IMAGE_SIZE_LIMIT)
          ) {
            if (typeof index === "number") {
              const additionalImagesCopy = [...additionalImages];
              additionalImagesCopy[index].source = result.assets[0].uri;
              setAdditionalImages(additionalImagesCopy);
              setAdditionalPicturesFull([
                ...additionalPicturesFull,
                result.assets[0],
              ]);
            } else {
              setImage(result.assets[0].uri);
              setProfilePictureObject(result.assets[0]);
              setLoading(false);
            }
          } else {
            Alert.alert(
              t("imageSizeLimitTitle") || "",
              t("imageSizeLimitDescription") || "",
              [{ text: t("ok").toUpperCase() }]
            );
            setLoading(false);
          }
        })
        .catch((error: any) => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  /**
   * @description Capture image from camera
   * @param index
   */
  const captureImage = async (index?: number) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      openCamera(index);
    } else {
      Alert.alert(
        t("cameraPermissionTitle") || "",
        t("cameraPermissionDescription") || "",
        [{ text: t("ok").toUpperCase() }]
      );
    }
  };

  /**
   * @description Open camera for image capture
   * @param index
   */
  const openCamera = async (index?: number) => {
    if (typeof index !== "number") setLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      if (typeof index === "number") {
        const additionalImagesCopy = [...additionalImages];
        additionalImagesCopy[index].source = result.assets[0].uri;
        setAdditionalImages(additionalImagesCopy);
        setAdditionalPicturesFull([
          ...additionalPicturesFull,
          result.assets[0],
        ]);
      } else {
        setImage(result.assets[0].uri);
        setProfilePictureObject(result.assets[0]);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  /**
   * @description Get options and cancel button index based on the platform
   * @returns {Object} Object with options and cancel button index based on the platform
   */
  const getPlatformSpecificOptions = () => {
    if (Platform.OS === "ios") {
      return {
        options: [t("cancel"), t("photoGallery"), t("camera")],
        cancelButtonIndex: 0,
      };
    } else {
      return {
        options: [t("photoGallery"), t("camera"), t("cancel")],
        cancelButtonIndex: 2,
      };
    }
  };

  /**
   * @description Trigger action sheet for image upload or capture. If index is provided, it means that we are uploading additional images.
   * @param index
   * @author ahmed suljic
   */
  const triggerActionSheet = (index?: number) => {
    const userInterfaceStyle = "dark";
    showActionSheetWithOptions(
      { ...getPlatformSpecificOptions(), userInterfaceStyle },
      (selectedIndex?: number) => {
        if (selectedIndex === undefined) return;
        else {
          switch (selectedIndex) {
            case 0:
              Platform.OS === "android" &&
                (index === undefined ? uploadImage() : uploadImage(index));
              break;

            case 1:
              Platform.OS === "android"
                ? index === undefined
                  ? captureImage()
                  : captureImage(index)
                : index === undefined
                ? uploadImage()
                : uploadImage(index);
              break;

            case 2:
              Platform.OS == "ios" &&
                (index === undefined ? captureImage() : captureImage(index));
              break;
            default:
              break;
          }
        }
      }
    );
  };
  /**
   * @description Remove profile image or additional image
   * @param source
   */
  const removeImage = (source: string) => {
    setIsRemoveImageModalVisible(false);

    const additionalImagesCopy = [...additionalImages];
    const index = additionalImagesCopy.findIndex(
      (item) => item.source === source
    );
    // Removing additional image
    if (index !== -1) {
      additionalImagesCopy[index].source = "";
      setAdditionalImages(additionalImagesCopy);

      setAdditionalPicturesFull(
        additionalPicturesFull.filter((item) => (item as any).uri !== source)
      );
    } else {
      // Removing profile image
      setImage(null);
      setProfilePictureObject({});
    }
  };

  /**
   * @description Create array of strings with the source of the images that are not empty and remove ids
   * @returns {Array<string>} Array of strings with the source of the images that are not empty
   * @author ahmed suljic
   */
  const removeIdFromAdditionalImages = () => {
    const additionalImagesSources: Array<string> = [];
    additionalImages.forEach((item) => {
      if (item.source !== "") {
        additionalImagesSources.push(item.source);
      }
    });
    return additionalImagesSources;
  };

  /**
   * @description For the array of strings add the id to each item
   * @returns {Array<Image>} Array of objects with id and source
   * @author ahmed suljic
   */
  const createAdditionalImagesArray = () => {
    const additionalPicturesWithId = [];
    for (let i = 0; i < 3; i++) {
      additionalPicturesWithId.push({
        id: i,
        source: (additionalPictures && additionalPictures[i]) || "",
      });
    }
    setAdditionalImages(additionalPicturesWithId);
  };

  /**
   * @description Check if there is an image in the state
   * @returns {boolean} True if there is an image, false if there is not an image in the state
   * @author ahmed suljic
   */
  const checkForScreenState = useCallback(() => {
    if (edit) {
      return true;
    } else {
      if (
        image ||
        (additionalImages &&
          additionalImages.some((item) => item.source !== ""))
      ) {
        return true;
      } else {
        return false;
      }
    }
  }, [image, additionalImages, edit]);

  /**
   * @description Check if the button should be disabled
   * @returns {boolean} True if the button should be disabled, false if the button should be enabled
   * @author ahmed suljic
   */
  const checkIsDisabled = useCallback(() => {
    // If it is not edit mode and there is no image, disable the button
    if (!edit) return !image;
    else {
      const additionalImagesStrings = additionalImages
        ?.filter((item) => item.source !== "") // Filter out items with an empty source
        .map((item) => item.source);
      // Check if the image and additional images are the same as the ones in the store
      // If they are, disable the button
      // If they are not, enable the button
      // If there is no image, disable the button
      if (
        !image ||
        (image === profilePicture &&
          checkIfArraysAreEqual(additionalImagesStrings, additionalPictures))
      )
        return true;
      else return false;
    }
  }, [image, additionalImages, profilePicture, additionalPictures, edit]);

  const handleContinuePress = async () => {
    const hasConnection = await isConnected();
    if (!hasConnection) {
      setShowAlert({
        show: true,
        isNetworkError: true,
      });
      return;
    } else {
      onContinuePress(image, removeIdFromAdditionalImages());
    }
  };

  useEffect(() => {
    if (imageToRemove) setIsRemoveImageModalVisible(true);
  }, [imageToRemove]);

  useEffect(() => {
    if (additionalPictures) {
      createAdditionalImagesArray();
    }
  }, [additionalPictures]);

  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, { dx }) => {
      if (dx > 50) {
        // If dragged more than 50 units (adjust this value as needed),
        // execute the onBackPress function
        onBackPress();
      } else {
        // If dragged less than 50 units, reset the position of the Animated.View
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const backAction = useCallback(() => {
    if (isFocused) {
      onBackPress();
      // Return true to prevent a back button from triggering the default action of exiting the app.
      return true;
    } else return false;
  }, [isFocused, onBackPress]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [backAction]);
  return (
    <SafeAreaView
      {...(Platform.OS === "ios" ? panResponder.panHandlers : {})}
      style={[localStyles.container, { backgroundColor: theme.secondary }]}
    >
      {loading ? (
        <View style={bodyStyles.fullCoverCenter}>
          <Spinner color={theme.primary} size="lg" />
        </View>
      ) : (
        <View style={localStyles.innerContainer}>
          <View>
            <View style={localStyles.headerButtons}>
              <BackButton onBackPress={onBackPress} />
              {checkForScreenState() && !edit && (
                <TouchableOpacity
                  onPress={async () => {
                    const hasConnection = await isConnected();
                    if (!hasConnection) {
                      setShowAlert({
                        show: true,
                        isNetworkError: true,
                      });
                      return;
                    } else {
                      image && onSkipPress && onSkipPress(image);
                    }
                  }}
                >
                  <Text fontSize="body13" color={image ? "green" : "black6"}>
                    {t("willDoLater")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Divider size={16} />
            <TitleDescriptionCard
              title={
                image
                  ? edit
                    ? t("updateProfilePictureTitle")
                    : t("pictureOverviewTitle1")
                  : t("addProfilePictureTitle")
              }
              description={
                !edit &&
                (image
                  ? t("pictureOverviewDescription1") || ""
                  : t("addProfilePictureDescription") || "")
              }
            />
            <Divider size={24} />

            {checkForScreenState() ? (
              <View>
                <View style={bodyStyles.fullWidthCentered}>
                  <CircleImageContainer
                    onPress={() => {
                      if (image) setImageToRemove(image);
                      else triggerActionSheet();
                    }}
                    source={image || ""}
                    large
                    editMode={!!image}
                  />
                </View>
                <Divider size={24} />
                <TitleDescriptionCard
                  title={
                    edit
                      ? t("updateGalleryPictureTitle")
                      : t("pictureOverviewTitle2")
                  }
                  description={
                    (!edit && t("pictureOverviewDescription2")) || ""
                  }
                />
                <Divider size={24} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {additionalImages.map((item: any) => (
                    <CircleImageContainer
                      key={item.id}
                      source={item.source}
                      onPress={() => {
                        if (item.source) setImageToRemove(item.source);
                        else triggerActionSheet(item.id);
                      }}
                      editMode={!!item.source}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <View>
                <ImageInfo
                  title="addProfilePictureButtonTitle1"
                  description="addProfilePictureButtonDescription1"
                />
                <Divider size={16} />
                <ImageInfo
                  title="addProfilePictureButtonTitle2"
                  description="addProfilePictureButtonDescription2"
                  checked={false}
                />
              </View>
            )}
          </View>
          <View>
            <View style={[localStyles.continueButton]}>
              {checkForScreenState() ? (
                <MainButton
                  label={edit ? "save" : "continue"}
                  onButtonPress={handleContinuePress}
                  icon={!edit && <ArrowRight />}
                  disabled={checkIsDisabled()}
                  loading={isLoading}
                />
              ) : (
                <>
                  <MainButton
                    label="upload"
                    onButtonPress={uploadImage}
                    icon={<Uploading />}
                    disabled={false}
                    fullHeight
                  />
                  <Divider size={8} horizontal />
                  <MainButton
                    label="capture"
                    onButtonPress={captureImage}
                    icon={<AddPhoto />}
                    disabled={false}
                    invertedLight
                    fullHeight
                  />
                </>
              )}
            </View>
          </View>
        </View>
      )}
      <RemoveImageModal
        isVisible={isRemoveImageModalVisible}
        onDismiss={() => {}}
        source={imageToRemove || ""}
        onCancel={() => {
          setIsRemoveImageModalVisible(false);
          setImageToRemove(null);
        }}
        onRemove={() => {
          removeImage(imageToRemove || "");
        }}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    paddingHorizontal: 16,
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  continueButton: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  profilePicture: {
    width: 100,
  },
});

export default QuestionContainerImageUploadCapture;
