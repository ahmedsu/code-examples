import { View, StyleSheet, useWindowDimensions } from 'react-native'
import RoundButton from '@components/RoundButton'
import SvgIcons from '@assets/svgs/icons'
import RectangularButton from '@components/RectangularButton'
import ZnzkviBa from '@components/ZnzkviBa'
import useDrawerStore from '@zustand/drawerManagement/store'
import { selectSetCurrentDrawerTab } from '@zustand/drawerManagement/selectors'
import Divider from '@components/Divider'
import { useEffect, useMemo, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { heightScale, widthScale } from '@constants/Scaling'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { AppStackNavigationProp } from '@navigation/AppStack'
import Routes from '@navigation/Routes'
import useGlobalStore from '@zustand/global/store'
import { gameplay, intro } from '@helpers/loadSounds'
import useCreateQuiz from '@hooks/api/useCreateQuiz'

const BUTTONS_CONTAINER = 350 * heightScale
const ZNZKVI_BA_SIZE = 60
const SETTINGS_BUTTON_HEIGHT = 60 * heightScale
const Home = () => {
    const insets = useSafeAreaInsets()
    const navigation = useNavigation<AppStackNavigationProp>()
    const TOP_MARGIN = insets.top
    const BOTTOM_MARGIN = insets.bottom
    const isFocused = useIsFocused()
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)
    const { width, height } = useWindowDimensions()
    const { setCurrentlyPlaying } = useGlobalStore()
    const setCurrentlyPlayingRef = useRef(setCurrentlyPlaying)
    const { createQuiz } = useCreateQuiz()

    setCurrentlyPlayingRef.current = setCurrentlyPlaying
    const logoSizeWithAspectRatioWidthBased = useMemo(() => {
        return { width: (width - 40) * 0.9, height: (width - 40) * 0.9 }
    }, [width])
    useEffect(() => {
        if (isFocused) setCurrentlyPlayingRef.current(intro)
    }, [isFocused])
    const logoSizeWithAspectRatio = useMemo(() => {
        const heightLeft =
            height -
            BUTTONS_CONTAINER -
            ZNZKVI_BA_SIZE -
            TOP_MARGIN -
            BOTTOM_MARGIN -
            SETTINGS_BUTTON_HEIGHT
        const final =
            heightLeft > logoSizeWithAspectRatioWidthBased.height
                ? logoSizeWithAspectRatioWidthBased.height
                : heightLeft
        return { width: final, height: final }
    }, [logoSizeWithAspectRatioWidthBased, height, TOP_MARGIN, BOTTOM_MARGIN])

    return (
        <View style={localStyles.flexOne}>
            <View style={localStyles.flexOneWithCenter}>
                <Divider size={5} />
                <View style={localStyles.fullWidth}>
                    <RoundButton
                        icon={
                            <SvgIcons.BurgerMenu
                                width={36 * heightScale}
                                height={26 * heightScale}
                            />
                        }
                        onPress={() => setCurrentDrawerTab('main')}
                    />
                </View>

                <SvgIcons.Logo
                    width={logoSizeWithAspectRatio.width}
                    height={logoSizeWithAspectRatio.height}
                />
                <Divider size={30} />
                <RectangularButton
                    onPress={async () => {
                        const res = await createQuiz()
                        if (res.code === '0000') {
                            setCurrentlyPlaying(gameplay)
                            navigation.navigate(Routes.AppStack.GetReady, {
                                quizData: res
                            })
                        }
                    }}
                    //  onPress={hideBottomInset} //INset is hidden in getReady screen for play
                    title="IGRAJ"
                    icon={
                        <SvgIcons.Play
                            width={26 * widthScale}
                            height={32 * heightScale}
                        />
                    }
                />
                <Divider size={20} />
                <RectangularButton
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Profile)
                    }}
                    title="PROFIL"
                    icon={
                        <SvgIcons.User
                            width={37 * widthScale}
                            height={43 * heightScale}
                        />
                    }
                />
                <Divider size={20} />
                <RectangularButton
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Settings)
                    }}
                    title="POSTAVKE"
                    icon={
                        <SvgIcons.Settings
                            width={46 * widthScale}
                            height={44 * heightScale}
                        />
                    }
                />
                <Divider size={20} />
                <RectangularButton
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Statistics)
                    }}
                    title="STATISTIKE"
                    icon={
                        <SvgIcons.Ranking
                            height={47 * heightScale}
                            width={46 * widthScale}
                        />
                    }
                />
            </View>
            <ZnzkviBa />
        </View>
    )
}

const localStyles = StyleSheet.create({
    flexOne: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    fullWidth: {
        width: '100%',
        alignItems: 'flex-end'
    },
    flexOneWithCenter: {
        alignItems: 'center',
        flex: 1
    }
})

export default Home
