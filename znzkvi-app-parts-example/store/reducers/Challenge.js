import Actions from '@actions'
import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
    isAttemptingGetList: false,
    list: [],
    activeList: [],
    isAttemptingGetCompletedList: false,
    completedList: [],
    isAttemptingGetDetail: false,
    detail: null,
    join: {
        attempting: false,
        success: false
    },
    leave: {
        attempting: false,
        success: false
    }
})

const doGetList = state => state.merge({isAttemptingGetList: true})
const doDoneGetList = state => state.merge({isAttemptingGetList: false})
const doSetList = (state, {list}) => state.merge({list})
const doSetActiveList = (state, {list}) => state.merge({activeList: list})

const doGetCompletedList = state => state.merge({isAttemptingGetCompletedList: true})
const doDoneGetCompletedList = state => state.merge({isAttemptingGetCompletedList: false})
const doSetCompletedList = (state, {list}) => state.merge({completedList: list})

const doGetDetail = state => state.merge({isAttemptingGetDetail: true})
const doDoneGetDetail = state => state.merge({isAttemptingGetDetail: false})
const doSetDetail = (state, {detail}) => state.merge({detail})
const doUpdateDetail = (state, {detail}) => (
    state.merge({
        detail: {
            ...state.detail,
            ...detail
        }
    })
)

const doJoin = state => state.merge({
    join: {
        ...INITIAL_STATE.join,
        attempting: true
    }
})
const doDoneJoin = state => state.merge({
    join: {
        ...INITIAL_STATE.join,
        attempting: false
    }
})
const doSetJoinSuccess = state => state.merge({
    join: {
        ...state.join,
        success: true
    }
})

const doLeave = state => state.merge({
    leave: {
        ...INITIAL_STATE.leave,
        attempting: true
    }
})
const doDoneLeave = state => state.merge({
    leave: {
        ...INITIAL_STATE.leave,
        attempting: false
    }
})
const doSetLeaveSuccess = state => state.merge({
    leave: {
        ...state.leave,
        success: true
    }
})

const HANDLERS = {
    [Actions.Types.ATTEMPT_GET_CHALLENGES]: doGetList,
    [Actions.Types.DONE_ATTEMPT_GET_CHALLENGES]: doDoneGetList,
    [Actions.Types.SET_CHALLENGES]: doSetList,
    [Actions.Types.SET_ACTIVE_CHALLENGES]: doSetActiveList,

    [Actions.Types.ATTEMPT_GET_COMPLETED_CHALLENGES]: doGetCompletedList,
    [Actions.Types.DONE_ATTEMPT_GET_COMPLETED_CHALLENGES]: doDoneGetCompletedList,
    [Actions.Types.SET_COMPLETED_CHALLENGES]: doSetCompletedList,

    [Actions.Types.ATTEMPT_GET_CHALLENGE_DETAIL]: doGetDetail,
    [Actions.Types.DONE_ATTEMPT_GET_CHALLENGE_DETAIL]: doDoneGetDetail,
    [Actions.Types.SET_CHALLENGE_DETAIL]: doSetDetail,
    [Actions.Types.UPDATE_CHALLENGE_DETAIL]: doUpdateDetail,

    [Actions.Types.ATTEMPT_JOIN_CHALLENGE]: doJoin,
    [Actions.Types.DONE_ATTEMPT_JOIN_CHALLENGE]: doDoneJoin,
    [Actions.Types.SET_JOIN_CHALLENGE_SUCCESS]: doSetJoinSuccess,

    [Actions.Types.ATTEMPT_LEAVE_CHALLENGE]: doLeave,
    [Actions.Types.DONE_ATTEMPT_LEAVE_CHALLENGE]: doDoneLeave,
    [Actions.Types.SET_LEAVE_CHALLENGE_SUCCESS]: doSetLeaveSuccess
}

export default createReducer(INITIAL_STATE, HANDLERS)