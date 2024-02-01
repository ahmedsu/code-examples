import {combineReducers} from 'redux'
import App from './App'
import Auth from './Auth'
import User from './User'
import Meal from './Meal'
import Shop from './Shop'
import Order from './Order'
import Cart from './Cart'
import Notification from './Notification'
import File from './File'
import Reward from './Reward'
import Challenge from './Challenge'
import DigitalPantry from './DigitalPantry'
import Navigation from './Navigation'

export default combineReducers({
    app: App,
    auth: Auth,
    user: User,
    meal: Meal,
    shop: Shop,
    order: Order,
    cart: Cart,
    notification: Notification,
    file: File,
    reward: Reward,
    challenge: Challenge,
    digitalPantry: DigitalPantry,
    navigation: Navigation,
})