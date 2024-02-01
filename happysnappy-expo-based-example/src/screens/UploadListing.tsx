import React, { useEffect, useMemo, useState } from 'react'
import {
    View,
    FlatList,
    TouchableHighlight,
    StyleSheet,
    ActivityIndicator,
    Image,
    Pressable,
    Platform
} from 'react-native'
import moment from 'moment'
import Colors from '../colors'
import { useSelector, useDispatch } from '../hooks/reduxHooks'
import {
    setLastAdhocUpload,
    setLastAdhocUploadQueueId,
    setNewTotalFailedUploadsWithoutUUID,
    setNewTotalPendingUploadsWithoutUUID,
    setSelectedQueueItem,
    setSelectedQueueItemStatus,
    setTotalFailedUploadsWithoutUUID
} from 'redux/actions/uploadActions'
import { Text, Button as MyButton, Title } from 'components'
import Container from 'components/Container'
import { Divider } from 'react-native-elements'
import CheckBox from '@react-native-community/checkbox'
import { uploadPhoto } from 'helpers/uploadService'
import Icon from 'react-native-vector-icons/Ionicons'
import store from 'redux/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { hideMessage, showMessage } from 'react-native-flash-message'
import { useNetInfo } from '@react-native-community/netinfo'

const UploadListing = ({ route, navigation }: any) => {
    const { type, title, statusText, emptyItemsText } = route.params

    const {
        totalSuccessfulUploadsWithoutUUID,
        totalPendingUploadsWithoutUUID,
        totalFailedUploadsWithoutUUID
    } = useSelector(state => state.upload)

    const [isBusyLoading, setIsBusyLoading] = useState(true)
    const [dataForTypeValue, setDataForTypeValue] = useState<any[]>([])

    const [itemsToReupload, setItemsToReupload] = useState<any>([])
    const [isBusyUploading, setIsBusyUploading] = useState(false)
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const [failedUploads, setFailedUploads] = useState(
        totalFailedUploadsWithoutUUID
    )
    const [pendingUploads, setPendingUploads] = useState(
        totalPendingUploadsWithoutUUID
    )
    const [selectAll, setSelectAll] = useState(false)
    //const [selectAllText, setSelectAllText] = useState('Select All')
    const { isConnected } = useNetInfo()
    const dispatch = useDispatch()
    useEffect(() => {
        dataForType()
        setIsBusyLoading(false)
    }, [])

    useEffect(() => {
        if (itemsToReupload && itemsToReupload.length !== 0) {
            setIsDisabled(false)
        } else setIsDisabled(true)
    }, [itemsToReupload])

    useEffect(() => {
        dataForType()
    }, [totalFailedUploadsWithoutUUID])

    useEffect(() => {
        dataForType()
    }, [totalPendingUploadsWithoutUUID])

    const tappedPhoto = (
        item: object | null,
        status: string | null,
        templateName: string
    ) => {
        dispatch(setSelectedQueueItem(item))
        dispatch(setSelectedQueueItemStatus(status))

        navigation.navigate('UploadDetail', { title, templateName })
    }

    const dataForType = () => {
        if (type === 'Successful') {
            setDataForTypeValue(
                Array.isArray(totalSuccessfulUploadsWithoutUUID)
                    ? [...totalSuccessfulUploadsWithoutUUID]
                    : []
            )
        } else if (type === 'Pending') {
            const tempArr = totalPendingUploadsWithoutUUID?.map(item => {
                item.checked = false
                return item
            })

            setDataForTypeValue(tempArr)
        } else if (type === 'Failed') {
            const tempArr = failedUploads?.map(item => {
                item.checked = false
                return item
            })

            setDataForTypeValue(tempArr)
        } else {
            setDataForTypeValue(
                Array.isArray(totalSuccessfulUploadsWithoutUUID)
                    ? [...totalSuccessfulUploadsWithoutUUID]
                    : []
            )
        }
    }

    const handleCheckChange = (imageId: any) => {
        const temp = dataForTypeValue.map(el => {
            if (imageId === el?.image.fileName) {
                return { ...el, checked: !el.checked }
            }
            return el
        })

        setDataForTypeValue(temp)
    }
    const checkAllImages = () => {
        const temp = dataForTypeValue.map(el => {
            return { ...el, checked: !selectAll }
        })
        setDataForTypeValue(temp)
        setItemsToReupload(!selectAll ? temp : [])
        setSelectAll(!selectAll)
    }
    const addItemToArray = (item: any, value: any) => {
        const tempArr = [...itemsToReupload]
        let itemsToReuploadNew = []

        if (value) {
            if (
                tempArr.findIndex(
                    e => e.image.fileName === item?.image.fileName
                ) === -1
            ) {
                tempArr.push(item)
            }
            itemsToReuploadNew = [...tempArr]
        } else {
            itemsToReuploadNew = tempArr.filter(
                (el: any) => el.image.fileName !== item?.image.fileName
            )
        }
        if (itemsToReuploadNew.length < dataForTypeValue.length && selectAll) {
            setSelectAll(false)
        } else if (itemsToReuploadNew.length === dataForTypeValue.length) {
            setSelectAll(true)
        }
        // setSelectAllText(
        //     itemsToReuploadNew.length === dataForTypeValue.length
        //         ? 'Deselect All'
        //         : 'Select All'
        // )
        setItemsToReupload([...itemsToReuploadNew])
    }
    const selectAllText = useMemo(() => {
        return selectAll ? 'Deselect All' : 'Select All'
    }, [selectAll])
    const setDifference = (wasSuccessful: boolean) => {
        if (type === 'Failed') {
            if (wasSuccessful === false) {
                return
            }
            const tempArr = failedUploads
            const difference = tempArr.filter(
                (el: any) => !itemsToReupload.includes(el)
            )
            //3 selektovane slike od 5

            setFailedUploads(difference)
            dispatch(setNewTotalFailedUploadsWithoutUUID([...difference]))
        } else {
            const tempArr = pendingUploads
            const difference = tempArr.filter(
                (el: any) => !itemsToReupload.includes(el)
            )

            setPendingUploads(difference)
            dispatch(setNewTotalPendingUploadsWithoutUUID(difference))
        }
    }
    const reuploadSelected = async () => {
        if (!isConnected)
            return showMessage({
                message: 'No internet connection, try again later',
                type: 'danger'
            })
        showMessage({
            message: 'Trying to reupload images..',
            type: 'default',
            autoHide: false
        })
        const firstLen = itemsToReupload.length
        setIsBusyUploading(true)

        /*const userE = store.getState().user.user.email
        let imagesToStore: any = await AsyncStorage.getItem(
            `@${userE}-imagesToStore`
        )
        const parsedToStore = JSON.parse(imagesToStore)
        imagesToStore = [
            ...(parsedToStore || []),
            ...itemsToReupload.filter(
                e =>
                    !(parsedToStore || []).some(
                        pe => pe.image.fileName === e.image.fileName
                    )
            )
        ]
        await AsyncStorage.setItem(
            `@${userE}-imagesToStore`,
            JSON.stringify(imagesToStore)
        )*/
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        const userE = store.getState().user.user.email
        for (const item of itemsToReupload) {
            const temp = await AsyncStorage.getItem(`@${userE}-imagesToStore`)
            let asyncData = []
            if (temp) asyncData = JSON.parse(temp)
            asyncData.push(item)
            await AsyncStorage.setItem(
                `@${userE}-imagesToStore`,
                JSON.stringify(asyncData)
            )

            uploadPhoto(
                item?.TemplateGroupId,
                item?.templateName,
                item?.templateCode,
                item?.albumCode,
                item?.photoOrientation,
                item?.photoDateTime,
                // item?.date,
                item?.image,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                (
                    uploadResults: object | null,
                    uploadQueueId: number | null
                ) => {
                    dispatch(setLastAdhocUpload(uploadResults))
                    dispatch(setLastAdhocUploadQueueId(uploadQueueId))

                    setDifference(true)
                    dataForType()

                    if (itemsToReupload.indexOf(item) + 1 === firstLen) {
                        hideMessage()
                    }
                },
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    setDifference(false)
                    dataForType()
                    setIsBusyUploading(false)

                    if (itemsToReupload.indexOf(item) + 1 === firstLen) {
                        hideMessage()
                    }
                },
                false,
                type
            )
        }
        setItemsToReupload([])
        setSelectAll(false)
        setIsBusyUploading(false)
    }

    const renderUploadItem = ({ item }: any) => {
        const takenDate = item.date
            ? moment(item.date).format('DD/MM/YY,hh:mma')
            : '-'
        let albumCode = ''

        if (item.response?.json?.albumCode) {
            albumCode = item.response.json.albumCode
        } else {
            albumCode = item.albumCode
        }

        const templateName = item?.templateName

        let rotationStyle = styles.iconsInPortrait
        if (item?.photoOrientation === 'LandscapeLeft') {
            rotationStyle = styles.rotateToRight
        } else if (item?.photoOrientation === 'LandscapeRight') {
            rotationStyle = styles.rotateToLeft
        }
        return (
            <View
                style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center'
                }}>
                <Pressable
                    onPress={async () => {
                        await handleCheckChange(item?.image.fileName)
                        addItemToArray(item, !item.checked)
                    }}
                    style={{
                        flex: 1,
                        // alignItems: 'center',
                        justifyContent: 'center',
                        height: 100
                    }}>
                    {type !== 'Successful' && (
                        <CheckBox
                            hitSlop={{
                                top: 20,
                                bottom: 20,
                                left: 20,
                                right: 20
                            }}
                            value={item.checked}
                            boxType={'square'}
                            onCheckColor={'#fff'}
                            onFillColor={'#45AEFF'}
                            tintColor={'#111'}
                            hideBox={false}
                            style={styles.checkBoxInput}
                            tintColors={{ true: Colors.PRIMARY_COLOR_2 }}
                            onValueChange={async (value: any) => {
                                if (Platform.OS === 'ios') return
                                await handleCheckChange(item?.image.fileName)
                                addItemToArray(item, value)
                            }}
                        />
                    )}
                </Pressable>
                <TouchableHighlight
                    onPress={() => {
                        tappedPhoto(item, statusText, templateName)
                    }}
                    onLongPress={async (value: any) => {
                        await handleCheckChange(item?.image.fileName)
                        addItemToArray(item, value)
                    }}
                    underlayColor="transparent"
                    style={styles.mainView}>
                    <View>
                        <View style={styles.templateRowView}>
                            <View style={styles.photoContainer}>
                                <Image
                                    style={[
                                        Platform.OS === 'android'
                                            ? rotationStyle
                                            : {},
                                        styles.templateSampleImage
                                    ]}
                                    resizeMode="contain"
                                    source={
                                        item?.response?.json?.viewURL
                                            ? {
                                                  uri: item.response.json
                                                      .viewURL
                                              }
                                            : require('../assets/HSL_Full_Colour.jpg')
                                    }
                                    defaultSource={require('../assets/HSL_Full_Colour.jpg')}
                                />
                            </View>
                            <View
                                style={{
                                    flex: 1,

                                    justifyContent: 'space-between',
                                    height: 76
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.templateRowText}>
                                        Taken:{' '}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.templateRowBoldedText,
                                            { width: '80%' }
                                        ]}
                                        ellipsizeMode="tail"
                                        numberOfLines={1}>
                                        {takenDate}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.templateRowText}>
                                        Template:{' '}
                                    </Text>
                                    <Text
                                        style={{
                                            ...styles.templateRowBoldedText,
                                            width: '60%'
                                        }}
                                        numberOfLines={1}
                                        ellipsizeMode="tail">
                                        {templateName || '-'}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.templateRowText}>
                                        QR Code:{' '}
                                    </Text>
                                    <Text style={styles.templateRowBoldedText}>
                                        {albumCode || ''}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                <Divider
                    style={{
                        backgroundColor: 'lightgray',
                        marginHorizontal: 10
                    }}
                />
            </View>
        )
    }

    const sortedDataForTypeValue = dataForTypeValue?.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return (
        <Container style={{ paddingHorizontal: 0 }}>
            {isBusyLoading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <View style={{ flex: 1 }}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={{
                            marginTop: 30,
                            marginLeft: 30,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <Icon
                            name="arrow-back-circle-outline"
                            size={25}
                            color="#000"
                        />

                        <Title style={{ marginLeft: 10 }}>
                            {dataForTypeValue?.length === 0
                                ? emptyItemsText
                                : title}
                        </Title>
                    </Pressable>

                    {dataForTypeValue?.length === 0 ? (
                        <View></View>
                    ) : (
                        <View style={styles.shadow}>
                            <View style={styles.uploadsCard}>
                                {type !== 'Successful' && (
                                    <Pressable
                                        onPress={() => {
                                            checkAllImages()
                                        }}
                                        style={{
                                            flexDirection: 'row',
                                            paddingTop: 10,
                                            alignItems: 'center',
                                            borderBottomColor: 'lightgray',
                                            borderBottomWidth: 1,
                                            paddingBottom: 5
                                        }}>
                                        <CheckBox
                                            hitSlop={{
                                                top: 20,
                                                bottom: 20,
                                                left: 20,
                                                right: 20
                                            }}
                                            value={selectAll}
                                            boxType={'square'}
                                            onCheckColor={'#fff'}
                                            onFillColor={'#45AEFF'}
                                            tintColor={'#111'}
                                            hideBox={false}
                                            style={styles.checkBoxInput}
                                            tintColors={{
                                                true: Colors.PRIMARY_COLOR_2
                                            }}
                                            onValueChange={async () => {
                                                if (Platform.OS === 'ios')
                                                    return
                                                checkAllImages()
                                            }}
                                        />
                                        <Text style={{ marginLeft: 10 }}>
                                            {selectAllText}
                                        </Text>
                                    </Pressable>
                                )}
                                <FlatList
                                    style={styles.templateFlatList}
                                    nestedScrollEnabled
                                    contentContainerStyle={{
                                        flexGrow: 1,
                                        paddingBottom: 10
                                    }}
                                    data={sortedDataForTypeValue}
                                    keyExtractor={(item, index) =>
                                        index.toString()
                                    }
                                    renderItem={renderUploadItem}
                                />
                            </View>
                        </View>
                    )}
                    {type != 'Successful' && dataForTypeValue?.length > 0 ? (
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                marginTop: 10,
                                marginBottom: 50
                            }}>
                            <MyButton
                                disabled={isDisabled}
                                style={styles.button}
                                onPress={() => reuploadSelected()}>
                                {isBusyUploading ? (
                                    <ActivityIndicator
                                        style={{ marginTop: 20 }}
                                    />
                                ) : (
                                    <Text style={{ color: 'white' }}>
                                        Reupload
                                    </Text>
                                )}
                            </MyButton>
                        </View>
                    ) : (
                        <View></View>
                    )}
                </View>
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    rotateToRight: {
        transform: [{ rotate: '-90deg' }]
    },
    rotateToLeft: {
        transform: [{ rotate: '90deg' }]
    },
    iconsInPortrait: {
        transform: [{ rotate: '0deg' }]
    },
    mainView: {
        //flex: 1,
        backgroundColor: 'white',
        marginTop: 4,
        // marginRight: 10,
        marginBottom: 1,
        //marginLeft: 10,
        width: '80%'
    },

    templateFlatList: {
        flex: 1
        // marginTop: 10,
        // marginBottom: 10
    },
    templateRowView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    templateSampleImage: {
        flex: 1,
        width: 100,
        height: 76
    },
    templateRowText: {
        fontSize: 12
    },
    templateRowBoldedText: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12
    },
    button: {
        borderRadius: 100,
        marginLeft: 10,
        backgroundColor: '#45AEFF',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 20
    },
    checkBoxInput: {
        height: 20,
        width: 20,
        borderWidth: 1,
        marginLeft: 10
    },
    photoContainer: {
        // flex: 1,
        backgroundColor: 'black',
        marginVertical: 20,
        marginRight: 10,
        marginLeft: 10,
        width: 100,
        height: 76,
        overflow: 'hidden',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

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

        marginTop: 15,
        marginBottom: 10,

        flex: 1
        // maxHeight: 460
    },
    uploadsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        height: '100%',
        justifyContent: 'center'
    },
    photosSingleRow: {
        margin: 20
    }
})

export default UploadListing
