import Actions from '@actions'
import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
    details: {},
    isAttemptingReportProblem: false,
    isAttemptingGetDeliveryOptions: false,
    deliveryOptions: [],
    deliveryTimes: [],
    deliveryDateFilter: null,
    isAttemptingGetPaymentMethods: false,
    paymentMethods: [],
    isAttemptingAddPaymentMethod: false,
    isAttemptingUpdatePaymentMethod: false,
    isAttemptingDeletePaymentMethod: false,
    isAttemptingPlaceOrder: false,
    placeOrderSuccess: false,
    isAttemptingGetGroceryOrders: false,
    groceryOrders: [],
    isAttemptingCompleteOrderByShoppingList: false
})

const doSetDetails = (state, {data}) => state.merge({details: data})

const doUpdateDetails = (state, {data}) => {
    return state.merge({
        details: {
            ...state.details,
            ...data
        }
    })
}

const doReportProblem = state => state.merge({isAttemptingReportProblem: true})
const doDoneReportProblem = state => state.merge({isAttemptingReportProblem: false})

const doGetDeliveryOptions = state => state.merge({isAttemptingGetDeliveryOptions: true})
const doDoneGetDeliveryOptions = state => state.merge({isAttemptingGetDeliveryOptions: false})
const doSetDeliveryOptions = (state, {deliveryOptions}) => state.merge({deliveryOptions})

const doSetDeliveryTimes = (state, {deliveryTimes}) => state.merge({deliveryTimes})

const doSetDeliveryDateFilter = (state, {date}) => state.merge({deliveryDateFilter: date})

const doGetPaymentMethods = state => state.merge({isAttemptingGetPaymentMethods: true})
const doDoneGetPaymentMethods = state => state.merge({isAttemptingGetPaymentMethods: false})
const doSetPaymentMethods = (state, {paymentMethods}) => state.merge({paymentMethods})

const doAddPaymentMethod = state => state.merge({isAttemptingAddPaymentMethod: true})
const doDoneAddPaymentMethod = state => state.merge({isAttemptingAddPaymentMethod: false})

const doUpdatePaymentMethod = state => state.merge({isAttemptingUpdatePaymentMethod: true})
const doDoneUpdatePaymentMethod = state => state.merge({isAttemptingUpdatePaymentMethod: false})

const doDeletePaymentMethod = state => state.merge({isAttemptingDeletePaymentMethod: true})
const doDoneDeletePaymentMethod = state => state.merge({isAttemptingDeletePaymentMethod: false})

const doPlaceOrder = state => state.merge({placeOrderSuccess: false, isAttemptingPlaceOrder: true})
const doDonePlaceOrder = (state, {success}) => state.merge({placeOrderSuccess: success, isAttemptingPlaceOrder: false})

const doGetGroceryOrders = state => state.merge({isAttemptingGetGroceryOrders: true})
const doDoneGetGroceryOrders = state => state.merge({isAttemptingGetGroceryOrders: false})
const doSetGroceryOrders = (state, {orders}) => state.merge({groceryOrders: orders})

const doCompleteOrderByShoppingList = state => state.merge({isAttemptingCompleteOrderByShoppingList: true})
const doDoneCompleteOrderByShoppingList = state => state.merge({isAttemptingCompleteOrderByShoppingList: false})

const HANDLERS = {
    [Actions.Types.SET_ORDER_DETAILS]: doSetDetails,
    [Actions.Types.UPDATE_ORDER_DETAILS]: doUpdateDetails,

    [Actions.Types.ATTEMPT_REPORT_ORDER_PROBLEM]: doReportProblem,
    [Actions.Types.DONE_ATTEMPT_REPORT_ORDER_PROBLEM]: doDoneReportProblem,

    [Actions.Types.ATTEMPT_GET_DELIVERY_OPTIONS]: doGetDeliveryOptions,
    [Actions.Types.DONE_ATTEMPT_GET_DELIVERY_OPTIONS]: doDoneGetDeliveryOptions,
    [Actions.Types.SET_DELIVERY_OPTIONS]: doSetDeliveryOptions,

    [Actions.Types.SET_DELIVERY_TIMES]: doSetDeliveryTimes,

    [Actions.Types.SET_DELIVERY_DATE_FILTER]: doSetDeliveryDateFilter,

    [Actions.Types.ATTEMPT_GET_PAYMENT_METHODS]: doGetPaymentMethods,
    [Actions.Types.DONE_ATTEMPT_GET_PAYMENT_METHODS]: doDoneGetPaymentMethods,
    [Actions.Types.SET_PAYMENT_METHODS]: doSetPaymentMethods,

    [Actions.Types.ATTEMPT_ADD_PAYMENT_METHOD]: doAddPaymentMethod,
    [Actions.Types.DONE_ATTEMPT_ADD_PAYMENT_METHOD]: doDoneAddPaymentMethod,

    [Actions.Types.ATTEMPT_UPDATE_PAYMENT_METHOD]: doUpdatePaymentMethod,
    [Actions.Types.DONE_ATTEMPT_UPDATE_PAYMENT_METHOD]: doDoneUpdatePaymentMethod,

    [Actions.Types.ATTEMPT_DELETE_PAYMENT_METHOD]: doDeletePaymentMethod,
    [Actions.Types.DONE_ATTEMPT_DELETE_PAYMENT_METHOD]: doDoneDeletePaymentMethod,

    [Actions.Types.ATTEMPT_PLACE_ORDER]: doPlaceOrder,
    [Actions.Types.DONE_ATTEMPT_PLACE_ORDER]: doDonePlaceOrder,

    [Actions.Types.ATTEMPT_GET_GROCERY_ORDERS]: doGetGroceryOrders,
    [Actions.Types.DONE_ATTEMPT_GET_GROCERY_ORDERS]: doDoneGetGroceryOrders,
    [Actions.Types.SET_GROCERY_ORDERS]: doSetGroceryOrders,

    [Actions.Types.ATTEMPT_COMPLETE_ORDER_BY_SHOPPING_LIST]: doCompleteOrderByShoppingList,
    [Actions.Types.DONE_ATTEMPT_COMPLETE_ORDER_BY_SHOPPING_LIST]: doDoneCompleteOrderByShoppingList
}

export default createReducer(INITIAL_STATE, HANDLERS)