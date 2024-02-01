import Navigator from "components/Navigator/Navigator";
import React, { useEffect, useState } from "react";
import { enableFreeze } from "react-native-screens";
import ThemeProvider from "theme/ThemeContext";
import i18n from "i18n-js";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import * as Sentry from "sentry-expo";

import en from "./assets/languages/en";
// This is for optimization, every screen that's not focused has a never ending promise
// that stalls it, which means that whatever the app would like to rerender in the background
// would now be unable to be rerendered. Comment it if it causes any issues.
enableFreeze(true);

SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: "https://a3cc7eda9708402cb5455486610ec32b@o4504564816543744.ingest.sentry.io/4504565503098880",
  debug: true, // SHOULD BE FALSE FOR REAL PRODUCTION BUILDS
  tracesSampleRate: 1,
});

const App = () => {
  const [fontsLoaded] = useFonts({
    "open-sans-regular": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "montserrat-regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "montserrat-semiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
  });

  i18n.translations = {
    en,
  };

  i18n.locale = "en";

  const [initialTheme] = useState<string | null>("light");
  //good function to persist theme
  // const getTheme = async () => {
  //   const savedTheme = await AsyncStorage.getItem("theme");
  //   if (savedTheme) setInitialTheme(savedTheme);
  // };
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
    };
    prepare();
    // getTheme();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  const queryClient = new QueryClient();

  return (
    <ThemeProvider initialTheme={initialTheme || undefined}>
      <QueryClientProvider client={queryClient}>
        <Navigator />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
