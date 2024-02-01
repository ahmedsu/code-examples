import Actions from '@actions'
import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
    photo: null,
    list: [],
})

const doSetFiles = (state, {list}) => state.merge({list})
const doSetFile = (state, {file}) => state.merge({photo:file})
const doAddFile = (state, {file}) => state.merge({
    list: [
        ...state.list,
        file
    ]
})
const doRemoveFileByIndex = (state, {index}) => {
    let list = [
        ...state.list
    ]

    list.splice(index, 1)

    return state.merge({list})
}
const doClearFiles = state => state.merge({list: INITIAL_STATE.list, photo:INITIAL_STATE.photo})
const doClearPhoto = state => state.merge({ photo:INITIAL_STATE.photo})

const HANDLERS = {
    [Actions.Types.SET_FILES]: doSetFiles,
    [Actions.Types.ADD_FILE]: doAddFile,
    [Actions.Types.REMOVE_FILE_BY_INDEX]: doRemoveFileByIndex,
    [Actions.Types.CLEAR_FILES]: doClearFiles,
    [Actions.Types.SET_FILE]: doSetFile,
    [Actions.Types.CLEAR_PHOTO]: doClearPhoto,
}

export default createReducer(INITIAL_STATE, HANDLERS)