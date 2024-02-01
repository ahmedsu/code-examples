import * as actions from 'redux/actions/loadingActions'
import { Action } from 'redux/interfaces'

interface LoadingState {
    isLoading: boolean
}

const initialState: LoadingState = {
    isLoading: false
}

const loadingReducer = (state = initialState, action: Action): LoadingState => {
    switch (action.type) {
        case actions.SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.value
            }
        default:
            return state
    }
}
export default loadingReducer
