import Actions from '@actions'
import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
    isAttemptingGetList: false,
    list: [],
    redeem: {
        attempting: false,
        success: false
    }
})

const doGetList = state => state.merge({isAttemptingGetList: true})
const doDoneGetList = state => state.merge({isAttemptingGetList: false})
const doSetList = (state, {list}) => state.merge({list})

const doRedeem = state => state.merge({
    redeem: {
        ...INITIAL_STATE.redeem,
        attempting: true
    }
})
const doDoneRedeem = state => state.merge({
    redeem: {
        ...INITIAL_STATE.redeem,
        attempting: false
    }
})
const doSetRedeemSuccess = state => state.merge({
    redeem: {
        ...state.redeem,
        success: true
    }
})

const HANDLERS = {
    [Actions.Types.ATTEMPT_GET_REWARDS]: doGetList,
    [Actions.Types.DONE_ATTEMPT_GET_REWARDS]: doDoneGetList,
    [Actions.Types.SET_REWARDS]: doSetList,

    [Actions.Types.ATTEMPT_REDEEM_REWARD]: doRedeem,
    [Actions.Types.DONE_ATTEMPT_REDEEM_REWARD]: doDoneRedeem,
    [Actions.Types.SET_REDEEM_REWARD_SUCCESS]: doSetRedeemSuccess
}

export default createReducer(INITIAL_STATE, HANDLERS)