import App from './App'
import Auth from './Auth'
import User from './User'
import Meal from './Meal'
import Shop from './Shop'
import Order from './Order'
import Cart from './Cart'
import Notification from './Notification'
import Reward from './Reward'
import Challenge from './Challenge'
import DigitalPantry from './DigitalPantry'

export default store => {
    store.runSaga(App)
    store.runSaga(Auth)
    store.runSaga(User)
    store.runSaga(Meal)
    store.runSaga(Shop)
    store.runSaga(Order)
    store.runSaga(Cart)
    store.runSaga(Notification)
    store.runSaga(Reward)
    store.runSaga(Challenge)
    store.runSaga(DigitalPantry)
}