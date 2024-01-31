import { takeEvery, put, call } from 'redux-saga/effects';
import firestore from '@react-native-firebase/firestore';

import {
  CREATE_CONTACT_TODO,
  UPDATE_CONTACT_TODO,
  COMPLETE_CONTACT_TODO,
  createContactTodoSuccess,
  createContactTodoFailure,
  updateContactTodoSuccess,
  updateContactTodoFailure,
  deleteContactTodoSuccess,
  completeContactTodoSuccess,
  completeContactTodoFailure,
} from './actions';

import {
  removeEmptyProperties,
  snapshotToArray,
  batchUpdate,
  isConnected,
} from '../../utils/helperFunctions';
import bugsnag from '../../utils/bugsnag';
import { setLoading, setShowNoConnection } from '../app/actions';
import { todosTypes } from '../../utils/constants';

/**
 * @description Creates a contact todo in the database
 * @author Ahmed Suljic
 */
function* createContactTodoSaga(action) {
  const { todo, userId } = action.payload;
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const { template, scheduledDate, repeatMode, contactId, completedDates, deletedDates } = todo;
    const todoForDB = removeEmptyProperties({
      template,
      repeatMode,
      scheduledDate,
      userId,
      contactId,
      completedDates,
      deletedDates,
    });

    const todoForDBWithType = { content: { ...todoForDB }, type: todosTypes.contactTodos };

    const { id } = yield firestore()
      .collection('todos')
      .add({ ...todoForDBWithType });
    yield put(createContactTodoSuccess({ contactTodo: { id, ...todoForDBWithType } }));

    // If user selected interest the default 'noneFilled' must be deleted
    if (template !== 'noneFilled') {
      const noneFilledTodo = yield firestore()
        .collection('todos')
        .where('content.contactId', '==', contactId)
        .where('content.template', '==', 'noneFilled')
        .get();
      const toBeDeletedContactTodo = snapshotToArray(noneFilledTodo);
      yield firestore().collection('todos').doc(toBeDeletedContactTodo[0].id).delete();
      yield put(deleteContactTodoSuccess({ id: toBeDeletedContactTodo[0].id }));
    }
  } catch (e) {
    bugsnag.notify(`Error creating contact todo ${todo}`, e);

    yield put(createContactTodoFailure());
  }
}

/**
 * @description Updates an existing contact todo in the database
 * @author Ahmed Suljic
 */
function* updateContactTodoSaga(action) {
  const { contactId, importance, template } = action.payload;
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    // If importance is changed only update the repeatMode of contact todos for the user
    if (importance) {
      const contactTodos = yield firestore()
        .collection('todos')
        .where('content.contactId', '==', contactId)
        .get();
      const toBeUpdatedContactTodos = snapshotToArray(contactTodos, 'id', true);
      yield batchUpdate(toBeUpdatedContactTodos, { 'content.repeatMode': importance });
      yield put(updateContactTodoSuccess({ importance }));
    } else if (template) {
      // If alreday selected template is deselected, remove it from DB
      const contactTodo = yield firestore()
        .collection('todos')
        .where('content.contactId', '==', contactId)
        .where('content.template', '==', template)
        .get();

      if (contactTodo) {
        const toBeDeletedContactTodo = snapshotToArray(contactTodo, 'id', true);
        yield firestore().collection('todos').doc(toBeDeletedContactTodo[0].id).delete();
        yield put(deleteContactTodoSuccess({ id: toBeDeletedContactTodo[0].id }));
      }
    }
  } catch (e) {
    // bugsnag.notify(`Error updating todo}`, e);

    yield put(updateContactTodoFailure());
  }
}
/**
 * @description Complete an existing contact todo in the database
 * @author Ahmed Suljic
 */
function* completeContactTodoSaga(action) {
  const { todo } = action.payload;
  yield put(setLoading({ loading: true, loadingType: 'todos' }));
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const { id, content } = todo;
    const { completedDates } = content;
    // Remove contacts property, because we don't save it into DB
    delete todo.contacts;
    // Fetch original todo from DB so scheduled date is not changed
    const todoToBeCompleted = yield firestore().collection('todos').doc(id).get();

    const todoForDB = removeEmptyProperties({
      ...todoToBeCompleted._data,
      content: {
        ...todoToBeCompleted._data.content,
        completedDates,
      },
    });

    yield firestore()
      .collection('todos')
      .doc(id)
      .update({
        ...todoForDB,
      });
    yield put(completeContactTodoSuccess({ todo: { id, ...todoForDB } }));
    yield put(setLoading({ loading: false, loadingType: 'todos' }));
  } catch (e) {
    bugsnag.notify(`Error completing contact todo ${todo}}`, e);

    yield put(setLoading({ loading: false, loadingType: 'todos' }));
    yield put(completeContactTodoFailure());
  }
}
function* createContactTodoSagaWatcher() {
  yield takeEvery(CREATE_CONTACT_TODO, createContactTodoSaga);
}

function* updateContactTodoSagaWatcher() {
  yield takeEvery(UPDATE_CONTACT_TODO, updateContactTodoSaga);
}

function* completeContactTodoSagaWatcher() {
  yield takeEvery(COMPLETE_CONTACT_TODO, completeContactTodoSaga);
}

/**
 * Exports
 */
export default [
  createContactTodoSagaWatcher,
  updateContactTodoSagaWatcher,
  completeContactTodoSagaWatcher,
];
