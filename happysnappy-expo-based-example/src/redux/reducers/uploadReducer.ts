import * as actions from 'redux/actions/uploadActions'
import { Action } from 'redux/interfaces'
import { v4 as uuidv4 } from 'uuid'

interface UploadsState {
    scannedAlbumCode: string | null
    lastAdhocUpload: object | null
    lastAdhocUploadQueueId: number | null
    selectedQueueItem: object | null
    selectedQueueItemStatus: string | null
    filteredSuccessfulUploads: any[]
    filteredPendingUploads: any[]
    filteredFailedUploads: any[]
    totalSuccessfulUploads: any[]
    totalPendingUploads: any[]
    totalFailedUploads: any[]
    totalSuccessfulUploadsForStats: any[]
    totalSuccessfulUploadsWithoutUUID: any[]
    totalPendingUploadsWithoutUUID: any[]
    totalFailedUploadsWithoutUUID: any[]
    multipleImagesToUpload: any[]
}

const initialState: UploadsState = {
    scannedAlbumCode: '',
    lastAdhocUpload: null,
    lastAdhocUploadQueueId: null,
    selectedQueueItem: null,
    selectedQueueItemStatus: null,
    filteredSuccessfulUploads: [],
    filteredPendingUploads: [],
    filteredFailedUploads: [],
    totalSuccessfulUploads: [],
    totalPendingUploads: [],
    totalFailedUploads: [],
    totalSuccessfulUploadsForStats: [],
    totalSuccessfulUploadsWithoutUUID: [],
    totalPendingUploadsWithoutUUID: [],
    totalFailedUploadsWithoutUUID: [],
    multipleImagesToUpload: []
}
const settingsReducer = (
    state = initialState,
    action: Action
): UploadsState => {
    switch (action.type) {
        case actions.SET_SCANNED_ALBUM_CODE:
            return {
                ...state,
                scannedAlbumCode: action.value
            }
        case actions.SET_LAST_ADHOC_UPLOAD:
            return {
                ...state,
                lastAdhocUpload: action.value
            }
        case actions.SET_LAST_ADHOC_UPLOAD_QUEUE_ID:
            return {
                ...state,
                lastAdhocUploadQueueId: action.value
            }
        case actions.SET_SELECTED_QUEUE_ITEM:
            return {
                ...state,
                selectedQueueItem: action.value
            }
        case actions.SET_SELECTED_QUEUE_ITEM_STATUS:
            return {
                ...state,
                selectedQueueItemStatus: action.value
            }
        case actions.SET_FILTERED_SUCCESSFUL_UPLOADS:
            return {
                ...state,
                filteredSuccessfulUploads: [
                    ...state.filteredSuccessfulUploads,
                    action.value
                ]
            }
        case actions.SET_FILTERED_PENDING_UPLOADS:
            return {
                ...state,
                filteredPendingUploads: [
                    ...state.filteredPendingUploads,
                    action.value
                ]
            }
        case actions.SET_FILTERED_FAILED_UPLOADS:
            return {
                ...state,
                filteredFailedUploads: [
                    ...state.filteredFailedUploads,
                    action.value
                ]
            }
        case actions.SET_TOTAL_SUCCESSFUL_UPLOADS:
            return {
                ...state,
                totalSuccessfulUploads: [
                    ...state.totalSuccessfulUploads,
                    action.value
                ]
            }
        case actions.SET_TOTAL_PENDING_UPLOADS:
            return {
                ...state,
                totalPendingUploads: [
                    ...state.totalPendingUploads,
                    action.value
                ]
            }
        case actions.SET_TOTAL_FAILED_UPLOADS:
            return {
                ...state,
                totalFailedUploads: [...state.totalFailedUploads, action.value]
            }

        case actions.SET_TOTAL_SUCCESSFUL_UPLOADS_FOR_STATS: {
            const val =
                state.totalSuccessfulUploadsForStats === undefined
                    ? [{ ...action.value }]
                    : [
                        ...state.totalSuccessfulUploadsForStats,
                        { ...action.value }
                    ]
            return {
                ...state,
                totalSuccessfulUploadsForStats: [...val]
            }
        }
        case actions.SET_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID: {
            const val =
                state.totalSuccessfulUploadsForStats === undefined
                    ? [{ ...action.value }]
                    : [
                        ...state.totalSuccessfulUploadsForStats,
                        { ...action.value }
                    ]

            if (!action.value?.albumCode) return state
            const newValue = [...state.totalSuccessfulUploadsWithoutUUID, action.value]
            return {
                ...state,
                totalSuccessfulUploadsWithoutUUID: [
                    ...newValue
                    
                ],
                totalSuccessfulUploadsForStats: [...val]
            }
        }
        case actions.SET_TOTAL_PENDING_UPLOADS_WITHOUT_UUID:
            // eslint-disable-next-line no-case-declarations
            const tempUploadP = { ...action.value }
            tempUploadP.id = uuidv4()
            if (!action.value?.albumCode) return state

            return {
                ...state,
                totalPendingUploadsWithoutUUID: [
                    ...state.totalPendingUploadsWithoutUUID,
                    action.value
                ],
                totalPendingUploads: [...state.totalPendingUploads, tempUploadP]
            }
        case actions.SET_TOTAL_FAILED_UPLOADS_WITHOUT_UUID:
            if (action.value === null){
                return { ...state }
            }
            // eslint-disable-next-line no-case-declarations
            const tempUpload = { ...action.value }
            tempUpload.id = uuidv4()
            if (!action.value?.albumCode) return state
            return {
                ...state,
                totalFailedUploads: [...state.totalFailedUploads, tempUpload],
                totalFailedUploadsWithoutUUID: [
                    ...state.totalFailedUploadsWithoutUUID,
                    action.value
                ]
            }
        case actions.FILTER_LAST_PENDING_ITEM:
            return {
                ...state,
                totalPendingUploads: state.totalPendingUploads.filter(
                    (_, i) => i !== state.totalPendingUploads.length - 1
                ),
                totalPendingUploadsWithoutUUID:
                    state.totalPendingUploadsWithoutUUID.filter(
                        (_, i) =>
                            i !==
                            state.totalPendingUploadsWithoutUUID.length - 1
                    )
            }

        case actions.SET_NEW_TOTAL_SUCCESSFUL_UPLOADS:
            return {
                ...state,
                totalSuccessfulUploads: action.value
            }
        case actions.SET_NEW_TOTAL_FAILED_UPLOADS:
            return {
                ...state,
                totalFailedUploads: [...action.value]
            }
        case actions.SET_NEW_TOTAL_PENDING_UPLOADS:
            return {
                ...state,
                totalPendingUploads: [...action.value]
            }

        case actions.SET_NEW_FILTERED_SUCCESSFUL_UPLOADS:
            return {
                ...state,
                filteredSuccessfulUploads: [...action.value]
            }
        case actions.SET_NEW_FILTERED_FAILED_UPLOADS:
            return {
                ...state,
                filteredFailedUploads: [...action.value]
            }
        case actions.SET_NEW_FILTERED_PENDING_UPLOADS:
            return {
                ...state,
                filteredPendingUploads: [...action.value]
            }

        case actions.SET_NEW_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID: {
            if (action.noStats) {
                return {
                    ...state,
                    totalSuccessfulUploadsWithoutUUID: [...action.value]
                }
            } else {
                return {
                    ...state,
                    totalSuccessfulUploadsWithoutUUID: [...action.value],
                    totalSuccessfulUploadsForStats: [...action.value]
                }
            }
        }

        case actions.SET_NEW_TOTAL_FAILED_UPLOADS_WITHOUT_UUID:
            return {
                ...state,
                totalFailedUploadsWithoutUUID: [...action.value]
            }
        case actions.SET_NEW_TOTAL_PENDING_UPLOADS_WITHOUT_UUID:
           
            return {
                ...state,
                totalPendingUploadsWithoutUUID: [...action.value]
            }

        case actions.SET_MULTIPLE_IMAGES_TO_UPLOAD: {
            if (action.replace) {
                return {
                    ...state,
                    multipleImagesToUpload: [...action.value]
                }
            } else {
                return {
                    ...state,
                    multipleImagesToUpload: [
                        ...state.multipleImagesToUpload,
                        action.value
                    ]
                }
            }
        }

        case actions.CLEAR_UPLOADS:
            return {
                ...state,
                scannedAlbumCode: '',
                lastAdhocUpload: null,
                lastAdhocUploadQueueId: null,
                selectedQueueItem: null,
                selectedQueueItemStatus: null,
                filteredSuccessfulUploads: [],
                filteredPendingUploads: [],
                filteredFailedUploads: [],
                totalSuccessfulUploads: [],
                totalPendingUploads: [],
                totalFailedUploads: [],
                totalSuccessfulUploadsWithoutUUID: [],
                totalPendingUploadsWithoutUUID: [],
                totalFailedUploadsWithoutUUID: [],
                multipleImagesToUpload: []
            }
        default:
            return state
    }
}

export default settingsReducer
