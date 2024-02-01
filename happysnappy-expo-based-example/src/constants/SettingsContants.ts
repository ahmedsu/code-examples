const photoQualityKey = 'settings_photoQuality'
const autoProcessingPendingQueueKey = 'settings_autoProcessPendingQueue'
const keepPhotosDurationIndexKey = 'settings_keepPhotosDurationIndex'
const photoQualityDefault = 0.25
const autoProcessingPendingDefault = false
const keepPhotosDurationDefault = 2

// CHROMA constants
const chromaHueKey = 'settings_chroma_hue'
const chromaToleranceKey = 'settings_chroma_tolerance'
const chromaSaturationKey = 'settings_chroma_saturation'
const chromaHueDefault = 120
const chromaToleranceDefault = 30
const chromaSaturationDefault = 0.2

enum KeepPhotosDuration {
    Day,
    Week,
    Month
}

const momentDateFormat = 'MMMM Do YYYY, h:mm:ss'

export {
    photoQualityKey,
    autoProcessingPendingDefault,
    autoProcessingPendingQueueKey,
    keepPhotosDurationDefault,
    photoQualityDefault,
    keepPhotosDurationIndexKey,
    chromaHueDefault,
    chromaHueKey,
    chromaSaturationDefault,
    chromaSaturationKey,
    chromaToleranceDefault,
    chromaToleranceKey,
    momentDateFormat,
    KeepPhotosDuration
}
