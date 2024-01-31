import React from 'react';
import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as Scrn from '@screens';
import {Routes} from '@config';
import {Navigation} from '@themes';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();

export default () => {
  const {isFirstTime} = useSelector(({app}) => app);
  // const isFirstTime = true;

  const {colors} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={isFirstTime ? Routes.showcase : Routes.login}
      screenOptions={{
        //...Navigation.defaultScreenOptions,
        headerTintColor: colors.text,
        headerBackTitle: ' ',
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOffset: {
            height: 0
          }
        }
      }}>
      <Stack.Screen
        name={Routes.appIntro}
        component={Scrn.AppIntro}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.marketingOnboarding}
        component={Scrn.MarketingOnboarding}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.showcase}
        component={Scrn.Showcase}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.login}
        component={Scrn.Login}
        options={{
          title: '',
          headerShown: false
          //...Navigation.noHeader
        }}
      />

      <Stack.Screen
        name={Routes.forgotPassword}
        component={Scrn.ForgotPassword}
        options={{
          title: ''
          //...Navigation.noHeader
        }}
      />

      <Stack.Screen
        name={Routes.resetPasswordCheckInbox}
        component={Scrn.ResetPasswordCheckInbox}
        options={{
          title: ''
          //...Navigation.noHeader
        }}
      />

      <Stack.Screen
        name={Routes.newPassword}
        component={Scrn.NewPassword}
        options={{
          title: ''
          //...Navigation.noHeader
        }}
      />

      <Stack.Screen
        name={Routes.resetPasswordSuccess}
        component={Scrn.ResetPasswordSuccess}
        options={{
          title: ''
          //...Navigation.noHeader
        }}
      />

      <Stack.Screen
        name={Routes.signup}
        component={Scrn.SignUp}
        options={{
          title: '',
          headerShown: false
          //...Navigation.noHeader
        }}
      />

      <Stack.Screen
        name={Routes.createPassword}
        component={Scrn.CreatePassword}
        options={{
          title: ''
          //...Navigation.noHeader
        }}
      />

      <Stack.Screen
        name={Routes.termsOfService}
        component={Scrn.TermsOfService}
        options={{
          title: 'Terms of Service'
        }}
      />

      <Stack.Screen
        name={Routes.preference}
        component={Scrn.SubscriptionOnBoarding}
        options={{
          headerShown: false
        }}
      />

      
      {/* <Stack.Screen
        name={Routes.selectSubscription}
        component={Scrn.SelectSubscription}
        options={{
          headerShown: false
        }}
      /> */}

    </Stack.Navigator>
  );
};
