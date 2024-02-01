import {takeLatest, put, call, select} from 'redux-saga/effects'
import Actions from '@actions'
import * as API from '@api'
import {logConsole} from '@utils'

function * getList() {
    try {

        yield put(Actions.Creators.showVeil())

        const res = yield call(API.getRewards)

        logConsole('GET REWARDS RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET REWARDS RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 200) {
            yield put(Actions.Creators.setRewards(res.data.data.results))
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptGetRewards())
    yield put(Actions.Creators.hideVeil())
}

function * redeem({payload}) {
    try {

        logConsole('REDEEM REWARD PAYLOAD!!!', payload)

        yield put(Actions.Creators.showVeil())

        const res = yield call(API.redeemReward, payload)

        logConsole('REDEEM REWARD RESPONSE STATUS!!!\n\n', res.status)
        logConsole('REDEEM REWARD RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 201) {
            yield put(Actions.Creators.setRedeemRewardSuccess())
            yield put(Actions.Creators.attemptGetTodayDashboard())
            yield put(Actions.Creators.attemptGetUserProfile())
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptRedeemReward())
    yield put(Actions.Creators.hideVeil())
}

export default function * () {
    yield takeLatest(Actions.Types.ATTEMPT_GET_REWARDS, getList)
    yield takeLatest(Actions.Types.ATTEMPT_REDEEM_REWARD, redeem)
}