import { combineReducers } from 'redux'
import { DESTROY_SESSION } from '../actions/destroySessionActions'
import bottomTabReducer from './bottomTabReducer'
import loadingReducer from './loadingReducer'
import loginReducer from './loginReducer'
import projectReducer from './projectReducer'
import settingsReducer from './settingsReducer'
import templateReducer from './templateReducer'
import uploadReducer from './uploadReducer'
import userReducer from './userReducer'

const appReducer = combineReducers({
    login: loginReducer,
    settings: settingsReducer,
    template: templateReducer,
    upload: uploadReducer,
    user: userReducer,
    bottomTab: bottomTabReducer,
    loading: loadingReducer,
    project: projectReducer
})

const rootReducer = (state: any, action: any) => {
    if (action.type === DESTROY_SESSION) {
        state = undefined
    }

    return appReducer(state, action)
}

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
