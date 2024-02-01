import * as actions from 'redux/actions/projectActions'
import { Action } from 'redux/interfaces'

interface ProjectState {
    project: actions.IProject | null
}

const initialState: ProjectState = {
    project: null
}

const projectReducer = (state = initialState, action: Action): ProjectState => {
    switch (action.type) {
        case actions.SET_PROJECT:
            return {
                ...state,
                project: action.project
            }
        default:
            return state
    }
}
export default projectReducer
