import * as actions from 'redux/actions/userActions'
import { Action } from 'redux/interfaces'

interface UserState {
    user: actions.IUser | null
    token: string | null
}

const initialState: UserState = {
    user: {
        email: '',
        id: null,
        isAdministrator: false,
        isManager: false,
        isPhotographer: false,
        displayName: '',
        phone: ''
    },
    token: '',
    totalStats: [],
    statsData: ''
}

const userReducer = (state = initialState, action: Action): UserState => {
    switch (action.type) {
        case actions.SET_USER:
            return {
                ...state,
                user: action.user
            }
        case actions.SET_TOKEN:
            return {
                ...state,
                token: action.token
            }

        default:
            return state
    }
}
export default userReducer
