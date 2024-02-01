import colors from 'colors'
import Fonts from 'constants/Fonts'
import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
    size?: number
    name?: string
}

const Avatar = ({ size = 60, name }: Props) => {
    //const { user } = useSelector(state => state.user)
    const containerStyle = useMemo(
        () => ({
            height: size,
            width: size,
            borderRadius: size / 2
        }),
        [size]
    )
    return (
        <View style={[containerStyle, localStyles.container]}>
            <Text style={localStyles.avatarText}>
                {name?.toUpperCase().substr(0, 1)}
            </Text>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.WHITE
    },
    avatarText: {
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 20
    }
})
export default Avatar
