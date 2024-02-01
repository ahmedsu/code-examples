import colors from 'colors'
import { Button, CenterChildrenOnBackground, Divider } from 'components'
import Fonts from 'constants/Fonts'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { setBottomTabs } from 'redux/actions/bottomTabActions'
import { useDispatch } from '../hooks/reduxHooks'

const Failure = ({ route }: any) => {
    const { callBack, title, subtitle, buttonText } = route.params

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setBottomTabs(false))
    }, [])

    return (
        <CenterChildrenOnBackground>
            <View style={localStyles.container}>
                <Text style={localStyles.title}>{title}</Text>
                <Divider />
                <Text style={localStyles.subheader}>{subtitle}</Text>
                <Divider size={20} />

                <Button
                    viewStyle={{
                        backgroundColor: colors.WHITE,
                        width: 'auto',
                        paddingHorizontal: 30
                    }}
                    textStyle={{
                        color: colors.SECONDARY_COLOR_3,
                        fontFamily: Fonts.PoppinsMedium,
                        fontWeight: '500'
                    }}
                    onPress={callBack}>
                    {buttonText}
                </Button>
            </View>
        </CenterChildrenOnBackground>
    )
}

const localStyles = StyleSheet.create({
    linkQRCodesText: {
        color: colors.WHITE,
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    title: {
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 24,
        color: colors.WHITE,
        textAlign: 'center'
    },
    subheader: {
        fontFamily: Fonts.PoppinsRegular,
        fontSize: 16,
        color: colors.WHITE,
        textAlign: 'center'
    },
    container: {
        width: '100%',
        padding: '18%',
        alignItems: 'center'
    },
    italic: {
        fontStyle: 'italic'
    }
})
export default Failure
