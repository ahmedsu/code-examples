import {createActions} from 'reduxsauce'
import app from './app'
import auth from './auth'
import user from './user'
import meal from './meal'
import shop from './shop'
import order from './order'
import cart from './cart'
import notification from './notification'
import file from './file'
import reward from './reward'
import challenge from './challenge'
import digitalPantry from './digitalPantry'
import navigation from './navigation'

const {Types, Creators} = createActions({
    ...app,
    ...auth,
    ...user,
    ...meal,
    ...shop,
    ...order,
    ...cart,
    ...notification,
    ...file,
    ...reward,
    ...challenge,
    ...digitalPantry,
    ...navigation,
})

export default {
    Types,
    Creators
}