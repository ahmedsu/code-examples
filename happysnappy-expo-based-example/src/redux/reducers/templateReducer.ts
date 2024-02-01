import * as actions from 'redux/actions/templateActions'
import { Action } from 'redux/interfaces'

interface TemplateState {
    template: object
}

const initialState: TemplateState = {
    template: {}
}

const templateReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        
        case actions.SET_TEMPLATE:
            return {
                ...state,
                template: action.template
            }
        default:
            return state
    }
}
export default templateReducer
