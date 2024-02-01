import {
    autoProcessingPendingDefault,
    chromaHueDefault,
    chromaSaturationDefault,
    chromaToleranceDefault,
    keepPhotosDurationDefault,
    photoQualityDefault
} from 'constants/SettingsContants'
import * as actions from 'redux/actions/settingsActions'
import { Action } from 'redux/interfaces'

interface SettingsState {
    photoQuality: number
    autoProcessPendingQueue: boolean
    keepPhotosDurationIndex: number
    chromaHue: number
    chromaTolerance: number
    chromaSaturation: number
}

const initialState: SettingsState = {
    photoQuality: photoQualityDefault,
    autoProcessPendingQueue: autoProcessingPendingDefault,
    keepPhotosDurationIndex: keepPhotosDurationDefault,
    chromaHue: chromaHueDefault,
    chromaTolerance: chromaToleranceDefault,
    chromaSaturation: chromaSaturationDefault
}

const settingsReducer = (
    state = initialState,
    action: Action
): SettingsState => {
    switch (action.type) {
        case actions.SET_PHOTO_QUALITY:
            return {
                ...state,
                photoQuality: action.value
            }
        case actions.AUTO_PROCESS_PENDING_QUEUE:
            return {
                ...state,
                autoProcessPendingQueue: action.value
            }
        case actions.KEEP_PHOTOS_DURATION_INDEX:
            return {
                ...state,
                keepPhotosDurationIndex: action.value
            }
        case actions.SET_CHROMA_HUE:
            return {
                ...state,
                chromaHue: action.value
            }
        case actions.SET_CHROMA_SATURATION:
            return {
                ...state,
                chromaSaturation: action.value
            }
        case actions.SET_CHROMA_TOLERANCE:
            return {
                ...state,
                chromaTolerance: action.value
            }
        case actions.RESET_CHROMAS:
            return {
                ...state,
                chromaHue: chromaHueDefault,
                chromaSaturation: chromaSaturationDefault,
                chromaTolerance: chromaToleranceDefault
            }
        default:
            return state
    }
}

export default settingsReducer
