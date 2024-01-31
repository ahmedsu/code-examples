import { takeLatest, put, select, call } from 'redux-saga/effects';
import { Keyboard } from 'react-native';
import I18n from 'i18n-js';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  UPDATE_USER,
  updateUserSuccess,
  updateUserFailure,
  INITIALIZE_USER,
  initializeUserSuccess,
  initializeUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  DELETE_USER,
} from './actions';
import { loadContacts } from '../contacts/actions';
import { loadTodos } from '../todos/actions';
import { loadEvents } from '../events/actions';
import { fetchCourses, fetchStories } from '../learn/actions';
import { setShowNoConnection } from '../app/actions';

import { isConnected } from '../../utils/helperFunctions';
import { navigate } from '../../utils/navigationService';
import bugsnag from '../../utils/bugsnag';

/**
 * @description Called when user logs in the app. Initializes the user if the user
 * already exists, otherwise created a new user in the database.
 * @author Ahmed Suljic
 */
function* initializeUserSaga(action) {
  const { id, country } = action.payload;
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const user = yield firestore().collection('users').doc(id).get();
    const fcmToken = yield AsyncStorage.getItem('fcmToken');

    if (user.exists) {
      // Load user's contacts
      yield put(loadContacts({ userId: id }));
      // Load user's todos
      yield put(loadTodos({ userId: id }));
      // Load user's events
      yield put(loadEvents({ userId: id }));

      const userData = user.data();

      // Remove receipt from userData to avoid storing it locally
      delete userData.receipt;

      // If FCM token has changed - update it
      if (userData.fcmToken !== fcmToken) {
        yield firestore().collection('users').doc(id).update({
          fcmToken,
        });
      }

      yield put(initializeUserSuccess({ id, ...userData, fcmToken }));
    } else {
      // New user
      yield firestore()
        .collection('users')
        .doc(id)
        .set({
          country,
          language: I18n.locale.split('-')[0],
          // Used to keep track of how many learn todos are deleted
          // After 2 learn todos deleted show modal where user can disable/enable learn todos
          deletedLearnTodosCount: 0,
          removedSocialProfileDate: null,
        });
      yield put(
        initializeUserSuccess({
          id,
          country,
          language: I18n.locale.split('-')[0],
          deletedLearnTodosCount: 0,
          removedSocialProfileDate: null,
        }),
      );
      // Load user's todos
      yield put(loadTodos({ userId: id }));
      // Dismiss keyboard before navigating. Might be a bug in RN navigation @5.5.0
      Keyboard.dismiss();
      navigate('EnableContacts');
    }
    // Fetches all courses and stories
    yield put(fetchCourses());
    yield put(fetchStories());
  } catch (e) {
    yield put(initializeUserFailure());
    bugsnag.notify(e, 'Error intializing user');
  }
}

/**
 * @description Updates an already existing user in database
 * @author Ahmed Suljic
 */
function* updateUserSaga(action) {
  const { payload } = action;

  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const { id } = yield select((state) => state.user);

    yield firestore()
      .collection('users')
      .doc(id)
      .update({
        ...payload,
      });

    // Never save the receipt locally
    if (payload.receipt) delete payload.receipt;

    yield put(updateUserSuccess({ ...payload }));
  } catch (e) {
    bugsnag.notify(e, 'Error updating user in firebase');
    yield put(updateUserFailure());
  }
}

/**
 * @description Deletes the user from firestore, used for the remove account feature
 * @author Ahmed Suljic
 */
function* deleteUserSaga() {
  try {
    const { id: userId } = yield select((state) => state.user);
    yield firestore().collection('users').doc(userId).delete();
    yield put(deleteUserSuccess());
  } catch (e) {
    yield put(deleteUserFailure());
    bugsnag.notify(e, `Error deleting user`);
  }
}

/**
 * Saga watchers
 */

function* initializeUserSagaWatcher() {
  yield takeLatest(INITIALIZE_USER, initializeUserSaga);
}

function* updateUserSagaWatcher() {
  yield takeLatest(UPDATE_USER, updateUserSaga);
}

function* deleteUserSagaWatcher() {
  yield takeLatest(DELETE_USER, deleteUserSaga);
}

/**
 * Exports
 */
export default [initializeUserSagaWatcher, updateUserSagaWatcher, deleteUserSagaWatcher];
