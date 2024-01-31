import React, {useEffect, useState} from 'react'
import {useColorScheme, StatusBar} from 'react-native'
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native'
import AuthStack from './AuthStack'
import HomeStack from './HomeStack'
import {ActivityIndicator, CartStatusTicker, IntercomButton} from '@components'
import {setNavigator, navigator} from '@services'
import {Colors} from '@themes'
import {DEEPLINK, Routes, IS_ANDROID, Events} from '@config'
import {logEvent} from '@lib'
import {useSelector, useDispatch} from 'react-redux'
import Actions from '@actions'

const LIGHT_CONTENT = 'light-content'
const DARK_CONTENT = 'dark-content'

const FORCED_LIGHT_CONTENT_ROUTES = [
    Routes.me,
    Routes.rewards
]

const SHOW_CART_REQUEST_TICKER_ROUTES = [
    Routes.today,
    Routes.challenges,
    Routes.meals,
    Routes.myMealPlan
]

const MyDefaultTheme = {
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        background: Colors.light,
        text: Colors.black,
        accent: Colors.dark,
        card: Colors.light,
        screen: Colors.bg
    }
}

const MyDarkTheme = {
    dark: true,
    colors: {
        ...DarkTheme.colors,
        background: Colors.black,
        text: Colors.light,
        accent: '#111',
        card: Colors.black,
        screen: 'transparent'
    }
}

export default () => {

    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'darkd'

    const {isAttemptingDownloadOverTheAirUpdates} = useSelector(({app}) => app)
    const isLoggedIn = useSelector(({auth}) => auth.isLoggedIn)
    const userData = useSelector(({user}) => user.data)
    const cart = useSelector(({cart}) => cart)

    const dispatch = useDispatch()

    const [statusBarStyle, setStatusBarStyle] = useState(LIGHT_CONTENT)

    const theme = MyDefaultTheme

    useEffect(() => {
        changeStatusBarStyle()
    },[])

    const handleSetNavigator = ref => setNavigator(ref)

    const handleNavigationStateChange = () => {
        const routeName = navigator()?.getCurrentRoute()?.name

        if(routeName) {
            dispatch({
                type: Actions.Types.SET_CURRENT_ROUTE_NAME,
                routeName
            })

            logEvent(Events.screen_visit, {
                name: routeName.toString()
            })

            if(
                isLoggedIn &&
                userData?.done_onboarding &&
                userData?.subscription?.product_id &&
                SHOW_CART_REQUEST_TICKER_ROUTES.indexOf(navigator()?.getCurrentRoute()?.name) >= 0 &&
                cart.status.data?.status
            ) {
                dispatch({type: Actions.Types.SHOW_CART_REQUEST_TICKER})
            }
            else {
                dispatch({type: Actions.Types.HIDE_CART_REQUEST_TICKER})
            }
        }

        changeStatusBarStyle()
    }

    const changeStatusBarStyle = () => {
        if(!IS_ANDROID) {
            if(FORCED_LIGHT_CONTENT_ROUTES.indexOf(navigator()?.getCurrentRoute()?.name) >= 0) {
                setStatusBarStyle(LIGHT_CONTENT)
            }
            else {
                setStatusBarStyle(isDark ? LIGHT_CONTENT : DARK_CONTENT)
            }
        }
    }

    return (
        <>
            <StatusBar barStyle={statusBarStyle} />

            {/* <CartStatusTicker /> */}
            {/* <IntercomButton /> */}
            
            <NavigationContainer
                ref={handleSetNavigator}
                linking={DEEPLINK}
                theme={theme}
                onStateChange={handleNavigationStateChange}
            >
                {isAttemptingDownloadOverTheAirUpdates ? <ActivityIndicator full text='Downloading updates. Please wait...' /> :
                    isLoggedIn ? <HomeStack /> : <AuthStack />
                }
            </NavigationContainer>
        </>
    )
}