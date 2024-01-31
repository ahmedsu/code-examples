import {takeLatest, put, call, select, delay} from 'redux-saga/effects'
import Actions from '@actions'
import * as API from '@api'
import {logConsole} from '@utils'
import {navigate} from '@services'
import {Routes, Events, CART_STATUS} from '@config'
import {logEvent} from '@lib'
import Immutable from 'seamless-immutable'
import { Linking} from "react-native"
import { INSTAKART } from '../../screens/GroceryList/GrocerySelector'
import AsyncStorage from '@react-native-async-storage/async-storage';

function * getData({payload}) {
    try {

        logConsole('GET CART PAYLOAD!!!\n\n', payload)

        yield put(Actions.Creators.showVeil())

        const state = yield select()

        const {currentPlan: {dates}, isNextWeekPlanShown} = state.meal

       /* logConsole('GET CART (CURRENT MEAL PLAN DATES)!!\n\n', {
            dates,
            isNextWeekPlanShown
        }, true)

        let from = ''
        let to = ''*/

        /*if(state.user.dataForCartRequest) {
            from = state.user.dataForCartRequest.from
            to = state.user.dataForCartRequest.to

            logConsole('GOT DATES FROM USER STATE (FOR CART REQUEST)!!\n\n', {from, to}, true)
        }

        if(payload.from || payload.to) {
            from = payload.from || ''
            to = payload.to || ''
        }
        else {
            if(dates?.length > 0) {
                from = dates[0].from
                to = dates[0].to
    
                logConsole('GOT DATES FROM MEAL STATE - CURRENT WEEK (FOR CART REQUEST)!!\n\n', {from, to}, true)
    
                if(isNextWeekPlanShown && dates[1]) {
                    from = dates[1].from
                    to = dates[1].to
    
                    logConsole('GOT DATES FROM MEAL STATE - NEXT WEEK (FOR CART REQUEST)!!\n\n', {from, to}, true)
                }
            }
        }*/

        const params = {
            //storeId: payload.storeId,
            //from,
            //to,
            shopping_list: payload.shopping_list || state.shop.list[0].data[0].shopping_list
        }

        logConsole('GET CART PARAMS!!\n\n', params, true)

        /*yield put(Actions.Creators.setDataForCartRequest({
            from,
            to
        }))*/

        const res = yield call(API.getCart, params)

        logConsole('GET CART RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET CART RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 200) {
            const status = res.data.data.status

            yield put(Actions.Creators.setCart(res.data.data))

            yield put(Actions.Creators.setCartStatus(res.data.data))
            
            if(status === CART_STATUS.PROCESSING) {
                navigate(Routes.home)
                yield put(Actions.Creators.showCartRequestTicker())
            }
            else {
                yield put(Actions.Creators.hideCartRequestTicker())
            }

            /*yield put(Actions.Creators.updateCart({
                store: payload.storeId
            }))*/
        }
    }
    catch(err) {

    }

    yield put(Actions.Creators.doneAttemptGetCart())
    yield put(Actions.Creators.hideVeil())
}

function * getStatus() {
    try {
        logConsole('CHECK CART STATUS')

        const state = yield select()
        
        if(state.user.data?.done_onboarding && state.user.data?.subscription?.product_id) {
            const res = yield call(API.getCartStatus)

            logConsole('GET CART STATUS RESPONSE STATUS!!\n\n', res.status)
            logConsole('GET CART STATUS RESPONSE DATA!!\n\n', res.data)

            if(res.status == 200) {
                const status = res.data.data.status
                yield put(Actions.Creators.setCartStatus(res.data.data))
                /*yield put(Actions.Creators.setCartStatus({
                    "id": 5106,
                    "status": status,
                    "store": 16,
                    "payment_method_id": null,
                    "phone": "",
                    "delivery_date": null,
                    "delivery_window": "",
                    "shopping_list": 62881,
                    "deliver_to": {
                        "street": "cansojong",
                        "unit": "",
                        "city": "talisay",
                        "state": "AZ",
                        "country": "",
                        "zip_code": "6000"
                    }
                }))*/
                
                if(status !== '') {
                    yield put(Actions.Creators.showCartRequestTicker())
                }
                else {
                    yield put(Actions.Creators.hideCartRequestTicker())
                }
            }
        }
    }
    catch(err) {

    }

    yield put(Actions.Creators.doneAttemptGetCartStatus())
}

function * addQuantityToGroceryItem({options}) {
    try {
        logConsole('ADD QUANTITY TO GROCERY ITEM PAYLOAD!!!\n\n', options)

        const state = yield select()

        let data = Immutable.asMutable(state.shop.availableStoreProducts, {deep: true})

        let product = options.product

        product.quantity += 1

        const res = yield call(API.updateProduct, product.id, {
            quantity: product.quantity
        })

        logConsole('ADD QUANTITY TO GROCERY ITEM RESPONSE STATUS!!!\n\n', res.status)
        logConsole('ADD QUANTITY TO GROCERY ITEM RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 200) {
            yield put(Actions.Creators.setAvailableStoreProducts(data))

            yield put(Actions.Creators.updateCart({
                sub_total: res.data.data.sub_total,
                total: res.data.data.total,
                cart_item_count: parseInt(res.data.data.cart_item_count)
            }))
        }
    }
    catch(err) {

    }
}

function * subtractQuantityFromGroceryItem({options}) {
    try {
        logConsole('SUBTRACT QUANTITY FROM GROCERY ITEM PAYLOAD!!!\n\n', options)

        const state = yield select()

        let data = Immutable.asMutable(state.shop.availableStoreProducts, {deep: true})

        let product = options.product

        if(product.quantity > 1) {
            product.quantity -= 1
        }
        else {
            product.quantity = null
        }

        const res = yield call(API.updateProduct, product.id, {
            quantity: product.quantity
        })

        logConsole('SUBTRACT QUANTITY FROM GROCERY ITEM RESPONSE STATUS!!!\n\n', res.status)
        logConsole('SUBTRACT QUANTITY FROM GROCERY ITEM RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 200)  {
            yield put(Actions.Creators.setAvailableStoreProducts(data))

            yield put(Actions.Creators.updateCart({
                sub_total: res.data.data.sub_total,
                total: res.data.data.total,
                cart_item_count: parseInt(res.data.data.cart_item_count)
            }))
        }
    }
    catch(err) {

    }
}

function * updateProduct({payload}) {
    try {
        logConsole('UPDATE CART PRODUCT PAYLOAD!!!\n\n', payload)

        const state = yield select()

        let data = Immutable.asMutable(state.shop.availableStoreProducts, {deep: true})

        data.categories[payload.categoryIndex].products[payload.index].instructions = {
            value: payload.instruction,
            out_of_stock_option: payload.outOfStockOption
        }

        const res = yield call(API.updateProduct, data.categories[payload.categoryIndex].products[payload.index].id, {
            quantity: data.categories[payload.categoryIndex].products[payload.index].quantity,
            instructions: {
                instruction_value: payload.instruction,
                instruction_out_of_stock_option: payload.outOfStockOption
            }
        })

        logConsole('UPDATE CART PRODUCT RESPONSE STATUS!!!\n\n', res.status)
        logConsole('UPDATE CART PRODUCT RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 200) {
            yield put(Actions.Creators.setAvailableStoreProducts(data))

            yield put(Actions.Creators.closeSheetDialogs())
        }
    }
    catch(err) {

    }
}

function * updateCart({payload}) {
    try {
        yield put(Actions.Creators.showVeil())

        logConsole('UPDATE CART PAYLOAD!!!\n\n', payload)

        const res = yield call(API.updateCart, payload)

        logConsole('UPDATE CART RESPONSE STATUS!!!\n\n', res.status)
        logConsole('UPDATE CART RESPONSE DATA!!!\n\n', res.data)

        /*if(payload.deliver_to.id) {
            const updateAddressRes = yield call(API.updateAddress, payload.deliver_to.id, {
                zip_code: payload.deliver_to.zip_code
            })

            logConsole('UPDATE ADDRESS RESPONSE STATUS!!!\n\n', updateAddressRes.status)
            logConsole('UPDATE ADDRESS RESPONSE DATA!!!\n\n', updateAddressRes.data)
        }
        else {
            const addAddressRes = yield call(API.addAddress, {
                zip_code: payload.deliver_to.zip_code
            })

            logConsole('ADD ADDRESS RESPONSE STATUS!!!\n\n', addAddressRes.status)
            logConsole('ADD ADDRESS RESPONSE DATA!!!\n\n', addAddressRes.data)
        }*/

        if(res.status == 200) {
            navigate(Routes.cart)
            //yield put(Actions.Creators.updateCart(res.data.data))

            //yield put(Actions.Creators.attemptGetCart())

            //yield delay(2000)

            //yield put(Actions.Creators.showCartRequestTicker())

            //yield put(Actions.Creators.attemptGetCartStatus())

            //navigate(Routes.home)

            //yield put(Actions.Creators.closeSheetDialogs())
            //yield put(Actions.Creators.attemptGetStores())
        }
    }
    catch(err) {

    }

    yield put(Actions.Creators.doneAttemptUpdateCart())
    yield put(Actions.Creators.hideVeil())
}

function * resetCartStatus() {
    try {
        logConsole('ATTEMPT RESET CART STATUS!!!')

        const res = yield call(API.updateCart, {
            status: ''
        })

        logConsole('RESET CART STATUS RESPONSE STATUS', res.status)
        logConsole('RESET CART STATUS RESPONSE DATA', res.data)

        if(res.status == 200) {
            yield put(Actions.Creators.setCartStatus({
                status: ''
            }))

            yield put(Actions.Creators.hideCartRequestTicker())
        }
    }
    catch(err) {

    }

    yield put(Actions.Creators.doneAttemptResetCartStatus())
}

function * getInstacartLink() {
    try {
        yield put(Actions.Creators.showVeil())

        const res = yield call(API.getInstacartLink)

        logConsole('GET INSTACART LINK RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET INSTACART LINK RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 200) {
            navigate(Routes.webview, {
                title: 'Instacart',
                url: res.data.data.url
            })
        }
    }
    catch(err) {

    }

    yield put(Actions.Creators.doneAttemptGetInstacartLink())
    yield put(Actions.Creators.hideVeil())
}

function* checkout({grocery}) {
    try {
      const state = yield select();
  
      // const res = yield call(API.cartCheckout)
      const res = yield call(API.cartGroceryCheckout, grocery.checkout_url); //<- enable once amazon is ready
  
      logConsole('CART CHECKOUT RESPONSE STATUS!!!\n\n', res.status);
      logConsole('CART CHECKOUT RESPONSE DATA!!!\n\n', res.data);
  
      if (res.status == 200) {
        yield call(logEvent, Events.cart_checkout, {
          items_q: state.cart.data.products.length,
          amount: state.cart.data.total
        });
        let url = res.data.data.url;
  
        if (Array.isArray(url)) {
          url = url[0];
        }
  
        if (url) {
          yield call(AsyncStorage.setItem, 'showOrderPlacedPrompt', 'true');
          yield put(
            Actions.Creators.redirectToGroceryBrowser({
              isRedirectedToGroceryBrowser: true
            })
          );
  
          Linking.openURL(url);
        }
      }
      // else if (res.status === 401 || res.status === 403) {
      //     yield put(Actions.Creators.attemptGetGroceryAuthUrl({grocery}))
      // }
    } catch (err) {}
  
    yield put(Actions.Creators.doneAttemptCartCheckout());
  }

function * checkOrderPlacedStatus() {
    try {
        logConsole("Cart Saga checkOrderPlacedStatus");
        const status = yield call(AsyncStorage.getItem,'showOrderPlacedPrompt');
        if(status != null && status == 'true'){
            logConsole("Cart Saga showOrderPlacedPrompt");
            const shoppingListId = yield call(AsyncStorage.getItem,'previousShoppingListId');
            logConsole("Cart Saga showOrderPlacedPrompt shoppingListId",parseInt(shoppingListId));
            yield put(Actions.Creators.setShoppingListId(parseInt(shoppingListId)))
            yield put(Actions.Creators.redirectToGroceryBrowser({isRedirectedToGroceryBrowser:true}))
        }
    }
    catch(err) {

    }
}

function* attemptGetGroceryAuthUrl({grocery}) {

    let authUrl = '';
    // if (grocery.service === 'Kroger') {
    //   authUrl = 'kroger_auth_url/';
    // }
  
    const res = yield call(API.getGroceryAuthUrl, authUrl);
    yield put(Actions.Creators.doneAttemptGetGroceryAuthUrl());
  
    if (res.status == 200) {
      const url = res.data.data.url;
      if (url) {
        navigate(Routes.webview, {
          url: res.data.data.url,
          grocery
        });
      }
    }
  }

export default function * () {
    yield takeLatest(Actions.Types.ATTEMPT_GET_CART, getData)
    yield takeLatest(Actions.Types.ATTEMPT_GET_CART_STATUS, getStatus)
    yield takeLatest(Actions.Types.ATTEMPT_ADD_QUANTITY_TO_GROCERY_ITEM, addQuantityToGroceryItem)
    yield takeLatest(Actions.Types.ATTEMPT_SUBTRACT_QUANTITY_FROM_GROCERY_ITEM, subtractQuantityFromGroceryItem)
    yield takeLatest(Actions.Types.ATTEMPT_UPDATE_CART_PRODUCT, updateProduct)
    yield takeLatest(Actions.Types.ATTEMPT_UPDATE_CART, updateCart)
    yield takeLatest(Actions.Types.ATTEMPT_RESET_CART_STATUS, resetCartStatus)
    yield takeLatest(Actions.Types.ATTEMPT_GET_INSTACART_LINK, getInstacartLink)
    yield takeLatest(Actions.Types.ATTEMPT_CART_CHECKOUT, checkout)
    yield takeLatest(Actions.Types.CHECK_ORDER_PLACED_STATUS, checkOrderPlacedStatus)
    yield takeLatest(Actions.Types.ATTEMPT_GET_GROCERY_AUTH_URL, attemptGetGroceryAuthUrl)
}