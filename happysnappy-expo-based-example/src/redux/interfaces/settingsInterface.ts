import {
    AutoProcessPendingQueue,
    KeepPhotosDurationIndex,
    ResetChromas,
    SetChromaHue,
    SetChromaSaturation,
    SetChromaTolerance,
    SetPhotoQuality
} from 'redux/actions/settingsActions'

export type SettingsInterface =
    | AutoProcessPendingQueue
    | KeepPhotosDurationIndex
    | SetChromaHue
    | SetChromaSaturation
    | SetChromaTolerance
    | SetPhotoQuality
    | ResetChromas
