import Upload from 'react-native-background-upload'
import { logOut, displayKickedOutMessage } from './userService'
import DeviceInfo from 'react-native-device-info'
import { photoStoragePath } from 'constants/UploadConstants'
import { setUser } from '../redux/actions/userActions'
import store from 'redux/store'
import { restoreToken, signIn } from 'redux/actions/loginActions'
import { Platform } from 'react-native'
import checkConnection from './checkConnection'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { hideMessage, showMessage } from 'react-native-flash-message'
import {
    setNewTotalFailedUploadsWithoutUUID,
    setNewTotalSuccessfulUploadsWithoutUUID,
    setTotalFailedUploadsWithoutUUID,
    setTotalSuccessfulUploadsWithoutUUID
} from 'redux/actions/uploadActions'

import * as Sentry from '@sentry/react-native'

export const BASE_URL = 'https://happy-snappy-lite-uat.herokuapp.com/api' // 'https://happy-snappy-lite.herokuapp.com/api'
//PROD https://happy-snappy-lite.herokuapp.com/api
//UAT https://happy-snappy-lite-uat.herokuapp.com/api
const deviceId = DeviceInfo.getUniqueId()
const axios = require('axios').default

export const authenticatedHeader = () => {
    const token = store.getState().login.userToken

    return {
        Authorization: 'Bearer ' + token,
        DeviceId: deviceId
    }
}

export const authenticatedHeadersForJSON = () => {
    const token = store.getState().login.userToken
    return {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        DeviceId: deviceId
    }
}
export const authenticatedHeadersForFormDataPost = () => {
    const token = store.getState().login.userToken

    return {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
        DeviceId: deviceId
    }
}
export const refreshToken = () => {
    return axios({
        method: 'POST',
        url: `${BASE_URL}/account/refreshToken`,
        headers: authenticatedHeader()
    })
        .then((response: { data: any; status: any }) => {
            const jsonData = response?.data

            store.dispatch(restoreToken(jsonData?.token))
            return response?.status
        })
        .catch((error: any) => {
            throw error
        })
}

axios.interceptors.response.use(
    undefined,
    async (apiError: { response?: any; config: any }) => {
        if (
            apiError.response &&
            apiError.response.status === 401 &&
            apiError.config
        ) {
            try {
                // refresh access token
                const res = await refreshToken()

                if (res === 200) {
                    const { config: oldRequest } = apiError
                    // retrigger old request

                    axios.request({
                        ...oldRequest,
                        headers: authenticatedHeader()
                    })
                } else {
                    // go to login page.
                    logOut()
                }
            } catch (error) {
                // refresh failed, return to login page

                logOut()
            }
        }
    }
)

export const authenticateUser = async ({
    username,
    password
}: {
    username: string
    password: string
}) => {
    return axios({
        method: 'post',
        url: `${BASE_URL}/account/login`,
        headers: authenticatedHeadersForJSON(),
        data: JSON.stringify({
            email: username,
            password: password,
            Extra: 'App'
        })
    })
        .then((response: { status: number; data: any; _bodyText: string }) => {
            if (response.status == 200) {
                return response?.data
            } else if (response.status == 403) {
                throw {
                    title: 'Login failed',
                    message: 'Incorrect username or password'
                }
            } else if (response.status == 500) {
                throw {
                    title: 'Server error',
                    message:
                        'Error occurred on the server, please try again later. \n\n Message: ' +
                        response._bodyText
                }
            } else {
                throw {
                    title: 'Unexpected error',
                    message:
                        'Unexpected error occurred. \n\n Message: ' +
                        response._bodyText
                }
            }
        })
        .then(async (response: any) => {
            const authenticated = response?.token != null

            if (authenticated) {
                // Store the Auth Token from the service for subsequent calls to the RestAPI
                try {
                    store.dispatch(signIn(response.token))
                    await getUserInfo()
                    // eslint-disable-next-line no-empty
                } catch (error) {}
            }

            return authenticated
        })
        .catch((error: any) => {
            throw error
        })
}

export const getUserInfo = async () => {
    return axios({
        method: 'get',
        url: `${BASE_URL}/account`,
        headers: authenticatedHeadersForJSON()
    })
        .then((response: { status: any; json: () => any; data: any }) => {
            store.dispatch(setUser(response.data))

            return true
        })

        .catch(async (error: any) => {
            throw error
        })
}

export const getProjects = async () => {
    let userId = store.getState().user.user?.id

    if (userId === undefined) {
        await getUserInfo()
        userId = store.getState().user.user?.id
    }

    return axios({
        method: 'get',
        url: `${BASE_URL}/templategroups/user/${userId}/templategroups`,
        headers: authenticatedHeadersForJSON()
    })
        .then((response: any) => {
            if (response === undefined) {
                return 'Empty'
                //getProjects()
            }

            if (response.data === undefined) {
                //getProjects()
            }
            return response.data
        })

        .catch((error: any) => {
            throw error
        })
}

export const getTemplates = async () => {
    let subPackageId = store.getState().user.user?.subscriptionId

    if (subPackageId === undefined) {
        await getUserInfo()
        subPackageId = store.getState().user.user?.subscriptionPackageId
    }

    return axios({
        method: 'get',
        url: `${BASE_URL}/templates/subscriptions/${subPackageId}/templates?mode=info&filter=all`,
        headers: authenticatedHeadersForJSON()
    })
        .then((response: { status: any; json: () => any; data: any }) => {
            return response.data
        })

        .catch((error: any) => {
            throw error
        })
}

export const getTemplateByCode = async (templateCode: any) => {
    let subPackageId = store.getState().user.user?.subscriptionPackageId

    if (subPackageId === undefined) {
        getUserInfo()
        subPackageId = store.getState().user.user?.subscriptionPackageId
    }
    return axios({
        method: 'get',
        url: `${BASE_URL}/templates/by/code/${templateCode}?mode=info`,
        headers: authenticatedHeadersForJSON()
    })
        .then((response: { status: any; json: () => any; data: any }) => {
            return response.data.name
        })

        .catch((error: any) => {
            throw error
        })
}

export const validateScannedQRCodeForTemplate = async (
    qrCode: string | null,
    onSuccess: () => void,
    onFailure: { (error: any): void; (): void }
) => {
    return fetch(`${BASE_URL}/albumcodes/validate` + qrCode, {
        method: 'GET',
        headers: authenticatedHeader()
    })
        .then(response => {
            if (response.ok === true) {
                onSuccess?.()
                return response.status
            } else {
                onFailure()
                return response.status
            }
        })
        .catch(error => {
            onSuccess()
            //throw error
        })
}

export const linkAnotherQrToPhoto = async (
    photoCode: any,
    qrCode: any,
    onSuccess: () => void,
    onFailure: () => void
) => {
    return fetch(`${BASE_URL}/photo/linkcode/${photoCode}/${qrCode}`, {
        method: 'POST',
        headers: authenticatedHeader()
    })
        .then(response => {
            if (response.ok === true) {
                onSuccess()
                return response.status
            } else {
                onFailure()
                return response.status
            }
        })
        .catch(error => {
            onFailure()
            throw error
        })
}

export interface IUploadPhoto {
    projectId: string
    templateName?: any
    templateCode: any
    albumCode: any
    photoOrientation: string
    photoDateTime: any
    image: any
    onComplete: (val: any) => void
    onFailure: (val: any) => void
    failedOnce: boolean
}

export const uploadPhoto = async ({
    projectId,
    templateCode,
    albumCode,
    photoOrientation,
    photoDateTime,
    image,
    onComplete,
    onFailure,
    failedOnce
}: IUploadPhoto) => {
    Sentry.setContext('Upload Start', {
        fileName: image.fileName
    })
    Sentry.captureMessage('Image is uploading... ')

    if (photoOrientation === undefined) {
        photoOrientation = 'PortraitTop'
    }

    if (albumCode === '') {
        albumCode = store.getState().upload.scannedAlbumCode
    }

    // We always need to prepend with the DocumentDirectory from RNFS to get the current
    // Documents path to the image URI

    const path = Platform.OS === 'android' ? '' : 'file://'
    const imageUri = path + photoStoragePath + image.fileName

    const parameters = {
        TemplateCode: templateCode,
        PhotoData: imageUri,
        PhotoDateTime: photoDateTime,
        PhotoOrientation: photoOrientation,
        GeolocationData: '',
        AlbumCode: albumCode,
        TemplateGroupId: projectId?.toString()
    }
    const options = {
        url: `${BASE_URL}/photo/UploadPhotoBus`,
        path: imageUri,
        method: 'POST',
        type: 'multipart',
        headers: authenticatedHeadersForFormDataPost(),
        field: 'PhotoData',
        parameters: parameters,
        notification: {
            enabled: false
        }
    }
    if ((await checkConnection()) === false) {
        const specialJson = {
            failedOnce: true,
            json: {
                albumCode: `@${albumCode}`,
                photoCode: '-',
                qrCodeURL: '-',
                viewURL: '-'
            },
            status: 500
        }
        onComplete({ status: 503, json: specialJson })
        return 0
    }

    Upload.startUpload(options)
        .then((uploadId: any) => {
            Upload.addListener('progress', uploadId, async (data: any) => {})

            Upload.addListener('cancelled', uploadId, (data: any) => {
                onComplete({ status: data.responseCode, responseBody: data })
            })

            Upload.addListener('error', uploadId, (data: any) => {
                onComplete({
                    status: data.responseCode,
                    json: data,
                    failedOnce: failedOnce
                })

                Sentry.setContext('failed upload', {
                    options: options,
                    uploadId: uploadId,
                    fileName: image.fileName,
                    error: data
                })

                Sentry.captureException(data)
            })

            Upload.addListener('completed', uploadId, (data: any) => {
                Sentry.setContext('uploading success', {
                    options: options,
                    fileName: image.fileName,
                    uploadId: uploadId
                })
                Sentry.captureMessage('Image uploaded: ')

                try {
                    const json = JSON.parse(data.responseBody)
                    onComplete({
                        status: data.responseCode,
                        responseBody: json
                    })
                } catch (err) {
                    onComplete({ responseBody: err })
                }
            })
        })
        .catch((err: any) => {
            onComplete({ json: err })
            Sentry.setContext('uploading failed', {
                options: options,
                fileName: image.fileName,
                error: err
            })
            Sentry.captureException(err)
        })
}

export const sendPhotoUploadNotificationEmail = async ({
    imageCode,
    emailAddress
}: any) => {
    return fetch(
        `${BASE_URL}/notifications/` +
            imageCode +
            '/email?address=' +
            emailAddress,
        {
            method: 'POST',
            headers: authenticatedHeader()
        }
    )
        .then(response => {
            return response.status
        })
        .catch(error => {
            throw error
        })
}

export const linkPhotoToAlbum = async ({ photoCode, albumCode }: any) => {
    return fetch(`${BASE_URL}/photos/linkcode/` + photoCode + '/' + albumCode, {
        method: 'POST',
        headers: authenticatedHeader()
    })
        .then(response => {
            return response.status
        })
        .catch(error => {
            throw error
        })
}

export const singleSignOnCheck = async (
    response: any,
    callBack: (() => void) | undefined
) => {
    if (
        (response.status >= 453 && response.status <= 459) ||
        response.status === 401
    ) {
        try {
            await refreshToken()

            //callBack()
        } catch (error) {
            logOut()
            displayKickedOutMessage(response.status)
            return Promise.reject(new Error(response.statusText))
        }
    } else {
        return Promise.resolve(response)
    }
}

export const removeBackground = async (image: { fileName: string }) => {
    const imageUri = photoStoragePath + image.fileName
    const options = {
        url: `${BASE_URL}/greenscreen/Normalfiles`,
        path: imageUri,
        method: 'POST',
        type: 'multipart',
        headers: authenticatedHeadersForFormDataPost(),
        field: 'FileData',
        parameters: {
            FileData: imageUri
        }
    }
    return new Promise((resolve, reject) => {
        Upload.startUpload(options).then((uploadId: any) => {
            /*Upload.addListener('progress', uploadId, (data: any) => {
                
            })*/
            Upload.addListener('completed', uploadId, (data: any) => {
                resolve(data.responseBody)
            })
            Upload.addListener('error', uploadId, (data: any) => {
                reject(data)
            })
        })
    })
}

export const getPhotosOnCloud = async () => {
    if (!(await checkConnection())) return

    //const failed = store.getState().upload.totalFailedUploadsWithoutUUID
    const failed: any[] = [
        ...store.getState().upload.totalFailedUploadsWithoutUUID
    ]
    // const username = store.getState().user.username
    // const valueAb: any = await AsyncStorage.getItem(`@${username}`)

    // if (valueAb === null) {
    //     const fail = store.getState().upload.totalFailedUploadsWithoutUUID

    //     if (failed !== null) {
    //         failed = [...fail]
    //     } else {
    //         failed = valueAb
    //             ? JSON.parse(valueAb?.totalFailedUploadsWithoutUUID)
    //             : []
    //     }
    // }
    if (failed.length < 1) return
    const fileNames = failed.map((elem: any) => {
        return elem.image.fileName
    })

    return axios({
        method: 'post',
        url: `${BASE_URL}/templategroups/photos/mobile`,
        headers: authenticatedHeadersForJSON(),
        data: JSON.stringify({
            fileNames: fileNames
        })
    })
        .then((response: any) => {
            const newArr = [...response.data]
            const arrToChange = [...failed]
            for (let i = 0; i < (failed || []).length; i++) {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let j = 0; j < newArr.length; j++) {
                    if (newArr[j].fileName === failed[i].image.fileName) {
                        const newImg = failed[i]
                        newImg.response = {}
                        newImg.response.json = newArr[j]
                        store.dispatch(
                            setTotalSuccessfulUploadsWithoutUUID(newImg)
                        )
                        arrToChange[i] = -1
                        break
                    }
                }
            }
            const filteredElements = arrToChange.filter(
                element => element !== -1
            )
            store.dispatch(
                setNewTotalFailedUploadsWithoutUUID(filteredElements)
            )
        })
        .catch((error: any) => {})
}

export const getPhotosDataFromCloudAfterUpload = async () => {
    if (!(await checkConnection())) return
    //const failed = store.getState().upload.totalFailedUploadsWithoutUUID
    const successful: any[] =
        store.getState().upload.totalSuccessfulUploadsWithoutUUID
    if (successful.length < 1) return
    const imagesWithoutJson = successful.filter(
        (elem: any) =>
            elem?.response?.json?.photoCode === undefined ||
            elem?.response?.json?.photoCode === ''
    )
    if (imagesWithoutJson.length < 1) return
    const fileNames = imagesWithoutJson.map((elem: any) => {
        return elem.image.fileName
    })
    return axios({
        method: 'post',
        url: `${BASE_URL}/templategroups/photos/mobile`,
        headers: authenticatedHeadersForJSON(),
        data: JSON.stringify({
            fileNames: fileNames
        })
    })
        .then((response: any) => {
            const newArr = [...response.data]
            const arrToChange = [...successful]
            const changedValues = []
            for (let i = 0; i < (successful || []).length; i++) {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let j = 0; j < newArr.length; j++) {
                    if (newArr[j].fileName === successful[i].image.fileName) {
                        const newImg = successful[i]
                        newImg.response = {}
                        newImg.response.json = newArr[j]

                        arrToChange[i] = -1
                        changedValues.push(newImg)
                        break
                    }
                }
            }
            const filteredElements = arrToChange.filter(
                element => element !== -1
            )
            store.dispatch(
                setNewTotalSuccessfulUploadsWithoutUUID(
                    [...filteredElements, ...changedValues],
                    false
                )
            )
        })
        .catch((error: any) => {})
}
