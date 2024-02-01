import { View, StyleSheet } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import Colors from '@constants/Colors'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import Text from '@components/Text'
import SquareButton from '@components/SquareButton'
import Row from '@components/Row'
import Divider from '@components/Divider'
import SvgIcons from '@assets/svgs/icons'

interface Props {
    isVisible?: boolean
    setIsVisible?: (val: boolean) => void
    onPress: () => void
    onBackdropPress?: (val: boolean) => void
}
const ConfirmationModal = ({
    isVisible = false,
    onPress,
    onBackdropPress,
    setIsVisible
}: Props) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => {
                setIsVisible?.(false)
                onBackdropPress?.(false)
            }}
            backdropColor={'rgba(0,0,0,0.7)'}
            style={localStyles.center}>
            <View style={localStyles.aroundContainer}>
                <View style={localStyles.container}>
                    <SvgIcons.InfoCoin
                        height={scaleByHeight(36)}
                        width={scaleByWidth(36)}
                    />
                    <Divider size={30} />
                    <Text
                        color={Colors.white}
                        fs={32}
                        letterSpacing={2}
                        style={localStyles.textCenter}>
                        nastavi igru?
                    </Text>
                    <Row style={localStyles.justifyCenter}>
                        <SquareButton
                            backgroundColor={Colors.red}
                            onPress={() => {
                                onPress()
                                onBackdropPress?.(false)
                            }}
                            icon={
                                <Text
                                    color={Colors.lesserBlack}
                                    fs={36}
                                    letterSpacing={2}>
                                    ne
                                </Text>
                            }
                        />
                        <Divider horizontal size={30} />
                        <SquareButton
                            onPress={() => {
                                setIsVisible?.(false)
                                onBackdropPress?.(false)
                            }}
                            icon={
                                <Text
                                    color={Colors.lesserBlack}
                                    fs={36}
                                    letterSpacing={2}>
                                    da
                                </Text>
                            }
                            backgroundColor={Colors.lightGreen}
                        />
                    </Row>
                    <Divider size={20} />
                </View>
            </View>
        </Modal>
    )
}

const localStyles = StyleSheet.create({
    container: {
        backgroundColor: Colors.red,
        height: '97%',
        width: '97%',
        borderRadius: 8,
        padding: 10,
        justifyContent: 'space-between'
    },
    aroundContainer: {
        backgroundColor: Colors.lesserBlack,
        borderRadius: scaleByHeight(10),
        height: '50%',
        width: '80%',

        borderTopRightRadius: 15,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    textCenter: {
        textAlign: 'center'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default ConfirmationModal
