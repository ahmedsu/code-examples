import * as actions from 'redux/actions/bottomTabActions'
import { Action } from 'redux/interfaces'

interface BottomTabState {
    bottomTabVisible: boolean
}

const initialState: BottomTabState = {
    bottomTabVisible: true
}

const bottomTabReducer = (
    state = initialState,
    action: Action
): BottomTabState => {
    switch (action.type) {
        case actions.SET_BOTTOM_TABS:
            return {
                ...state,
                bottomTabVisible: action.value
            }
        default:
            return state
    }
}
export default bottomTabReducer
