import Actions from '@actions'
import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
    isAttemptingGetList: false,
    data: {
        pantry: null,
        categories: []
    },
    isAttemptingUpdate: false
})

const doGetList = state => state.merge({isAttemptingGetList: true})
const doDoneGetList = state => state.merge({isAttemptingGetList: false})
const doSetList = (state, {data}) => state.merge({data})

const doUpdate = state => state.merge({isAttemptingUpdate: true})
const doDoneUpdate = state => state.merge({isAttemptingUpdate: false})

const HANDLERS = {
    [Actions.Types.ATTEMPT_GET_DIGITAL_PANTRY]: doGetList,
    [Actions.Types.DONE_ATTEMPT_GET_DIGITAL_PANTRY]: doDoneGetList,
    [Actions.Types.SET_DIGITAL_PANTRY]: doSetList,

    [Actions.Types.ATTEMPT_UPDATE_DIGITAL_PANTRY]: doUpdate,
    [Actions.Types.DONE_ATTEMPT_UPDATE_DIGITAL_PANTRY]: doDoneUpdate
}

export default createReducer(INITIAL_STATE, HANDLERS)