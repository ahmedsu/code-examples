import {takeLatest, put, call, select, all} from 'redux-saga/effects'
import Actions from '@actions'
import * as API from '@api'
import {logConsole, Say} from '@utils'
import {goBack, navigate} from '@services'
import {Routes} from '@config';
import {logEvent} from '@lib'
import {Events} from '@config'
import Immutable from 'seamless-immutable'
import moment from 'moment';

function * getList() {
    try {

        yield put(Actions.Creators.showVeil())
        
        const state = yield select();
        
        const currentDate = moment();
        const { date_created } = state.user.data;

        const res = yield call(API.getDigitalPantry)

        logConsole('GET DIGITAL PANTRY RESPONSE STATUS!!!\n\n', res.status)
        logConsole('GET DIGITAL PANTRY RESPONSE DATA!!!\n\n', res.data)

        if(res.status == 200) {
            let items = []
            let hasShowSlide = false;

            const accountCreationDateDuration = moment.duration(
              currentDate.diff(moment(date_created, 'YYYY-MM-DD'))
            );
      
            let accountCreationDateDifference = Math.floor(
              accountCreationDateDuration.asDays()
            );
            if (accountCreationDateDifference >= 14) {
                hasShowSlide = true
            }

            res.data.data.categories.map((c, i) => {
                let firstExpiredIndex = c.items.findIndex(data => data.expired);
                if(!hasShowSlide && firstExpiredIndex != -1){
                    c.items[firstExpiredIndex].showSlide = true;
                    hasShowSlide = true;
                }
                items.push({
                    index: i,
                    name: c.name,
                    data: c.items
                })
            })

            yield put(Actions.Creators.setDigitalPantry({
                pantry: res.data.data.pantry,
                categories: items
            }))
        }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptGetDigitalPantry())
    yield put(Actions.Creators.hideVeil())
}

function * update({route}) {
    try {

        yield put(Actions.Creators.showVeil())

        const state = yield select()
        
        let payload = {
            pantry: state.digitalPantry.data.pantry,
            categories: []
        }
        let updateIng = []; 

        state.digitalPantry.data.categories.map(c => {
            let deleteIngredients = c.data.filter(i => !i.confirm_available_in_pantry);
            if(deleteIngredients.length > 0){
                payload.categories.push({
                    name: c.name,
                    items: deleteIngredients
                })
            }
            let ingExpiryUpdate = c.data.filter(i => i.updateExpiry);
            for(let ing of ingExpiryUpdate){

                let updatePayload = {
                    id: ing.pantry_item,
                    date: new Date()
                }
                updateIng.push(call(API.updateIngredientExpiry, updatePayload))
            }
        })

        logConsole('UPDATE DIGITAL PANTRY PAYLOAD!!!', payload);
        
        let res = null
        if(payload.categories.length > 0){
            res = yield call(API.updateDigitalPantry, payload)
        }
        logConsole('UPDATE DIGITAL PANTRY updateIng!!!', updateIng);
        const ingRes = yield all(updateIng)

        logConsole('UPDATE DIGITAL PANTRY ingRes!!!\n\n', ingRes)

        // if(res.status == 200) {
            yield put(Actions.Creators.attemptGetShoppingList())

            yield call(logEvent, Events.pantry_edit)

            yield put(Actions.Creators.attemptGetDigitalPantry())
            navigate(route.redirectTo || Routes.myMealPlan)
        // }
    }
    catch(err) {
        
    }

    yield put(Actions.Creators.doneAttemptUpdateDigitalPantry())
    yield put(Actions.Creators.hideVeil())
}

function * toggleIngredientAvailability({payload}) {
    try {
        const state = yield select()

        logConsole('TOGGLE INGREDIENT AVAILABILITY IN PANTRY PAYLOAD!!!', payload)

        const {categoryIndex, itemIndex} = payload

        let data = Immutable.asMutable(state.digitalPantry.data, {deep: true})

        data.categories[categoryIndex].data[itemIndex].confirm_available_in_pantry = !data.categories[categoryIndex].data[itemIndex].confirm_available_in_pantry

        yield put(Actions.Creators.setDigitalPantry(data))
    }
    catch(err) {
        Say.err(err)
    }
}

function * updateIngredient({payload}) {
    try {

        const state = yield select()

        logConsole('UPDATE DIGITAL PANTRY INGREDIENT payload!!!\n\n', payload)

        const {categoryIndex, itemIndex} = payload

        let data = Immutable.asMutable(state.digitalPantry.data, {deep: true})

        logConsole('UPDATE DIGITAL PANTRY INGREDIENT data.categories[categoryIndex].data[itemIndex]!!!\n\n', data.categories[categoryIndex].data[itemIndex])
        data.categories[categoryIndex].data[itemIndex].expired = false
        data.categories[categoryIndex].data[itemIndex].updateExpiry = true
        data.categories[categoryIndex].data[itemIndex].showSlide = false

        logConsole('UPDATE DIGITAL PANTRY INGREDIENT state.digitalPantry!!!\n\n', data)

        yield put(Actions.Creators.setDigitalPantry(data))
    }
    catch(err) {
        // Say.err(err)
    }
}

export default function * () {
    yield takeLatest(Actions.Types.ATTEMPT_GET_DIGITAL_PANTRY, getList)
    yield takeLatest(Actions.Types.ATTEMPT_UPDATE_DIGITAL_PANTRY, update)
    yield takeLatest(Actions.Types.ATTEMPT_TOGGLE_INGREDIENT_AVAILABLE_IN_PANTRY, toggleIngredientAvailability)
    yield takeLatest(Actions.Types.ATTEMPT_UPDATE_INGREDIENT_EXPIRY, updateIngredient)
}