import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'
import { Text } from 'components'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import Icon from 'react-native-vector-icons/Ionicons'
import { default as MaterialIcon } from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const SettingsSingleRow = ({
    colors,
    title,
    onPress,
    autoProcessQueue,
    value,
    isEditable,

    isUser,
    image,
    iconName = 'user',
    password
}: any) => {
    const [isUserSet, setIsUserSet] = useState<boolean>(false)

    useEffect(() => {
        if (isUser === undefined) {
            setIsUserSet(false)
        } else {
            setIsUserSet(isUser)
        }
    }, [])

    let iconToShow
    if (password === undefined) {
        if (title.split(':')[0] === 'Successful') {
            iconToShow = <Icon name="checkmark" size={15} color={colors[1]} />
        } else if (title.split(':')[0] === 'Pending') {
            iconToShow = (
                <Entypo
                    name="dots-three-horizontal"
                    size={15}
                    color={colors[1]}
                />
            )
        } else if (title.split(':')[0] === 'Failed') {
            iconToShow = <FeatherIcon name="x" size={15} color={colors[1]} />
        } else if (title === 'Stats') {
            iconToShow = <Icon name="stats-chart" size={15} color={colors[1]} />
        } else if (title === 'Auto process queue') {
            iconToShow = (
                <MaterialIcon name="menu-open" size={15} color={colors[1]} />
            )
        }
    }

    const iconPath = () => {
        switch (iconName) {
            case 'user':
                return require('../assets/icons/user.png')
            case 'mail':
                return require('../assets/icons/mail.png')
            case 'lock':
                return require('../assets/icons/lock.png')
            case 'phone':
                return require('../assets/icons/phone.png')
            default:
                return require('../assets/icons/user.png')
        }
    }

    return (
        <View>
            {isUserSet ? (
                <TouchableOpacity
                    disabled={!isEditable}
                    onPress={onPress}
                    style={styles.singleRow}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {image != undefined ? (
                            <View
                                style={{
                                    width: 31,
                                    height: 31,
                                    borderRadius: 31,
                                    backgroundColor: 'orange',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <Image
                                    source={require('../assets/logo/white_logo.png')}
                                    style={{
                                        width: 25,
                                        height: 10
                                    }}
                                />
                            </View>
                        ) : (
                            <Image
                                source={iconPath()}
                                style={{
                                    width: 31,
                                    height: 31
                                }}
                            />
                        )}

                        {password ? (
                            <TextInput
                                style={{
                                    marginLeft: 12
                                }}
                                value="123456"
                                secureTextEntry={true}
                            />
                        ) : (
                            <Text style={{ marginLeft: 12 }}>{title}</Text>
                        )}
                    </View>
                    {isEditable ? (
                        <TouchableOpacity onPress={onPress}>
                            <MaterialCommunityIcon
                                name="pencil"
                                color={'black'}
                                size={20}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View></View>
                    )}
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={onPress} style={styles.singleRow}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: colors[0] }
                            ]}>
                            {iconToShow}
                        </View>
                        <Text style={{ marginLeft: 12 }}>{title}</Text>
                    </View>
                    {autoProcessQueue ? (
                        <ToggleSwitch
                            isOn={value}
                            onColor="#FBBA00"
                            offColor="#767577"
                            size="medium"
                            onToggle={onPress}
                        />
                    ) : (
                        <TouchableOpacity
                            onPress={onPress}
                            style={styles.arrowIconContainer}>
                            <FeatherIcon
                                name="arrow-right"
                                color={'black'}
                                size={15}
                            />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    singleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        margin: 20
    },
    iconContainer: {
        borderRadius: 20,
        padding: 5
    },
    arrowIconContainer: {
        padding: 3,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black'
    }
})

export default SettingsSingleRow
