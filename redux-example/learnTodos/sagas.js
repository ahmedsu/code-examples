import { takeLatest, put, call } from 'redux-saga/effects';
import firestore from '@react-native-firebase/firestore';

import {
  CREATE_LEARN_TODO,
  UPDATE_LEARN_TODO,
  DELETE_ALL_LEARN_TODOS,
  createLearnTodoFailure,
  updateLearnTodoSuccess,
  updateLearnTodoFailure,
  deleteAllLearnTodosSuccess,
  deleteAllLearnTodosFailure,
} from './actions';
import { setLoading, setShowNoConnection } from '../app/actions';
import { updateUser } from '../user/actions';
import { loadTodos } from '../todos/actions';

import {
  removeEmptyProperties,
  snapshotToArray,
  batchUpload,
  batchDelete,
  createLearnTodosArray,
  isConnected,
} from '../../utils/helperFunctions';
import { learnTodoTemplates, learnTodoTypes } from '../../utils/constants';
import bugsnag from '../../utils/bugsnag';

/**
 * @description Adds 11 learn todos to DB for the user on first time when user registers into the app
 * @author Ahmed Suljic
 */
function* createLearnTodoSaga(action) {
  const { userId } = action.payload;
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    // Create array of 11 default learn todos
    const learnTodosToStore = createLearnTodosArray(learnTodoTypes, userId, learnTodoTemplates);
    // Adding learn todos array to DB
    yield batchUpload(learnTodosToStore, 'todos');
    yield put(loadTodos({ userId }));
  } catch (e) {
    bugsnag.notify(`Error creating learn todo`, e);
    yield put(createLearnTodoFailure());
  }
}

/**
 * @description Update learn todo function
 * Right now used only for completing learn todos
 * @author Ahmed Suljic
 */
function* updateLearnTodoSaga(action) {
  const { todo } = action.payload;
  const { id, content } = todo;
  const { completedDates } = content;
  yield put(setLoading({ loading: true, loadingType: 'todos' }));
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const learnTodoFromDB = yield firestore().collection('todos').doc(id).get();
    const learnTodoFromDBObj = learnTodoFromDB._data;

    const todoForDB = removeEmptyProperties({
      ...learnTodoFromDBObj,
      content: {
        ...learnTodoFromDBObj.content,
        completedDates: [...completedDates],
      },
    });
    yield firestore()
      .collection('todos')
      .doc(id)
      .update({
        ...todoForDB,
      });
    yield put(updateLearnTodoSuccess({ todo: { id, ...todoForDB } }));
    yield put(setLoading({ loading: false, loadingType: 'todos' }));
  } catch (e) {
    yield put(setLoading({ loading: false, loadingType: 'todos' }));

    bugsnag.notify(`Error updating learn todo ${id}`, e);
    yield put(updateLearnTodoFailure());
  }
}

/**
 * @description Remove all learn todos of the user
 * @author Ahmed Suljic
 */
function* deleteAllLearnTodosSaga(action) {
  const { userId } = action.payload;
  yield put(setLoading({ loading: true, loadingType: 'todos' }));
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const learnTodosFromDB = yield firestore()
      .collection('todos')
      .where('content.userId', '==', userId)
      .get();
    const toBeDeletedLearnTodos = snapshotToArray(learnTodosFromDB, 'id', true);

    // Delete todos
    yield batchDelete(toBeDeletedLearnTodos);

    // Reset deleted learn todos count for user
    yield put(updateUser({ deletedLearnTodosCount: 0 }));

    yield put(deleteAllLearnTodosSuccess());
    yield put(setLoading({ loading: false, loadingType: 'todos' }));
  } catch (e) {
    yield put(setLoading({ loading: false, loadingType: 'todos' }));

    bugsnag.notify(`Error deleting all learn todos`, e);
    yield put(deleteAllLearnTodosFailure());
  }
}

function* createLearnTodoSagaWatcher() {
  yield takeLatest(CREATE_LEARN_TODO, createLearnTodoSaga);
}
function* updateLearnTodoSagaWatcher() {
  yield takeLatest(UPDATE_LEARN_TODO, updateLearnTodoSaga);
}
function* deleteAllLearnTodosSagaWatcher() {
  yield takeLatest(DELETE_ALL_LEARN_TODOS, deleteAllLearnTodosSaga);
}

/**
 * Exports
 */
export default [
  createLearnTodoSagaWatcher,
  updateLearnTodoSagaWatcher,
  deleteAllLearnTodosSagaWatcher,
];
