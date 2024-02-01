import Actions from '@actions'
import { createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
    isAttemptingGetList: false,
    list: [],
    itemCount: 0,
    isAttemptingGetFinalList: false,
    finalList: [],
    finalListCount: 0,
    shoppedCount: 0,
    isAttemptingUpdateItem: false,
    isAttemptingSearchItems: false,
    searchedItems: [],
    isAttemptingGetAvailableStoreProducts: false,
    availableStoreProducts: {
        next: null,
        categories: []
    },
    isAttemptingGetMoreAvailableStoreProducts: false,
    isAttemptingMarkGroceryAsShopped: false,
    isAttemptingUnmarkGroceryAsShopped: false,
    isHideCompletedItems: false,
    isAttemptingGetStores: false,
    stores: [],
    timeAndMoneySaved: {
        attempting: false,
        data: null
    },
    showFinalizedList: false,
    shoppingListId: undefined
})

const doGetList = state => state.merge({ isAttemptingGetList: true })
const doDoneGetList = state => state.merge({ isAttemptingGetList: false })
const doSetList = (state, { list }) => state.merge({ list })
const doSetListId = (state, { shoppingListId }) => state.merge({ shoppingListId })

const doGetFinalList = state => state.merge({ isAttemptingGetFinalList: true })
const doDoneGetFinalList = state => state.merge({ isAttemptingGetFinalList: false })
const doSetFinalList = (state, { list }) => state.merge({ finalList: list })
const doSetFinalItemCount = (state, { count }) => state.merge({ finalListCount: count })
const doSetShowFinalizedList = (state, { show }) => state.merge({ showFinalizedList: show })

const doSetItemCount = (state, { count }) => state.merge({ itemCount: count })
const doSetShoppedCount = (state, { count }) => state.merge({ shoppedCount: count })
const doIncreaseShoppedCount = state => state.merge({ shoppedCount: state.shoppedCount + 1 })
const doDecreaseShoppedCount = state => state.merge({ shoppedCount: state.shoppedCount - 1 })

const doUpdateItem = state => state.merge({ isAttemptingUpdateItem: true })
const doDoneUpdateItem = state => state.merge({ isAttemptingUpdateItem: false })

const doSearchItems = state => state.merge({ isAttemptingSearchItems: true })
const doDoneSearchItems = state => state.merge({ isAttemptingSearchItems: false })
const doSetSearchedItems = (state, { searchedItems }) => state.merge({ searchedItems })

const doGetAvailableStoreProducts = state => state.merge({ isAttemptingGetAvailableStoreProducts: true })
const doDoneGetAvailableStoreProducts = state => state.merge({ isAttemptingGetAvailableStoreProducts: false })
const doSetAvailableStoreProducts = (state, { data }) => state.merge({ availableStoreProducts: data })
const doResetAvailableStoreProducts = state => state.merge({ availableStoreProducts: INITIAL_STATE.availableStoreProducts })

const doGetMoreAvailableStoreProducts = state => state.merge({ isAttemptingGetMoreAvailableStoreProducts: true })
const doDoneGetMoreAvailableStoreProducts = state => state.merge({ isAttemptingGetMoreAvailableStoreProducts: false })
const doSetMoreAvailableStoreProducts = (state, { data }) => state.merge({
    availableStoreProducts: {
        ...state.availableStoreProducts,
        next: data.next,
        categories: [
            ...state.availableStoreProducts.categories,
            ...data.categories
        ]
    }
})

const doMarkGroceryAsShopped = state => state.merge({ isAttemptingMarkGroceryAsShopped: true })
const doDoneMarkGroceryAsShopped = state => state.merge({ isAttemptingMarkGroceryAsShopped: false })

const doUnmarkGroceryAsShopped = state => state.merge({ isAttemptingUnmarkGroceryAsShopped: true })
const doDoneUnmarkGroceryAsShopped = state => state.merge({ isAttemptingUnmarkGroceryAsShopped: false })

const doSetHideCompletedItems = (state, { isHide }) => state.merge({ isHideCompletedItems: isHide })

const doGetStores = state => state.merge({ isAttemptingGetStores: true })
const doDoneGetStores = state => state.merge({ isAttemptingGetStores: false })
const doSetStores = (state, { list }) => state.merge({ stores: list })

const doGetTimeAndMoneySaved = state => state.merge({
    timeAndMoneySaved: {
        ...INITIAL_STATE.timeAndMoneySaved,
        attempting: true
    }
})
const doDoneGetTimeAndMoneySaved = state => state.merge({
    timeAndMoneySaved: {
        ...state.timeAndMoneySaved,
        attempting: false
    }
})
const doSetTimeAndMoneySavedData = (state, { data }) => state.merge({
    timeAndMoneySaved: {
        ...state.timeAndMoneySaved,
        data
    }
})

const HANDLERS = {
    [Actions.Types.ATTEMPT_GET_SHOPPING_LIST]: doGetList,
    [Actions.Types.DONE_ATTEMPT_GET_SHOPPING_LIST]: doDoneGetList,
    [Actions.Types.SET_SHOPPING_LIST]: doSetList,
    [Actions.Types.SET_SHOPPING_LIST_ID]: doSetListId,

    [Actions.Types.ATTEMPT_GET_FINAL_SHOPPING_LIST]: doGetFinalList,
    [Actions.Types.DONE_ATTEMPT_GET_FINAL_SHOPPING_LIST]: doDoneGetFinalList,
    [Actions.Types.SET_FINAL_SHOPPING_LIST]: doSetFinalList,
    [Actions.Types.SET_FINAL_SHOPPING_LIST_ITEM_COUNT]: doSetFinalItemCount,
    [Actions.Types.SET_SHOW_FINALIZED_LIST]: doSetShowFinalizedList,

    [Actions.Types.SET_SHOPPING_LIST_ITEM_COUNT]: doSetItemCount,
    [Actions.Types.SET_SHOPPING_LIST_SHOPPED_COUNT]: doSetShoppedCount,
    [Actions.Types.INCREASE_SHOPPING_LIST_SHOPPED_COUNT]: doIncreaseShoppedCount,
    [Actions.Types.DECREASE_SHOPPING_LIST_SHOPPED_COUNT]: doDecreaseShoppedCount,

    [Actions.Types.ATTEMPT_UPDATE_SHOPPING_ITEM]: doUpdateItem,
    [Actions.Types.DONE_ATTEMPT_UPDATE_SHOPPING_ITEM]: doDoneUpdateItem,

    [Actions.Types.ATTEMPT_SEARCH_SHOPPING_ITEMS]: doSearchItems,
    [Actions.Types.DONE_ATTEMPT_SEARCH_SHOPPING_ITEMS]: doDoneSearchItems,
    [Actions.Types.SET_SEARCHED_SHOPPING_ITEMS]: doSetSearchedItems,

    [Actions.Types.ATTEMPT_GET_AVAILABLE_STORE_PRODUCTS]: doGetAvailableStoreProducts,
    [Actions.Types.DONE_ATTEMPT_GET_AVAILABLE_STORE_PRODUCTS]: doDoneGetAvailableStoreProducts,
    [Actions.Types.SET_AVAILABLE_STORE_PRODUCTS]: doSetAvailableStoreProducts,
    [Actions.Types.RESET_AVAILABLE_STORE_PRODUCTS]: doResetAvailableStoreProducts,

    [Actions.Types.ATTEMPT_GET_MORE_AVAILABLE_STORE_PRODUCTS]: doGetMoreAvailableStoreProducts,
    [Actions.Types.DONE_ATTEMPT_GET_MORE_AVAILABLE_STORE_PRODUCTS]: doDoneGetMoreAvailableStoreProducts,
    [Actions.Types.SET_MORE_AVAILABLE_STORE_PRODUCTS]: doSetMoreAvailableStoreProducts,

    [Actions.Types.ATTEMPT_MARK_GROCERY_AS_SHOPPED]: doMarkGroceryAsShopped,
    [Actions.Types.DONE_ATTEMPT_MARK_GROCERY_AS_SHOPPED]: doDoneMarkGroceryAsShopped,

    [Actions.Types.ATTEMPT_UNMARK_GROCERY_AS_SHOPPED]: doUnmarkGroceryAsShopped,
    [Actions.Types.DONE_ATTEMPT_UNMARK_GROCERY_AS_SHOPPED]: doDoneUnmarkGroceryAsShopped,

    [Actions.Types.SET_HIDE_COMPLETED_SHOPPING_ITEMS]: doSetHideCompletedItems,

    [Actions.Types.ATTEMPT_GET_STORES]: doGetStores,
    [Actions.Types.DONE_ATTEMPT_GET_STORES]: doDoneGetStores,
    [Actions.Types.SET_STORES]: doSetStores,

    [Actions.Types.ATTEMPT_GET_TIME_AND_MONEY_SAVED]: doGetTimeAndMoneySaved,
    [Actions.Types.DONE_ATTEMPT_GET_TIME_AND_MONEY_SAVED]: doDoneGetTimeAndMoneySaved,
    [Actions.Types.SET_TIME_AND_MONEY_SAVED_DATA]: doSetTimeAndMoneySavedData
}

export default createReducer(INITIAL_STATE, HANDLERS)
