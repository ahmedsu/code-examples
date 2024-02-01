import React, {useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import * as Scrn from '@screens';
import {Routes, Tag} from '@config';
import {Colors, Images} from '@themes';
import {NavigationTooltip} from '@components';
import {useSelector, useDispatch} from 'react-redux';
import Actions from '@actions';
import {Image} from 'react-native';
import style from './style';
import ForYou from '../../screens/Today/ForYou';

const Tab = createMaterialBottomTabNavigator();

export default () => {
  const {dark, colors} = useTheme();

  const {tag_names} = useSelector(({user}) => user.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({type: Actions.Types.ATTEMPT_SEND_SURVEY_REMINDER});
  }, []);

  return (
    <>
      {/* {tag_names.indexOf(Tag.homeTabWalkthrough_tooltip) < 0 && <NavigationTooltip />} */}

      <Tab.Navigator
        initialRouteName={Routes.today}
        activeColor={Colors.text}
        inactiveColor={Colors.mute}
        shifting={false}
        barStyle={{
          backgroundColor: dark ? colors.accent : colors.background
        }}>
        <Tab.Screen
          name={Routes.today}
          component={ForYou}
          options={{
            title: 'Today',
            tabBarIcon: ({focused}) => (
              <Image
                style={style.navIcon}
                source={
                  focused
                    ? dark
                      ? Images.icon.today_white
                      : Images.icon.today
                    : Images.icon.today_gray
                }
              />
            )
          }}
        />

        <Tab.Screen
          name={Routes.meals}
          component={Scrn.Meals}
          options={{
            title: 'My Meals',
            tabBarIcon: ({focused}) => (
              <Image
                style={style.navIcon}
                source={
                  focused
                    ? dark
                      ? Images.icon.my_meal_white
                      : Images.icon.my_meal
                    : Images.icon.my_meal_gray
                }
              />
            )
          }}
        />

        <Tab.Screen
          name={Routes.me}
          component={Scrn.Me}
          options={{
            title: 'Me',
            tabBarIcon: ({focused}) => (
              <Image
                style={style.navIcon}
                source={
                  focused
                    ? dark
                      ? Images.icon.profile_white
                      : Images.icon.profile
                    : Images.icon.profile_gray
                }
              />
            )
          }}
        />
      </Tab.Navigator>
    </>
  );
};
