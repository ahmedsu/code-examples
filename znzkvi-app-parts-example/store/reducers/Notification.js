import Actions from '@actions'
import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
    isRequestPushNotificationPermission: false,
    isAttemptingGetAll: false,
    all: [],
    reminders: {
        weight: null,
        waist_size: null
    }
})

const doRequestPushNotificationPermission = (state, {isRequest}) => state.merge({isRequestPushNotificationPermission: isRequest})

const doAttemptGetAll = state => state.merge({isAttemptingGetAll: true})
const doDoneAttemptGetAll = state => state.merge({isAttemptingGetAll: false})

const doSetAll = (state, {data}) => state.merge({all: data})
const doClearAll = state => state.merge({all: []})

const doSetReminder = (state, {payload}) => {
    return state.merge({
        reminders: {
            ...state.reminders,
            [payload.type]: payload.data
        }
    })
}

const HANDLERS = {
    [Actions.Types.REQUEST_PUSH_NOTIFICATION_PERMISSION]: doRequestPushNotificationPermission,
    
    [Actions.Types.ATTEMPT_GET_NOTIFICATIONS]: doAttemptGetAll,
    [Actions.Types.DONE_ATTEMPT_GET_NOTIFICATIONS]: doDoneAttemptGetAll,

    [Actions.Types.SET_NOTIFICATIONS]: doSetAll,
    [Actions.Types.CLEAR_NOTIFICATIONS]: doClearAll,

    [Actions.Types.SET_REMINDER]: doSetReminder
}

export default createReducer(INITIAL_STATE, HANDLERS)