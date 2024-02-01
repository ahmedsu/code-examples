export const SET_SCANNED_ALBUM_CODE = 'SET_SCANNED_ALBUM_CODE'
export const SET_LAST_ADHOC_UPLOAD = 'SET_LAST_ADHOC_UPLOAD'
export const SET_LAST_ADHOC_UPLOAD_QUEUE_ID = 'SET_LAST_ADHOC_UPLOAD_QUEUE_ID'
export const SET_SELECTED_QUEUE_ITEM = 'SELECTEDL_QUEUE_ITEM'
export const SET_SELECTED_QUEUE_ITEM_STATUS = 'SET_SELECTED_QUEUE_ITEM_STATUS'
export const SET_FILTERED_SUCCESSFUL_UPLOADS = 'SET_FILTERED_SUCCESSFUL_UPLOADS'
export const SET_FILTERED_PENDING_UPLOADS = 'SET_FILTERED_PENDING_UPLOADS'
export const SET_FILTERED_FAILED_UPLOADS = 'SET_FILTERED_FAILED_UPLOADS'
export const SET_TOTAL_SUCCESSFUL_UPLOADS = 'SET_TOTAL_SUCCESSFUL_UPLOADS'
export const SET_TOTAL_PENDING_UPLOADS = 'SET_TOTAL_PENDING_UPLOADS'
export const SET_TOTAL_FAILED_UPLOADS = 'SET_TOTAL_FAILED_UPLOADS'
export const SET_TOTAL_SUCCESSFUL_UPLOADS_FOR_STATS =
    'SET_TOTAL_SUCCESSFUL_UPLOADS_FOR_STATS'
export const SET_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID =
    'SET_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID'
export const SET_TOTAL_PENDING_UPLOADS_WITHOUT_UUID =
    'SET_TOTAL_PENDING_UPLOADS_WITHOUT_UUID'
export const SET_TOTAL_FAILED_UPLOADS_WITHOUT_UUID =
    'SET_TOTAL_FAILED_UPLOADS_WITHOUT_UUID'

export const SET_NEW_FILTERED_SUCCESSFUL_UPLOADS =
    'SET_NEW_FILTERED_SUCCESSFUL_UPLOADS'
export const SET_NEW_FILTERED_PENDING_UPLOADS =
    'SET_NEW_FILTERED_PENDING_UPLOADS'
export const SET_NEW_FILTERED_FAILED_UPLOADS = 'SET_NEW_FILTERED_FAILED_UPLOADS'
export const SET_NEW_TOTAL_SUCCESSFUL_UPLOADS =
    'SET_NEW_TOTAL_SUCCESSFUL_UPLOADS'
export const SET_NEW_TOTAL_PENDING_UPLOADS = 'SET_NEW_TOTAL_PENDING_UPLOADS'
export const SET_NEW_TOTAL_FAILED_UPLOADS = 'SET_NEW_TOTAL_FAILED_UPLOADS'
export const SET_NEW_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID =
    'SET_NEW_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID'
export const SET_NEW_TOTAL_PENDING_UPLOADS_WITHOUT_UUID =
    'SET_NEW_TOTAL_PENDING_UPLOADS_WITHOUT_UUID'
export const SET_NEW_TOTAL_FAILED_UPLOADS_WITHOUT_UUID =
    'SET_NEW_TOTAL_FAILED_UPLOADS_WITHOUT_UUID'

export const FILTER_LAST_PENDING_ITEM = 'FILTER_LAST_PENDING_ITEM'
export const CLEAR_UPLOADS = 'CLEAR_UPLOADS'

export const SET_MULTIPLE_IMAGES_TO_UPLOAD = 'SET_MULTIPLE_IMAGES_TO_UPLOAD'

export interface SetScannedAlbumCode {
    type: typeof SET_SCANNED_ALBUM_CODE
    value: string | null
}

export interface SetLastAdhocUpload {
    type: typeof SET_LAST_ADHOC_UPLOAD
    value: object | null
}

export interface SetLastAdhocUploadQueueId {
    type: typeof SET_LAST_ADHOC_UPLOAD_QUEUE_ID
    value: number | null
}

export interface SetSelectedQueueItem {
    type: typeof SET_SELECTED_QUEUE_ITEM
    value: object | null
}

export interface SetSelectedQueueItemStatus {
    type: typeof SET_SELECTED_QUEUE_ITEM_STATUS
    value: string | null
}

export interface SetFilteredSuccessfulUploads {
    type: typeof SET_FILTERED_SUCCESSFUL_UPLOADS
    value: any[]
}

export interface SetFilteredPendingUploads {
    type: typeof SET_FILTERED_PENDING_UPLOADS
    value: any[]
}

export interface SetFilteredFailedUploads {
    type: typeof SET_FILTERED_FAILED_UPLOADS
    value: any[]
}

export interface SetTotalSuccessfulUploads {
    type: typeof SET_TOTAL_SUCCESSFUL_UPLOADS
    value: any[]
}

export interface SetTotalPendingUploads {
    type: typeof SET_TOTAL_PENDING_UPLOADS
    value: any[]
}

export interface SetTotalFailedUploads {
    type: typeof SET_TOTAL_FAILED_UPLOADS
    value: any[]
}

export interface SetTotalSuccessfulUploadsForStats {
    type: typeof SET_TOTAL_SUCCESSFUL_UPLOADS_FOR_STATS
    value: any[]
}

export interface SetTotalSuccessfulUploadsWithoutUUID {
    type: typeof SET_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID
    value: any[]
}

export interface SetTotalPendingUploadsWithoutUUID {
    type: typeof SET_TOTAL_PENDING_UPLOADS_WITHOUT_UUID
    value: any[]
}

export interface SetTotalFailedUploadsWithoutUUID {
    type: typeof SET_TOTAL_FAILED_UPLOADS_WITHOUT_UUID
    value: any[]
}

//
export interface SetNewFilteredSuccessfulUploads {
    type: typeof SET_NEW_FILTERED_SUCCESSFUL_UPLOADS
    value: any[]
}

export interface SetNewFilteredPendingUploads {
    type: typeof SET_NEW_FILTERED_PENDING_UPLOADS
    value: any[]
}

export interface SetNewFilteredFailedUploads {
    type: typeof SET_NEW_FILTERED_FAILED_UPLOADS
    value: any[]
}

export interface SetNewTotalSuccessfulUploads {
    type: typeof SET_NEW_TOTAL_SUCCESSFUL_UPLOADS
    value: any[]
}

export interface SetNewTotalPendingUploads {
    type: typeof SET_NEW_TOTAL_PENDING_UPLOADS
    value: any[]
}

export interface SetNewTotalFailedUploads {
    type: typeof SET_NEW_TOTAL_FAILED_UPLOADS
    value: any[]
}

export interface SetNewTotalSuccessfulUploadsWithoutUUID {
    type: typeof SET_NEW_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID
    value: any[]
    noStats: boolean
}

export interface SetNewTotalPendingUploadsWithoutUUID {
    type: typeof SET_NEW_TOTAL_PENDING_UPLOADS_WITHOUT_UUID
    value: any[]
}

export interface SetNewTotalFailedUploadsWithoutUUID {
    type: typeof SET_NEW_TOTAL_FAILED_UPLOADS_WITHOUT_UUID
    value: any[]
}

export interface FilterLastPendingItem {
    type: typeof FILTER_LAST_PENDING_ITEM
}

export interface SetMultipleImagesToUpload {
    type: typeof SET_MULTIPLE_IMAGES_TO_UPLOAD
    value: any[]
    replace: boolean
}

export interface ClearUploads {
    type: typeof CLEAR_UPLOADS
}
export const setScannedAlbumCode = (
    value: string | null
): SetScannedAlbumCode => ({
    type: SET_SCANNED_ALBUM_CODE,
    value
})

export const setLastAdhocUpload = (
    value: object | null
): SetLastAdhocUpload => ({
    type: SET_LAST_ADHOC_UPLOAD,
    value
})

export const setLastAdhocUploadQueueId = (
    value: number | null
): SetLastAdhocUploadQueueId => ({
    type: SET_LAST_ADHOC_UPLOAD_QUEUE_ID,
    value
})

export const setSelectedQueueItem = (
    value: object | null
): SetSelectedQueueItem => ({
    type: SET_SELECTED_QUEUE_ITEM,
    value
})

export const setSelectedQueueItemStatus = (
    value: string | null
): SetSelectedQueueItemStatus => ({
    type: SET_SELECTED_QUEUE_ITEM_STATUS,
    value
})

export const setFilteredSuccessfulUploads = (
    value: any[]
): SetFilteredSuccessfulUploads => ({
    type: SET_FILTERED_SUCCESSFUL_UPLOADS,
    value
})

export const setFilteredPendingUploads = (
    value: any[]
): SetFilteredPendingUploads => ({
    type: SET_FILTERED_PENDING_UPLOADS,
    value
})

export const setFilteredFailedUploads = (
    value: any[]
): SetFilteredFailedUploads => ({
    type: SET_FILTERED_FAILED_UPLOADS,
    value
})

export const setTotalSuccessfulUploads = (
    value: any[]
): SetTotalSuccessfulUploads => ({
    type: SET_TOTAL_SUCCESSFUL_UPLOADS,
    value
})

export const setTotalPendingUploads = (
    value: any[]
): SetTotalPendingUploads => ({
    type: SET_TOTAL_PENDING_UPLOADS,
    value
})

export const setTotalFailedUploads = (
    value: any[]
): SetTotalFailedUploadsWithoutUUID => ({
    type: SET_TOTAL_FAILED_UPLOADS_WITHOUT_UUID,
    value
})

export const setTotalSuccessfulUploadsForStats = (
    value: any[]
): SetTotalSuccessfulUploadsForStats => ({
    type: SET_TOTAL_SUCCESSFUL_UPLOADS_FOR_STATS,
    value
})

export const setTotalSuccessfulUploadsWithoutUUID = (
    value: any[]
): SetTotalSuccessfulUploadsWithoutUUID => ({
    type: SET_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID,
    value
})

export const setTotalPendingUploadsWithoutUUID = (
    value: any[]
): SetTotalPendingUploadsWithoutUUID => ({
    type: SET_TOTAL_PENDING_UPLOADS_WITHOUT_UUID,
    value
})

export const setTotalFailedUploadsWithoutUUID = (
    value: any[]
): SetTotalFailedUploadsWithoutUUID => ({
    type: SET_TOTAL_FAILED_UPLOADS_WITHOUT_UUID,
    value
})

//

export const setNewFilteredSuccessfulUploads = (
    value: any[]
): SetNewFilteredSuccessfulUploads => ({
    type: SET_NEW_FILTERED_SUCCESSFUL_UPLOADS,
    value
})

export const setNewFilteredPendingUploads = (
    value: any[]
): SetNewFilteredPendingUploads => ({
    type: SET_NEW_FILTERED_PENDING_UPLOADS,
    value
})

export const setNewFilteredFailedUploads = (
    value: any[]
): SetNewFilteredFailedUploads => ({
    type: SET_NEW_FILTERED_FAILED_UPLOADS,
    value
})

export const setNewTotalSuccessfulUploads = (
    value: any[]
): SetNewTotalSuccessfulUploads => ({
    type: SET_NEW_TOTAL_SUCCESSFUL_UPLOADS,
    value
})

export const setNewTotalPendingUploads = (
    value: any[]
): SetNewTotalPendingUploads => ({
    type: SET_NEW_TOTAL_PENDING_UPLOADS,
    value
})

export const setNewTotalFailedUploads = (
    value: any[]
): SetNewTotalFailedUploadsWithoutUUID => ({
    type: SET_NEW_TOTAL_FAILED_UPLOADS_WITHOUT_UUID,
    value
})

export const setNewTotalSuccessfulUploadsWithoutUUID = (
    value: any[],
    noStats: boolean
): SetNewTotalSuccessfulUploadsWithoutUUID => ({
    type: SET_NEW_TOTAL_SUCCESSFUL_UPLOADS_WITHOUT_UUID,
    value,
    noStats
})

export const setNewTotalPendingUploadsWithoutUUID = (
    value: any[]
): SetNewTotalPendingUploadsWithoutUUID => ({
    type: SET_NEW_TOTAL_PENDING_UPLOADS_WITHOUT_UUID,
    value
})

export const setNewTotalFailedUploadsWithoutUUID = (
    value: any[]
): SetNewTotalFailedUploadsWithoutUUID => ({
    type: SET_NEW_TOTAL_FAILED_UPLOADS_WITHOUT_UUID,
    value
})

export const filterLastPendingItem = (): FilterLastPendingItem => ({
    type: FILTER_LAST_PENDING_ITEM
})

export const setMultipleImagesToUpload = (
    value: any,
    replace: boolean
): SetMultipleImagesToUpload => ({
    type: SET_MULTIPLE_IMAGES_TO_UPLOAD,
    value,
    replace
})

export const clearUploads = (): ClearUploads => ({
    type: CLEAR_UPLOADS
})
