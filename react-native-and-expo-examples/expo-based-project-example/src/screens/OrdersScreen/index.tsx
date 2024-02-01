import useTheme from "hooks/useTheme";
import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import { useQuery } from "react-query";
import * as Sharing from "expo-sharing";

import { Navigation } from "types";
import { Header, OrderCard } from "components";
import { textStyles } from "globalStyles";

import { getAllResults } from "services/customer";
import { ResultDataInterface } from "types/results";

import { getResultPDF } from "services/customer";

interface OrdersScreenProps {
  navigation: Navigation;
}

const OrdersScreen: FC<OrdersScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    isError,
    isLoading: isLoadingResults,
    data: allResults = [],
  } = useQuery<Array<ResultDataInterface>>(["results"], getAllResults);

  /**
   * @description Requests the base64 encoded PDF and saves it to the device
   * @author Ahmed Suljic
   */
  const downloadLabResultPDF = async (id: number) => {
    try {
      setIsDownloading(true);
      const res = await getResultPDF(id);
      const base64Data = res?.pdf;

      if (Platform.OS === "android") {
        const permissions =
          await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          return;
        }

        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          `LabResultPDF-${id}`,
          "application/pdf",
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64Data, {
              encoding: FileSystem.EncodingType.Base64,
            });
            setIsDownloading(false);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (Platform.OS === "ios") {
        const path = FileSystem.documentDirectory + `LabResultPDF-${id}.pdf`;
        await FileSystem.writeAsStringAsync(path, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(path, { mimeType: "application/pdf" });

        setIsDownloading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView
      style={localStyles.container}
      showsVerticalScrollIndicator={false}>
      <Header
        onDrawerPress={() =>
          navigation.navigate("shop", { screen: "CartScreen" })
        }
        onSettingsPress={() =>
          navigation.navigate("healthReport", { screen: "EditAccountScreen" })
        }
        onLogoPress={() => navigation.navigate("HomeScreen")}
      />

      <View
        style={[
          localStyles.contentDiv,
          { minHeight: useWindowDimensions().height },
        ]}>
        <View style={localStyles.patientDiv}>
          <Text style={[localStyles.patientName, { color: theme.primary }]}>
            Anna Doe
          </Text>
          <Text style={localStyles.patientTitle}>(Patient)</Text>
        </View>

        <View style={localStyles.flatListDiv}>
          {isLoadingResults && <ActivityIndicator />}
          {allResults &&
            allResults?.map((item: any) => (
              <OrderCard
                onPress={() =>
                  navigation.navigate("results", {
                    screen: "TestResultsScreen",
                    params: { resultData: item },
                  })
                }
                requisitionNum={item.RequisitionNum}
                specimen={item.SpecimenNumber}
                dateCollected={item.DateTimeCollected}
                dateReported={item.DateTimeReported}
                onPressDownload={() => downloadLabResultPDF(item.OrderNumber)}
                isDownloading={isDownloading}
              />
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  alignItems: {
    alignItems: "center",
  },
  patientDiv: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    top: 10,
    height: 100,
    paddingLeft: 40,
  },
  patientName: {
    ...textStyles.mainBold,
    top: -10,
  },
  patientTitle: {
    ...textStyles.mainText,
    left: 10,
    top: -10,
  },
  headerDiv: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 91,
    backgroundColor: "#ffffff",
    flexDirection: "row",
  },
  centerDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#ffffff",
  },
  contentDiv: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  flatListDiv: {
    paddingHorizontal: 24,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;
