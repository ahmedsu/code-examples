export const SET_PHOTO_QUALITY = 'SET_PHOTO_QUALITY'
export const AUTO_PROCESS_PENDING_QUEUE = 'AUTO_PROCESS_PENDING_QUEUE'
export const KEEP_PHOTOS_DURATION_INDEX = 'KEEP_PHOTOS_DURATION_INDEX'
export const SET_CHROMA_HUE = 'SET_CHROMA_HUE'
export const SET_CHROMA_TOLERANCE = 'SET_CHROMA_TOLERANCE'
export const SET_CHROMA_SATURATION = 'SET_CHROMA_SATURATION'
export const RESET_CHROMAS = 'RESET_CHROMAS'

export interface SetPhotoQuality {
    type: typeof SET_PHOTO_QUALITY
    value: number
}

export interface AutoProcessPendingQueue {
    type: typeof AUTO_PROCESS_PENDING_QUEUE
    value: boolean
}

export interface KeepPhotosDurationIndex {
    type: typeof KEEP_PHOTOS_DURATION_INDEX
    value: number
}

export interface SetChromaHue {
    type: typeof SET_CHROMA_HUE
    value: number
}

export interface SetChromaTolerance {
    type: typeof SET_CHROMA_TOLERANCE
    value: number
}

export interface SetChromaSaturation {
    type: typeof SET_CHROMA_SATURATION
    value: number
}

export interface ResetChromas {
    type: typeof RESET_CHROMAS
}

export const setPhotoQuality = (value: number): SetPhotoQuality => ({
    type: SET_PHOTO_QUALITY,
    value
})

export const setAutoProcessPendingQueue = (
    value: AutoProcessPendingQueue['value']
): AutoProcessPendingQueue => ({
    type: AUTO_PROCESS_PENDING_QUEUE,
    value
})

export const setKeepPhotosDurationIndex = (
    value: number
): KeepPhotosDurationIndex => ({
    type: KEEP_PHOTOS_DURATION_INDEX,
    value
})

export const setChromaHue = (
    value: SetChromaSaturation['value']
): SetChromaHue => ({
    type: SET_CHROMA_HUE,
    value
})

export const setChromaTolerance = (
    value: SetChromaSaturation['value']
): SetChromaTolerance => ({
    type: SET_CHROMA_TOLERANCE,
    value
})

export const setChromaSaturation = (
    value: SetChromaSaturation['value']
): SetChromaSaturation => ({
    type: SET_CHROMA_SATURATION,
    value
})

export const resetChromas = (): ResetChromas => ({
    type: RESET_CHROMAS
})
