import { View, StyleSheet } from 'react-native'
import React from 'react'
import Svgs from '@assets/svgs'
import Colors from '@constants/Colors'
import RectangularButton from '@components/RectangularButton'
import ZnzkviBa from '@components/ZnzkviBa'
import Text from '@components/Text'
import Divider from '@components/Divider'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppStackNavigationProp, AppStackParams } from '@navigation/AppStack'
import Routes from '@navigation/Routes'
import { gameplay } from '@helpers/loadSounds'
import useGlobalStore from '@zustand/global/store'
import useCreateQuiz from '@hooks/api/useCreateQuiz'

const Success = () => {
    const route = useRoute<RouteProp<AppStackParams, 'Success'>>()
    const navigation = useNavigation<AppStackNavigationProp>()
    const { setCurrentlyPlaying } = useGlobalStore()
    const { createQuiz } = useCreateQuiz()
    return (
        <View style={localStyles.container}>
            {route.params.correct_answers <= 3 ? (
                <Svgs.OfirasSe
                    width={scaleByWidth(256)}
                    height={scaleByHeight(369)}
                    preserveAspectRatio="none"
                />
            ) : (
                <Svgs.Bravo
                    width={scaleByWidth(256)}
                    height={scaleByHeight(369)}
                    preserveAspectRatio="none"
                />
            )}
            <View style={localStyles.parentContainer}>
                <View style={localStyles.horizontalLine} />
                <View style={localStyles.svgContainer}>
                    <Svgs.SuccessOdgovoriContainer
                        preserveAspectRatio="none"
                        style={{ ...StyleSheet.absoluteFillObject }}
                    />
                    <Text fs={96} color={Colors.white}>
                        {route.params.correct_answers}/7
                    </Text>
                </View>
                <View style={localStyles.horizontalLine} />
            </View>
            <View style={localStyles.fullWidth}>
                <RectangularButton
                    title="Novi kviz"
                    size="small"
                    onPress={async () => {
                        const res = await createQuiz()
                        if (res.code === '0000') {
                            setCurrentlyPlaying(gameplay)
                            navigation.navigate(Routes.AppStack.Home)
                            navigation.navigate(Routes.AppStack.GetReady, {
                                quizData: res
                            })
                        }
                    }}
                />
                <Divider size={20} />
                <RectangularButton
                    title="Naslovna"
                    size="small"
                    onPress={() => {
                        navigation.navigate(Routes.AppStack.Home)
                    }}
                />
            </View>
            <ZnzkviBa />
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    svgContainer: {
        width: 257,
        height: 125,
        alignItems: 'center',
        justifyContent: 'center'
    },
    parentContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    horizontalLine: {
        height: 4,
        flex: 1,
        backgroundColor: Colors.lesserBlack
    },
    fullWidth: {
        width: '100%',
        paddingHorizontal: 20
    }
})

export default Success
