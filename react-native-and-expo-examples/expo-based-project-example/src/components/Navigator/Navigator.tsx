import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "screens/HomeScreen";
import TestResultsScreen from "screens/TestResultsScreen";
import LoginScreen from "screens/LoginScreen";
import RegisterScreen from "screens/RegisterScreen";
import WelcomeScreen from "screens/WelcomeScreen/WelcomeScreen";
import AccountSettingsScreen from "screens/AccountSettingsScreen";
import ShopScreen from "screens/ShopScreen";
import ProductCategoryScreen from "screens/ProductCategoryScreen";
import ProductShowScreen from "screens/ProductShowScreen";
import CartScreen from "screens/CartScreen";
import OrdersScreen from "screens/OrdersScreen";
import AccountScreen from "screens/AccountScreen";
import YourOrdersScreen from "screens/YourOrdersScreen";
import EditAccountScreen from "screens/EditAccountScreen";
import WebViewScreen from "screens/WebViewScreen";

import { useSelector } from "hooks/reduxHooks";
import useTheme from "hooks/useTheme";

import HomeIcon from "../../../assets/images/svg/TabNavigationIcons/homeTabIcon.svg";
import ShopIcon from "../../../assets/images/svg/TabNavigationIcons/cartTabIcon.svg";
import ResultsIcon from "../../../assets/images/svg/TabNavigationIcons/resultsTabIcon.svg";
import AccountIcon from "../../../assets/images/svg/TabNavigationIcons/accountTabIcon.svg";
import { useNavigation } from "@react-navigation/native";

const defaultStackOptions = {
  headerShown: false,
};

const AuthStack = createStackNavigator();
const AuthStackScreen = () => {
  const getInitialRoute = () => {
    return "WelcomeScreen";
  };

  return (
    <AuthStack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{ ...defaultStackOptions }}>
      <AuthStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={defaultStackOptions}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen
      name="AccountSettingsScreen"
      component={AccountSettingsScreen}
    />
    <HomeStack.Screen name="WebViewScreen" component={WebViewScreen} />
  </HomeStack.Navigator>
);

const ShopStack = createStackNavigator();
const ShopStackScreen = () => (
  <ShopStack.Navigator screenOptions={defaultStackOptions}>
    <ShopStack.Screen name="ShopScreen" component={ShopScreen} />
    <ShopStack.Screen name="CartScreen" component={CartScreen} />
    <ShopStack.Screen name="ProductShowScreen" component={ProductShowScreen} />
    <ShopStack.Screen
      name="ProductCategoryScreen"
      component={ProductCategoryScreen}
    />
  </ShopStack.Navigator>
);

const AccountStack = createStackNavigator();
const AccountStackScreen = () => (
  <AccountStack.Navigator screenOptions={defaultStackOptions}>
    <AccountStack.Screen name="YourOrdersScreen" component={YourOrdersScreen} />
    <AccountStack.Screen name="AccountScreen" component={AccountScreen} />
    <AccountStack.Screen
      name="EditAccountScreen"
      component={EditAccountScreen}
    />
  </AccountStack.Navigator>
);

const ResultsStack = createStackNavigator();
const ResultsStackScreen = () => (
  <ResultsStack.Navigator screenOptions={defaultStackOptions}>
    <ResultsStack.Screen name="OrdersScreen" component={OrdersScreen} />
    <ResultsStack.Screen
      name="TestResultsScreen"
      component={TestResultsScreen}
    />
  </ResultsStack.Navigator>
);

/**
 * Tab bar configuration
 */
const TabBarConfig = [
  {
    screen: HomeStackScreen,
    activeIcon: HomeIcon,
    inactiveIcon: HomeIcon,
    tabBarLabel: "home",
  },
  {
    screen: ShopStackScreen,
    activeIcon: ShopIcon,
    inactiveIcon: ShopIcon,
    tabBarLabel: "shop",
  },
  {
    screen: AccountStackScreen,
    activeIcon: AccountIcon,
    inactiveIcon: AccountIcon,
    tabBarLabel: "healthReport",
  },
  {
    screen: ResultsStackScreen,
    activeIcon: ResultsIcon,
    inactiveIcon: ResultsIcon,
    tabBarLabel: "results",
  },
];

const TabNavigator = createBottomTabNavigator();
const TabNavigatorScreen = () => {
  const { theme } = useTheme();

  return (
    <TabNavigator.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const tab = TabBarConfig.find(
            ({ tabBarLabel }) => tabBarLabel === route.name,
          );
          return <tab.activeIcon />;
        },
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 35,
          shadowColor: "#000",
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.primary,
        inactiveTintColor: theme.primary,
        showLabel: false,
        headerShown: false,
        style: {
          marginBottom: Platform.OS === "ios" ? 10 : 20,
          paddingTop: 4,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
        },
      }}>
      {TabBarConfig.map(({ screen, tabBarLabel }) => (
        <TabNavigator.Screen
          key={tabBarLabel}
          name={tabBarLabel}
          options={{ headerShown: false }}
          component={screen}
        />
      ))}
    </TabNavigator.Navigator>
  );
};

const RootStack = createStackNavigator();
const RootStackScreen = () => {
  const userToken = useSelector((state) => state.login.userToken);

  const navigation = useNavigation();

  if (!userToken) {
    navigation.navigate("Auth");
  }

  return (
    <RootStack.Navigator
      initialRouteName={userToken ? "App" : "Auth"}
      screenOptions={{
        ...defaultStackOptions,
      }}>
      <RootStack.Screen name="Auth" component={AuthStackScreen} />
      <RootStack.Screen name="App" component={TabNavigatorScreen} />
    </RootStack.Navigator>
  );
};

export default function Navigator() {
  return <RootStackScreen />;
}
