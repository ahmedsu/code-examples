/* eslint-disable @typescript-eslint/prefer-for-of */
declare let global: any

import moment from 'moment'
import { momentDateFormat } from 'constants/SettingsContants'
import store from 'redux/store'
import 'react-native-get-random-values'
import { stringify, v4 as uuidv4 } from 'uuid'
import {
    clearUploads,
    setLastAdhocUpload,
    setLastAdhocUploadQueueId,
    setMultipleImagesToUpload,
    setNewTotalFailedUploadsWithoutUUID,
    setNewTotalPendingUploadsWithoutUUID,
    setTotalFailedUploadsWithoutUUID,
    setTotalPendingUploadsWithoutUUID,
    setTotalSuccessfulUploads,
    setTotalSuccessfulUploadsWithoutUUID
} from 'redux/actions/uploadActions'
import Upload from 'react-native-background-upload'
import {
    getPhotosOnCloud,
    refreshToken,
    uploadPhoto as uploadPhotoToServer
} from './restApi'
import calculateStatsForUploads from './uploadStatsCalc'
import { setBottomTabs } from 'redux/actions/bottomTabActions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import checkConnection from './checkConnection'
import { setIsLoading } from 'redux/actions/loadingActions'
import { photoStoragePath } from 'constants/UploadConstants'
import { logOut } from './userService'
import { showMessage, hideMessage } from 'react-native-flash-message'
import EncryptedStorage from 'react-native-encrypted-storage'

import * as Sentry from '@sentry/react-native'

if (__DEV__ && typeof global.crypto !== 'object') {
    global.crypto = {
        getRandomValues: (array: any[]) =>
            array.map(() => Math.floor(Math.random() * 256))
    }
} else {
    require('react-native-get-random-values')
}

const RNFS = require('react-native-fs')

export const getTotalDiskSpaceByUser = (
    filteredSuccessfulUploads: any[],
    filteredPendingUploads: any[],
    filteredFailedUploads: any[]
) => {
    let success: any = calculateStatsForUploads(
        filteredSuccessfulUploads
    ).dataUsedToDisplay
    let pending: any = calculateStatsForUploads(
        filteredPendingUploads
    ).dataUsedToDisplay
    let failed: any = calculateStatsForUploads(
        filteredFailedUploads
    ).dataUsedToDisplay

    if (success === '-') {
        success = 0
    }
    if (pending === '-') {
        pending = 0
    }
    if (failed === '-') {
        failed = 0
    }

    success = Number.parseFloat(success)
    pending = Number.parseFloat(pending)
    failed = Number.parseFloat(failed)

    return Number.parseFloat(success + pending + failed).toFixed(2)
}

export const cleanUpPhotos = async () => {
    const { totalPendingUploads, totalFailedUploads, totalSuccessfulUploads } =
        store.getState().upload
    const email = store.getState().user.user?.email
    const promisesArr: any[] = []
    const totalUploads = [
        ...totalSuccessfulUploads,
        ...totalFailedUploads,
        ...totalPendingUploads
    ]
    totalUploads.forEach(upload => {
        promisesArr.push(RNFS.unlink(photoStoragePath + upload.image.fileName))
    })
    try {
        store.dispatch(clearUploads())
        const userE = store.getState().user.user.email
        AsyncStorage.removeItem(`@${userE}-imagesToStore`)
        await AsyncStorage.removeItem(`@${email}`)
        await Promise.allSettled(promisesArr)
        showMessage({
            message: 'Photos successfuly cleared.',
            type: 'success'
        })
    } catch (err) {
        showMessage({
            message: 'Photos successfuly cleared.',
            type: 'success'
        })
    }
}

export const successfulUploadsForUserForSelectedMonthAndYear = ({
    selectedDate
}: any) => {
    const user = store.getState().user?.user
    const totalSuccessfulUploadsForStats =
        store.getState().upload.totalSuccessfulUploadsForStats
    const userId = user?.id
    const allSuccessfulUploadsForUser = totalSuccessfulUploadsForStats?.filter(
        (upload: { userId: any }) => upload.userId === userId
    )
    return allSuccessfulUploadsForUser.filter((upload: { uploadDate: any }) => {
        const uploadDate = moment(upload.uploadDate)
        return (
            uploadDate.year() === selectedDate.year() &&
            uploadDate.month() === selectedDate.month()
        )
    })
}

export const getMappedOrientation = (originalOrientation: any) => {
    const mappedOrientations = {
        UNKNOWN: 'PortraitTop', // If it is unknown, default it to PortraitTop
        'LANDSCAPE-LEFT': 'LandscapeLeft',
        'LANDSCAPE-RIGHT': 'LandscapeRight',
        PORTRAIT: 'PortraitTop',
        'FACE-UP': 'PortraitTop',
        'PORTRAIT-UPSIDEDOWN': 'PortraitTop',
        LandscapeLeft: 'LandscapeLeft',
        LandscapeRight: 'LandscapeRight',
        PortraitTop: 'PortraitTop'
    }

    return mappedOrientations[originalOrientation]
}

// export const photoStoragePath = () => {
//     return RNFS.DocumentDirectoryPath + '/'
// }

export const filterUploadsByUserId = (
    user: { id: any } | undefined,
    totalSuccessfulUploadsWithoutUUID: any[],
    setFiltered: (arg0: any[]) => void
) => {
    const userId = user?.id
    let filteredArray = totalSuccessfulUploadsWithoutUUID.filter(
        upload => upload.userId === userId
    )
    filteredArray = filteredArray.filter(upload => {
        return upload.isDeleted === undefined || upload.isDeleted === false
    })

    const sortedFilteredArray = filteredArray.sort((a, b) => {
        const aDate =
            moment(a.uploadDate, momentDateFormat) ||
            moment(a.date, momentDateFormat)
        const bDate =
            moment(b.uploadDate, momentDateFormat) ||
            moment(b.date, momentDateFormat)
        return bDate - aDate
    })

    setFiltered(sortedFilteredArray)
}

export const addSuccessfulUpload = (upload: any) => {
    const dispatch = store.dispatch
    const pen = store.getState().upload.totalPendingUploadsWithoutUUID
    const fail = store.getState().upload.totalFailedUploadsWithoutUUID

    dispatch(setTotalSuccessfulUploadsWithoutUUID(upload))

    const res = pen.filter(ele => ele.image.fileName !== upload.image.fileName)
    dispatch(setNewTotalPendingUploadsWithoutUUID(res))

    const resFail = fail.filter(
        ele => ele.image.fileName !== upload.image.fileName
    )
    dispatch(setNewTotalFailedUploadsWithoutUUID(resFail))

    const tempUpload = { ...upload }
    tempUpload.userId = uuidv4() //Somehow messes up the above redux state set

    dispatch(setTotalSuccessfulUploads(tempUpload))
}

const addFailedUpload = async (upload: any) => {
    const pen = store.getState().upload.totalPendingUploadsWithoutUUID
    const dispatch = store.dispatch
    dispatch(setTotalFailedUploadsWithoutUUID(upload))

    const res = pen.filter(ele => ele.image.fileName !== upload.image.fileName)
    dispatch(setNewTotalPendingUploadsWithoutUUID(res))
}

export const addPendingUpload = (upload: any) => {
    const fail = store.getState().upload.totalFailedUploadsWithoutUUID
    const dispatch = store.dispatch

    dispatch(setTotalPendingUploadsWithoutUUID(upload))

    const resFail = fail.filter(
        ele => ele.image.fileName !== upload.image.fileName
    )
    dispatch(setNewTotalFailedUploadsWithoutUUID(resFail))
}

export const uploadPhoto = async (
    projectId: string,
    templateName: string,
    templateCode: any,
    albumCode: any,
    photoOrientation: any,
    photoDateTime: any,
    image: { fileName: any },
    success: (arg0: any, arg1: any) => void,
    failure: (arg0: any, arg1: any) => void,
    isAlreadyPendingUpload: any,
    type: string
) => {
    if (albumCode === '') {
        albumCode = store.getState().upload.scannedAlbumCode
    }

    const dispatch = store.dispatch
    const mappedOrientation = getMappedOrientation(photoOrientation)
    const user = store.getState().user.user
    const keepImageFor = store.getState().settings.keepPhotosDurationIndex

    const email = EncryptedStorage.getItem('user_session')
    if (photoDateTime === undefined) {
        photoDateTime = new Date().toISOString()
    }

    const params: any = {
        userId: user?.id,
        date: photoDateTime,
        uploadDate: new Date().toISOString(),
        templateCode: templateCode,
        albumCode: albumCode,
        photoOrientation: mappedOrientation,
        image: image,
        keepImageFor: keepImageFor,
        templateName: templateName,
        TempalteGroupId: projectId.toString()
    }

    const onComplete = async (uploadResults: {
        status: number
        responseBody: any
        failedOnce: any
    }) => {
        if (uploadResults.failedOnce === undefined)
            uploadResults.failedOnce = false
        if (uploadResults.status === undefined) uploadResults.status = 401

        if (uploadResults.failedOnce === true && uploadResults.status === 401) {
            logOut(true)
        }
        if (
            uploadResults.status === 401 &&
            uploadResults.failedOnce === false
        ) {
            const token = await refreshToken()
            if (token === undefined){
                uploadResults.status = 1337
                
            } else {
                uploadPhotoToServer({
                projectId,
                templateCode,
                albumCode,
                photoOrientation: mappedOrientation,
                photoDateTime,
                image,
                onComplete,
                onFailure: async () => {
                    if (await checkConnection()) dispatch(setBottomTabs(true))
                },
                failedOnce: true
            })
            return
            }
            
        }

        if (
            uploadResults.status === 200 &&
            uploadResults.responseBody === true
        ) {
            let uploadSize

            Upload.getFileInfo(photoStoragePath + image.fileName).then(info => {
                uploadSize = info.size

                const uploadId = addSuccessfulUpload({
                    TemplateGroupId: projectId.toString(),
                    userId: user?.id,
                    date: photoDateTime,
                    uploadDate: new Date().toISOString(),
                    uploadSize: uploadSize,
                    templateCode: templateCode,
                    albumCode: albumCode,
                    photoOrientation: mappedOrientation,
                    image: image,
                    keepImageFor: keepImageFor,
                    templateName: templateName,
                    response: uploadResults
                })
                success(uploadResults.responseBody, uploadId)
            })
        } else {
            if (await checkConnection()) {
                hideMessage()
                if (type !== 'Failed') {
                    if (type === 'Pending') {
                        const uploadId = addFailedUpload({
                            TemplateGroupId: projectId.toString(),
                            userId: user?.id,
                            date: photoDateTime,
                            templateCode: templateCode,
                            albumCode: albumCode,
                            photoOrientation: mappedOrientation,
                            image: image,
                            keepImageFor: keepImageFor,
                            templateName: templateName,
                            response: uploadResults
                        })
                        failure(uploadResults.responseBody)
                        return
                    } else if (type === 'Camera') {
                        const uploadId = addPendingUpload({
                            TemplateGroupId: projectId.toString(),
                            userId: user?.id,
                            date: photoDateTime,
                            templateCode: templateCode,
                            albumCode: albumCode,
                            photoOrientation: mappedOrientation,
                            image: image,
                            keepImageFor: keepImageFor,
                            templateName: templateName,
                            response: uploadResults
                        })
                        success(uploadResults.responseBody, uploadId)
                    } else {
                        const uploadId = addFailedUpload({
                            TemplateGroupId: projectId.toString(),
                            userId: user?.id,
                            date: photoDateTime,
                            templateCode: templateCode,
                            albumCode: albumCode,
                            photoOrientation: mappedOrientation,
                            image: image,
                            keepImageFor: keepImageFor,
                            templateName: templateName,
                            response: uploadResults
                        })
                        success(uploadResults.responseBody, uploadId)
                    }
                } else {
                    failure(uploadResults.responseBody, 'Failed')
                }
            } else {
                if (type === 'Camera') {
                    const uploadId = addPendingUpload({
                        TemplateGroupId: projectId.toString(),
                        userId: user?.id,
                        date: photoDateTime,
                        templateCode: templateCode,
                        albumCode: albumCode,
                        photoOrientation: mappedOrientation,
                        image: image,
                        keepImageFor: keepImageFor,
                        templateName: templateName,
                        response: uploadResults
                    })
                    success(uploadResults.responseBody, uploadId)
                } else if (type === 'Pending') {
                    addFailedUpload({
                        TemplateGroupId: projectId.toString(),
                        userId: user?.id,
                        date: photoDateTime,
                        templateCode: templateCode,
                        albumCode: albumCode,
                        photoOrientation: mappedOrientation,
                        image: image,
                        keepImageFor: keepImageFor,
                        templateName: templateName,
                        response: uploadResults
                    })
                    failure(uploadResults.responseBody)
                } else if (type === 'Failed') {
                    failure(uploadResults.responseBody, 'Failed')
                }
            }
            dispatch(setIsLoading(false))
        }
    }
    uploadPhotoToServer({
        projectId,
        templateCode,
        albumCode,
        photoOrientation: mappedOrientation,
        photoDateTime,
        image,
        onComplete,
        onFailure: async () => {
            if (await checkConnection()) dispatch(setBottomTabs(true))
        },
        failedOnce: false
    }).catch(error => {
        // This is actually adding to PENDING UPLOADS if there was some uncaught error

        if (!isAlreadyPendingUpload) {
            Sentry.setContext('uploading failed(uncaught)', {
                fileName: image.fileName,
                error: error
            })
            Sentry.captureException('Error while trying to upload(uncaught).')

            const uploadId = addPendingUpload({
                TemplateGroupId: projectId.toString(),
                userId: user?.id,
                date: photoDateTime,
                templateCode: templateCode,
                albumCode: albumCode,
                photoOrientation: mappedOrientation,
                image: image,
                keepImageFor: keepImageFor,
                response: null
            })
            success('Pendingg', uploadId)
        }
    })
}

export const uploadPhotosInPending = async () => {
    const autoProcessQue = store.getState().settings.autoProcessPendingQueue

    if (autoProcessQue === false || autoProcessQue === undefined) {
        return
    }

    const pendingUploads =
        store.getState().upload.totalPendingUploadsWithoutUUID
    const dispatch = store.dispatch

    if (pendingUploads !== undefined && pendingUploads?.length > 0) {
        const photoDateTime = new Date().toISOString()
        let difference: any[] = []
        for (const item of pendingUploads) {
            showMessage({
                message: 'Images are being uploaded in the background..',
                type: 'default',
                autoHide: false
            })
            const templateCode = item?.templateCode

            const fileName = item?.image?.fileName
            const templateName = item?.templateName

            const user = store.getState().user.user
            const keepImageFor =
                store.getState().settings.keepPhotosDurationIndex

            const projectId = store.getState().project.project?.id

            const mappedOrientation = getMappedOrientation(
                item?.photoOrientation
            )
            const params: any = {
                userId: user?.id,
                date: photoDateTime,
                uploadDate: new Date().toISOString(),
                templateCode: templateCode,
                albumCode: item?.albumCode,
                photoOrientation: mappedOrientation,
                image: { fileName },
                keepImageFor: keepImageFor,
                templateName: templateName,
                TemplateGroupId: projectId.toString()
            }
            const userE = store.getState().user.user.email
            try {
                const temp = await AsyncStorage.getItem(
                    `@${userE}-imagesToStore`
                )
                let asyncData = JSON.parse(temp)

                if (asyncData === null) {
                    asyncData = []
                }
                try {
                    asyncData.push(params)
                    await AsyncStorage.setItem(
                        `@${userE}-imagesToStore`,
                        JSON.stringify(asyncData)
                    )
                } catch (error) {}
            } catch (error) {}

            if (fileName != undefined) {
                uploadPhoto(
                    projectId.toString(),
                    templateName,
                    templateCode,
                    item.albumCode,
                    item.photoOrientation,
                    photoDateTime,
                    { fileName },
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    (
                        uploadResults: object | null,
                        uploadQueueId: number | null
                    ) => {
                        dispatch(setIsLoading(false))
                        dispatch(setLastAdhocUpload(uploadResults))
                        dispatch(setLastAdhocUploadQueueId(uploadQueueId))
                        //dispatch(setScannedAlbumCode(''))
                        hideMessage()

                        difference = tempArr.filter((el: any) => item !== el)
                    },
                    (error: any) => {
                        dispatch(setIsLoading(false))

                        return
                    },
                    false,
                    'uploadService'
                )
            }
        }

        const tempArr = pendingUploads

        dispatch(setNewTotalPendingUploadsWithoutUUID(difference))
    }
}

export const upadateQRCodeInMultiplePhotos = () => {
    const photosToUpload = store.getState().upload.multipleImagesToUpload
    const dispatch = store.dispatch

    const newAlbumCode = store.getState().upload.scannedAlbumCode

    if (photosToUpload !== undefined && photosToUpload?.length > 0) {
        const tempArr = photosToUpload.map(item => {
            if (item.albumCode === '') {
                item.albumCode = newAlbumCode
            }

            return item
        })

        dispatch(setMultipleImagesToUpload(tempArr, true))
    }
}

export const uploadPhotoMultiplePhotos = async () => {
    await upadateQRCodeInMultiplePhotos()

    const photosToUpload = store.getState().upload.multipleImagesToUpload

    const dispatch = store.dispatch

    if (photosToUpload !== undefined && photosToUpload?.length > 0) {
        const photoDateTime = new Date().toISOString()

        for (const item of photosToUpload) {
            const templateCode = item?.templateCode

            const fileName = item?.image?.fileName
            const templateName = item?.templateName

            const projectId = store.getState().project.project?.id

            const user = store.getState().user.user
            const keepImageFor =
                store.getState().settings.keepPhotosDurationIndex

            const mappedOrientation = getMappedOrientation(
                item?.photoOrientation
            )

            const params: any = {
                userId: user?.id,
                date: photoDateTime,
                uploadDate: new Date().toISOString(),
                templateCode: templateCode,
                albumCode: item?.albumCode,
                photoOrientation: mappedOrientation,
                image: { fileName },
                keepImageFor: keepImageFor,
                templateName: templateName,
                TemplateGroupId: projectId.toString()
            }

            const userE = store.getState().user.user.email

            const temp = await AsyncStorage.getItem(`@${userE}-imagesToStore`)
            let asyncData = []
            if (temp) asyncData = JSON.parse(temp)

            asyncData.push(params)
            await AsyncStorage.setItem(
                `@${userE}-imagesToStore`,
                JSON.stringify(asyncData)
            )

            showMessage({
                message: 'Images are being uploaded in the background..',
                type: 'default',
                autoHide: false
            })
            if (fileName != undefined) {
                uploadPhoto(
                    projectId.toString(),
                    templateName,
                    templateCode,
                    item.albumCode,
                    item.photoOrientation,
                    photoDateTime,
                    { fileName },
                    (
                        uploadResults: object | null,
                        uploadQueueId: number | null
                    ) => {
                        dispatch(setIsLoading(false))
                        dispatch(setLastAdhocUpload(uploadResults))
                        dispatch(setLastAdhocUploadQueueId(uploadQueueId))
                        //dispatch(setScannedAlbumCode(''))
                        hideMessage()
                    },
                    (error: any) => {
                        dispatch(setIsLoading(false))
                    },
                    false,
                    'Camera'
                )
            }
        }

        dispatch(setMultipleImagesToUpload([], true))
    }
}

export const checkForLostImages = async () => {
    // const username = store.getState().user.username
    //  const valueAb = await AsyncStorage.getItem(`@${username}`)

    let jsonData = null

    //  if (valueAb === null) {
    const succ = store.getState().upload.totalSuccessfulUploadsWithoutUUID
    const fail = store.getState().upload.totalFailedUploadsWithoutUUID
    const pen = store.getState().upload.totalPendingUploadsWithoutUUID

    if (succ !== null || fail !== null || pen !== null) {
        jsonData = {
            totalSuccessfulUploadsWithoutUUID: succ,
            totalFailedUploadsWithoutUUID: fail,
            totalPendingUploadsWithoutUUID: pen
        }
    }
    // } else {
    //     jsonData = JSON.parse(valueAb)
    // }
    if (!jsonData) return

    const jsonDataArr: any[] = Object.values(jsonData).reduce(
        (prev, curr) => [...prev, ...curr],
        []
    )

    const userE = store.getState().user.user.email
    const imagesToStore: string | null = await AsyncStorage.getItem(
        `@${userE}-imagesToStore`
    )
    if (!imagesToStore) return

    const parsedToStore = JSON.parse(imagesToStore)
    const tempArr = [...parsedToStore]
    for (let i = 0; i < (parsedToStore || []).length; i++) {
        for (let j = 0; j < jsonDataArr.length; j++) {
            if (
                parsedToStore[i].image.fileName ===
                jsonDataArr[j].image.fileName
            ) {
                tempArr[i] = -1
                break
            }
        }
    }
    const filteredElements = tempArr.filter(element => element !== -1)

    await AsyncStorage.removeItem(`@${userE}-imagesToStore`)
    filteredElements.forEach(element => {
        store.dispatch(setTotalFailedUploadsWithoutUUID(element))
    })
    getPhotosOnCloud()
}
