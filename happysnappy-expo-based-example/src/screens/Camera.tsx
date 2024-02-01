import React, { useEffect, useRef, useState } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    StyleSheet,
    BackHandler,
    Alert,
    useWindowDimensions
} from 'react-native'

import { Camera, CameraType } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'

import Icon from 'react-native-vector-icons/FontAwesome'
import RetakeIcon from '@assets/icons/retake-camera.svg'
import Orientation, { OrientationType } from 'react-native-orientation-locker'
import * as Animatable from 'react-native-animatable'
import { useSelector, useDispatch } from '../hooks/reduxHooks'

import { setBottomTabs } from 'redux/actions/bottomTabActions'
import { Navigation, Route } from 'types/Index'
import CameraHeader from 'components/CameraHeader'
import { Button } from 'components'
import colors from '../colors'
import Fonts from 'constants/Fonts'
import {
    setLastAdhocUpload,
    setLastAdhocUploadQueueId,
    setMultipleImagesToUpload,
    setScannedAlbumCode
} from 'redux/actions/uploadActions'
import Routes from 'navigation/Routes'
import { uploadPhoto, getMappedOrientation } from 'helpers/uploadService'
import RNFS from 'react-native-fs'
import { useIsFocused } from '@react-navigation/native'
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator'
import Loader from 'components/Loader'
import { setIsLoading } from 'redux/actions/loadingActions'
import { SAFE_TIMEOUT } from './CapturePhoto'
import { photoStoragePath } from 'constants/UploadConstants'
import store from 'redux/store'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'
import { hideMessage, showMessage } from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

const vertical = ['PORTRAIT', 'FACE-UP', 'FACE-DOWN', 'PORTRAIT-UPSIDEDOWN']

const win = Dimensions.get('window')
const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity)

const flashModeOrder = {
    off: 'auto',
    auto: 'torch',
    torch: 'off'
}

interface Props {
    route: Route
    navigation: Navigation
}
const CameraScreen = ({ route, navigation }: Props) => {
    const dispatch = useDispatch()

    const {
        photoQuality = 0.25,
        isGreenScreen = false,
        returnPhotoData = async (photoData: any) => {},
        isAlbumCodeMode = false,
        returnBarCodeData = () => {},
        customGoBack = () => {},
        isBarCodeOnlyMode,
        isBarCodeModeDisabled,
        isLinkEnabled,
        shouldCameraBeActive = true,
        isLinkMoreQrCodes
    } = { ...route.params }

    const cameraRef = useRef<Camera | null>(null)
    const [flash, setFlash] = useState('off')
    const [zoom] = useState(0)
    const [autoFocus] = useState('on')
    const [depth] = useState(0.0)
    const [type, setType] = useState('back')
    const [whiteBalance] = useState('auto')
    const [ratio] = useState('4:3')
    const [photoData, setPhotoData] = useState(null)
    const [photoOrientation, setPhotoOrientation] = useState('')
    const photoOrientationShared = useSharedValue('')
    const [shouldShowTakeAnotherView, setShouldShowTakeAnotherView] =
        useState(false)
    const [isProcessingGreenScreen, setIsProcessingGreenScreen] =
        useState(false)

    const currentOrientation = useSharedValue<OrientationType | string>(
        'PORTRAIT'
    )
    const [currentOrientationForHeader, setCurrentOrientationForHeader] =
        useState<OrientationType | string>('PORTRAIT')

    const [responsiveStyles, setResponsiveStyles] = useState(portraitStyles)

    const [isBarCodeMode, setIsBarCodeMode] = useState(isBarCodeOnlyMode)
    const [isBarCodeDisabled, setIsBarCodeDisabled] = useState(
        isBarCodeModeDisabled
    )
    const [forceBarCode, setForceBarCode] = useState(false)
    const [isBarCodeScanned, setIsBarCodeScanned] = useState(false)
    const [hasPermission, setHasPermission] = useState(null)

    const { scannedAlbumCode } = useSelector(state => state.upload)

    const { template } = useSelector(state => state.template)
    const { user } = useSelector(state => state.user)
    const [width, setWidth] = useState<number>()
    const [height, setHeight] = useState<number>()
    const { height: scrHeight, width: scrWidth } = useWindowDimensions()

    const isFocused = useIsFocused()
    const retBarcodeData = evt => {
        returnBarCodeData?.(evt)

        setScannedAlbumCode(evt.data)
    }
    const getPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        setHasPermission(status === 'granted')
    }

    const setOrientation = orientation => {
        if (orientation === '') {
            return
        }
        if (orientation === 'UNKNOWN') orientation = 'PORTRAIT'
        /*vertical.includes(orientation) || orientation === ''
            ? setResponsiveStyles(portraitStyles)
            : setResponsiveStyles(landscapeStyles)*/

        currentOrientation.value = orientation
        setCurrentOrientationForHeader(orientation)
    }

    useEffect(() => {
        //const initial = Orientation.getInitialOrientation()
        Orientation.lockToPortrait()

        if (isLinkMoreQrCodes === true) {
            setForceBarCode(true)
        }
        getPermission()
        dispatch(setBottomTabs(false))

        Orientation.addDeviceOrientationListener(setOrientation)
        return () => {
            Orientation.removeDeviceOrientationListener(setOrientation)
        }
    }, [])

    const iconsRotation = useAnimatedStyle(() => {
        // Zasto ovdje ne dobije currentOrienation odmah?

        if (currentOrientation.value === 'LANDSCAPE-RIGHT') {
            return {
                transform: [{ rotate: withTiming('-90deg') }]
            }
        } else if (currentOrientation.value === 'LANDSCAPE-LEFT') {
            return {
                transform: [{ rotate: withTiming('90deg') }]
            }
        }
        return {
            transform: [{ rotate: withTiming('0deg') }]
        }
    }, [currentOrientation.value])

    const imageRotation = useAnimatedStyle(() => {
        if (currentOrientation.value === 'LANDSCAPE-RIGHT') {
            return {
                transform: [
                    { rotateZ: withTiming('-90deg') },
                    {
                        scale:
                            photoOrientation === 'PORTRAIT'
                                ? withTiming(1 / 1.33)
                                : withTiming(1.33)
                    }
                ]
            }
        } else if (currentOrientation.value === 'LANDSCAPE-LEFT') {
            return {
                transform: [
                    { rotateZ: withTiming('90deg') },
                    {
                        scale:
                            photoOrientation === 'PORTRAIT'
                                ? withTiming(1 / 1.33)
                                : withTiming(1.33)
                    }
                ]
            }
        }
        return {
            transform: [
                { rotateZ: withTiming('0deg') },
                {
                    scale: withTiming(1)
                }
            ]
        }
    })

    const setThePhotoData = dataFromPhoto => {
        setTimeout(() => {
            setPhotoData(dataFromPhoto)
        }, 500)
    }

    const lockedBackHandler = () => true
    const unlockedBackHandler = () => false
    useEffect(() => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            isFocused ? lockedBackHandler : unlockedBackHandler
        )
        return () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                isFocused ? lockedBackHandler : unlockedBackHandler
            )
        }
    }, [isFocused])

    // we set the current orientation on orientation change

    const toggleFacing = () => {
        const temp = type === 'back' ? CameraType.front : CameraType.back
        setType(temp)
    }

    const toggleFlash = () => {
        setFlash(flashModeOrder[flash])
    }
    const takePicture = async () => {
        let photoOrient = currentOrientation.value

        if (cameraRef.current) {
            const options = {
                quality: photoQuality, // | 0.5,
                skipProcessing: true
            }
            dispatch(setIsLoading(true))

            cameraRef.current
                .takePictureAsync(options)
                .then(async data => {
                    let dataFromPhoto = data

                    photoOrient = await new Promise(resolve => {
                        Orientation.getDeviceOrientation(orientation => {
                            setPhotoOrientation(orientation)
                            photoOrientationShared.value = orientation
                            resolve(orientation)
                        })
                    })

                    if (photoOrient === 'PORTRAIT-UPSIDEDOWN') {
                        const manipResult = await manipulateAsync(
                            dataFromPhoto?.localUri || dataFromPhoto?.uri,
                            [{ rotate: 180 }],
                            { compress: 1, format: SaveFormat.PNG }
                        )
                        dataFromPhoto = manipResult
                    }

                    if (type !== 'back') {
                        dataFromPhoto = await manipulateAsync(
                            dataFromPhoto?.localUri || dataFromPhoto?.uri,
                            [{ rotate: 180 }, { flip: FlipType.Vertical }],
                            { compress: 1, format: SaveFormat.PNG }
                        )
                    }

                    if (Platform.OS === 'ios') {
                        setThePhotoData(dataFromPhoto)
                    } else {
                        setPhotoData(dataFromPhoto)
                    }

                    dispatch(setIsLoading(false))

                    //  }
                })
                .catch(err => {
                    Alert.alert('There was an issue. Please try again.')
                    dispatch(setIsLoading(false))
                })
        }
    }

    const retakePicture = () => {
        dispatch(setIsLoading(true))
        setTimeout(() => {
            setPhotoData(null)
        }, 500)
        dispatch(setIsLoading(false))
    }

    const takeAnotherPicture = async () => {
        const data = photoData
        const photoDateTime = new Date().toISOString()

        const templateName = store.getState().template.template.name

        // Use RegEx to replace everything up until the last "/" in the existing path with ""
        // (Leaving just the filename from the cache directory)
        let cachePath = data.uri

        const forcedFileName = data.uri.replace(new RegExp('^.*(/)'), '')
        const permanentStoragePath = photoStoragePath + forcedFileName

        if (Platform.OS !== 'ios') {
            cachePath = cachePath.replace('file://', '')
        }

        const projectId = store.getState().project.project?.id

        const moveFile = async () => {
            // Move the temporary file to a permanent storage location, then proceed with upload / queue
            if (await RNFS.exists(cachePath)) {
                RNFS.moveFile(cachePath, permanentStoragePath).then(
                    async () => {
                        data.fileName = forcedFileName

                        // Inform the user through a toast that the photo has been added to
                        // Pending Uploads and can be processed manually later

                        dispatch(
                            setMultipleImagesToUpload(
                                {
                                    TemplateGroupId: projectId.toString(),
                                    userId: user?.id,
                                    date: photoDateTime,
                                    templateCode: template?.code,
                                    albumCode: scannedAlbumCode,
                                    photoOrientation: photoOrientation,
                                    templateName: templateName,
                                    image: data,
                                    response: null
                                },
                                false
                            )
                        )
                    }
                )
            }
        }

        await moveFile()
        setShouldShowTakeAnotherView(false)
        setPhotoData(null)
    }

    const onPressGoBack = () => {
        if (customGoBack) {
            customGoBack()
        } else {
            dispatch(setBottomTabs(true))
            navigation.goBack()
        }
    }

    const uploadThePhoto = async (
        albumCodeFromValidate?: string | null | undefined
    ) => {
        let albumCodeToUse = scannedAlbumCode
        if (scannedAlbumCode === '') {
            albumCodeToUse = albumCodeFromValidate
        }
        if (isBarCodeScanned && forceBarCode) {
            return
        }
        const photoDateTime = new Date().toISOString()

        const templateCode = template?.code

        setIsBarCodeScanned(true)
        let fileName = await returnPhotoData(photoData)
        const templateName = store.getState().template.template.name
        const user = store.getState().user.user
        const keepImageFor = store.getState().settings.keepPhotosDurationIndex
        const mappedOrientation = getMappedOrientation(photoOrientation)

        const projectId = store.getState().project.project?.id.toString()

        const params: any = {
            userId: user?.id,
            date: photoDateTime,
            uploadDate: new Date().toISOString(),
            templateCode: templateCode,
            albumCode: albumCodeToUse,
            photoOrientation: mappedOrientation,
            image: { fileName },
            keepImageFor: keepImageFor,
            templateName: templateName,
            TemplateGroupId: projectId
        }
        const userE = store.getState().user.user.email
        if (fileName != undefined) {
            const temp = await AsyncStorage.getItem(`@${userE}-imagesToStore`)
            let asyncData = []
            if (temp) asyncData = JSON.parse(temp)

            asyncData.push(params)
            await AsyncStorage.setItem(
                `@${userE}-imagesToStore`,
                JSON.stringify(asyncData)
            )

            uploadPhoto(
                projectId,
                templateName,
                templateCode,
                albumCodeToUse,
                photoOrientation,
                photoDateTime,
                { fileName },
                (
                    uploadResults: object | null,
                    uploadQueueId: number | null
                ) => {
                    dispatch(setIsLoading(false))
                    dispatch(setLastAdhocUpload(uploadResults))
                    dispatch(setLastAdhocUploadQueueId(uploadQueueId))

                    //dispatch(setScannedAlbumCode(''))

                    setIsBarCodeScanned(false)
                    hideMessage()
                },
                (error: any) => {
                    dispatch(setIsLoading(false))
                    hideMessage()
                    navigation.navigate('Failure', {
                        callBack: () => {
                            dispatch(setScannedAlbumCode(''))
                            navigation.navigate('CapturePhoto', {
                                linkMoreQR: true
                            })
                        },
                        title: 'Failure!',
                        subtitle: `Don't panic. This is probably because you are not connected to the internet OR we could not connect to the server.
                        Your photo has been saved. You can try to re-upload it again manually later, by going to Settings > Failed. 
                        Click Save & Finish below or take another photo linked to this QR code. `,
                        buttonText: 'Take another'
                    })
                },
                false,
                'Camera'
            )
            return
        } else {
            const data = photoData
            // Use RegEx to replace everything up until the last "/" in the existing path with ""
            // (Leaving just the filename from the cache directory)
            let cachePath = data.uri
            const forcedFileName = data.uri.replace(new RegExp('^.*(/)'), '')
            const permanentStoragePath = photoStoragePath + forcedFileName
            if (Platform.OS !== 'ios') {
                cachePath = cachePath.replace('file://', '')
            }
            const moveFile = async () => {
                // Move the temporary file to a permanent storage location, then proceed with upload / queue
                if (await RNFS.exists(cachePath)) {
                    await RNFS.moveFile(cachePath, permanentStoragePath).then(
                        () => {
                            data.fileName = forcedFileName
                        }
                    )
                }
            }
            fileName = forcedFileName

            const paramsF: any = {
                userId: user?.id,
                date: photoDateTime,
                uploadDate: new Date().toISOString(),
                templateCode: templateCode,
                albumCode: albumCodeToUse,
                photoOrientation: mappedOrientation,
                image: { fileName },
                keepImageFor: keepImageFor,
                templateName: templateName,

                TemplateGroupId: projectId.toString()
            }

            const temp = await AsyncStorage.getItem(`@${userE}-imagesToStore`)
            let asyncData = []
            if (temp) asyncData = JSON.parse(temp)

            asyncData.push(paramsF)
            await AsyncStorage.setItem(
                `@${userE}-imagesToStore`,
                JSON.stringify(asyncData)
            )

            const uploadByForce = async () => {
                await moveFile()
                uploadPhoto(
                    projectId,
                    templateName,
                    templateCode,
                    scannedAlbumCode,
                    photoOrientation,
                    photoDateTime,
                    { fileName },
                    (
                        uploadResults: object | null,
                        uploadQueueId: number | null
                    ) => {
                        dispatch(setIsLoading(false))
                        dispatch(setLastAdhocUpload(uploadResults))
                        dispatch(setLastAdhocUploadQueueId(uploadQueueId))

                        //dispatch(setScannedAlbumCode(''))

                        setIsBarCodeScanned(false)
                        hideMessage()
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
                            subtitle: 'The photo could not be uploaded!',
                            buttonText: 'Take another'
                        })
                    },
                    false,
                    'Camera'
                )
            }
            uploadByForce()
        }
    }

    const didUserScanQr = () => {
        if (scannedAlbumCode === null || scannedAlbumCode === '') {
            if (type === CameraType.front) {
                toggleFacing()
            }

            setIsBarCodeMode(true)
            setIsBarCodeDisabled(false)
            setForceBarCode(true)
            renderCamera()
        } else {
            navigation.navigate('NiceWork', {
                confirmPicture: async () => {
                    showMessage({
                        message: 'Images are being uploaded in the backgound..',
                        type: 'default',
                        autoHide: false
                    })
                    await uploadThePhoto()
                    dispatch(setBottomTabs(true))
                    setTimeout(() => {
                        navigation.navigate(Routes.TabNavigator.Home, {
                            screen: Routes.HomeStack.Home
                        })
                    }, SAFE_TIMEOUT)
                },
                retakePicture: () => {
                    navigation.navigate('CapturePhoto', {
                        takeAnotherPhoto: true
                    })
                    takeAnotherPicture()
                },
                linkMoreQRCode: async () => {
                    showMessage({
                        message:
                            'Images are being uploaded in the background..',
                        type: 'default',
                        autoHide: false
                    })
                    await uploadThePhoto()
                }
            })
        }
    }

    const validateForcedBarcode = async (evt: { data: string }) => {
        if (isLinkMoreQrCodes === true) {
            return retBarcodeData(evt)
        }

        const urlSplit = evt.data.split('/')
        const lastElem = urlSplit[urlSplit.length - 1]

        dispatch(setScannedAlbumCode(lastElem))

        navigation.navigate('ValidateBarcode', {
            albumCode: lastElem,
            onSuccess: (albumCodeFromValidate: any) => {
                navigation.navigate('NiceWork', {
                    confirmPicture: async () => {
                        showMessage({
                            message:
                                'Images are being uploaded in the background..',
                            type: 'default',
                            autoHide: false
                        })
                        await uploadThePhoto(albumCodeFromValidate)

                        dispatch(setBottomTabs(true))
                        setTimeout(() => {
                            navigation.navigate(Routes.TabNavigator.Home, {
                                screen: Routes.HomeStack.Home
                            })
                        }, SAFE_TIMEOUT)
                    },
                    retakePicture: () => {
                        navigation.navigate('CapturePhoto', {
                            takeAnotherPhoto: true
                        })
                        takeAnotherPicture()
                    }
                })
            },

            onRescanChosen: () =>
                navigation.navigate('CapturePhoto', {
                    linkMoreQR: true
                }),
            onCancelChosen: () =>
                navigation.navigate('CapturePhoto', {
                    linkMoreQR: true
                })
        })
    }

    const calculateImageDimensions = (srcWidth: number, srcHeight: number) => {
        const maxHeight = (win.height + 100) * 0.5
        const maxWidth = win.width + 100

        const photoRatio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)

        setWidth(srcWidth * photoRatio)
        setHeight(srcHeight * photoRatio)
    }
    const animatedImageStyle = useAnimatedStyle(() => {
        if (photoOrientationShared.value === 'LANDSCAPE-LEFT') {
            if (currentOrientation.value === 'LANDSCAPE-RIGHT') {
                // customStyle = { transform:[{ rotate: '-180deg' }] }
                return {
                    transform: [{ rotateZ: withTiming('-180deg') }]
                }
            } else if (vertical.includes(currentOrientation.value)) {
                return {
                    transform: [
                        { rotateZ: withTiming('-90deg') },
                        {
                            scale: withTiming(1 / 1.33)
                        }
                    ]
                }
            }
            return {
                transform: [
                    {
                        rotate: withTiming('0deg')
                    }
                ]
            }
        } else if (photoOrientationShared.value === 'LANDSCAPE-RIGHT') {
            if (currentOrientation.value === 'LANDSCAPE-LEFT') {
                return { transform: [{ rotateZ: withTiming('180deg') }] }
            } else if (vertical.includes(currentOrientation.value)) {
                return {
                    transform: [
                        { rotateZ: withTiming('90deg') },
                        {
                            scale: withTiming(1 / 1.33)
                        }
                    ]
                }
            }
            return { transform: [{ rotateZ: withTiming('0deg') }] }
        } else {
            if (currentOrientation.value === 'LANDSCAPE-LEFT') {
                return {
                    transform: [
                        { rotateZ: withTiming('90deg') },
                        {
                            scale: withTiming(1 / 1.33)
                        }
                    ]
                }
            } else if (currentOrientation.value === 'LANDSCAPE-RIGHT') {
                return {
                    transform: [
                        { rotateZ: withTiming('-90deg') },
                        {
                            scale: withTiming(1 / 1.33)
                        }
                    ]
                }
            }
            return { transform: [{ rotate: withTiming('0deg') }] }
        }
    }, [currentOrientation.value, photoOrientationShared.value])
    const renderConfirmationView = () => {
        const getImageDimensions = async () => {
            if (await RNFS.exists(photoData?.uri)) {
                Image.getSize(
                    photoData?.uri,
                    calculateImageDimensions,
                    error => {
                        setWidth(win.width)
                        setHeight(win.height)
                    }
                )
            } else {
                calculateImageDimensions(photoData?.height, photoData?.width)
            }
        }
        getImageDimensions()

        // TODO: Remove the Platform check once we implement GreenScreen for Android
        const container = (
            <View
                style={[
                    vertical.includes(currentOrientationForHeader)
                        ? { paddingTop: 15 }
                        : { alignItems: 'center' },
                    responsiveStyles.confirmationButtonsContainer
                ]}>
                <AnimatedTouchableOpacity
                    style={[responsiveStyles.retakeButton, iconsRotation]}
                    onPress={retakePicture}>
                    <View>
                        <RetakeIcon height={65} width={58} />
                    </View>
                </AnimatedTouchableOpacity>

                <AnimatedTouchableOpacity
                    style={[
                        responsiveStyles.takeAnotherPhotoButton,
                        iconsRotation
                    ]}
                    onPress={() => takeAnotherPicture()}>
                    <View>
                        <Icon
                            style={styles.confirmationButtonIcon}
                            name="plus"
                            size={41}
                            color="#fff"
                        />
                        <Text style={styles.confirmationButtonText}>
                            Take Another
                        </Text>
                    </View>
                </AnimatedTouchableOpacity>

                <AnimatedTouchableOpacity
                    style={[responsiveStyles.confirmButton, iconsRotation]}
                    onPress={() => didUserScanQr()}>
                    <View>
                        <Icon
                            style={styles.confirmationButtonIcon}
                            name="thumbs-o-up"
                            size={41}
                            color="#fff"
                        />
                        <Text style={styles.confirmationButtonText}>
                            Accept
                        </Text>
                    </View>
                </AnimatedTouchableOpacity>
            </View>
        )

        const customStyle = {}
        let ratioStyle = {}

        const customRotation = () => {
            if (photoOrientation === 'LANDSCAPE-LEFT') {
                if (vertical.includes(currentOrientation.value)) {
                    ratioStyle = { width: scrWidth, height: scrWidth / 1.33 }
                }
            } else if (photoOrientation === 'LANDSCAPE-RIGHT') {
                if (vertical.includes(currentOrientation.value)) {
                    ratioStyle = {
                        width: scrWidth / 1.33,
                        height: scrHeight,
                        marginLeft: 50
                    }
                }
            }
        }

        if (Platform.OS === 'ios') {
            if (vertical.includes(photoOrientation)) {
                ratioStyle = {
                    width: vertical.includes(currentOrientation.value)
                        ? scrWidth
                        : scrWidth / 1.33,
                    height: vertical.includes(currentOrientation.value)
                        ? scrWidth * 1.33
                        : scrHeight,

                    marginLeft: vertical.includes(currentOrientation.value)
                        ? 0
                        : 50
                }
            } else {
                ratioStyle = {
                    width: vertical.includes(currentOrientation.value)
                        ? scrWidth
                        : scrWidth * 1.33,
                    height: vertical.includes(currentOrientation.value)
                        ? scrWidth * 1.33
                        : scrHeight,

                    marginLeft: vertical.includes(currentOrientation.value)
                        ? 0
                        : -60
                }
            }
        } else {
            customRotation()
        }

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'black'
                }}>
                <CameraHeader
                    currentOrientation={currentOrientationForHeader}
                    onPressBack={() => retakePicture()}
                    isViewLandscape={
                        !vertical.includes(currentOrientationForHeader)
                    }
                />

                <Animated.Image
                    style={[
                        Platform.OS === 'ios'
                            ? imageRotation
                            : animatedImageStyle,
                        {
                            flex: 1
                        }
                    ]}
                    resizeMode={'contain'}
                    source={{ uri: photoData?.uri }}
                />

                {container}
            </View>
        )
    }

    const renderTakeAnotherView = () => {
        const animationBasedOnOrientation = vertical.includes(photoOrientation)
            ? 'slideInUp'
            : 'slideInRight'

        const container = (
            <Animatable.View
                animation={animationBasedOnOrientation}
                duration={1000}
                style={responsiveStyles.takeAnotherButtonsContainer}>
                <TouchableOpacity
                    style={responsiveStyles.retakeButton}
                    onPress={onPressGoBack}>
                    <View>
                        <Icon
                            style={styles.confirmationButtonIcon}
                            name="check-circle"
                            size={30}
                            color="#fff"
                        />
                        <Text style={styles.confirmationButtonText}>Done</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={responsiveStyles.confirmButton}
                    onPress={takeAnotherPicture}>
                    <View>
                        <Icon
                            style={styles.confirmationButtonIcon}
                            name="plus"
                            size={30}
                            color="#fff"
                        />
                        <Text style={styles.confirmationButtonText}>
                            Take Another
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        )

        return (
            <View style={{ flex: 1 }}>
                <Image
                    style={{ flex: 1 }}
                    resizeMode={'cover'}
                    source={{ uri: photoData?.uri }}
                />
                {container}
            </View>
        )
    }

    const renderBarCodeScannerOverlay = () => {
        return (
            <View style={{ flex: 1 }}>
                {/* <View style={{ flex: 0.1 }}> */}
                <CameraHeader
                    onPressBack={onPressGoBack}
                    currentOrientation={currentOrientationForHeader}
                />
                {/* </View> */}
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <View
                        style={{
                            height: 200,
                            width: 200,
                            opacity: 0.3,
                            borderWidth: 1,
                            borderColor: 'white'
                        }}
                    />
                </View>
                <View style={portraitStyles.overlayBottomButtonBar}>
                    <Button
                        viewStyle={portraitStyles.viewStyleButton}
                        textStyle={{
                            color: colors.WHITE,
                            fontFamily: Fonts.PoppinsMedium,
                            fontWeight: '500',
                            textAlign: 'center'
                        }}
                        onPress={() => {
                            setIsBarCodeMode(false)
                            setIsBarCodeDisabled(true)

                            renderCamera()

                            //HARDCODE FOR USE ON SIMULATOR, COMMENT THE TOP PART
                            /*retBarcodeData({
                                data: 'http://viewmy.pics/@Ep6Z',
                                target: 9847,
                                type: 256
                            })*/
                        }}>
                        Scan QR Code After?
                    </Button>
                </View>
            </View>
        )
    }

    const renderForceBarCodeScannerOverlay = () => {
        return (
            <View style={{ flex: 1 }}>
                {/* <View style={{ flex: 0.1 }}> */}
                <CameraHeader
                    onPressBack={() => {
                        if (isLinkMoreQrCodes === true) {
                            onPressGoBack()
                        } else {
                            navigation.navigate('CapturePhoto', {
                                linkMoreQR: false,
                                takeAnotherPhoto: true
                            })
                        }
                    }}
                    isViewLandscape={
                        !vertical.includes(currentOrientationForHeader)
                    }
                    currentOrientation={currentOrientationForHeader}
                />
                {/* </View> */}
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <View
                        style={{
                            height: 200,
                            width: 200,
                            opacity: 0.3,
                            borderWidth: 1,
                            borderColor: 'white'
                        }}
                    />
                </View>
                <View
                    style={[
                        responsiveStyles.overlayBottomButtonBar,
                        { justifyContent: 'center', alignItems: 'center' }
                    ]}>
                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }
                        ]}>
                        <Icon name={'qrcode'} size={20} color={colors.WHITE} />
                        <Text
                            style={{
                                color: colors.WHITE,
                                fontFamily: Fonts.PoppinsMedium,
                                fontWeight: '500',
                                marginLeft: 10
                            }}>
                            Scan the QR code
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderCameraOverlay = () => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'transparent'
                }}>
                <CameraHeader
                    onPressBack={() => {
                        dispatch(setScannedAlbumCode(''))
                        navigation.navigate('CapturePhoto', {
                            takeAnotherPhoto: false,
                            linkMoreQR: true
                        })
                    }}
                    flash={true}
                    flashFunc={() => toggleFlash()}
                    flashText={flash}
                    isViewLandscape={
                        !vertical.includes(currentOrientationForHeader)
                    }
                    currentOrientation={currentOrientationForHeader}
                    isCamera={true}
                />
                <View
                    style={[
                        responsiveStyles.overlayBottomButtonBar,
                        { justifyContent: 'center', alignItems: 'center' }
                    ]}>
                    <TouchableOpacity
                        style={responsiveStyles.takePhotoButton}
                        onPress={takePicture}>
                        <View style={responsiveStyles.innerTakePhotoButton} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={responsiveStyles.reverseCameraButton}
                        onPress={toggleFacing}>
                        <Icon name="rotate-right" color="#fff" size={30} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderCamera = () => {
        // If there is photo data in the state, display confirmation of photo taken
        if (photoData != null && forceBarCode != true) {
            if (shouldShowTakeAnotherView) {
                return renderTakeAnotherView()
            }

            if (isLinkEnabled === undefined) {
                return renderConfirmationView()
            }
        }

        // If the camera has been de-activated, do not render the camera
        // This has been done to save battery power and for during bar code scann

        // If there is no photo data, continue with normal photo layout
        let cameraOverlayView = renderCameraOverlay()

        if (isBarCodeMode) {
            if (forceBarCode) {
                cameraOverlayView = renderForceBarCodeScannerOverlay()
            } else {
                cameraOverlayView = renderBarCodeScannerOverlay()
            }
        } else {
            cameraOverlayView = renderCameraOverlay()
        }
        if (!isFocused) return null
        return (
            <>
                {hasPermission ? (
                    <View
                        style={{
                            height: '100%',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute'
                        }}>
                        <Camera
                            ref={cameraRef}
                            style={[
                                {
                                    width: scrWidth,
                                    height: scrWidth * 1.33
                                }
                            ]}
                            captureAudio={false}
                            type={type}
                            flashMode={flash}
                            autoFocus={autoFocus}
                            zoom={zoom}
                            whiteBalance={whiteBalance}
                            ratio={ratio}
                            barCodeScannerSettings={{
                                barCodeTypes: [
                                    BarCodeScanner.Constants.BarCodeType.qr
                                ]
                            }}
                            onBarCodeScanned={
                                isBarCodeDisabled
                                    ? null
                                    : forceBarCode
                                    ? validateForcedBarcode
                                    : retBarcodeData
                            }
                            focusDepth={depth}
                        />
                    </View>
                ) : null}
                {cameraOverlayView}
            </>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {/* <SafeAreaView style={styles.container} onLayout={onLayout}> */}
            {renderCamera()}
            {/* </SafeAreaView> */}
            <Loader />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    absoluteCenteredView: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    flipText: {
        color: 'white',
        fontSize: 15
    },
    retakeContainer: {
        backgroundColor: 'transparent',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    confirmContainer: {
        backgroundColor: 'transparent',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    applyChangesButton: {
        backgroundColor: '#82A963',
        padding: 4,
        borderRadius: 4,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    resetToDefaultsButton: {
        backgroundColor: 'red',
        padding: 4,
        borderRadius: 4,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    confirmationButtonIcon: {
        alignSelf: 'center'
    },
    confirmationButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
        paddingTop: Platform.OS !== 'ios' ? 5 : 0
    },
    settingsButtonIcon: {
        alignSelf: 'center'
    },
    settingsButtonText: {
        color: '#fff',
        fontSize: 14,
        alignSelf: 'center',
        textAlign: 'center',
        paddingTop: Platform.OS !== 'ios' ? 5 : 2
    },
    rotateToRight: {
        transform: [{ rotate: '-90deg' }]
    },
    rotateToLeft: {
        transform: [{ rotate: '90deg' }]
    },
    iconsInPortrait: {
        transform: [{ rotate: '0deg' }]
    }
})

const landscapeStyles = StyleSheet.create({
    overlayTopButtonBar: {
        position: 'absolute',
        top: 0,
        left: 70,
        right: 70,
        height: 70,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    overlayBottomButtonBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100%',
        width: Platform.OS === 'android' ? 90 : 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45AEFF',
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40
    },
    overlayBottomButtonBarToLeft: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: '100%',
        width: Platform.OS === 'android' ? 90 : 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45AEFF',
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 40
    },
    greenScreenSettingsContainer: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        height: 260,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'column'
    },
    confirmationButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100%',
        width: 110,
        backgroundColor: '#45AEFF',
        borderBottomRightRadius: 40,
        borderTopRightRadius: 40,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    confirmationButtonsContainerLeft: {
        paddingTop: 15,
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: '100%',
        width: 110,
        backgroundColor: '#45AEFF',
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 40,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    confirmationButtonsContainerRight: {
        paddingTop: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100%',
        width: 110,
        backgroundColor: '#45AEFF',
        borderBottomRightRadius: 40,
        borderTopRightRadius: 40,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    takeAnotherButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row'
    },
    closeButton: {
        position: 'absolute',
        left: 20,
        top: 25,
        width: 40,
        height: 40
    },
    flashButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 100,
        height: 40
    },
    flashContainerView: {
        flex: 1,
        flexDirection: 'row'
    },
    flashIconContainerView: {
        flex: 0.5,
        justifyContent: 'center'
    },
    flashStateText: {
        flex: 0.5,
        alignSelf: 'center',
        paddingLeft: 5
    },
    takePhotoButton: {
        opacity: 1,
        height: 74,
        width: 74,
        //alignSelf: 'flex-end',
        // marginBottom: 17,
        borderRadius: 37,
        borderWidth: 3,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    takeAnotherPhotoButton: {
        width: 60,
        height: 41
    },
    reverseCameraButton: {
        opacity: 0.8,
        position: 'absolute',
        left: 20,
        bottom: 30
    },
    confirmButton: {
        width: 60,
        height: 41
    },
    retakeButton: {
        width: 58,
        height: 65
    },
    settingsButton: {
        position: 'absolute',
        left: win.width / 2 - 60 / 2,
        top: 10,
        width: 60,
        height: 70
    },
    viewStyleButton: {
        backgroundColor: '#E9D66B',
        width: 'auto',
        paddingHorizontal: 30,

        minWidth: 200
    },
    innerTakePhotoButton: {
        backgroundColor: colors.WHITE,
        height: 64,
        width: 64,
        borderRadius: 32
    }
})

const portraitStyles = StyleSheet.create({
    overlayTopButtonBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 70,

        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    viewStyleButton: {
        backgroundColor: '#E9D66B',
        width: 'auto',
        paddingHorizontal: 30
    },
    overlayBottomButtonBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'android' ? 90 : 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45AEFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    greenScreenSettingsContainer: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        height: 260,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'column'
    },
    confirmationButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 110,
        backgroundColor: '#45AEFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    takeAnotherButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,

        width: 90,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'column'
    },
    closeButton: {
        position: 'absolute',
        left: 20,
        top: 25,
        width: 40,
        height: 40
    },
    flashButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 100,
        height: 40
    },
    flashContainerView: {
        flex: 1,
        flexDirection: 'row'
    },
    flashIconContainerView: {
        flex: 0.5,
        justifyContent: 'center'
    },
    flashStateText: {
        flex: 0.5,
        alignSelf: 'center',
        paddingLeft: 5
    },
    takePhotoButton: {
        opacity: 1,
        height: 74,
        width: 74,
        //alignSelf: 'flex-end',
        // marginBottom: 17,
        borderRadius: 37,
        borderWidth: 3,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    takeAnotherPhotoButton: {
        width: 60,
        height: 41
    },
    reverseCameraButton: {
        opacity: 0.8,
        position: 'absolute',
        right: 40,
        bottom: 30
    },
    confirmButton: {
        width: 60,
        height: 41
    },
    retakeButton: {
        width: 58,
        height: 65
    },
    settingsButton: {
        position: 'absolute',
        left: win.width / 2 - 60 / 2,
        top: 10,
        width: 60,
        height: 70
    },
    innerTakePhotoButton: {
        backgroundColor: colors.WHITE,
        height: 64,
        width: 64,
        borderRadius: 32
    }
})

export default CameraScreen
