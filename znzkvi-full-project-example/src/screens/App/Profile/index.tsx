import { View, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import SvgIcons from '@assets/svgs/icons'
import RoundButton from '@components/RoundButton'
import Svgs from '@assets/svgs'
import ProfileInfoRow from '@components/ProfileInfoRow'
import Divider from '@components/Divider'
import BottomTab from '@components/BottomTab'
import SettingsHeader from '@components/SettingsHeader'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useGetUserData from '@hooks/api/useGetUserData'
import RectangularButton from '@components/RectangularButton'
import Colors from '@constants/Colors'
import { IUser } from '@customTypes/IUser'
import useEditUserData from '@hooks/api/useEditUserData'
import CountryPickerInput from '@components/CountryPicker/CountryPickerInput'
import { ICountry } from '@components/CountryPicker/CountryPickerModal'

const Profile = () => {
    const [imePrezime, setImePrezime] = useState('')
    const [username, setUsername] = useState('')
    const [grad, setGrad] = useState('')
    const [drzava, setDrzava] = useState<Pick<ICountry, 'id' | 'name'> | null>(
        null
    )
    const [editMode, setEditMode] = useState(false)
    const [phone, setPhone] = useState('')
    const { editUserData } = useEditUserData()
    const { getUserData } = useGetUserData()
    const [baseValues, setBaseValues] = useState<IUser | null>(null)
    const getData = useCallback(async () => {
        const userData = await getUserData()
        if (userData.code === '0000') {
            setValues(userData.data)
        }
    }, [getUserData])
    const setValues = (data: IUser, includeBase = true) => {
        const {
            name,
            username: usernameApi,
            city,
            country,
            country_name,
            phone: phoneApi
        } = data
        setImePrezime(name)
        setUsername(usernameApi)
        setGrad(city)
        setDrzava({ id: country, name: country_name })
        setPhone(phoneApi)
        if (includeBase) setBaseValues(data)
    }
    const otkazi = useCallback(() => {
        if (!baseValues) return

        setValues(baseValues, false)
    }, [baseValues])

    const editUser = useCallback(async () => {
        if (drzava) {
            const res = await editUserData({
                name: imePrezime,
                username,
                city: grad,
                country: drzava.id,
                phone,
                email: baseValues?.email
            })
            if (res?.code === '0000') {
                setValues(res.data)
                setEditMode(false)
            }
        }
    }, [editUserData, imePrezime, username, grad, drzava, phone, baseValues])

    useEffect(() => {
        getData()
    }, [getData])
    return (
        <KeyboardAwareScrollView
            style={localStyles.container}
            contentContainerStyle={localStyles.contentContainer}>
            <SettingsHeader
                title="Profil"
                icon={
                    <SvgIcons.User
                        width={scaleByWidth(37)}
                        height={scaleByHeight(43)}
                    />
                }
            />
            <View style={localStyles.fullWidth}>
                <View style={localStyles.svgContainer}>
                    <RoundButton
                        icon={
                            <SvgIcons.Olovka
                                width={scaleByHeight(32)}
                                height={scaleByHeight(32)}
                            />
                        }
                        onPress={() => {
                            setEditMode(prev => {
                                if (!prev === false) otkazi()
                                return !prev
                            })
                        }}
                        style={localStyles.roundButton}
                    />
                    <Svgs.ProfileInfoContainer
                        preserveAspectRatio={'none'}
                        height={'100%'}
                        width={'100%'}
                        style={localStyles.svg}
                    />
                    <Divider size={50} />
                    <View style={localStyles.horizontalPadding}>
                        <ProfileInfoRow
                            label="IME I PREZIME:"
                            editMode={editMode}
                            value={imePrezime}
                            onChangeText={setImePrezime}
                        />
                        <Divider line size={3} />
                        <ProfileInfoRow
                            label="USERNAME:"
                            editMode={editMode}
                            value={username}
                            onChangeText={setUsername}
                        />
                        <Divider line size={3} />
                        <ProfileInfoRow
                            label="GRAD:"
                            editMode={editMode}
                            value={grad}
                            onChangeText={setGrad}
                        />
                        <Divider line size={3} />
                        <ProfileInfoRow
                            label="DRZAVA:"
                            editMode={editMode}
                            embedInputComponent={
                                <CountryPickerInput
                                    enabled={editMode}
                                    withIcon={false}
                                    isPickerInSettings
                                    selectedCountry={drzava}
                                    onChooseCountry={setDrzava}
                                />
                            }
                        />

                        <Divider line size={3} />
                        <ProfileInfoRow
                            label="TELEFON:"
                            editMode={editMode}
                            value={phone}
                            onChangeText={setPhone}
                        />
                        <Divider line size={3} />

                        <Divider size={30} />
                        {editMode && (
                            <View style={localStyles.buttonsContainer}>
                                <View style={localStyles.buttonContainerWidth}>
                                    <RectangularButton
                                        onPress={otkazi}
                                        backgroundColor={Colors.red}
                                        title="OTKAŽI"
                                        size="smaller"
                                    />
                                </View>
                                <View style={localStyles.buttonContainerWidth}>
                                    <RectangularButton
                                        title="SPASI"
                                        size="smaller"
                                        onPress={editUser}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            <Divider size={20} />

            <BottomTab currentTab="user" />
        </KeyboardAwareScrollView>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        justifyContent: 'space-between',
        flexGrow: 1
    },
    fullWidth: {
        width: '100%'
    },
    horizontalPadding: {
        paddingHorizontal: 15
    },
    svg: {
        ...StyleSheet.absoluteFillObject,
        left: 20,
        right: 20
    },
    roundButton: {
        position: 'absolute',
        zIndex: 2,
        top: -25,
        alignSelf: 'center'
    },
    svgContainer: {
        height: scaleByHeight(418) + 40,
        width: '100%',
        paddingHorizontal: 20
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonContainerWidth: {
        width: '48%'
    }
})
export default Profile
