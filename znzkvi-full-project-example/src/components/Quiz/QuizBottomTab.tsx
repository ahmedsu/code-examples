import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Row from '../Row'
import SquareButton from '@components/SquareButton'
import SvgIcons from '@assets/svgs/icons'
import Colors from '@constants/Colors'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import { AppStackNavigationProp } from '@navigation/AppStack'
import { useNavigation } from '@react-navigation/native'
import Routes from '@navigation/Routes'
import useGlobalStore from '@zustand/global/store'
import ConfirmationModal from './ConfirmationModal'

interface Props {
    // pause?: () => void
    // unpause?: () => void
    endQuizFn: (didUserQuit?: boolean) => void
}
const QuizBottomTab = ({ endQuizFn }: Props) => {
    const navigation = useNavigation<AppStackNavigationProp>()
    const { setQuizActive } = useGlobalStore()
    const [openEndModal, setOpenEndModal] = useState(false)
    const leaveQuiz = () => {
        setQuizActive(false)
        navigation.navigate(Routes.AppStack.Home)
    }

    return (
        <Row style={localStyles.container}>
            <SquareButton
                onPress={() => {
                    setOpenEndModal(true)
                    // pause?.() //uncoment this to pause animation when end menu is opened
                }}
                icon={
                    <SvgIcons.XVerticalLong
                        width={scaleByWidth(27)}
                        height={scaleByHeight(41)}
                    />
                }
                backgroundColor={Colors.white}
            />
            <ConfirmationModal
                onPress={() => {
                    endQuizFn(true)
                    leaveQuiz()
                }}
                onBackdropPress={(val: boolean) => {
                    setOpenEndModal(val)
                    // unpause?.()
                }}
                isVisible={openEndModal}
            />
        </Row>
    )
}

const localStyles = StyleSheet.create({
    container: {
        // justifyContent: 'space-between',
        justifyContent: 'center',
        width: '100%'
    }
})

export default QuizBottomTab
