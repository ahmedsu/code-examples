import React, { FC, useState } from 'react'
import { View, Text as RNText, Pressable, StyleSheet } from 'react-native'
import InfoIcon from '../assets/icons/info.svg'
import Ionicon from 'react-native-vector-icons/Ionicons'
import colors from 'colors'
import Fonts from 'constants/Fonts'
import { TextProps } from 'react-native-elements'
import { Divider } from 'components'
const Text: FC<TextProps> = props => (
    <RNText style={localStyles.expandedListItems}>{props.children}</RNText>
)
const ExpandableView = () => {
    const [isExpanded, setIsExpanded] = useState(true)
    return (
        <View style={localStyles.container}>
            <View>
                <View
                    style={[
                        localStyles.headerContainer,
                        isExpanded && {
                            borderBottomColor: '#F1F2F5',
                            borderBottomWidth: 1
                        }
                    ]}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <InfoIcon height={32} width={32} />
                        <Divider horizontal size={10} />
                        <RNText style={localStyles.listTitle}>
                            How it works
                        </RNText>
                    </View>
                    <Pressable onPress={() => setIsExpanded(prev => !prev)}>
                        <Ionicon
                            name={`chevron-${
                                isExpanded ? 'up' : 'down'
                            }-circle-outline`}
                            size={32}
                            color={colors.BLACK}
                        />
                    </Pressable>
                </View>
                {isExpanded && (
                    <View style={localStyles.expanded}>
                        <Text>1. Select the project you are at</Text>
                        <Text>2. Select a template to use</Text>
                        <Text>3. Scan the clients QR code</Text>
                        <Text> {'    '}(or skip and scan it afterwards)</Text>
                        <Text>4. Take their picture</Text>
                        <Text>5. Save the photo & add to queue</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10
    },
    expanded: {
        width: '100%',
        paddingTop: 20
    },
    expandedListItems: {
        color: '#00000050',
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        marginBottom: 5
    },
    listTitle: {
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 18,
        color: colors.BLACK
    },
    container: {
        shadowColor: '#c4c4c4',
        shadowOffset: {
            width: 0,
            height: 12
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,

        elevation: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginBottom: 20,
        borderRadius: 20,
        marginHorizontal: 20
    }
})
export default ExpandableView
