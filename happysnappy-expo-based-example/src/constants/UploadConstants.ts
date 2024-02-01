import RNFS from 'react-native-fs'

const successUploadsKey = 'successfulUploads'
const pendingUploadsKey = 'pendingUploads'
const failedUploadsKey = 'failedUploads'

const photoStoragePath = RNFS.DocumentDirectoryPath + '/'

export {
    successUploadsKey,
    pendingUploadsKey,
    failedUploadsKey,
    photoStoragePath
}
