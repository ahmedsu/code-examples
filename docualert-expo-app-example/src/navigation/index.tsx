import { FC, useEffect, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme, View } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useTranslation } from 'react-i18next'

import { AddNewModal, Loader, GlobalAlert, Text } from '@/components'
import { NAVIGATION_NAMES } from '@/constants'
import { DocumentsNavigation } from './navigations/documents'
import { AuthNavigation } from './navigations/auth'
import {
  AddNew,
  CalendarScreen,
  Notifications,
  Settings,
  StartScreen
} from '@/screens'
import { useAddNewModalStore, useWelcomeScreenStore } from '@/store'

const BottomTab = createBottomTabNavigator()

export const Navigation = () => {
  const { welcomeScreenCompleted } = useWelcomeScreenStore(state => state)
  const { openAddNewModal } = useAddNewModalStore(state => state)
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()
  const { t } = useTranslation('common')

  const onAuthStateChanged = user => {
    setUser(user)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [])

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '823681087835-jsk2ga11m80hvumb4imtoor0h3n6e4ka.apps.googleusercontent.com'
    })
  })

  if (initializing) return null

  const renderNavigation = () => {
    if (!user) {
      return (
        <>
          <AuthNavigation />
          <GlobalAlert />
          <Loader />
        </>
      )
    } else {
      if (!welcomeScreenCompleted) {
        return <StartScreen />
      } else {
        return (
          <>
            <BottomTab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                  height: Platform.OS === 'android' ? 60 : 90,
                  position: 'absolute',
                  bottom: 0,
                  left: 1,
                  right: 1,
                  backgroundColor: '#f9f9f9',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  shadowColor: 'rgba(0,0,0,0.1)',
                  shadowOffset: {
                    width: 10,
                    height: 2
                  },
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 2,
                  zIndex: 50
                }
              }}>
              <BottomTab.Screen
                name={NAVIGATION_NAMES.DOCUMENTS_STACK}
                component={DocumentsNavigation}
                options={{
                  tabBarIcon: tab => (
                    <TabIcon
                      isFocused={tab.focused}
                      iconName="card-account-details-outline"
                      name={t('Dokumenti')}
                    />
                  )
                }}
              />
              <BottomTab.Screen
                name={NAVIGATION_NAMES.CALENDAR}
                component={CalendarScreen}
                options={{
                  tabBarIcon: tab => (
                    <TabIcon
                      isFocused={tab.focused}
                      iconName="calendar"
                      name={t('Kalendar')}
                    />
                  )
                }}
              />
              <BottomTab.Screen
                name={NAVIGATION_NAMES.ADD_NEW}
                component={AddNew}
                options={{
                  tabBarIcon: tab => (
                    <TabIcon
                      isCentral={true}
                      isFocused={tab.focused}
                      iconName="file"
                      name={t('Dodaj novi')}
                    />
                  )
                }}
                listeners={() => ({
                  tabPress: e => {
                    e.preventDefault()
                    openAddNewModal()
                  }
                })}
              />
              <BottomTab.Screen
                name={NAVIGATION_NAMES.NOTIFICATIONS}
                component={Notifications}
                options={{
                  tabBarIcon: tab => (
                    <TabIcon
                      isFocused={tab.focused}
                      iconName="bell-badge"
                      name={t('Notifikacije')}
                    />
                  )
                }}
              />
              <BottomTab.Screen
                name={NAVIGATION_NAMES.SETTINGS}
                component={Settings}
                options={{
                  tabBarIcon: tab => (
                    <TabIcon
                      isFocused={tab.focused}
                      iconName="cog"
                      name={t('Postavke')}
                    />
                  )
                }}
              />
            </BottomTab.Navigator>
            <AddNewModal />
            <GlobalAlert />
            <Loader />
          </>
        )
      }
    }
  }

  return renderNavigation()
}

interface TabIconProps {
  isCentral?: boolean
  isFocused: boolean
  iconName:
    | 'card-account-details-outline'
    | 'calendar'
    | 'file'
    | 'bell-badge'
    | 'cog'
  name: string
}

const TabIcon: FC<TabIconProps> = ({
  isCentral,
  isFocused,
  iconName,
  name
}) => {
  const theme = useTheme()
  return (
    <View
      style={{
        ...localStyles.tabItem,
        backgroundColor: isCentral
          ? theme.colors.primary['500']
          : 'transparent',
        borderTopLeftRadius: isCentral ? 50 : 0,
        borderTopRightRadius: isCentral ? 50 : 0
      }}>
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        style={{
          color: isCentral
            ? 'white'
            : isFocused
            ? theme.colors.primary['500']
            : 'black'
        }}
      />
      <Text
        style={{
          ...localStyles.tabItemText,
          color: isCentral
            ? 'white'
            : isFocused
            ? theme.colors.primary['500']
            : 'black'
        }}
        fontSize="h3"
        typography={isFocused ? 'bold' : 'regular'}>
        {name}
      </Text>
    </View>
  )
}

const localStyles = StyleSheet.create({
  tabItem: {
    ...StyleSheet.absoluteFillObject,
    height: Platform.OS === 'android' ? 60 : 90,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5
  },
  tabItemText: {
    fontSize: 10,
    fontWeight: '600'
  }
})
