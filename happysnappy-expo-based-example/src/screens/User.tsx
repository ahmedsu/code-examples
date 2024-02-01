import React, { useEffect, useRef } from 'react'
import { ScrollView, View, StyleSheet, Text } from 'react-native'

import { useSelector } from '../hooks/reduxHooks'
import { Divider } from 'react-native-elements'
import Container from 'components/Container'
import SettingsSingleRow from 'components/SettingSingleRow'
import { Button, Title } from 'components'
import { logOut } from 'helpers/userService'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import store from 'redux/store'

const User = () => {
    const scrollRef = useRef<any>()
    const isFocused = useIsFocused()

    useEffect(() => {
        const getValue = async() => {
            const userE = store.getState().user.user.email
            try {
                const imagesToStore: any = await AsyncStorage.getItem(
                    `@${userE}-imagesToStore`
                )
                const temp = JSON.parse(imagesToStore)

            } catch (error) {
              
            }
        }
        
        getValue()
        if (isFocused === false) {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true
            })
        }
    }, [isFocused])

    const { user } = useSelector(state => state.user)

    return (
        <Container style={{ paddingHorizontal: 0 }}>
            <ScrollView ref={scrollRef}>
                <View style={{ height: 31 }} />
                <Title style={{ marginLeft: 30 }}>My Account</Title>
                <View style={styles.shadow}>
                    <View style={styles.uploadsCard}>
                        <SettingsSingleRow
                            colors={['rgba(82, 196, 26, 0.25)', '#52C41A']}
                            title={'Profile Picture'}
                            onPress={() => {}}
                            isUser={true}
                            image="https://reactnative.dev/img/tiny_logo.png"
                            isEditable={false}
                        />
                        <Divider
                            style={{
                                marginVertical: 5,
                                backgroundColor: 'lightgray',
                                marginHorizontal: 10
                            }}
                        />
                        <SettingsSingleRow
                            colors={['#C8C8C8', '#fff']}
                            title={user?.displayName}
                            onPress={() => {}}
                            isUser={true}
                            iconName="user"
                            isEditable={false}
                        />
                        <Divider
                            style={{
                                marginVertical: 5,
                                backgroundColor: 'lightgray',
                                marginHorizontal: 10
                            }}
                        />
                        <SettingsSingleRow
                            colors={['#C8C8C8', '#fff']}
                            title={user?.email}
                            onPress={() => {}}
                            isUser={true}
                            iconName="mail"
                            isEditable={false}
                        />
                        <Divider
                            style={{
                                marginVertical: 5,
                                backgroundColor: 'lightgray',
                                marginHorizontal: 10
                            }}
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                paddingVertical: 20
                            }}>
                            <Button
                                onPress={() => {
                                    logOut(true)
                                }}>
                                <Text style={{ color: 'white' }}>Log Out</Text>
                            </Button>
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

        marginTop: 15,
        marginBottom: 50
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
    button: {
        borderRadius: 100,
        backgroundColor: '#45AEFF',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',

        margin: 20
    }
})

export default User
