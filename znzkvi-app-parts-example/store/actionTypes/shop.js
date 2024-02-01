export default {
    attemptGetShoppingList: ['params'],
    doneAttemptGetShoppingList: null,
    setShoppingList: ['list'],

    attemptGetFinalShoppingList: null,
    doneAttemptGetFinalShoppingList: null,
    setFinalShoppingList: ['list'],
    setFinalShoppingListItemCount: ['count'],
    setShowFinalizedList: ['show'],

    setShoppingListItemCount: ['count'],
    setShoppingListShoppedCount: ['count'],
    setShoppingListId: ['shoppingListId'],
    increaseShoppingListShoppedCount: null,
    decreaseShoppingListShoppedCount: null,

    attemptGetAvailableStoreProducts: ['storeId'],
    doneAttemptGetAvailableStoreProducts: null,
    setAvailableStoreProducts: ['data'],
    resetAvailableStoreProducts: null,

    attemptGetMoreAvailableStoreProducts: ['url'],
    doneAttemptGetMoreAvailableStoreProducts: null,
    setMoreAvailableStoreProducts: ['data'],

    attemptUpdateShoppingItem: ['payload'],
    doneAttemptUpdateShoppingItem: null,

    attemptSearchShoppingItems: ['searchQuery'],
    doneAttemptSearchShoppingItems: null,
    setSearchedShoppingItems: ['searchedItems'],

    attemptMarkGroceryAsShopped: ['payload'],
    doneAttemptMarkGroceryAsShopped: null,

    attemptUnmarkGroceryAsShopped: ['payload'],
    doneAttemptUnmarkGroceryAsShopped: null,

    setHideCompletedShoppingItems: ['isHide'],

    attemptGetStores: ['params'],
    doneAttemptGetStores: null,
    setStores: ['list'],

    attemptGetTimeAndMoneySaved: null,
    doneAttemptGetTimeAndMoneySaved: null,
    setTimeAndMoneySavedData: ['data'],

    attemptUpdateShowFinalizedList: ['payload']
}
