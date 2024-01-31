import { takeLatest, put, call, select } from 'redux-saga/effects'
import Actions from '@actions'
import * as API from '@api'
import { Tag, Events } from '@config'
import { logConsole } from '@utils'
import { goBack } from '@services'
import { logEvent } from '@lib'
import Immutable from 'seamless-immutable'

function* getList() {
    try {

        yield put(Actions.Creators.showVeil())

        const res = yield call(API.getChallenges)

        logConsole('GET CHALLENGES RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET CHALLENGES RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            yield put(Actions.Creators.setChallenges(res.data.data.results))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetChallenges())
    yield put(Actions.Creators.hideVeil())
}

function* getCompletedList() {
    try {

        yield put(Actions.Creators.showVeil())

        const res = yield call(API.getCompletedChallenges)

        logConsole('GET COMPLETED CHALLENGES RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET COMPLETED CHALLENGES RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            yield put(Actions.Creators.setCompletedChallenges(res.data.data.results))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetCompletedChallenges())
    yield put(Actions.Creators.hideVeil())
}

function* getDetail({ challenge }) {
    try {
        yield put(Actions.Creators.showVeil())

        const state = yield select()

        //logConsole('GET CHALLENGE DETAIL ID PARAM!!!\n\n', id)
        logConsole('GET CHALLENGE DETAIL CHALLENGE PARAM!!!\n\n', challenge)

        let res = null

        if (challenge.completed) {
            res = {
                status: 200,
                data: {
                    data: challenge
                }
            }
        }
        else {
            res = yield call(API.getChallengeDetail, challenge.id)
        }

        logConsole('GET CHALLENGE DETAIL RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET CHALLENGE DETAIL RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            let user_milestones = []
            let user_completed_milestones = []
            let milestones = []
            let number_of_milestones = (res.data.data.number_of_days * 4) / 12

            let has_joined = false

            const DELIMETER = '\r\n'

            let overview = []

            //number_of_milestones - 1 -> this is to remove the last badge
            for (let i = 1; i <= number_of_milestones - 1; i++) {
                milestones.push({
                    logged_meals: i * 12
                })
            }

            if (res.data.data.milestones.length > 0) {

                if (res.data.data.milestones[res.data.data.milestones.length - 1].source == 'challenge_completed') {
                    milestones.push(res.data.data.milestones[res.data.data.milestones.length - 1])
                }

                res.data.data.milestones.map(m => {
                    if (m.source == 'challenge_completed') user_completed_milestones.push(m.logged_meals)
                    else user_milestones.push(m.logged_meals)
                })
            }
            else {
                milestones.push({
                    logged_meals: milestones[milestones.length - 1].logged_meals + 12,
                    challenge_days: res.data.data.number_of_days,
                    challenge_completed: 'gold',
                    source: 'challenge_completed'
                })
            }

            res.data.data.overview.split(DELIMETER).map((o, i) => {
                if (o) {

                    let icon = ''

                    if (i == 0) icon = 'star'
                    else if (i == 1) icon = 'meal'
                    else if (i == 2) icon = 'trophy_small'
                    else if (i == 3) icon = 'double_check'
                    else if (i == 4) icon = 'flag_gray'

                    overview.push({
                        icon,
                        text: o
                    })
                }
            })

            state.challenge.list.map(c => {
                if (c.joined) {
                    has_joined = true
                }
            })

            yield put(Actions.Creators.setChallengeDetail({
                ...res.data.data,
                overview,
                has_joined,
                milestones,
                user_milestones,
                user_completed_milestones
            }))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetChallengeDetail())
    yield put(Actions.Creators.hideVeil())
}

function* join({ id }) {
    try {
        yield put(Actions.Creators.showVeil())

        logConsole('JOIN CHALLENGE ID!!!', id)

        const state = yield select()

        const res = yield call(API.joinChallenge, id)

        logConsole('JOIN CHALLENGE RESPONSE STATUS!!!\n\n', res.status)
        logConsole('JOIN CHALLENGE RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 201) {
            let detail = Immutable.asMutable(state.challenge.detail, { deep: true })
            detail.joined = true
            yield put(Actions.Creators.updateChallengeDetail(detail))

            let list = Immutable.asMutable(state.challenge.list, { deep: true })

            list = list.map(l => {
                if (l.id == id) {
                    l.joined = true
                }

                return l
            })

            yield put(Actions.Creators.setChallenges(list))
            yield put(Actions.Creators.setJoinChallengeSuccess())
            yield put(Actions.Creators.attemptGetUserProfile())
            yield call(logEvent, Events.challenge_join, {
                challenge_days: detail.number_of_days
            })

            //yield put(Actions.Creators.triggerTesterSurvey(Tag.challenges_survey))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptJoinChallenge())
    yield put(Actions.Creators.hideVeil())
}

function* leave({ id }) {
    try {
        yield put(Actions.Creators.showVeil())

        logConsole('LEAVE CHALLENGE ID!!!', id)

        const state = yield select()

        const res = yield call(API.leaveChallenge, id)

        logConsole('LEAVE CHALLENGE RESPONSE STATUS!!!\n\n', res.status)
        logConsole('LEAVE CHALLENGE RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 201) {
            let detail = Immutable.asMutable(state.challenge.detail, { deep: true })
            detail.joined = false
            yield put(Actions.Creators.updateChallengeDetail(detail))

            let list = Immutable.asMutable(state.challenge.list, { deep: true })

            list = list.map(l => {
                if (l.id == id) {
                    l.joined = false
                }

                return l
            })

            yield put(Actions.Creators.setChallenges(list))
            yield put(Actions.Creators.setLeaveChallengeSuccess())
            yield put(Actions.Creators.attemptGetUserProfile())
            yield call(logEvent, Events.challenge_leave)

            goBack()
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptLeaveChallenge())
    yield put(Actions.Creators.hideVeil())
}

export default function* () {
    yield takeLatest(Actions.Types.ATTEMPT_GET_CHALLENGES, getList)
    yield takeLatest(Actions.Types.ATTEMPT_GET_COMPLETED_CHALLENGES, getCompletedList)
    yield takeLatest(Actions.Types.ATTEMPT_GET_CHALLENGE_DETAIL, getDetail)
    yield takeLatest(Actions.Types.ATTEMPT_JOIN_CHALLENGE, join)
    yield takeLatest(Actions.Types.ATTEMPT_LEAVE_CHALLENGE, leave)
}
