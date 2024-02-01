import React, { FC, useEffect, useState, useMemo, useRef } from 'react'
import {
    View,
    StyleSheet,
    SafeAreaView,
    BackHandler,
    Animated,
    PanResponder,
    Platform
} from 'react-native'
import { Navigation, Route } from '@types'
import useTheme from '@hooks/useTheme'

import {
    ProfileOverviewContainer,
    JoinPowerHourOverviewContainer,
    PowerHourChatContainer,
    ReportAccountContainer
} from '../../containers'

import {
    SINGLE_POWER_HOUR_INFO,
    POWER_HOUR_OVERVIEW_SCREEN,
    POWER_HOUR_CHAT_SCREEN,
    REPORT_ACCOUNT_SCREEN
} from '@utils/constants'
import { isConnected } from '@utils/helperFunctions'

import { JoinPowerHour, GetPowerHour } from '@services'
import { usePersonalDetailsStore, useAppStatusStore } from '@hooks/zustand'
interface PowerHourInfoScreenProps {
    navigation: Navigation
    route: Route
}

const PowerHourInfoScreen: FC<PowerHourInfoScreenProps> = ({
    route,
    navigation
}) => {
    const { powerHourInfo, chatScreen } = route?.params || {}
    const { theme } = useTheme()
    const [powerHourData, setPowerHourData] = useState(powerHourInfo)
    const [currentScreen, setCurrentScreen] = useState(
        chatScreen || SINGLE_POWER_HOUR_INFO
    )
    const [shouldChat, setShouldChat] = useState(false)
    const { userId } = usePersonalDetailsStore()
    const { setShowAlert } = useAppStatusStore()
    const overScrollViewRef = useRef(false)
    const handleConnectPress = () => {
        const isConnected = powerHourData?.powerHour?.participants?.some(
            (item: any) => item.userId === userId
        )
        if (isConnected) {
            setCurrentScreen(POWER_HOUR_CHAT_SCREEN)
        } else {
            joinPowerHour()
        }
    }

    /**
     * @description Join Power Hour
     */
    const joinPowerHour = async () => {
        const hasConnection = await isConnected()
        if (!hasConnection) {
            setShowAlert({
                show: true,
                isNetworkError: true
            })
            return
        } else {
            await JoinPowerHour(userId, powerHourData?.userId)
                .then(res => {
                    setCurrentScreen(POWER_HOUR_CHAT_SCREEN)
                    getPowerHour()
                })
                .catch(err => {
                    console.log('ERROR', err)
                })
        }
    }

    const handleSwipeBack = () => {
        switch (currentScreen) {
            case POWER_HOUR_OVERVIEW_SCREEN:
                navigation.goBack()
                break
            case POWER_HOUR_CHAT_SCREEN:
                handleChatBackPress()
                break
            case REPORT_ACCOUNT_SCREEN:
                setCurrentScreen(POWER_HOUR_CHAT_SCREEN)
                break
            default:
                navigation.goBack()
                break
        }
    }

    const pan = useRef(new Animated.Value(0)).current
    const panResponder = PanResponder.create({
        onPanResponderMove: Animated.event([null, { dx: pan }], {
            useNativeDriver: false
        }),
        onStartShouldSetPanResponderCapture: () => {
            return false
        },

        onMoveShouldSetPanResponder: () => {
            return !overScrollViewRef.current
        },
        onPanResponderRelease: (_, { dx }) => {
            if (dx > 50) {
                // If dragged more than 50 units (adjust this value as needed),
                // execute the onBackPress function
                handleSwipeBack()
            } else {
                // If dragged less than 50 units, reset the position of the Animated.View
                Animated.spring(pan, {
                    toValue: 0,
                    useNativeDriver: false
                }).start()
            }
        }
    })

    /**
     * @description Gets the power hour info
     */
    const getPowerHour = async () => {
        const hasConnection = await isConnected()
        if (!hasConnection) {
            setShowAlert({
                show: true,
                isNetworkError: true
            })
            return
        } else {
            await GetPowerHour(powerHourData?.userId)
                .then(response => {
                    setPowerHourData({ powerHour: response?.data?.data })
                })
                .catch(error => {
                    console.log('Error getting PH', error)
                })
        }
    }

    const handleChatBackPress = () => {
        if (chatScreen) {
            navigation.goBack()
        } else if (shouldChat) {
            setCurrentScreen(SINGLE_POWER_HOUR_INFO)
            setShouldChat(false)
        } else {
            getPowerHour()
            setCurrentScreen(POWER_HOUR_OVERVIEW_SCREEN)
        }
    }

    const handleOnChatNavigation = async () => {
        const hasConnection = await isConnected()
        if (!hasConnection) {
            setShowAlert({
                show: true,
                isNetworkError: true
            })
            return
        } else {
        }
    }
    const updateSliderRef = (val: boolean) => {
        overScrollViewRef.current = val
    }
    const getCurrentScreen = () =>
        useMemo(() => {
            switch (currentScreen) {
                case POWER_HOUR_OVERVIEW_SCREEN:
                    return (
                        <JoinPowerHourOverviewContainer
                            onBackPress={() => {
                                setCurrentScreen(SINGLE_POWER_HOUR_INFO)
                            }}
                            onContinuePress={() => {
                                handleConnectPress()
                            }}
                            powerHourInfo={powerHourData?.powerHour}
                            fullName={powerHourInfo?.personalDetails?.fullName}
                            navigation={navigation}
                            updateSliderRef={updateSliderRef}
                        />
                    )
                case POWER_HOUR_CHAT_SCREEN:
                    return (
                        <PowerHourChatContainer
                            onBackPress={() => {
                                handleChatBackPress()
                            }}
                            onContinuePress={() => {}}
                            fullName={powerHourInfo?.personalDetails?.fullName}
                            onReportPress={() => {
                                setCurrentScreen(REPORT_ACCOUNT_SCREEN)
                            }}
                            participantUserId={powerHourInfo?.userId}
                            userImage={powerHourInfo?.pictures?.profilePicture}
                            isPowerHourActive={
                                powerHourInfo?.powerHour?.hasScheduledPowerHour
                            }
                            navigation={navigation}
                            updateScrollRef={updateSliderRef}
                        />
                    )
                case REPORT_ACCOUNT_SCREEN:
                    return (
                        <ReportAccountContainer
                            onBackPress={() => {
                                setCurrentScreen(POWER_HOUR_CHAT_SCREEN)
                            }}
                            onContinuePress={() => {
                                setCurrentScreen(POWER_HOUR_CHAT_SCREEN)
                            }}
                            onCancelPress={() => {
                                setCurrentScreen(POWER_HOUR_CHAT_SCREEN)
                            }}
                            reportedUserId={powerHourInfo?.userId}
                            reportedUserName={
                                powerHourInfo?.personalDetails?.fullName
                            }
                            navigation={navigation}
                        />
                    )
                default:
                    return (
                        <ProfileOverviewContainer
                            onBackPress={() => {
                                navigation.goBack()
                            }}
                            onEditPress={() => {
                                setCurrentScreen(POWER_HOUR_CHAT_SCREEN)
                                setShouldChat(true)
                            }}
                            updateSliderRef={updateSliderRef}
                            isPowerHour
                            onBlurPress={() => {
                                setCurrentScreen(POWER_HOUR_OVERVIEW_SCREEN)
                            }}
                            phFullName={
                                powerHourInfo?.personalDetails?.fullName
                            }
                            phHeadline={
                                powerHourInfo?.personalDetails?.headline
                            }
                            phProfilePicture={
                                powerHourInfo?.pictures?.profilePicture
                            }
                            phAdditionalPictures={
                                powerHourInfo?.pictures?.additionalPictures
                            }
                            phActivities={
                                powerHourInfo?.workoutDetails?.fitnessActivities
                            }
                            phFitnessGoal={
                                powerHourInfo?.workoutDetails?.fitnessGoal
                            }
                            phWorkoutFrequency={
                                powerHourInfo?.workoutDetails?.workoutFrequency
                            }
                            phWorkoutDuration={
                                powerHourInfo?.workoutDetails?.workoutDuration
                            }
                            phExperienceLevel={
                                powerHourInfo?.workoutDetails?.experienceLevel
                            }
                            phDistanceInKm={powerHourInfo?.distanceKm}
                            phHasScheduledPowerHour={
                                powerHourInfo?.powerHour?.hasScheduledPowerHour
                            }
                            phRatings={powerHourInfo?.ratings}
                            phParticipants={
                                powerHourData?.powerHour?.participants
                            }
                            navigation={navigation}
                        />
                    )
            }
        }, [powerHourData, powerHourInfo, currentScreen])
    useEffect(() => {
        const backAction = () => {
            navigation.goBack()
            // Return true to prevent a back button from triggering the default action of exiting the app.
            return true
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        )
        return () => backHandler.remove()
    }, [navigation])

    return (
        <SafeAreaView
            {...(currentScreen !== REPORT_ACCOUNT_SCREEN &&
            Platform.OS === 'ios'
                ? panResponder.panHandlers
                : {})}
            style={[
                localStyles.container,
                { backgroundColor: theme.secondary }
            ]}>
            {getCurrentScreen()}
        </SafeAreaView>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1
    }
})
export default PowerHourInfoScreen
