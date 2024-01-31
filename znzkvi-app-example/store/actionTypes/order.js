export default  {
    setOrderDetails: ['data'],
    updateOrderDetails: ['data'],

    attemptReportOrderProblem: ['payload'],
    doneAttemptReportOrderProblem: null,

    attemptGetDeliveryOptions: null,
    doneAttemptGetDeliveryOptions: null,
    setDeliveryOptions: ['deliveryOptions'],

    setDeliveryTimes: ['deliveryTimes'],

    setDeliveryDateFilter: ['date'],

    attemptGetPaymentMethods: null,
    doneAttemptGetPaymentMethods: null,
    setPaymentMethods: ['paymentMethods'],

    attemptAddPaymentMethod: ['payload'],
    doneAttemptAddPaymentMethod: null,

    attemptUpdatePaymentMethod: ['payload'],
    doneAttemptUpdatePaymentMethod: null,

    attemptDeletePaymentMethod: ['id'],
    doneAttemptDeletePaymentMethod: null,

    attemptPlaceOrder: ['payload'],
    doneAttemptPlaceOrder: ['success'],

    attemptGetGroceryOrders: ['payload'],
    doneAttemptGetGroceryOrders: null,
    setGroceryOrders: ['orders'],

    attemptCompleteOrderByShoppingList: ['payload'],
    doneAttemptCompleteOrderByShoppingList: null
}