import { View, StyleSheet } from 'react-native'
import React from 'react'
import SvgIcons from '@assets/svgs/icons'
import Row from '@components/Row'
import Svgs from '@assets/svgs'
import BottomTab from '@components/BottomTab'
import ReanimatedSwitch from '@components/ReanimatedSwitch'
import Text from '@components/Text'
import SettingsHeader from '@components/SettingsHeader'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import Divider from '@components/Divider'
import Colors from '@constants/Colors'
import useSettings from '@hooks/useSettings'

const Settings = () => {
    const { music, sounds, setMusic, setSounds } = useSettings()
    return (
        <View style={localStyles.container}>
            <SettingsHeader
                title="Postavke"
                icon={
                    <SvgIcons.Settings
                        width={scaleByWidth(46)}
                        height={scaleByHeight(44)}
                    />
                }
            />
            <View style={localStyles.flexOne}>
                <Divider size={70} />
                <View style={localStyles.svgContainer}>
                    <Svgs.SettingsContainer
                        preserveAspectRatio={'none'}
                        height={'100%'}
                        width={'100%'}
                        style={localStyles.svg}
                    />
                    <Row style={localStyles.switchContainer}>
                        <ReanimatedSwitch
                            isEnabled={music}
                            setIsEnabled={setMusic}
                        />
                        <Divider horizontal size={20} />
                        <Text fs={32} color={Colors.white}>
                            Muzika
                        </Text>
                    </Row>
                    <Row style={localStyles.switchContainer}>
                        <ReanimatedSwitch
                            isEnabled={sounds}
                            setIsEnabled={setSounds}
                        />
                        <Divider horizontal size={20} />
                        <Text fs={32} color={Colors.white}>
                            Zvukovi
                        </Text>
                    </Row>
                </View>
            </View>
            <BottomTab currentTab="settings" />
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    switchContainer: {
        alignItems: 'center',
        // justifyContent: 'space-between',
        width: 180,
        height: 50
    },
    svg: {
        ...StyleSheet.absoluteFillObject,
        left: 20,
        right: 20
    },
    svgContainer: {
        height: 162,
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fullWidth: {
        width: '100%'
    },
    flexOne: {
        flex: 1
    }
})
export default Settings
