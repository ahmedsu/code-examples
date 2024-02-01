import React, { useState, useEffect } from 'react'
import {
    View,
    Image,
    StyleSheet,
    Text,
    Platform,
    ActivityIndicator
} from 'react-native'
import FullWidthImage from '../components/FullWidthImage'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Orientation from 'react-native-orientation-locker'
import RNFS from 'react-native-fs'
import { useSelector, useDispatch } from '../hooks/reduxHooks'
import { setScannedAlbumCode } from 'redux/actions/uploadActions'
import { setBottomTabs } from 'redux/actions/bottomTabActions'
import { photoStoragePath } from 'constants/UploadConstants'
import Routes from 'navigation/Routes'
import { NoTemplateView } from 'components'
import { useIsFocused } from '@react-navigation/native'
import colors from 'colors'
import { linkAnotherQrToPhoto } from 'helpers/restApi'
import { setTemplate } from 'redux/actions/templateActions'
import { showMessage } from 'react-native-flash-message'

export const SAFE_TIMEOUT = 50
const CapturePhoto = ({ navigation, route }: any) => {
    const [orientation, setOrientation] = useState('PORTRAIT')

    const { scannedAlbumCode, selectedQueueItem } = useSelector(
        state => state.upload
    )
    const { template } = useSelector(state => state.template)
    const { photoQuality } = useSelector(state => state.settings)

    const isFocused = useIsFocused()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setBottomTabs(false))
        setTimeout(() => {
            if (route.params?.takeAnotherPhoto) {
                onPressTakePhoto()
            } else if (route.params?.linkMoreQR) {
                onPressScanQRCode()
            } else if (route.params?.linkMoreQRFromSuccess) {
                onPressScanLinkMoreQRFromSuccess()
            }
        }, SAFE_TIMEOUT)
    }, [route.params])

    useEffect(() => {
        Orientation.unlockAllOrientations()
        if (template?.name != undefined) {
            onPressScanQRCode()
        }
    }, [template])
    useEffect(() => {
        if (isFocused) {
            template?.name === undefined
                ? dispatch(setBottomTabs(true))
                : dispatch(setBottomTabs(false))
        }
    }, [isFocused])

    const onPressChooseTemplate = () => {
        navigation.navigate(Routes.TemplateSelectorStack.title, {
            screen: Routes.TemplateSelectorStack.ProjectSelector
        })
    }

    const onPressTakePhoto = () => {
        dispatch(setBottomTabs(false))
        setTimeout(() => {
            navigation.navigate('Camera', {
                photoQuality: photoQuality,
                returnPhotoData: returnPhotoData,
                isBarCodeModeDisabled: true,
                isGreenScreen: isTemplateGreenScreen(),
                isAlbumCodeMode: hasAlbumCode(),
                customGoBack: resetToCapturePhotoPage(),
                shouldCameraBeActive: true
            })
        }, SAFE_TIMEOUT)
    }

    const onPressScanQRCode = () => {
        if (scannedAlbumCode != '') {
            // Reset the album code if the user tapped the button when an album code already exists

            dispatch(setScannedAlbumCode(''))
        }
        dispatch(setBottomTabs(false))
        setTimeout(() => {
            navigation.navigate('Camera', {
                returnBarCodeData: returnBarCodeData,
                isBarCodeOnlyMode: true,
                shouldCameraBeActive: true,
                isBarCodeModeDisabled: false,
                customGoBack: () => {
                    if (template?.templateGroupTemplates === []) {
                        dispatch(setBottomTabs(true))
                        navigation.navigate(
                            Routes.TemplateSelectorStack.title,
                            {
                                screen: Routes.TemplateSelectorStack
                                    .ProjectSelector
                            }
                        )
                    } else {
                        dispatch(setBottomTabs(true))
                        navigation.navigate(
                            Routes.TemplateSelectorStack.title,
                            {
                                screen: Routes.TemplateSelectorStack
                                    .TemplateSelector,
                                params: {
                                    templates: template?.templateGroupTemplates,
                                    projectName: template?.name
                                }
                            }
                        )
                    }
                }
            })
        }, SAFE_TIMEOUT)
    }

    const onPressScanLinkMoreQRFromSuccess = () => {
        dispatch(setBottomTabs(false))
        setTimeout(() => {
            navigation.push('Camera', {
                returnBarCodeData: returnBarCodeDataWhenLinkingMore,
                isBarCodeOnlyMode: true,
                shouldCameraBeActive: true,
                isBarCodeModeDisabled: false,
                isLinkMoreQrCodes: true,
                customGoBack: () => {
                    if (route.params?.type === 'NiceWork') {
                        dispatch(setBottomTabs(false))
                        navigation.navigate('NiceWork', {
                            confirmPicture: () => {
                                dispatch(setBottomTabs(true))
                                setTimeout(() => {
                                    navigation.navigate(
                                        Routes.TabNavigator.Home,
                                        {
                                            screen: Routes.HomeStack.Home
                                        }
                                    )
                                }, SAFE_TIMEOUT)
                            },
                            retakePicture: () => {
                                navigation.navigate(
                                    Routes.CapturePhotoStack.CapturePhoto,
                                    {
                                        linkMoreQR: true
                                    }
                                )
                            }
                        })
                    } else {
                        dispatch(setBottomTabs(true))
                        navigation.navigate(Routes.SettingsStack.title, {
                            screen: Routes.SettingsStack.UploadDetail,
                            params: {
                                title: 'Successful Uploads'
                            }
                        })
                    }
                }
            })
        }, SAFE_TIMEOUT)
    }

    const onRescanChosen = () => {
        dispatch(setScannedAlbumCode(''))
        dispatch(setBottomTabs(false))
        setTimeout(() => {
            navigation.navigate('Camera', {
                returnBarCodeData: returnBarCodeData,
                isBarCodeOnlyMode: true,
                shouldCameraBeActive: true
            })
        }, SAFE_TIMEOUT)
    }

    const forceSuccess = () => {
        dispatch(setBottomTabs(false))
        setTimeout(() => {
            navigation.navigate('NiceWork', {
                confirmPicture: async () => {
                    await returnPhotoData()
                },
                retakePicture: () => {}
            })
        }, SAFE_TIMEOUT)
    }

    const onImageSizeChange = ({ width, height }: any) => {
        imageHeight = height
    }

    const resetToCapturePhotoPage = () => {
        //dispatch(setScannedAlbumCode(''))

        navigation.navigate('CapturePhoto')
    }

    const isTemplateGreenScreen = () => {
        //TODO: Remove this name check
        return template?.isGreenScreen || template?.name === 'Snapt Test 2'
    }

    const hasAlbumCode = () => {
        return scannedAlbumCode != null && scannedAlbumCode != ''
    }

    const returnBarCodeData = (event: { data: any }) => {
        Orientation.lockToPortrait()
        setBottomTabs(false)
        // This is to prevent multiple scans on the same code before processing has completed

        if (hasAlbumCode()) {
            dispatch(setScannedAlbumCode(''))
            //   return
        }
        // Grab just the last part of the scanned URL to use as the AlbumCode
        const rawAlbumCode = event.data
        const components = rawAlbumCode.split('/')
        const AlbumCode = components[components.length - 1]

        dispatch(setScannedAlbumCode(AlbumCode))

        navigation.push('ValidateBarcode', {
            albumCode: scannedAlbumCode,
            onSuccess: () => onPressTakePhoto(),
            onForceSuccess: () => forceSuccess,
            onRescanChosen: () => onRescanChosen,
            onCancelChosen: () => resetToCapturePhotoPage
        })
    }

    const linkAnotherQrToPhotoAfterValidation = (albumCode: any) => {
        const imageCode = selectedQueueItem.response.json.photoCode
        linkAnotherQrToPhoto(
            imageCode,
            albumCode,
            () => {
                dispatch(setBottomTabs(false))
                navigation.navigate('NiceWork', {
                    isFromLinkMore:
                        route?.params?.type === 'NiceWork' ? false : true,
                    confirmPicture: () => {
                        dispatch(setBottomTabs(true))
                        setTimeout(() => {
                            navigation.navigate(Routes.TabNavigator.Home, {
                                screen: Routes.HomeStack.Home
                            })
                        }, SAFE_TIMEOUT)
                    }
                })

                showMessage({
                    message: 'QR code successfully linked!',
                    type: 'success'
                })
            },
            (error: any) => {
                if (route?.params.type !== 'NiceWork') {
                    navigation.navigate(Routes.SettingsStack.title, {
                        screen: Routes.SettingsStack.UploadDetail,
                        params: {
                            title: 'Successful Uploads'
                        }
                    })
                    dispatch(setBottomTabs(true))
                } else {
                    navigation.navigate(Routes.TabNavigator.Home, {
                        screen: Routes.HomeStack.Home
                    })
                }

                showMessage({
                    message: 'QR code could not be linked!',
                    type: 'danger'
                })
            }
        )
    }

    const returnBarCodeDataWhenLinkingMore = async (event: { data: any }) => {
        // Grab just the last part of the scanned URL to use as the AlbumCode
        const rawAlbumCode = event.data
        const components = rawAlbumCode.split('/')
        const AlbumCode = components[components.length - 1]

        dispatch(setScannedAlbumCode(AlbumCode))

        navigation.push('ValidateBarcode', {
            isFromSuccess: true,
            albumCode: AlbumCode,
            onSuccess: (albumCode: any) =>
                linkAnotherQrToPhotoAfterValidation(albumCode),
            onForceSuccess: () => forceSuccess,
            onRescanChosen: () => onRescanChosen,
            onCancelChosen: () => resetToCapturePhotoPage
        })
    }

    const returnPhotoData = async (data: { uri: string; fileName: any }) => {
        // If there is a scanned AlbumCode, then we should queue it,
        // Otherwise we should automatically upload and continue to results
        const photoDateTime = new Date().toISOString()

        // Use RegEx to replace everything up until the last "/" in the existing path with ""
        // (Leaving just the filename from the cache directory)
        let cachePath = data.uri

        const fileName = data.uri.replace(new RegExp('^.*(/)'), '')
        const permanentStoragePath = photoStoragePath + fileName

        if (Platform.OS !== 'ios') {
            cachePath = cachePath.replace('file://', '')
        }
        // Move the temporary file to a permanent storage location, then proceed with upload / queue
        if (await RNFS.exists(cachePath)) {
            await RNFS.moveFile(cachePath, permanentStoragePath)
        }
        return fileName
    }

    if (template?.name === undefined) {
        return <NoTemplateView onPress={onPressChooseTemplate} />
    }

    let albumCodeText = null

    if (hasAlbumCode()) {
        albumCodeText = (
            <Text style={styles.albumCodeText}>{scannedAlbumCode}</Text>
        )
    }
    const imageCacheBustString = new Date().getMilliseconds()
    let imageView = (
        <FullWidthImage
            source={{
                uri: template?.sampleImageUrl + '?' + imageCacheBustString
            }}
            onSizeChange={onImageSizeChange}
        />
    )

    // TODO: Remove the text "(only available for iOS)" once we have implemented
    // GreenScreen for Android
    const greenScreenIcon = !template?.isGreenScreen ? null : (
        <View style={{ paddingTop: 10, flexDirection: 'row' }}>
            <MaterialCommunityIcon
                style={styles.greenScreenIcon}
                name={'projector-screen'}
                size={25}
                color={'#82A963'}
            />
            <Text style={{ alignSelf: 'center' }}>
                &nbsp;GREEN SCREEN ENABLED
            </Text>
        </View>
    )

    if (orientation != 'PORTRAIT') {
        imageView = (
            <Image
                style={{ flex: 0.5, height: undefined, width: undefined }}
                resizeMode="contain"
                source={{
                    uri: template?.sampleImageUrl + '?' + imageCacheBustString
                }}
            />
        )
    }

    return (
        <View style={styles.mainView}>
            <ActivityIndicator size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noTemplateView: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    noTemplateText: {
        fontSize: 38,
        textAlign: 'center'
    },
    templateContainer: {
        flex: 1
    },
    sampleImage: {
        height: 200
    },
    albumCodeText: {
        color: '#000'
    },
    headerText: {
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
        fontSize: 28,
        textAlign: 'center'
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    scanButtonContainer: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10
    },
    scanQRButton: {},
    takePhotoButtonContainer: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10
    },
    takePhotoButton: {}
})

export default CapturePhoto
