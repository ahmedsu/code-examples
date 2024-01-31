export default {
    attemptGetCart: ['payload'],
    doneAttemptGetCart: null,
    setCart: ['data'],
    updateCart: ['data'],
    clearCart: null,

    attemptGetCartStatus: null,
    doneAttemptGetCartStatus: null,
    setCartStatus: ['response'],

    showCartRequestTicker: null,
    hideCartRequestTicker: null,

    attemptAddQuantityToGroceryItem: ['options'],
    attemptSubtractQuantityFromGroceryItem: ['options'],

    attemptUpdateCart: ['payload'],
    doneAttemptUpdateCart: null,

    attemptResetCartStatus: null,
    doneAttemptResetCartStatus: null,

    attemptUpdateCartProduct: ['payload'],

    attemptGetInstacartLink: null,
    doneAttemptGetInstacartLink: null,

    attemptCartCheckout: ['grocery'],
    doneAttemptCartCheckout: null,

    redirectToGroceryBrowser: ['isRedirectedToGroceryBrowser'],

    checkOrderPlacedStatus: null,

    attemptGetGroceryAuthUrl: ['grocery'],
    doneAttemptGetGroceryAuthUrl: null,
}