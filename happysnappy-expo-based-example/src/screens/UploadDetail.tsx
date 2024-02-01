import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Linking,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Pressable,
    Platform
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import Moment from 'moment'

import { useSelector } from '../hooks/reduxHooks'
import { photoStoragePath } from 'constants/UploadConstants'

import Container from 'components/Container'
import Routes from 'navigation/Routes'
import { Title } from 'components'
import Sentry from '@sentry/react-native'

const win = Dimensions.get('window')

const UploadDetail = ({ navigation, route }: any) => {
    const [width, setWidth] = useState<number | null>()
    const [height, setHeight] = useState<number | null>()

    const { selectedQueueItem, selectedQueueItemStatus } = useSelector(
        (state: any) => state.upload
    )

    const [albumCode, setAlbumCode] = useState(
        selectedQueueItem?.albumCode || ''
    )

    useEffect(() => {
        const uri =
            'file://' + photoStoragePath + selectedQueueItem?.image?.fileName
        Image.getSize(
            uri,
            (srcWidth, srcHeight) => {
                const maxHeight = win.height * 0.4
                const maxWidth = win.width

                const ratio = Math.min(
                    maxWidth / srcWidth,
                    maxHeight / srcHeight
                )

                setWidth(srcWidth * ratio)
                setHeight(srcHeight * ratio)
            },
            error => {
                setWidth(win.width)
                setHeight(win.width)
            }
        )

        if (selectedQueueItem.albumCode === '') {
            setAlbumCode(selectedQueueItem.response.json.albumCode)
        }
    }, [])

    const getAlbumURL = () => {
        if (selectedQueueItem?.response?.json?.albumCode) {
            //PROD https://viewmy-pics.com/
            //UAT https://viewmy-pics-uat.herokuapp.com/
            return (
                'https://viewmy-pics-uat.herokuapp.com/' +
                selectedQueueItem?.response.json.albumCode
            )
        } else return '/'
    }

    const navigateToCamera = () => {
        navigation.navigate(Routes.CapturePhotoStack.title, {
            screen: Routes.CapturePhotoStack.CapturePhoto,
            params: { linkMoreQRFromSuccess: true, fromUP: true }
        })
    }

    let hasAlbumCode = false

    if (
        selectedQueueItem?.response?.json?.albumCode ||
        selectedQueueItem?.albumCode
    ) {
        hasAlbumCode = true
    }

    let rotationStyle = styles.iconsInPortrait
    if (selectedQueueItem?.photoOrientation === 'LandscapeLeft') {
        rotationStyle = styles.rotateToRight
    } else if (selectedQueueItem?.photoOrientation === 'LandscapeRight') {
        rotationStyle = styles.rotateToLeft
    }
    return (
        <Container style={{ paddingHorizontal: 0 }}>
            <Pressable
                onPress={() => navigation.goBack()}
                style={{
                    paddingHorizontal: 30,
                    paddingTop: 20,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <Icon name="arrow-back-circle-outline" size={25} color="#000" />

                <Title style={styles.title}>{route.params.title || ''}</Title>
            </Pressable>

            <ScrollView>
                <View style={styles.shadow}>
                    <View style={styles.card}>
                        <Image
                            resizeMode={'contain'}
                            style={[
                                Platform.OS === 'android' ? rotationStyle : {},
                                styles.itemImage,
                                {
                                    width: width,
                                    height: height
                                }
                            ]}
                            source={{
                                uri: `${
                                    Platform.OS === 'android' ? 'file://' : ''
                                }${photoStoragePath}${
                                    selectedQueueItem?.image.fileName
                                }`
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                marginVertical: 20,
                                marginLeft: 20
                            }}>
                            <View style={{ marginRight: 27 }}>
                                <Text>Taken:</Text>
                                <Text>Uploaded:</Text>
                                <Text>Status:</Text>
                                <Text>Photo code:</Text>
                                <Text>Photo URL:</Text>
                                <Text>QR Code:</Text>
                                <Text>Album URL:</Text>
                                <Text>Template:</Text>
                            </View>
                            <View>
                                <Text style={styles.mainText}>
                                    {selectedQueueItem?.date
                                        ? Moment(
                                              selectedQueueItem?.date
                                          ).format('DD/MM/YY, h:mma')
                                        : '-'}
                                </Text>
                                <Text style={styles.mainText}>
                                    {selectedQueueItem?.uploadDate
                                        ? Moment(
                                              selectedQueueItem?.uploadDate
                                          ).format('DD/MM/YY, h:mma')
                                        : '-'}
                                </Text>
                                <Text style={styles.mainText}>
                                    {selectedQueueItemStatus}
                                </Text>

                                <Text style={styles.mainText}>
                                    {selectedQueueItem?.response
                                        ? selectedQueueItem?.response?.json
                                              ?.photoCode
                                        : ''}
                                </Text>
                                <Text
                                    style={styles.mainText}
                                    onPress={() =>
                                        selectedQueueItem?.response
                                            ? Linking.openURL(
                                                  selectedQueueItem?.response
                                                      .json.viewURL
                                              )
                                            : null
                                    }>
                                    viewmy.pics/
                                    {selectedQueueItem?.response
                                        ? selectedQueueItem?.response?.json
                                              ?.photoCode
                                        : ''}
                                </Text>
                                <Text style={styles.mainText}>{albumCode}</Text>

                                <Text
                                    style={[styles.mainText, { width: 200 }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    onPress={() =>
                                        hasAlbumCode
                                            ? Linking.openURL(getAlbumURL())
                                            : null
                                    }>
                                    {getAlbumURL()}
                                </Text>
                                <Text numberOfLines={1} style={styles.mainText}>
                                    {route.params.templateName}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateToCamera()}>
                            <Text style={{ color: 'white' }}>
                                Link more QR codes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    itemImage: {
        flex: 1,
        alignSelf: 'center',
        marginTop: 20,
        marginHorizontal: 20
    },

    shadow: {
        marginHorizontal: 30,
        marginBottom: 50,

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
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden'
    },
    button: {
        borderRadius: 100,
        backgroundColor: '#45AEFF',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',

        margin: 20
    },
    mainText: {
        fontWeight: 'bold',
        color: 'black'
    },
    title: {
        marginLeft: 10
    }
})

export default UploadDetail
