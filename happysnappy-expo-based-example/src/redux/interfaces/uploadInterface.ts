import {
    SetScannedAlbumCode,
    SetLastAdhocUpload,
    SetLastAdhocUploadQueueId,
    SetSelectedQueueItem,
    SetSelectedQueueItemStatus,
    SetFilteredSuccessfulUploads,
    SetFilteredPendingUploads,
    SetFilteredFailedUploads,
    SetTotalSuccessfulUploads,
    SetTotalPendingUploads,
    SetTotalFailedUploads,
    SetTotalSuccessfulUploadsForStats,
    SetTotalSuccessfulUploadsWithoutUUID,
    SetTotalPendingUploadsWithoutUUID,
    SetTotalFailedUploadsWithoutUUID,
    SetNewFilteredSuccessfulUploads,
    SetNewFilteredPendingUploads,
    SetNewFilteredFailedUploads,
    SetNewTotalSuccessfulUploads,
    SetNewTotalPendingUploads,
    SetNewTotalFailedUploads,
    SetNewTotalSuccessfulUploadsWithoutUUID,
    SetNewTotalPendingUploadsWithoutUUID,
    SetNewTotalFailedUploadsWithoutUUID,
    FilterLastPendingItem,
    SetMultipleImagesToUpload,
    ClearUploads
} from 'redux/actions/uploadActions'

export type UploadInterface =
    | SetScannedAlbumCode
    | SetLastAdhocUpload
    | SetLastAdhocUploadQueueId
    | SetSelectedQueueItem
    | SetSelectedQueueItemStatus
    | SetFilteredSuccessfulUploads
    | SetFilteredPendingUploads
    | SetFilteredFailedUploads
    | SetTotalSuccessfulUploads
    | SetTotalPendingUploads
    | SetTotalFailedUploads
    | SetTotalSuccessfulUploadsForStats
    | SetTotalSuccessfulUploadsWithoutUUID
    | SetTotalPendingUploadsWithoutUUID
    | SetTotalFailedUploadsWithoutUUID
    | SetNewFilteredSuccessfulUploads
    | SetNewFilteredPendingUploads
    | SetNewFilteredFailedUploads
    | SetNewTotalSuccessfulUploads
    | SetNewTotalPendingUploads
    | SetNewTotalFailedUploads
    | SetNewTotalSuccessfulUploadsWithoutUUID
    | SetNewTotalPendingUploadsWithoutUUID
    | SetNewTotalFailedUploadsWithoutUUID
    | FilterLastPendingItem
    | SetMultipleImagesToUpload
    | ClearUploads
