import colors from 'colors'
import { Button, CenterChildrenOnBackground, Divider } from 'components'
import Fonts from 'constants/Fonts'
import React, { useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Navigation, Route } from 'types/Index'
import {
    uploadPhotoMultiplePhotos,
    uploadPhotosInPending
} from 'helpers/uploadService'
import checkConnection from 'helpers/checkConnection'
import { useSelector } from '../hooks/reduxHooks'
import Orientation from 'react-native-orientation-locker'

interface Props {
    route: Route
    navigation: Navigation
}

interface RouteParams {
    isFromLinkMore?: boolean
    confirmPicture: () => Promise<void>
    retakePicture: () => void
    linkMoreQRCode: () => void
}

const NiceWork = ({ navigation, route }: Props) => {
    const { isFromLinkMore, confirmPicture, retakePicture, linkMoreQRCode } =
        route.params as RouteParams
    const { autoProcessPendingQueue } = useSelector(state => state.settings)

    const lockOrient = () => {
        Orientation.lockToPortrait()
    }

    useEffect(() => {
        Orientation.addOrientationListener(lockOrient)

        return () => {
            Orientation.removeOrientationListener(lockOrient)
        }
    }, [])

    const setData = async () => {
        uploadPhotoMultiplePhotos()
    }

    return (
        <CenterChildrenOnBackground>
            <View style={localStyles.container}>
                <Text style={localStyles.title}>Nice work!</Text>
                <Divider />
                <Text style={localStyles.subheader}>
                    Click <Text style={localStyles.italic}>Save & Finish </Text>
                    below to add your photo to the process queue or take another
                    photo linked to this QR code.
                </Text>
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
                    onPress={async () => {
                        await confirmPicture()
                        setData()
                    }}>
                    Save & Finish
                </Button>
                <Divider size={20} />

                <Pressable
                    onPress={() => {
                        linkMoreQRCode()
                        navigation.navigate('CapturePhoto', {
                            isFromNiceWork: true,
                            linkMoreQRFromSuccess: true,
                            type: 'NiceWork'
                        })
                    }}>
                    <Text style={localStyles.linkQRCodesText}>
                        Link More QR Codes
                    </Text>
                </Pressable>
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

export default NiceWork
