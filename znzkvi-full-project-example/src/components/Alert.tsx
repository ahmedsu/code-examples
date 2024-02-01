import { StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import Text from '@components/Text'
import Colors from '@constants/Colors'
import useAlertStore from '@zustand/alertManagement/store'
import Animated, {
    ZoomInEasyDown,
    ZoomOutEasyUp
} from 'react-native-reanimated'
import Divider from './Divider'

let timeout: NodeJS.Timeout | null = null
const Alert = () => {
    const [visible, setVisible] = useState(false)
    const { title, message, type, setMessageAndType } = useAlertStore()
    const backgroundColor = useMemo(() => {
        switch (type) {
            case 'error':
                return Colors.red
            case 'success':
                return Colors.lightGreen
            default:
                return Colors.white
        }
    }, [type])

    useEffect(() => {
        if (type !== 'none') {
            setVisible(true)
            timeout = setTimeout(() => {
                setVisible(false)
                setMessageAndType('', '', 'none')
            }, 2000)
        }
        return () => {
            if (timeout) {
                setVisible(false)
                clearTimeout(timeout)
                timeout = null
            }
        }
    }, [type, setMessageAndType])
    if (!visible) return null
    return (
        <Animated.View
            entering={ZoomInEasyDown}
            exiting={ZoomOutEasyUp}
            style={[localStyles.container, { backgroundColor }]}>
            <Text fs={24}>{title}</Text>
            <Divider />
            <Text fs={18}>{message}</Text>
        </Animated.View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        maxHeight: 300,
        maxWidth: 250,
        padding: 10,
        position: 'absolute',
        top: 80,
        right: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10
    }
})

export default Alert
