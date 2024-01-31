export default {
    requestPushNotificationPermission: ['isRequest'],

    attemptGetNotifications: null,
    doneAttemptGetNotifications: null,

    setNotifications: ['data'],
    clearNotifications: null,
    removeNotification: ['id'],

    getReminders: null,
    attemptSetReminder: ['payload'],
    setReminder: ['payload']
}