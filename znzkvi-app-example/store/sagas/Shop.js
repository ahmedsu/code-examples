import { takeLatest, put, call, select } from 'redux-saga/effects'
import Actions from '@actions'
import * as API from '@api'
import { logConsole, getNextURL } from '@utils'
import { Events } from '@config'
import { logEvent } from '@lib'
import Immutable from 'seamless-immutable'
import AsyncStorage from '@react-native-async-storage/async-storage';

function* getList({ params }) {
    try {

        yield put(Actions.Creators.showVeil())

        const state = yield select()

        const {currentPlan: {dates}, isNextWeekPlanShown} = state.meal

        logConsole('GET SHOPPING LIST (CURRENT MEAL PLAN DATES)!!\n\n', {
            dates,
            isNextWeekPlanShown
        }, true)

        let from = ''
        let to = ''

        if(dates?.length > 0) {
            from = dates[0].from
            to = dates[0].to

            if(isNextWeekPlanShown && dates[1]) {
                from = dates[1].from
                to = dates[1].to
            }
        }

        const additional_params = {
            from,
            to
        }

        const finalParams = {
            ...params,
            ...additional_params
        }

        logConsole('GET SHOPPING LIST PARAMS!!!', finalParams, true)

        const res = yield call(API.getShoppingList, finalParams)

        logConsole('GET SHOPPING LIST RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET SHOPPING LIST RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            let list = []
            let itemCount = 0
            let shoppedCount = 0
            const shoppingListId = res.data.data.id;

            if (res.data.data.categories) {
                res.data.data.categories.map((l, i) => {

                    itemCount += l.items.length

                    if (l.items.length > 0) {
                        shoppedCount += (l.items.filter(i => i.shopped)).length
                    }

                    list.push({
                        index: i,
                        name: l.name,
                        data: l.items
                    })
                    /*l.items.map(item => {
                        list.push(item)
                    })*/
                })
            }

            list.sort(function (a, b) {
                if (a.name.toLowerCase() === 'uncategorized') {
                    return 1
                }

                if (a.name < b.name) {
                    return -1
                }

                else if (a.name > b.name) {
                    return 1
                }

                return 0
            })

            yield put(Actions.Creators.setShoppingListItemCount(itemCount))
            yield put(Actions.Creators.setShoppingListShoppedCount(shoppedCount))
            yield put(Actions.Creators.setShoppingList(list))
            yield call(AsyncStorage.setItem,'previousShoppingListId', shoppingListId.toString());
            yield put(Actions.Creators.setShoppingListId(shoppingListId))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetShoppingList())
    yield put(Actions.Creators.hideVeil())
}

function* getFinalList() {
    try {

        yield put(Actions.Creators.showVeil())

        const res = yield call(API.getShoppingList, {
            hide_completed: true
        })

        logConsole('GET FINAL SHOPPING LIST RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET FINAL SHOPPING LIST RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            let list = []
            let itemsCount = 0

            if (res.data.data.categories) {
                res.data.data.categories.map((l, i) => {
                    list.push({
                        index: i,
                        name: l.name,
                        data: l.items
                    })

                    itemsCount += l.items.length
                })
            }

            list.sort(function (a, b) {
                if (a.name.toLowerCase() === 'uncategorized') {
                    return 1
                }

                if (a.name < b.name) {
                    return -1
                }

                else if (a.name > b.name) {
                    return 1
                }

                return 0
            })
            const showFinalizeList = res.data.data.show_finalized_list;
            yield put(Actions.Creators.setFinalShoppingList(list))
            yield put(Actions.Creators.setFinalShoppingListItemCount(itemsCount))
            yield put(Actions.Creators.setShowFinalizedList(showFinalizeList))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetFinalShoppingList())
    yield put(Actions.Creators.hideVeil())
}

function* updateItem({ payload }) {
    try {

        yield put(Actions.Creators.showVeil())

        const state = yield select()

        if (!payload.shopped) {
            yield put(Actions.Creators.decreaseShoppingListShoppedCount())
        }
        else {
            yield put(Actions.Creators.increaseShoppingListShoppedCount())

            yield call(logEvent, Events.shopping_item_done)
        }

        const res = yield call(API.updateShoppingItem, payload.id, payload.shopped, payload.shopping_list)

        logConsole('UPDATE SHOPPING ITEM RESPONSE STATUS!!!\n\n', res.status)
        logConsole('UPDATE SHOPPING ITEM RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            let finalListCount = state.shop.finalListCount
            let list = Immutable.asMutable(state.shop.list, { deep: true })

            if (payload.shopped) finalListCount -= 1
            else finalListCount += 1

            if (state.shop.isHideCompletedItems) {
                list[payload.category.index].data[payload.index].hidden = payload.shopped
                //list[payload.index].hidden = payload.shopped

                /*if(payload.shopped) {
                    //list[payload.category.index].data = list[payload.category.index].data.filter(l => l.id != payload.id)
                }*/
            }
            else {
                list[payload.category.index].data[payload.index].shopped = payload.shopped
                //list[payload.index].shopped = payload.shopped
            }

            yield put(Actions.Creators.setShoppingList(list))
            yield put(Actions.Creators.setFinalShoppingListItemCount(finalListCount))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptUpdateShoppingItem())
    yield put(Actions.Creators.hideVeil())
}

function* searchItems({ searchQuery }) {
    try {

        const res = yield call(API.searchShoppingItems, searchQuery)

        logConsole('SEARCH SHOPPING ITEMS RESPONSE STATUS!!!\n\n', res.status)
        logConsole('SEARCH SHOPPING ITEMS RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            yield put(Actions.Creators.setSearchedShoppingItems(res.data.data.items))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptSearchShoppingItems())
}

function* getAvailableStoreProducts({ storeId }) {
    try {

        yield put(Actions.Creators.showVeil())

        logConsole('AVAILABLE STORE PRODUCTS STORE!!!\n\n', storeId)

        const res = yield call(API.getAvailableStoreProducts, { storeId })

        logConsole('AVAILABLE STORE PRODUCTS RESPONSE STATUS!!!\n\n', res.status)
        logConsole('AVAILABLE STORE PRODUCTS RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            let data = {
                ...res.data.data,
                next: getNextURL(res.data.data.next),
                categories: []
            }

            res.data.data.categories.map(c => {
                c.items.map(ci => {
                    data.categories.push({
                        category: c.name,
                        ...ci
                    })
                })
            })

            yield put(Actions.Creators.setAvailableStoreProducts(data))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetAvailableStoreProducts())
    yield put(Actions.Creators.hideVeil())
}

function* getMoreAvailableStoreProducts({ url }) {
    try {

        logConsole('GET MORE AVAILABLE STORE PRODUCTS URL!!!\n\n', url)

        const res = yield call(API.getAvailableStoreProducts, { url })

        logConsole('GET MORE AVAILABLE STORE PRODUCTS RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET MORE AVAILABLE STORE PRODUCTS RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            let data = {
                ...res.data.data,
                next: getNextURL(res.data.data.next),
                categories: []
            }

            res.data.data.categories.map(c => {
                c.items.map(ci => {
                    data.categories.push({
                        category: c.name,
                        ...ci
                    })
                })
            })

            yield put(Actions.Creators.setMoreAvailableStoreProducts(data))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetMoreAvailableStoreProducts())
}

function* markGroceryAsShopped({ payload }) {
    try {

        yield put(Actions.Creators.showVeil())

        logConsole('MARK GROCERY AS SHOPPED PAYLOAD', payload)

        const res = yield call(API.updateShoppingItems, payload)

        logConsole('MARK GROCERY AS SHOPPED RESPONSE STATUS!!!\n\n', res.status)
        logConsole('MARK GROCERY AS SHOPPED RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            yield call(logEvent, Events.shopping_list_done)

            yield put(Actions.Creators.attemptGetFinalShoppingList())
            yield put({ type: Actions.Types.ATTEMPT_GET_SHOPPING_LIST })
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptMarkGroceryAsShopped())
    yield put(Actions.Creators.hideVeil())
}

function* unmarkGroceryAsShopped({ payload }) {
    try {

        yield put(Actions.Creators.showVeil())

        logConsole('UNMARK GROCERY AS SHOPPED PAYLOAD', payload)

        const res = yield call(API.updateShoppingItems, payload)

        logConsole('UNMARK GROCERY AS SHOPPED RESPONSE STATUS!!!\n\n', res.status)
        logConsole('UNMARK GROCERY AS SHOPPED RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            yield put({ type: Actions.Types.ATTEMPT_GET_SHOPPING_LIST })
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptUnmarkGroceryAsShopped())
    yield put(Actions.Creators.hideVeil())
}

function* setHideCompletedItems({ isHide }) {
    try {
        const state = yield select()

        yield put({
            type: Actions.Types.ATTEMPT_GET_SHOPPING_LIST,
            params: {
                hide_completed: isHide
            }
        })
    }
    catch (err) {

    }
}

function* getStores({ params }) {
    try {

        logConsole('GET STORES PAYLOAD!!!\n\n', params)

        yield put(Actions.Creators.showVeil())

        const res = yield call(API.getStores, params)

        logConsole('GET STORES RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET STORES RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            yield put(Actions.Creators.setStores(res.data.data))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetStores())
    yield put(Actions.Creators.hideVeil())
}

function* getTimeAndMoneySaved() {
    try {
        const res = yield call(API.getTimeAndMoneySaved)

        logConsole('GET TIME AND MONEY SAVED RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET TIME AND MONEY SAVED RESPONSE DATA!!!\n\n', res.data)

        if (res.status == 200) {
            yield put(Actions.Creators.setTimeAndMoneySavedData(res.data.data))
        }
    }
    catch (err) {

    }

    yield put(Actions.Creators.doneAttemptGetTimeAndMoneySaved())
}

function* updateShowFinalizedList({ payload }) {
    try {

        logConsole('UPDATE SHOW FINALIZED LISTS PAYLOAD', payload)

        const res = yield call(API.updateShoppingItems, payload)

        logConsole('UPDATE SHOW FINALIZED LISTS PAYLOAD RESPONSE STATUS!!!\n\n', res.status)
        logConsole('UPDATE SHOW FINALIZED LISTS PAYLOAD DATA!!!\n\n', res.data)

        if (res.status == 200) {
            yield put({ type: Actions.Types.ATTEMPT_GET_FINAL_SHOPPING_LIST })
        }
    }
    catch (err) {
        logConsole('ATTEMPT_UPDATE_SHOW_FINALIZED_LIST > ERROR', err)
    }
}

export default function* () {
    yield takeLatest(Actions.Types.ATTEMPT_GET_SHOPPING_LIST, getList)
    yield takeLatest(Actions.Types.ATTEMPT_GET_FINAL_SHOPPING_LIST, getFinalList)
    yield takeLatest(Actions.Types.ATTEMPT_UPDATE_SHOPPING_ITEM, updateItem)
    yield takeLatest(Actions.Types.ATTEMPT_SEARCH_SHOPPING_ITEMS, searchItems)
    yield takeLatest(Actions.Types.ATTEMPT_GET_AVAILABLE_STORE_PRODUCTS, getAvailableStoreProducts)
    yield takeLatest(Actions.Types.ATTEMPT_GET_MORE_AVAILABLE_STORE_PRODUCTS, getMoreAvailableStoreProducts)
    yield takeLatest(Actions.Types.ATTEMPT_MARK_GROCERY_AS_SHOPPED, markGroceryAsShopped)
    yield takeLatest(Actions.Types.ATTEMPT_UNMARK_GROCERY_AS_SHOPPED, unmarkGroceryAsShopped)
    yield takeLatest(Actions.Types.SET_HIDE_COMPLETED_SHOPPING_ITEMS, setHideCompletedItems)
    yield takeLatest(Actions.Types.ATTEMPT_GET_STORES, getStores)
    yield takeLatest(Actions.Types.ATTEMPT_GET_TIME_AND_MONEY_SAVED, getTimeAndMoneySaved)
    yield takeLatest(Actions.Types.ATTEMPT_UPDATE_SHOW_FINALIZED_LIST, updateShowFinalizedList)
}
