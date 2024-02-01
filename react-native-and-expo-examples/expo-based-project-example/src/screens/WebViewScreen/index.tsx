import React, { FC } from "react";
import { StyleSheet } from "react-native";

import { Navigation } from "types";

import { RouteProp } from "@react-navigation/native";
import WebView from "react-native-webview";

interface WebViewScreenProps {
  navigation: Navigation;
  route: RouteProp<{ params: { link: string } }>;
}

const WebViewScreen: FC<WebViewScreenProps> = ({ navigation, route }) => {
  return (
    <WebView
      style={localStyles.container}
      source={{ uri: route.params?.link ? route.params?.link : "" }}
    />
  );
};

const localStyles = StyleSheet.create({
  container: {},
});

export default WebViewScreen;
