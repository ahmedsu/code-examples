import { Alert, BackHandler } from 'react-native'
import store from 'redux/store'
import { signOut } from 'redux/actions/loginActions'
import EncryptedStorage from 'react-native-encrypted-storage'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { setTemplate } from 'redux/actions/templateActions'
import {
    clearUploads,
    setNewFilteredFailedUploads
} from 'redux/actions/uploadActions'
import * as Sentry from '@sentry/react-native'

export const setImageDataFromReduxToAsync = async () => {
    const isRememberMe = store.getState().login.isRememberMe

    const filteredSuccessful = store.getState().upload.filteredSuccessfulUploads
    const filteredFailed = store.getState().upload.filteredFailedUploads
    const filteredPending = store.getState().upload.filteredPendingUploads

    const totalSuccessful = store.getState().upload.totalSuccessfulUploads
    const totalFailed = store.getState().upload.totalFailedUploads
    const totalPending = store.getState().upload.totalPendingUploads

    const totalSuccessfulWithoutUUID =
        store.getState().upload.totalSuccessfulUploadsWithoutUUID
    const totalFailedWithoutUUID =
        store.getState().upload.totalFailedUploadsWithoutUUID
    const totalPendingWithoutUUID =
        store.getState().upload.totalPendingUploadsWithoutUUID

    const autoPending = store.getState().settings.autoProcessPendingQueue

    const savedUploads = {
        filteredSuccessful: filteredSuccessful,
        filteredFailed: filteredFailed,
        filteredPending: filteredPending,

        totalSuccessful: totalSuccessful,
        totalFailed: totalFailed,
        totalPending: totalPending,

        totalSuccessfulWithoutUUID: totalSuccessfulWithoutUUID,
        totalFailedWithoutUUID: totalFailedWithoutUUID,
        totalPendingWithoutUUID: totalPendingWithoutUUID,

        autoPending: autoPending
    }
    let email

    const getEmail = async () => {
        const session = store.getState().user.user?.email

        if (session !== undefined) {
            email = session
        }
    }
    try {
        await getEmail()
        const jsonValue = JSON.stringify(savedUploads)
        await AsyncStorage.setItem(`@${email}`, jsonValue)
        store.dispatch(clearUploads())
        const userE = store.getState().user.user.email
        AsyncStorage.removeItem(`@${userE}-imagesToStore`)

    } catch (e) {
        // saving error
    }

    if (isRememberMe === false) {
        await EncryptedStorage.setItem('user_session', '')
    }
}

export const logOut = async (wasInitiatedByUser?: boolean) => {
    Sentry.setUser(null)
    if (wasInitiatedByUser) {
        await setImageDataFromReduxToAsync()
        store.dispatch(clearUploads())
    }

    store.dispatch(setTemplate(null))
    store.dispatch(signOut()) // THIS LOGS OUT THE USER, THE SAME THING LINE ABOVE DID
}

export const displayKickedOutMessage = (statusCode: number) => {
    const title = 'Logged Out'
    let message = 'You were logged out by the system.'

    switch (statusCode) {
        case 453: {
            message += '\n\n Warning: Mismatched session based on device.'
            break
        }
        case 454: {
            message += '\n\n Warning: Mismatched session based on device.'
            break
        }
        case 455: {
            message += '\n\n Warning: You were already logged out.'
            break
        }
        case 456: {
            message +=
                '\n\n Warning: Your user account was used to sign in on another device.'
            break
        }
        case 457: {
            message += '\n\n Warning: Session timed out.'
            break
        }
        case 458: {
            message += '\n\n Warning: Session was closed by the system.'
            break
        }
        case 459: {
            message += '\n\n Error: The session encountered a server error.'
            break
        }
    }

    Alert.alert(title, message, [{ text: 'OK', onPress: () => logOut() }], {
        cancelable: false
    })
}
