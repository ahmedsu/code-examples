import {takeLatest, put, call, select} from 'redux-saga/effects'
import Actions from '@actions'
import * as API from '@api'
import {navigate} from '@services'
import {Routes} from '@config'
import {Say, logConsole} from '@utils'
import Immutable from 'seamless-immutable'
import {reset} from '@services';
import AsyncStorage from '@react-native-async-storage/async-storage';

function * reportProblem({payload}) {
    try {

        let {id, subject, details} = payload

        subject = subject.trim()
        details = details.trim()

        if(!subject || !details) Say.info('Please enter the subject and details')
        else {
            const res = yield call(API.reportOrderProblem, id, {
                subject,
                details
            })

            logConsole('REPORT ORDER PROBLEM RESPONSE STATUS!!!\n\n\n', res.status)
            logConsole('REPORT ORDER PROBLEM RESPONSE DATA!!!\n\n\n', res.data)
    
            if(res.status == 201) {
                Say.ok('Report submitted')
            }
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptReportOrderProblem())
}

function * getDeliveryOptions() {
    try {

        //const res = yield call(API.getDeliveryOptions)
        const res = {
            status: 200,
            data: {
                days: [
                    {
                        date: '2021-03-19',
                        name: 'Today'
                    },
                    {
                        date: '2021-03-20',
                        name: 'Fri'
                    },
                    {
                        date: '2021-03-21',
                        name: 'Sat'
                    },
                    {
                        date: '2021-03-22',
                        name: 'Sun'
                    }
                ],
                times: [
                    {
                        name: '10am - 11am',
                        price: '$7.99'
                    },
                    {
                        name: '11am - 12pm',
                        price: '$4.99'
                    }
                ]
            }
        }

        logConsole('GET DELIVERY OPTIONS RESPONSE STATUS!!!\n\n\n', res.status)
        logConsole('GET DELIVERY OPTIONS RESPONSE DATA!!!\n\n\n', res.data)

        if(res.status == 200) {
            yield put(Actions.Creators.setDeliveryOptions(res.data.days))
            yield put(Actions.Creators.setDeliveryTimes(res.data.times))
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptGetDeliveryOptions())
}

function * getPaymentMethods() {
    try {

        //const res = yield call(API.getPaymentMethods)
        const res = {
            status: 200,
            data: {
                payment_methods: [
                    {
                        id: 1,
                        label: 'Visa 123456',
                        cardNo: '123456',
                        billingAddress: 'Cebu City',
                        apartmentNo: 'Bldg 123',
                        state: 'PH',
                        zipCode: 6000
                    },
                    {
                        id: 2,
                        label: 'Mastercard 456',
                        cardNo: '456',
                        billingAddress: 'Cebu City',
                        apartmentNo: 'Apt 123',
                        state: 'PH',
                        zipCode: 6000
                    },
                    {
                        id: 3,
                        label: 'Apple Pay',
                        cardNo: '008',
                        billingAddress: 'Talisay City',
                        apartmentNo: 'Bldg 456',
                        state: 'PH',
                        zipCode: 6045
                    }
                ]
            }
        }

        logConsole('GET PAYMENT METHODS RESPONSE STATUS!!!\n\n\n', res.status)
        logConsole('GET PAYMENT METHODS RESPONSE DATA!!!\n\n\n', res.data)

        if(res.status == 200) {
            //yield put(Actions.Creators.setPaymentMethods(res.data.payment_methods))
            yield put(Actions.Creators.setPaymentMethods(res.data.payment_methods))
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptGetPaymentMethods())
}

function * addPaymentMethod({payload}) {
    try {

        logConsole('ADD PAYMENT METHOD PAYLOAD!!!\n\n\n', payload)

        const res = yield call(API.addPaymentMethod, payload)

        logConsole('ADD PAYMENT METHOD RESPONSE STATUS!!!\n\n\n', res.status)
        //logConsole('ADD PAYMENT METHOD RESPONSE DATA!!!\n\n\n', res.data)

        if(res.status == 200) {
            navigate(Routes.reviewOrder)
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptAddPaymentMethod())
}

function * updatePaymentMethod({payload}) {
    try {

        logConsole('UPDATE PAYMENT METHOD PAYLOAD!!!\n\n\n', payload)

        const state = yield select()

        //const res = yield call(API.updatePaymentMethod, payload)
        const res = {
            status: 200,
            data: {}
        }

        logConsole('UPDATE PAYMENT METHOD RESPONSE STATUS!!!\n\n\n', res.status)
        logConsole('UPDATE PAYMENT METHOD RESPONSE DATA!!!\n\n\n', res.data)

        if(res.status == 200) {

            let list = Immutable.asMutable(state.order.paymentMethods, {deep: true})

            list = list.map(l => {
                if(l.id == payload.id) {
                    l = {
                        ...l,
                        ...payload
                    }
                }

                return l
            })

            yield put(Actions.Creators.setPaymentMethods(list))

            yield put(Actions.Creators.closeSheetDialogs())
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptUpdatePaymentMethod())
}

function * deletePaymentMethod({id}) {
    try {

        logConsole('DELETE PAYMENT METHOD PAYLOAD!!!\n\n\n', id)

        const state = yield select()

        //const res = yield call(API.deletePaymentMethod, id)
        const res = {
            status: 200,
            data: {}
        }

        logConsole('DELETE PAYMENT METHOD RESPONSE STATUS!!!\n\n\n', res.status)
        logConsole('DELETE PAYMENT METHOD RESPONSE DATA!!!\n\n\n', res.data)

        if(res.status == 200) {

            let list = Immutable.asMutable(state.order.paymentMethods)

            list = list.filter(l => l.id != id)

            yield put(Actions.Creators.setPaymentMethods(list))

            yield put(Actions.Creators.closeSheetDialogs())
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptDeletePaymentMethod())
}

function * placeOrder({payload}) {
    let success = false

    try {

        logConsole('PLACE ORDER PAYLOAD!!!\n\n\n', payload)

        const res = yield call(API.placeOrder, payload)

        logConsole('PLACE ORDER RESPONSE STATUS!!!\n\n\n', res.status)
        logConsole('PLACE ORDER RESPONSE DATA!!!\n\n\n', res.data)

        if(res.status == 201) {
            success = true
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptPlaceOrder(success))
}

function * getGroceryOrders({payload}) {
    try {

        const res = yield call(API.getGroceryOrders, payload)

        logConsole('GET GROCERY ORDERS RESPONSE STATUS!!!\n\n\n', res.status)
        logConsole('GET GROCERY ORDERS RESPONSE DATA!!!\n\n\n', res.data)

        if(res.status == 200) {
            yield put(Actions.Creators.setGroceryOrders(res.data.data.results))
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptGetGroceryOrders())
}

function * completeOrderByShoppingList({payload}) {
    try {

        const state = yield select()

        let shopping_list_id = payload ?? state.shop.shoppingListId //state.shop.list[0].data[0].shopping_list

        logConsole('COMPLETE ORDER BY SHOPPING LIST PAYLOAD!!!\n\n\n', shopping_list_id)

        const res = yield call(API.completeOrderByShoppingList, shopping_list_id)

        logConsole('COMPLETE ORDER BY SHOPPING LIST RESPONSE STATUS!!!\n\n\n', res.status)
        logConsole('COMPLETE ORDER BY SHOPPING LIST RESPONSE DATA!!!\n\n\n', res.data)

        if(res.status == 200) {
            yield put(Actions.Creators.updateUsersMeta({alreadyPlacedAnOrder: true, last_ordered_shopping_id:shopping_list_id}))
            yield put(Actions.Creators.attemptGetFinalShoppingList())
            yield put(Actions.Creators.attemptGetShoppingList())
            yield call(AsyncStorage.removeItem,'previousShoppingListId');
            
           
        }
    }
    catch(err) {

    }

    yield put(Actions.Creators.doneAttemptCompleteOrderByShoppingList())

    reset({
        index: 0,
        routes: [{name: Routes.home}]
    });

    yield put(Actions.Creators.showToastMessage())
}

export default function * () {
    yield takeLatest(Actions.Types.ATTEMPT_REPORT_ORDER_PROBLEM, reportProblem)
    yield takeLatest(Actions.Types.ATTEMPT_GET_DELIVERY_OPTIONS, getDeliveryOptions)
    yield takeLatest(Actions.Types.ATTEMPT_GET_PAYMENT_METHODS, getPaymentMethods)
    yield takeLatest(Actions.Types.ATTEMPT_ADD_PAYMENT_METHOD, addPaymentMethod)
    yield takeLatest(Actions.Types.ATTEMPT_UPDATE_PAYMENT_METHOD, updatePaymentMethod)
    yield takeLatest(Actions.Types.ATTEMPT_DELETE_PAYMENT_METHOD, deletePaymentMethod)
    yield takeLatest(Actions.Types.ATTEMPT_PLACE_ORDER, placeOrder)
    yield takeLatest(Actions.Types.ATTEMPT_GET_GROCERY_ORDERS, getGroceryOrders)
    yield takeLatest(Actions.Types.ATTEMPT_COMPLETE_ORDER_BY_SHOPPING_LIST, completeOrderByShoppingList)
}