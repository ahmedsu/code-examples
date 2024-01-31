import Actions from '@actions'
import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
    isAttemptingGet: false,
    data: {
        deliver_to: null,
        store: null,
        cart_item_count: 0,
        total: 0,
        products: []
    },
    status: {
        fetching: false,
        success: false,
        data: null
    },
    isShowRequestTicker: false,
    isAttemptingUpdate: false,
    isAttemptingGetInstacartLink: false,
    isAttemptingCheckout: false,
    isRedirectedToGroceryBrowser: false,
    isAttemptingGetGroceryAuthUrl: false
})

const doGet = state => state.merge({isAttemptingGet: true})
const doDoneGet = state => state.merge({isAttemptingGet: false})
const doSet = (state, {data}) => state.merge({data})
const doUpdate = (state, {data}) => state.merge({
    data: {
        ...state.data,
        ...data
    }
})

const doClear = state => state.merge({data: INITIAL_STATE.data})

const doGetStatus = state => state.merge({
    status: {
        ...INITIAL_STATE.status,
        fetching: true
    }
})
const doDoneGetStatus = state => state.merge({
    status: {
        ...state.status,
        fetching: false
    }
})
const doSetStatus = (state, { response }) => state.merge({
    status: {
        ...state.status,
        success: true,
        data: {
            ...state.status.data,
            ...response
        }
    }
})

const doShowRequestTicker = state => state.merge({isShowRequestTicker: true})
const doHideRequestTicker = state => state.merge({isShowRequestTicker: false})

const doAttemptUpdate = state => state.merge({isAttemptingUpdate: true})
const doDoneAttemptUpdate = state => state.merge({isAttemptingUpdate: false})

const doGetInstacartLink = state => state.merge({isAttemptingGetInstacartLink: true})
const doDoneGetInstacartLink = state => state.merge({isAttemptingGetInstacartLink: false})

const doCheckout = state => state.merge({isAttemptingCheckout: true})
const doDoneCheckout = state => state.merge({isAttemptingCheckout: false})

const doAttemptGetGroceryAuthUrl = state => state.merge({isAttemptingGetGroceryAuthUrl: true})
const doDoneAttemptGetGroceryAuthUrl = state => state.merge({isAttemptingGetGroceryAuthUrl: false})

const doRedirectToGroceryBrowser = (state, {isRedirectedToGroceryBrowser}) => state.merge({isRedirectedToGroceryBrowser}) 

const HANDLERS = {
    [Actions.Types.ATTEMPT_GET_CART]: doGet,
    [Actions.Types.DONE_ATTEMPT_GET_CART]: doDoneGet,
    [Actions.Types.SET_CART]: doSet,
    [Actions.Types.UPDATE_CART]: doUpdate,
    [Actions.Types.CLEAR_CART]: doClear,

    [Actions.Types.ATTEMPT_GET_CART_STATUS]: doGetStatus,
    [Actions.Types.DONE_ATTEMPT_GET_CART_STATUS]: doDoneGetStatus,
    [Actions.Types.SET_CART_STATUS]: doSetStatus,

    [Actions.Types.SHOW_CART_REQUEST_TICKER]: doShowRequestTicker,
    [Actions.Types.HIDE_CART_REQUEST_TICKER]: doHideRequestTicker,

    [Actions.Types.ATTEMPT_UPDATE_CART]: doAttemptUpdate,
    [Actions.Types.DONE_ATTEMPT_UPDATE_CART]: doDoneAttemptUpdate,

    [Actions.Types.ATTEMPT_GET_INSTACART_LINK]: doGetInstacartLink,
    [Actions.Types.DONE_ATTEMPT_GET_INSTACART_LINK]: doDoneGetInstacartLink,

    [Actions.Types.ATTEMPT_CART_CHECKOUT]: doCheckout,
    [Actions.Types.DONE_ATTEMPT_CART_CHECKOUT]: doDoneCheckout,
    [Actions.Types.REDIRECT_TO_GROCERY_BROWSER]: doRedirectToGroceryBrowser,

    [Actions.Types.DONE_ATTEMPT_GET_GROCERY_AUTH_URL]: doDoneAttemptGetGroceryAuthUrl,
    [Actions.Types.ATTEMPT_GET_GROCERY_AUTH_URL]: doAttemptGetGroceryAuthUrl
}

export default createReducer(INITIAL_STATE, HANDLERS)