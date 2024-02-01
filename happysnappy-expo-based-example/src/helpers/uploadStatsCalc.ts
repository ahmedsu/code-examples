const calculateStatsForUploads = (arrayOfUploads?: any[]) => {
    const numberOfUploadsForDay = arrayOfUploads.length || 0
    const bytesUploaded = arrayOfUploads.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.uploadSize || 0)
    }, 0)
    const megabytesUploaded = bytesUploaded / 1024 / 1024
    const dataUsedForDay = Number.parseFloat(megabytesUploaded).toFixed(2)

    const numberOfUploadsToDisplay =
        numberOfUploadsForDay == 0 ? '-' : numberOfUploadsForDay
    const dataUsedToDisplay = dataUsedForDay == 0 ? '-' : dataUsedForDay

    return {
        numberOfUploadsToDisplay: numberOfUploadsToDisplay,
        dataUsedToDisplay: dataUsedToDisplay
    }
}

export default calculateStatsForUploads
