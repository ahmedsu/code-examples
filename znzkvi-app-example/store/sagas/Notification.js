import {takeLatest, call, put, select} from 'redux-saga/effects'
import Actions from '@actions'
import * as API from '@api'
import {PUSH_NOTIFICATION_CHANNEL, NOTIFICATION_ID, Highlights} from '@config'
import {logConsole, LocalPushNotification} from '@utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

function * getAll() {
    try {
        const res = yield call(API.getNotifications)

        logConsole('NOTIFICATION RESPONSE STATUS!!!\n\n', res.status)
        logConsole('NOTIFICATION RESPONSE DATA!!!\n\n', res.data.data.notifications)

        if(res.status == 200) {
            yield put(Actions.Creators.setNotifications(res.data.data.notifications))
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptGetNotifications())
}

function * remove({id}) {
    try {
        const state = yield select()

        const res = yield call(API.removeNotification, id)

        logConsole('REMOVE NOTIFICATION RESPONSE STATUS!!!\n\n', res.status)
        logConsole('REMOVE NOTIFICATION RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 200) {
            const newList = state.notification.all.filter(n => n.id !== id)
            yield put(Actions.Creators.setNotifications(newList))
        }
    }
    catch(err) {
        
    }
}

function * getReminders() {
    try {
        const state = yield select()

        if(state.auth.isLoggedIn && state.user.data) {
            const weightReminderRes = yield call(AsyncStorage.getItem, PUSH_NOTIFICATION_CHANNEL.logWeightReminder)
            if(weightReminderRes) {
                yield put(Actions.Creators.setReminder(JSON.parse(weightReminderRes)))
            }
            else {
                yield put(Actions.Creators.setReminder({type: 'weight', data: null}))
            }

            const waistSizeReminderRes = yield call(AsyncStorage.getItem, PUSH_NOTIFICATION_CHANNEL.logWaistSizeReminder)
            if(waistSizeReminderRes) {
                yield put(Actions.Creators.setReminder(JSON.parse(waistSizeReminderRes)))
            }
            else {
                yield put(Actions.Creators.setReminder({type: 'waist_size', data: null}))
            }
        }
    }
    catch(err) {

    }
}

function * setReminder({payload}) {
    try {
        yield call(AsyncStorage.setItem, `log-${payload.type}-reminder`, JSON.stringify(payload))
        yield put(Actions.Creators.setReminder(payload))

        let id = ''
        let channelId = ''
        let message = `It's time to log your `
        let repeatType = ''

        switch(payload.type) {
            case Highlights.weight.key:
                channelId = PUSH_NOTIFICATION_CHANNEL.logWeightReminder 
                message += 'weight'
                break
            case Highlights.waist_size.key:
                channelId = PUSH_NOTIFICATION_CHANNEL.logWaistSizeReminder
                message += 'waist size'
                break
        }

        id = NOTIFICATION_ID[channelId]

        yield call(LocalPushNotification.cancelLocalNotificationById, id)

        switch(payload.data.recurrence.toLowerCase()) {
            case 'daily':
                repeatType = 'day'
                break
            case 'weekly':
                repeatType = 'week'
                break
            case 'monthly':
                repeatType = 'month'
                break
        }

        const today = moment()

        let time_value_splits = payload.data.time.split(' ')
        let time_splits = time_value_splits[0].split(':')

        let hour = parseInt(time_splits[0]) + (payload.data.time.indexOf('pm') >= 0 ? 12 : 0)
        let minute = parseInt(time_splits[1])

        let fireDate = new Date(
            today.format('YYYY'),
            parseInt(today.format('MM')) - 1,
            today.format('DD'),
            hour,
            minute
        )

        yield call(
            LocalPushNotification.showScheduledNotification,
            id,
            'Log Measurement',
            message,
            null,
            {
                channelId,
                date: fireDate,
                repeatType
            }
        )
    }
    catch(err) {
        
    }
}

export default function * () {
    yield takeLatest(Actions.Types.ATTEMPT_GET_NOTIFICATIONS, getAll)
    yield takeLatest(Actions.Types.REMOVE_NOTIFICATION, remove)
    yield takeLatest(Actions.Types.GET_REMINDERS, getReminders)
    yield takeLatest(Actions.Types.ATTEMPT_SET_REMINDER, setReminder)
}