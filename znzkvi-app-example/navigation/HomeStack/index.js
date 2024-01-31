import React from 'react';
import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as Scrn from '@screens';
import HomeTabStack from '../HomeTabStack';
import {Routes} from '@config';
import {BackButton} from '@components';
import {Navigation, Metrics} from '@themes';
import {navigate} from '@services';
import {useSelector} from 'react-redux';
import {isProAccount} from '@utils';

const Stack = createStackNavigator();

export default () => {
  const {colors} = useTheme();

  const {data} = useSelector(({user}) => user);

  //initially, show users the welcome screen so they can go through the onboarding process
  let initialRoute = Routes.home;
  const isProUser = isProAccount(data);

  if (data?.allergies?.length === 0 && data?.diet?.days_to_eat_meat === null) {
    initialRoute = Routes.preferenceUpdate;
  } else {
    initialRoute = Routes.home;
  }
  // if (!data.phone_number) {
  //   initialRoute = Routes.smsOnboarding;
  // }
  // else if (!data.subscription?.product_id) {
  //   initialRoute = Routes.subscriptions;
  // }
  // else {

  // if (data.done_onboarding) {
  //   // if (
  //   //   data.proceeded_to_home ||
  //   //   data.tag_names.indexOf(Tag.proceededToHome) >= 0
  //   // ) {
  //   initialRoute = Routes.home;
  //   // } else {
  //   //   initialRoute = Routes.onBoardingSummary;
  //   // }

  //   /*
  //       if user have already taken the onboarding and the subscription onboarding,
  //       show home screen
  //       */
  //   /*if (data.subscription.product_id) {
  //   initialRoute = Routes.home;
  // } else {*/
  //   /*
  //       if user have not selected any subscription, show onboarding summary screen,
  //       so user can look at the summary again and go through the subscription onboarding
  //       */
  //   //initialRoute = Routes.onBoardingSummary;
  //   //}
  // } else {
  //   /*
  //       if user have skipped the onboarding calculation, and have already gone throught the subscription onboarding, show home screen
  //       */
  //   if (data.subscription?.product_id || data.proceeded_to_home) {
  //     initialRoute = Routes.home;
  //   } else if (data.skipped_onboarding) {
  //     /*
  //       if user have skipped the onboarding calculation, but did not go through the subscription onboarding, show onboarding summary,
  //       so user can look at the summary again and go through the subscription onboarding
  //       */
  //     initialRoute = Routes.onBoardingSummary;
  //   }
  // }
  // }

  return (
    <Stack.Navigator
      //initialRouteName={Routes.myMealPlan}
      initialRouteName={initialRoute}
      screenOptions={{
        ...Navigation.defaultScreenOptions,
        headerTintColor: colors.text
      }}>
      <Stack.Screen
        name={Routes.newPassword}
        component={Scrn.NewPassword}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOffset: {
              height: 0
            }
          }
          //...Navigation.noHeader
        }}
      />

      <Stack.Screen
        name={Routes.mandatoryUserProfileUpdate}
        component={Scrn.MandatoryUserProfileUpdate}
        options={{
          title: 'Update Profile'
        }}
      />

      <Stack.Screen
        name={Routes.welcome}
        component={Scrn.Welcome}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.smsOnboarding}
        component={Scrn.SmsOnboarding}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.onBoarding}
        component={Scrn.OnBoarding}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.calculatePlan}
        component={Scrn.CalculatePlan}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.onBoardingSummary}
        component={Scrn.OnBoardingSummary}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.preferenceUpdate} //For Plan Summary
        component={Scrn.SubscriptionOnBoarding}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.preference}
        component={Scrn.SubscriptionOnBoarding}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.selectSubscription}
        component={Scrn.SelectSubscription}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={Routes.changeSubscription}
        component={Scrn.SelectSubscription}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.diabeticsDisclaimer}
        component={Scrn.DiabeticsDisclaimer}
        options={{
          title: '',
          headerTintColor: colors.text,
          headerBackTitle: ' ',
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOffset: {
              height: 0
            }
          }
        }}
      />

      <Stack.Screen
        name={Routes.subscriptionSuccess}
        component={Scrn.SubscriptionSuccess}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.home}
        component={HomeTabStack}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.myPlan}
        component={Scrn.MyPlan}
        options={{
          title: 'My Plan'
        }}
      />

      <Stack.Screen
        name={Routes.logProgress}
        component={Scrn.LogProgress}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.configureMetrics}
        component={Scrn.ConfigureMetrics}
        options={{
          title: 'Configure Metrics'
        }}
      />

      <Stack.Screen
        name={Routes.configureStats}
        component={Scrn.ConfigureStats}
        options={{
          title: 'Edit Progress Highlights'
        }}
      />

      <Stack.Screen
        name={Routes.myProgress}
        component={Scrn.MyProgress}
        options={{
          title: 'My Progress'
        }}
      />

      <Stack.Screen
        name={Routes.shareProgress}
        component={Scrn.ShareProgress}
        options={{
          title: 'Progress Photo'
        }}
      />

      <Stack.Screen
        name={Routes.shareProgressSuccess}
        component={Scrn.ShareProgressSuccess}
        options={{
          title: 'Progress Photo'
        }}
      />

      <Stack.Screen
        name={Routes.allUpcomingMeals}
        component={Scrn.AllUpcomingMeals}
        options={{
          title: 'Upcoming Meals'
        }}
      />

      <Stack.Screen
        name={Routes.mealDetail}
        component={Scrn.MealDetail}
        options={({route}) => ({
          title: route.params.meal.name
        })}
      />

      <Stack.Screen
        name={Routes.myMealPlan}
        component={Scrn.MyMealPlan}
        options={{
          title: 'My Meal Plan'
        }}
      />

      <Stack.Screen
        name={Routes.batchMeal}
        component={Scrn.BatchMeal}
        options={{
          headerShown: false,
          title: 'Batch Meal'
        }}
      />

      <Stack.Screen
        name={Routes.browseMeals}
        component={Scrn.BrowseMeals}
        options={({navigation, route}) => ({
          title: route.params?.searchOption
            ? route.params.searchOption
            : 'Browse Meals'
          /*headerRight: () => (
            <IconButton
              color={colors.text}
              icon={route.params?.searchOption ? 'close' : 'magnify'}
              onPress={() =>
                route.params?.searchOption
                  ? navigation.setParams({searchOption: ''})
                  : navigate(Routes.mealSearch, {
                      sourceRoute: Routes.browseMeals,
                    })
              }
            />
          ),*/
        })}
      />

      <Stack.Screen
        name={Routes.replaceMeals}
        component={Scrn.ReplaceMeals}
        options={({navigation, route}) => ({
          title: route.params?.searchOption
            ? route.params.searchOption
            : 'Replace Meals'
          /*headerRight: () => (
            <IconButton
              color={colors.text}
              icon={route.params?.searchOption ? 'close' : 'magnify'}
              onPress={() =>
                route.params?.searchOption
                  ? navigation.setParams({searchOption: ''})
                  : navigate(Routes.mealSearch, {
                      sourceRoute: Routes.replaceMeals
                    })
              }
            />
          )*/
        })}
      />

      <Stack.Screen
        name={Routes.mealsCategory}
        component={Scrn.MealsCategory}
        options={({route}) => {
          let title = route.params?.searchOption;
          if (route.params?.category) {
            title =
              route.params?.category == 'See All'
                ? route.params?.searchOption
                : route.params?.category;
          }
          if (route.params?.sourceRoute == Routes.addIngredients) {
            title = 'Suggested Recipes';
          }
          // const CustomHeader = ({ title, subtitle }) => (
          //   <View >
          //     <Text >Suggested Recipes based on your Ingredients</Text>
          //     {/* <Text >{subtitle}</Text> */}
          //   </View>
          // );

          return {
            title,
            // headerTitle: <CustomHeader title={"Title"} subtitle={"subtitle"}/>,
            headerLeft: () => {
              return (
                <BackButton
                  onPress={() => {
                    navigate(route.params.sourceRoute, {
                      meal: route.params.selectedMeal
                    });
                  }}
                />
              );
            }
          };
        }}
      />

      <Stack.Screen
        name={Routes.groceryList}
        component={Scrn.GroceryList}
        options={{
          //title: 'This Week\'s Groceries',
          title: '',
          headerBackTitle: ' ',
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOffset: {
              height: 0
            }
          }
        }}
      />

      <Stack.Screen
        name={Routes.googlePlacesSearch}
        component={Scrn.GooglePlacesSearch}
        options={{
          title: 'Add Address'
        }}
      />

      <Stack.Screen
        name={Routes.confirmAddress}
        component={Scrn.ConfirmAddress}
        options={{
          title: 'Confirm Address'
        }}
      />

      <Stack.Screen
        name={Routes.finalShoppingList}
        component={Scrn.FinalShoppingList}
        options={{
          title: "This Week's Groceries"
        }}
      />

      <Stack.Screen
        name={Routes.selectStore}
        component={Scrn.SelectStore}
        options={{
          title: 'Select Store'
        }}
      />

      <Stack.Screen
        name={Routes.deliveryDetails}
        component={Scrn.DeliveryDetails}
        options={{
          title: 'Delivery Details'
        }}
      />

      <Stack.Screen
        name={Routes.deliveryDetailsPhone}
        component={Scrn.DeliveryDetailsPhone}
        options={{
          title: 'Delivery Details'
        }}
      />

      <Stack.Screen
        name={Routes.paymentMethod}
        component={Scrn.PaymentMethod}
        options={{
          title: 'Payment Method'
        }}
      />

      <Stack.Screen
        name={Routes.reviewOrder}
        component={Scrn.ReviewOrder}
        options={{
          title: 'Review Order'
        }}
      />

      <Stack.Screen
        name={Routes.shopYourList}
        component={Scrn.ShopYourList}
        options={{
          title: 'Shop Your List'
          /*headerRight: () => (
                        <Row>
                            <Badge value={cart.data.cart_item_count} />
                            <IconButton color={colors.text} icon='cart-outline' onPress={() => navigate(Routes.cart)} />
                        </Row>
                    )*/
        }}
      />

      <Stack.Screen
        name={Routes.cart}
        component={Scrn.Cart}
        options={{
          title: 'Shop Your List'
          /*headerRight: () => (
                        <Row>
                            <Badge value={cart.data.cart_item_count} />
                            <IconButton color={colors.text} icon='cart-outline' onPress={() => navigate(Routes.shopYourList)} />
                        </Row>
                    )*/
        }}
      />

      <Stack.Screen
        name={Routes.groceryOrders}
        component={Scrn.GroceryOrders}
        options={{
          title: 'Grocery Orders'
        }}
      />

      <Stack.Screen
        name={Routes.mealSearch}
        component={Scrn.MealSearch}
        options={{
          title: 'Show Filters'
        }}
      />

      <Stack.Screen
        name={Routes.profileSettings}
        component={Scrn.ProfileSettings}
        options={{
          title: 'Profile Settings'
        }}
      />

      <Stack.Screen
        name={Routes.editProfile}
        component={Scrn.EditProfile}
        options={{
          title: 'Edit Profile'
        }}
      />

      <Stack.Screen
        name={Routes.editWhy}
        component={Scrn.EditWhy}
        options={{
          title: 'Edit Your Why',
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.editHighlights}
        component={Scrn.EditHighlights}
        options={{
          title: 'Edit Highlights'
        }}
      />

      <Stack.Screen
        name={Routes.weightChart}
        component={Scrn.WeightChart}
        options={{
          title: 'Current Weight'
        }}
      />

      <Stack.Screen
        name={Routes.waistSizeChart}
        component={Scrn.WaistSizeChart}
        options={{
          title: 'Current Waist Size'
        }}
      />

      <Stack.Screen
        name={Routes.a1cChart}
        component={Scrn.A1CChart}
        options={{
          title: 'Current A1C'
        }}
      />

      <Stack.Screen
        name={Routes.bloodSugarChart}
        component={Scrn.BloodSugarChart}
        options={{
          title: 'Current Blood Sugar'
        }}
      />

      <Stack.Screen
        name={Routes.bodyFatChart}
        component={Scrn.BodyFatChart}
        options={{
          title: 'Current Body Fat %'
        }}
      />

      <Stack.Screen
        name={Routes.changePassword}
        component={Scrn.ChangePassword}
        options={{
          title: 'Change Password'
        }}
      />

      <Stack.Screen
        name={Routes.restoreSubscription}
        component={Scrn.RestoreSubscription}
        options={{
          title: 'Restore Subscription'
        }}
      />

      <Stack.Screen
        name={Routes.notificationSettings}
        component={Scrn.NotificationSettings}
        options={{
          title: 'Notifications Settings'
        }}
      />

      <Stack.Screen
        name={Routes.mealNotificationSettings}
        component={Scrn.MealNotificationSettings}
        options={{
          title: 'Schedule your Meals'
        }}
      />

      <Stack.Screen
        name={Routes.deleteAccount}
        component={Scrn.DeleteAccount}
        options={{
          title: 'Delete My Account'
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
        name={Routes.privacyPolicy}
        component={Scrn.PrivacyPolicy}
        options={{
          title: 'Privacy Policy'
        }}
      />

      <Stack.Screen
        name={Routes.contactUs}
        component={Scrn.ContactUs}
        options={{
          title: 'Contact Us'
        }}
      />

      <Stack.Screen
        name={Routes.challengeDetail}
        component={Scrn.ChallengeDetail}
        options={({route}) => ({
          title: route.params.challenge.name
        })}
      />

      <Stack.Screen
        name={Routes.myAchievements}
        component={Scrn.MyAchievements}
        options={{
          title: 'My Achievements'
        }}
      />

      {/*<Stack.Screen
                name={Routes.rewards}
                component={Scrn.Rewards}
                options={{
                    title: 'Healthy Habits Rewards Program'
                }}
            />*/}

      <Stack.Screen
        name={Routes.redeemReward}
        component={Scrn.RedeemReward}
        options={({route}) => ({
          title: route.params.reward.brand_name
        })}
      />

      <Stack.Screen
        name={Routes.digitalPantryIntro}
        component={Scrn.DigitalPantryIntro}
        options={{
          title: '',
          headerShown: false
        }}
      />

      <Stack.Screen
        name={Routes.digitalPantry}
        component={Scrn.DigitalPantry}
        options={({route}) => ({
          title: ''
        })}
      />

      <Stack.Screen
        name={Routes.digitalPantryGrocery}
        component={Scrn.DigitalPantry}
        options={({route}) => ({
          title: ''
        })}
      />

      <Stack.Screen
        name={Routes.videoTips}
        component={Scrn.VideoTips}
        options={{
          title: 'Featured Tips'
        }}
      />

      <Stack.Screen
        name={Routes.allDiscoverByCategory}
        component={Scrn.AllDiscoverByCategory}
        options={({route}) => ({
          title: route.params.title || ' '
        })}
      />

      <Stack.Screen
        name={Routes.webview}
        component={Scrn.Webview}
        options={({route}) => ({
          title: route.params?.title || ' '
        })}
      />

      <Stack.Screen
        name={Routes.video}
        component={Scrn.Video}
        options={({route}) => ({
          title: route.params?.title || ' '
        })}
      />

      <Stack.Screen
        name={Routes.testerSurveyWebview}
        component={Scrn.TesterSurveyWebview}
        options={({route}) => ({
          title: 'Survey'
        })}
      />

      <Stack.Screen
        name={Routes.survey}
        component={Scrn.Survey}
        options={({route}) => ({
          title: 'Let us know your thoughts!',
          headerTitleStyle: {fontSize: Metrics.font.rg}
        })}
      />

      <Stack.Screen
        name={Routes.balancedNutritionPhilosophy}
        component={Scrn.BalancedNutritionPhilosophy}
        options={{
          title: ''
        }}
      />

      <Stack.Screen
        name={Routes.addIngredients}
        component={Scrn.AddIngredients}
        options={{
          title: ''
        }}
      />

      <Stack.Screen
        name={Routes.mealNotes}
        component={Scrn.MealNotes}
        options={({route}) => ({
          title: route.params.meal.name
        })}
      />

      <Stack.Screen
        name={Routes.recipeStepper}
        component={Scrn.RecipeStepper}
        options={({route}) => ({
          title: route.params.title
        })}
      />
    </Stack.Navigator>
  );
};
