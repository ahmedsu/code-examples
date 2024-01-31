import { takeLatest, put, call } from 'redux-saga/effects';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  FETCH_STORIES,
  fetchStoriesSuccess,
  FETCH_COURSES,
  fetchCoursesSuccess,
  FETCH_COMPLETED_COURSES,
  fetchCompletedCoursesSuccess,
} from './actions';
import { setShowNoConnection } from '../app/actions';

import bugsnag from '../../utils/bugsnag';
import { storiesApiUrl } from '../../utils/constants';
import { snapshotToArray, isConnected } from '../../utils/helperFunctions';

/**
 * @description Fetch stories from story API
 * @author Ahmed Suljic
 */
function* fetchStoriesSaga() {
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const storiesRes = yield fetch(storiesApiUrl);
    const storiesJSON = yield storiesRes.json();
    yield put(fetchStoriesSuccess({ stories: storiesJSON }));
  } catch (e) {
    bugsnag.notify(e, `Error fetching stories`);
  }
}

/**
 * @description Fetch courses from firebase
 * @author Ahmed Suljic
 */
function* fetchCoursesSaga() {
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const result = yield firestore().collection('courses').get();
    const courses = snapshotToArray(result, 'id');
    yield put(fetchCoursesSuccess({ courses }));
  } catch (e) {
    bugsnag.notify(e, `Error fetching courses`);
  }
}

/**
 * @description Returns array of course-slug strings corresponding to the completed courses from AsyncStorage
 * @author Ahmed Suljic
 */
function* fetchCompletedCoursesSaga() {
  try {
    const savedCoursesJSON = yield AsyncStorage.getItem('savedCourses');
    const savedCourses = JSON.parse(savedCoursesJSON);
    if (!savedCourses) {
      yield put(fetchCompletedCoursesSuccess({ completedCourses: [] }));
    }
    yield put(fetchCompletedCoursesSuccess({ completedCourses: savedCourses }));
  } catch (e) {
    bugsnag.notify('Error retrieving saved courses', e);
  }
}

function* fetchStoriesSagaWatcher() {
  yield takeLatest(FETCH_STORIES, fetchStoriesSaga);
}

function* fetchCoursesSagaWatcher() {
  yield takeLatest(FETCH_COURSES, fetchCoursesSaga);
}

function* fetchCompletedCoursesSagaWatcher() {
  yield takeLatest(FETCH_COMPLETED_COURSES, fetchCompletedCoursesSaga);
}

/**
 * Exports
 */
export default [fetchStoriesSagaWatcher, fetchCoursesSagaWatcher, fetchCompletedCoursesSagaWatcher];
