import React, { useState, useEffect } from 'react'
import { Text, StyleSheet } from 'react-native'
import ColorTheme from '../colors'
import { validateScannedQRCodeForTemplate } from 'helpers/restApi'
import CenterChildrenOnBackground from 'components/CenterChildrenOnBackground'
import Fonts from 'constants/Fonts'
import { useSelector, useDispatch } from '../hooks/reduxHooks'
import { setScannedAlbumCode } from 'redux/actions/uploadActions'
import checkConnection from 'helpers/checkConnection'

const ValidateBarcode = ({ navigation, route }: any) => {

    const dispatch = useDispatch()

    const { scannedAlbumCode } = useSelector(state => state.upload)
    
    const { albumCode, onSuccess, isFromSuccess } = route.params

    const [albumCodeToUse, setAlbumCodeToUse] = useState(isFromSuccess ? albumCode : scannedAlbumCode)

    const validateQRCode = async () => {
        if (await checkConnection()) {
            validateScannedQRCodeForTemplate(
                albumCodeToUse,
                () => {
                    onSuccess(albumCodeToUse)

                },
                (error: any) => {
                    navigation.navigate('Failure', {
                        callBack: () => {
                            dispatch(setScannedAlbumCode(''))
                            navigation.navigate('CapturePhoto', {
                                linkMoreQR: true
                            })
                        },
                        title: 'Failure!',
                        subtitle: 'The QR code could not be linked!',
                        buttonText: 'Rescan'
                    })
                }
            )
        } else {
            const barcodeValidatorRegEx = /^@{1}[^\s][\w-]+$/

            if (barcodeValidatorRegEx.test(albumCodeToUse)) {
                onSuccess(scannedAlbumCode)
            } else {
                navigation.navigate('Failure', {
                    callBack: () => {
                        dispatch(setScannedAlbumCode(''))
                        navigation.navigate('CapturePhoto', {
                            linkMoreQR: true
                        })
                    },
                    title: 'Failure!',
                    subtitle: 'The QR code could not be linked!',
                    buttonText: 'Rescan'
                })
            }
        }
    }

    useEffect(() => {
        if (albumCodeToUse === null || albumCodeToUse === '') {
            setAlbumCodeToUse(albumCode)
        }

        validateQRCode()
    }, [])

    return (
        <CenterChildrenOnBackground>
            <Text style={styles.text}>Validating...</Text>
            
        </CenterChildrenOnBackground>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: ColorTheme.PRIMARY_COLOR_1,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 26,
        fontFamily: Fonts.PoppinsSemiBold,
        color: ColorTheme.WHITE
    },
    message: {
        color: '#fff',
        fontSize: 20
    },
    activityIndicator: {
        paddingTop: 10
    },
    confirmationButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})

export default ValidateBarcode
