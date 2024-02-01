import React, { useEffect, useRef } from 'react'
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    Alert,
    TouchableOpacity
} from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/Ionicons'
import Orientation from 'react-native-orientation-locker'
import { Slider } from '@miblanchard/react-native-slider'
import { useSelector, useDispatch } from '../hooks/reduxHooks'
import { Divider } from 'react-native-elements'
import { cleanUpPhotos, getTotalDiskSpaceByUser } from 'helpers/uploadService'
import {
    setAutoProcessPendingQueue,
    setKeepPhotosDurationIndex,
    setPhotoQuality
} from 'redux/actions/settingsActions'
import Container from 'components/Container'
import SettingsSingleRow from 'components/SettingSingleRow'
import { Title, Divider as MyDivider } from 'components'
import { Navigation } from 'types/Index'
import colors from '../colors'
import Fonts from 'constants/Fonts'
import { useIsFocused } from '@react-navigation/native'
import {
    setNewTotalFailedUploadsWithoutUUID,
    setNewTotalSuccessfulUploadsWithoutUUID,
    setTotalPendingUploadsWithoutUUID,
} from 'redux/actions/uploadActions'
import { getPhotosDataFromCloudAfterUpload } from 'helpers/restApi'

const Settings = ({ navigation }: { navigation: Navigation }) => {
    const dispatch = useDispatch()

    const {
        totalSuccessfulUploadsWithoutUUID,
        totalPendingUploadsWithoutUUID,
        totalFailedUploadsWithoutUUID
    } = useSelector(state => state.upload)
    const { photoQuality, autoProcessPendingQueue, keepPhotosDurationIndex } =
        useSelector(state => state.settings)
    const { userToken } = useSelector(state => state.login)
    const scrollRef = useRef()
    const isFocused = useIsFocused()

    useEffect(() => {
        Orientation.lockToPortrait()
    }, [])

    useEffect(() => {
        if (isFocused){
            getPhotosDataFromCloudAfterUpload()
        }
        if (isFocused === false) {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true
            })
        }
        let uniqueIds: any[] = []

        const getUnique = (arrToCheck: any[]) => {
            const unique = arrToCheck.filter((element: any) => {
                const isDuplicate = uniqueIds.includes(element.image.fileName)

                if (!isDuplicate) {
                    uniqueIds.push(element.image.fileName)
                    return true
                }
                return false
            })
            uniqueIds = []
            return unique
        }

        dispatch(
            setNewTotalSuccessfulUploadsWithoutUUID(
                getUnique(totalSuccessfulUploadsWithoutUUID),
                false
            )
        )
        dispatch(
            setNewTotalFailedUploadsWithoutUUID(
                getUnique(totalFailedUploadsWithoutUUID)
            )
        )
        dispatch(
            setTotalPendingUploadsWithoutUUID(
                getUnique(totalPendingUploadsWithoutUUID)
            )
        )
    }, [isFocused])

    const onSuccessfulPressed = () => {
        navigation.navigate('UploadListing', {
            type: 'Successful',
            title: 'Successful Uploads',
            statusText: 'Successful',
            emptyItemsText: 'There are no successful uploads'
        })
    }

    const onPendingPressed = () => {
        navigation.navigate('UploadListing', {
            type: 'Pending',
            title: 'Pending Uploads',
            statusText: 'Pending',
            showProgress: true,
            emptyItemsText: 'There are no pending uploads'
        })
    }

    const onFailedPressed = () => {
        navigation.navigate('UploadListing', {
            type: 'Failed',
            title: 'Failed Uploads',
            statusText: 'Failed',
            emptyItemsText: 'There are no failed uploads'
        })
    }

    const onStatsPressed = () => {
        navigation.navigate('Stats', {})
    }

    const onClearAllPressed = () => {
        const title = 'Delete All Photos?'
        let message = 'Are you sure you want to delete all photos?'
        const pendingUploads = totalPendingUploadsWithoutUUID

        if (pendingUploads?.length > 0) {
            const originalMessage = message
            message =
                'NOTE: You have pending uploads, which means that if you delete the photos, the pending uploads will not upload to the server and photos will be lost!'
            message += '\n\n ' + originalMessage
        }

        Alert.alert(
            title,
            message,
            [
                {
                    text: 'No, cancel',

                    style: 'cancel'
                },
                {
                    text: 'Yes, delete',
                    onPress: () => clearAllPhotosConfirmed(),
                    style: 'destructive'
                }
            ],
            { cancelable: false }
        )
    }

    const clearAllPhotosConfirmed = () => {
        cleanUpPhotos()
    }

    const clearAllPhotosCancelled = () => {}

    const autoProcessPendingQueueOnValueChange = (value: boolean) => {
        dispatch(setAutoProcessPendingQueue(value))
    }

    const photoQualityOnValueChange = (value: number) => {
        dispatch(setPhotoQuality(value))
    }

    const onPressKeepPhotosDurationIndex = (selectedIndex: number) => {
        dispatch(setKeepPhotosDurationIndex(selectedIndex))
    }

    return (
        <Container style={{ paddingHorizontal: 0 }}>
            <ScrollView ref={scrollRef}>
                <View style={{ height: 31 }} />
                <Title style={{ marginLeft: 30 }}>Uploads</Title>
                <View style={styles.shadow}>
                    <View style={styles.uploadsCard}>
                        <SettingsSingleRow
                            colors={['rgba(82, 196, 26, 0.25)', '#52C41A']}
                            title={`Successful: ${totalSuccessfulUploadsWithoutUUID?.length}`}
                            onPress={() => onSuccessfulPressed()}
                        />
                        <Divider
                            style={{
                                marginVertical: 5,
                                backgroundColor: 'lightgray',
                                marginHorizontal: 10
                            }}
                        />
                        <SettingsSingleRow
                            colors={['rgba(243, 146, 0, 0.25)', '#F39200']}
                            title={`Pending: ${totalPendingUploadsWithoutUUID?.length}`}
                            onPress={() => onPendingPressed()}
                        />
                        <Divider
                            style={{
                                marginVertical: 5,
                                backgroundColor: 'lightgray',
                                marginHorizontal: 10
                            }}
                        />
                        <SettingsSingleRow
                            colors={['rgba(255, 104, 69, 0.25)', '#FF6845']}
                            title={`Failed: ${totalFailedUploadsWithoutUUID?.length}`}
                            onPress={() => onFailedPressed()}
                        />
                        <Divider
                            style={{
                                marginVertical: 5,
                                backgroundColor: 'lightgray',
                                marginHorizontal: 10
                            }}
                        />
                        <SettingsSingleRow
                            colors={['rgb(197,197,197)', 'white']}
                            title="Stats"
                            onPress={() => onStatsPressed()}
                        />
                        <Divider
                            style={{
                                marginVertical: 5,
                                backgroundColor: 'lightgray',
                                marginHorizontal: 10
                            }}
                        />
                        <SettingsSingleRow
                            colors={['rgb(197,197,197)', 'white']}
                            title="Auto process queue"
                            onPress={() =>
                                autoProcessPendingQueueOnValueChange(
                                    !autoProcessPendingQueue
                                )
                            }
                            autoProcessQueue={true}
                            value={autoProcessPendingQueue}
                        />
                    </View>
                </View>
                <MyDivider size={50} />
                <Title style={{ marginLeft: 30 }}>Photos</Title>
                <View style={[styles.shadow, { marginBottom: 140 }]}>
                    <View style={styles.uploadsCard}>
                        <View style={styles.photosSingleRow}>
                            <View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                    <View style={styles.iconContainer}>
                                        <Icon
                                            name="star"
                                            size={15}
                                            color="white"
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            marginLeft: 12,
                                            fontWeight: 'bold'
                                        }}>
                                        Photo quality:{' '}
                                        {photoQuality * 100 + '%'}
                                    </Text>
                                </View>
                                <Slider
                                    value={photoQuality}
                                    onValueChange={value => {
                                        dispatch(setPhotoQuality(value[0]))
                                    }}
                                    onSlidingComplete={value => {
                                        photoQualityOnValueChange(value[0])
                                    }}
                                    minimumValue={0.25}
                                    maximumValue={1.0}
                                    step={0.25}
                                    minimumTrackTintColor="#FBBA00"
                                    maximumTrackTintColor="lightgray"
                                    thumbTintColor="white"
                                    thumbStyle={{
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 8
                                        },
                                        shadowOpacity: 0.46,
                                        shadowRadius: 11.14,

                                        elevation: 9
                                    }}
                                />
                                <Text
                                    style={{
                                        marginBottom: 20,
                                        color: 'lightgray'
                                    }}>
                                    The higher the quality, the better the photo
                                    will look, howewer, it will also take longer
                                    to upload and take up more space on your
                                    device and on the server.
                                </Text>
                            </View>
                            <Divider style={{ backgroundColor: 'ligtgray' }} />
                            <View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginVertical: 20
                                    }}>
                                    <View style={styles.iconContainer}>
                                        <Icon
                                            name="camera"
                                            size={15}
                                            color="white"
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            marginLeft: 12,
                                            fontWeight: 'bold'
                                        }}>
                                        Keep photos for:
                                    </Text>
                                </View>
                                <View style={styles.durationSelector}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            onPressKeepPhotosDurationIndex(1)
                                        }
                                        style={
                                            keepPhotosDurationIndex === 1
                                                ? styles.singleDurationSelector
                                                : { paddingHorizontal: 15 }
                                        }>
                                        <Text
                                            style={{
                                                color:
                                                    keepPhotosDurationIndex ===
                                                    1
                                                        ? '#000'
                                                        : '#fff',
                                                fontWeight:
                                                    keepPhotosDurationIndex ===
                                                    1
                                                        ? 'bold'
                                                        : '400'
                                            }}>
                                            1 Day
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            onPressKeepPhotosDurationIndex(2)
                                        }
                                        style={
                                            keepPhotosDurationIndex === 2
                                                ? styles.singleDurationSelector
                                                : { paddingHorizontal: 15 }
                                        }>
                                        <Text
                                            style={{
                                                color:
                                                    keepPhotosDurationIndex ===
                                                    2
                                                        ? '#000'
                                                        : '#fff',
                                                fontWeight:
                                                    keepPhotosDurationIndex ===
                                                    2
                                                        ? 'bold'
                                                        : '400'
                                            }}>
                                            1 Week
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            onPressKeepPhotosDurationIndex(3)
                                        }
                                        style={
                                            keepPhotosDurationIndex === 3
                                                ? styles.singleDurationSelector
                                                : { paddingHorizontal: 15 }
                                        }>
                                        <Text
                                            style={{
                                                color:
                                                    keepPhotosDurationIndex ===
                                                    3
                                                        ? '#000'
                                                        : '#fff',
                                                fontWeight:
                                                    keepPhotosDurationIndex ===
                                                    3
                                                        ? 'bold'
                                                        : '400'
                                            }}>
                                            1 Month
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        color: 'lightgray'
                                    }}>
                                    The amount of time to keep photos on this
                                    device before performing an automatic clear
                                    up of photos.
                                </Text>
                            </View>
                            <Divider
                                style={{
                                    backgroundColor: 'ligtgray',
                                    marginTop: 20
                                }}
                            />
                            <View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 20
                                    }}>
                                    <View style={styles.iconContainer}>
                                        <FeatherIcon
                                            name="hard-drive"
                                            size={15}
                                            color="white"
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            marginLeft: 12,
                                            fontWeight: 'bold'
                                        }}>
                                        Disk Space used:{' '}
                                        {getTotalDiskSpaceByUser(
                                            totalSuccessfulUploadsWithoutUUID,
                                            totalPendingUploadsWithoutUUID,
                                            totalFailedUploadsWithoutUUID
                                        ) + ' MB'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={onClearAllPressed}
                                    style={{
                                        backgroundColor: '#FF6845',
                                        borderRadius: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 161,
                                        height: 32,
                                        alignSelf: 'center',
                                        marginTop: 18
                                    }}>
                                    <Text style={styles.clearPhotosText}>
                                        Clear All Photos
                                    </Text>
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        marginVertical: 20,
                                        color: 'lightgray'
                                    }}>
                                    This is the total amount of disk space used
                                    on your device. Tapping the 'Clear all'
                                    button will remove the photos from this
                                    device only. Your uploads will still remain,
                                    its just the photo on your device that will
                                    be removed to free up your device space.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    shadow: {
        marginHorizontal: 30,

        borderRadius: 20,
        backgroundColor: 'transparent',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,

        marginTop: 15
    },
    uploadsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden'
    },
    photosSingleRow: {
        margin: 20
    },
    iconContainer: {
        borderRadius: 25,
        padding: 5,
        backgroundColor: 'gray'
    },
    durationSelector: {
        borderRadius: 50,
        backgroundColor: '#FBBA00',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: 40
    },
    singleDurationSelector: {
        borderRadius: 50,
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    // durationTextMain: {
    //     color: '#fff'
    // },
    clearPhotosText: {
        color: colors.WHITE,
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium
    }
})

export default Settings
