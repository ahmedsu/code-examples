import { StyleSheet, View } from 'react-native'
import React from 'react'
import Container from '@components/Container'
import RoundButton from '@components/RoundButton'
import SvgIcons from '@assets/svgs/icons'
import Svgs from '@assets/svgs'
import Divider from '@components/Divider'
import DrawerItem from './components/DrawerItem'
import Colors from '@constants/Colors'
import ZnzkviBa from '@components/ZnzkviBa'
import useDrawerStore from '@zustand/drawerManagement/store'
import { selectSetCurrentDrawerTab } from '@zustand/drawerManagement/selectors'
import { scaleByHeight } from '@constants/Scaling'
import useLogout from '@hooks/useLogout'
import useGlobalStore from '@zustand/global/store'
import useAuthStore from '@zustand/auth/store'

interface Props {
    postaviOnModalCloseRef: (fn: () => void) => void
}
const MainPage = ({ postaviOnModalCloseRef }: Props) => {
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)
    const { setDeleteAccountPressed } = useGlobalStore()
    const { hasToken } = useAuthStore()
    const logout = useLogout()
    return (
        <Container style={localStyles.horizontalPadding}>
            <View style={localStyles.flexOne}>
                <View style={localStyles.alignItems}>
                    <RoundButton
                        onPress={() => {
                            setCurrentDrawerTab('none')
                        }}
                        icon={
                            <SvgIcons.XIcon
                                height={scaleByHeight(34)}
                                width={scaleByHeight(34)}
                            />
                        }
                        innerStyle={{ backgroundColor: Colors.red }}
                    />
                </View>
                <Svgs.ZnzkviText />
                <Divider size={70} />
                {hasToken && (
                    <>
                        <DrawerItem
                            title="Naslovna"
                            onPress={() => {
                                setCurrentDrawerTab('none')
                            }}
                        />

                        <View style={localStyles.horizontalLine} />
                        <Divider size={35} />
                    </>
                )}
                <DrawerItem
                    title="Pravila privatnosti"
                    onPress={() => {
                        setCurrentDrawerTab('privacy')
                    }}
                />
                <DrawerItem
                    title="Uslovi korištenja"
                    largerDivider
                    onPress={() => {
                        setCurrentDrawerTab('terms')
                    }}
                />
                <View style={localStyles.horizontalLine} />
                <Divider size={35} />
                <DrawerItem
                    title="Pravila kviza"
                    onPress={() => {
                        setCurrentDrawerTab('rules')
                    }}
                />
                <DrawerItem
                    title="Partneri"
                    onPress={() => {
                        setCurrentDrawerTab('partners')
                    }}
                />
                <DrawerItem
                    title="Impressum"
                    onPress={() => {
                        setCurrentDrawerTab('impressum')
                    }}
                />
                {hasToken && (
                    <DrawerItem
                        title="Logout"
                        onPress={() => {
                            logout()
                            setCurrentDrawerTab('none')
                        }}
                    />
                )}
                {hasToken && (
                    <DrawerItem
                        title="Obriši nalog"
                        onPress={() => {
                            setCurrentDrawerTab('none')
                            postaviOnModalCloseRef(() => {
                                setDeleteAccountPressed(true)
                            })
                        }}
                    />
                )}
            </View>
            <ZnzkviBa />
        </Container>
    )
}

const localStyles = StyleSheet.create({
    horizontalLine: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.lesserBlack
    },
    horizontalPadding: {
        paddingHorizontal: 20
    },
    alignItems: {
        alignItems: 'flex-end',
        paddingTop: 5
    },
    flexOne: {
        flex: 1
    }
})
export default MainPage
