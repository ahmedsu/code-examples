import colors from 'colors'
import Fonts from 'constants/Fonts'
import React from 'react'
import { Text, Pressable, Image, StyleSheet, View } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image'

interface Props {
    item: any
    name: string
    image: string | null
    onPress: () => void
}
const TemplateItem = ({ item, name, image, onPress }: Props) => {
    const isValidURL = (str: string | null) => {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i'
        ) // fragment locator

        return !!pattern.test(str)
    }

    return (
        <View style={localStyles.shadow}>
            <Pressable onPress={onPress} style={localStyles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        {isValidURL(image) ? (
                            <>
                                <FastImage
                                    style={localStyles.image}
                                    source={{
                                        uri: image?.includes('https:')
                                            ? ''
                                            : image?.replace('http:', 'https:'),
                                        priority: FastImage.priority.high
                                    }}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </>
                        ) : (
                            <View style={localStyles.emptyImageContainer}>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: Fonts.PoppinsSemiBold
                                    }}>
                                    {name.toUpperCase().substr(0, 1)}
                                    {/* {lastName.toUpperCase().substr(0, 1)} */}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text
                        style={{
                            fontFamily: Fonts.PoppinsSemiBold,
                            color: 'black',
                            width: item.template.isGreenScreen ? '60%' : '70%'
                        }}>
                        {name}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    {item.template.isGreenScreen ? (
                        <MaterialCommunityIcons
                            name="projector-screen"
                            color={colors.PRIMARY_COLOR_1}
                            size={20}
                            style={{ marginRight: 5 }}
                        />
                    ) : null}

                    <FeatherIcon
                        name="arrow-right-circle"
                        size={25}
                        color={colors.BLACK}
                    />
                </View>
            </Pressable>
        </View>
    )
}

const localStyles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        width: '95%',
        padding: 20
    },
    container: {
        // width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,

        marginRight: 15
    },
    emptyImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15
    }
})
export default TemplateItem
