import { View, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@constants/Colors'
import SvgIcons from '@assets/svgs/icons'
import SquareButton from './SquareButton'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import Routes from '@navigation/Routes'
import { useNavigation } from '@react-navigation/native'
import { AppStackNavigationProp } from '@navigation/AppStack'
interface Props {
    currentTab: 'ranking' | 'home' | 'user' | 'settings'
}

const BottomTab = ({ currentTab }: Props) => {
    const navigation = useNavigation<AppStackNavigationProp>()

    return (
        <View style={localStyles.container}>
            {currentTab !== 'user' && (
                <SquareButton
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Profile)
                    }}
                    icon={
                        <SvgIcons.User
                            width={scaleByWidth(37)}
                            height={scaleByHeight(43)}
                        />
                    }
                />
            )}
            {!['user', 'home', 'settings'].includes(currentTab) && (
                <SquareButton
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Home)
                    }}
                    icon={
                        <SvgIcons.Home
                            width={scaleByWidth(46)}
                            height={scaleByHeight(44)}
                        />
                    }
                />
            )}
            {currentTab !== 'settings' && (
                <SquareButton
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Settings)
                    }}
                    icon={
                        <SvgIcons.Settings
                            width={scaleByWidth(46)}
                            height={scaleByHeight(44)}
                        />
                    }
                />
            )}
            {!['ranking', 'home'].includes(currentTab) && (
                <SquareButton
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Home)
                    }}
                    icon={
                        <SvgIcons.Home
                            width={scaleByWidth(46)}
                            height={scaleByHeight(44)}
                        />
                    }
                />
            )}
            {currentTab !== 'ranking' && (
                <SquareButton
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Statistics)
                    }}
                    icon={
                        <SvgIcons.Ranking
                            width={scaleByWidth(46)}
                            height={scaleByHeight(47)}
                        />
                    }
                />
            )}
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: scaleByHeight(112),
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopColor: Colors.lesserBlack,
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderBottomColor: Colors.lesserBlack,
        backgroundColor: Colors.blue,
        paddingHorizontal: 25
    }
})
export default BottomTab
