import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'components'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import Fonts from 'constants/Fonts'
const StatsCard = ({ color, title, numbers }: any) => {
    const [iconName, setIconName] = useState('check')
    const [isPending, setIsPending] = useState(false)
    const [formatedNumbers, setFormatedNumbers] = useState(22)
    const [fillNum, setFill] = useState()

    const getIcon = () => {
        if (title === 'Successful Photos') {
            setIconName('check')
        } else if (title === 'Disk Space Used') {
            setIconName('hard-drive')
        } else if (title === 'Pending Photos') {
            setIsPending(true)
        } else if (title === 'Failed Photos') {
            setIconName('x')
        }
    }

    const getNumbers = () => {
        if (title != 'Disk Space Used') {
            setFormatedNumbers(`${numbers[0]} of ${numbers[1]}`)
            setFill((numbers[0] / numbers[1]) * 100)
        } else {
            setFormatedNumbers(
                `${Math.trunc(+numbers[0])}MB of ${numbers[1]}GB`
            )
            setFill((numbers[0] / (numbers[1] * 1024)) * 100)
        }
    }

    useEffect(() => {
        getIcon()
        getNumbers()
    }, [numbers])

    return (
        <View style={styles.shadow}>
            <View style={styles.container}>
                <AnimatedCircularProgress
                    size={81}
                    width={6}
                    fill={fillNum}
                    tintColor={color}
                    backgroundColor="#ebebeb">
                    {fillNum =>
                        isPending ? (
                            <Entypo
                                name="dots-three-horizontal"
                                size={35}
                                color={color}
                            />
                        ) : (
                            <FeatherIcon
                                name={iconName}
                                size={30}
                                color={color}
                            />
                        )
                    }
                </AnimatedCircularProgress>
                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            marginTop: 20,
                            fontFamily: Fonts.PoppinsMedium
                        }}>
                        {title}
                    </Text>
                    <Text style={{ fontSize: 13, opacity: 0.25 }}>
                        {formatedNumbers}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,

        padding: 18,
        height: 210,
        marginHorizontal: 2,
        justifyContent: 'space-between'
    },
    shadow: {
        borderRadius: 20,
        backgroundColor: 'transparent',

        // shadowColor: '#c4c4c4',
        // shadowOffset: {
        //     width: 0,
        //     height: 1
        // },
        // shadowOpacity: 0.22,
        // shadowRadius: 2.22,

        // elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
        marginTop: 15,

        flexBasis: '47%',
        height: 210
    }
})

export default StatsCard
