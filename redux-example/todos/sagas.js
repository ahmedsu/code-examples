import { takeLatest, takeEvery, put, select, call } from 'redux-saga/effects';
import firestore from '@react-native-firebase/firestore';

import {
  CREATE_TODO,
  UPDATE_TODO,
  DELETE_TODO,
  LOAD_TODOS,
  createTodoSuccess,
  createTodoFailure,
  updateTodoSuccess,
  updateTodoFailure,
  deleteTodoSuccess,
  deleteTodoFailure,
  deleteTodoDateSuccess,
  loadTodosSuccess,
  loadTodosFailure,
  deleteAllUserTodosSuccess,
  deleteAllUserTodosFailure,
  DELETE_ALL_USER_TODOS,
} from './actions';
import {
  loadLearnTodosSuccess,
  createLearnTodo,
  deleteLearnTodoDateSuccess,
} from '../learnTodos/actions';
import { setLoading, setLoadingList, setShowNoConnection } from '../app/actions';
import {
  formatArrayToObject,
  removeEmptyProperties,
  snapshotToArray,
  isConnected,
} from '../../utils/helperFunctions';
import bugsnag from '../../utils/bugsnag';
import { todosTypes } from '../../utils/constants';
import { loadContactTodosSuccess, deleteContactTodoDateSuccess } from '../contactTodos/actions';
import { updateUser } from '../user/actions';

const getUser = (state) => state.user;

/**
 * @description Creates a todo in the database
 * @author Ahmed Suljic
 */
function* createTodoSaga(action) {
  const { todo, eventId, userId } = action.payload;
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const { template, scheduledDate, eventDate, repeatMode, repeatEndDate, deletedDates } = todo;

    const todoForDB = removeEmptyProperties({
      template,
      eventDate,
      repeatMode,
      repeatEndDate,
      scheduledDate,
      userId,
      eventId,
      deletedDates,
    });

    const todoForDBWithType = { content: { ...todoForDB }, type: todosTypes.eventTodos };
    const { id } = yield firestore()
      .collection('todos')
      .add({ ...todoForDBWithType });

    yield put(createTodoSuccess({ todo: { id, ...todoForDBWithType } }));
  } catch (e) {
    bugsnag.notify(`Error creating todo ${todo} for event ${eventId}`, e);
    yield put(createTodoFailure());
  }
}

/**
 * @description Updates an existing todo in the database
 * @author Ahmed Suljic
 */
function* updateTodoSaga(action) {
  const { todo, completed } = action.payload;
  const { id, content } = todo;
  yield put(setLoading({ loading: true, loadingType: 'todos' }));
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const {
      template,
      eventDate,
      repeatMode,
      repeatEndDate,
      scheduledDate,
      userId,
      eventId,
      status,
      completedDates,
    } = content;
    const todoToBeUpdated = yield firestore().collection('todos').doc(id).get();

    const todoForDB = {
      ...todoToBeUpdated._data,
      content: removeEmptyProperties({
        ...todoToBeUpdated._data.content,
        scheduledDate: completed ? todoToBeUpdated._data.content.scheduledDate : scheduledDate,
        eventDate: completed ? todoToBeUpdated._data.content.eventDate : eventDate,
        repeatMode,
        repeatEndDate,
        template,
        userId,
        eventId,
        status,
        completedDates,
      }),
    };
    yield firestore()
      .collection('todos')
      .doc(id)
      .update({
        ...todoForDB,
      });
    yield put(updateTodoSuccess({ todo: { id, ...todoForDB } }));
    yield put(setLoading({ loading: false, loadingType: 'todos' }));
  } catch (e) {
    bugsnag.notify(`Error updating todo ${todo}}`, e);
    yield put(setLoading({ loading: false, loadingType: 'todos' }));
    yield put(updateTodoFailure());
  }
}

/**
 * @description Deletes a todo from the database
 * @author Ahmed Suljic
 */
function* deleteTodoSaga(action) {
  const { todo } = action.payload;
  const { id, content } = todo;
  const { deletedDates, repeatMode } = content;
  const userData = yield select(getUser);

  yield put(setLoading({ loading: true, loadingType: 'todos' }));
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    // For event based todos, if repeat mode is 'none' remove todo from DB
    // Othervise we only add deleted date into deleted dates array
    if (!!todo?.content?.eventId && repeatMode === 'none') {
      yield firestore().collection('todos').doc(id).delete();
      yield put(deleteTodoSuccess({ id }));
    } else {
      const todoFromDB = yield firestore().collection('todos').doc(id).get();
      const todoFromDBObj = todoFromDB._data;

      const todoForDB = removeEmptyProperties({
        ...todoFromDBObj,
        content: {
          ...todoFromDBObj?.content,
          deletedDates: [...deletedDates],
        },
      });

      // Increment deletedLearnTodosCount
      if (todo?.content?.course) {
        yield put(updateUser({ deletedLearnTodosCount: userData?.deletedLearnTodosCount + 1 }));
      }

      // Update todo in DB
      yield firestore()
        .collection('todos')
        .doc(id)
        .update({
          ...todoForDB,
        });

      // Apply changes in redux
      // If todo contains eventId it's event based todo, if it contains course it's learn based todo
      // Othervise it's contact based todo
      if (todo?.content?.eventId) {
        yield put(deleteTodoDateSuccess({ todo: { id, ...todoForDB } }));
      } else if (todo?.content?.course) {
        yield put(deleteLearnTodoDateSuccess({ todo: { id, ...todoForDB } }));
      } else {
        yield put(deleteContactTodoDateSuccess({ todo: { id, ...todoForDB } }));
      }
    }

    yield put(setLoading({ loading: false, loadingType: 'todos' }));
  } catch (e) {
    bugsnag.notify(`Error deleting todo ${id}`, e);
    yield put(setLoading({ loading: false, loadingType: 'todos' }));
    yield put(deleteTodoFailure());
  }
}

/**
 * @description Loads user's todos from the database
 * @author Ahmed Suljic
 */
function* loadTodosSaga(action) {
  yield put(setLoadingList({ loadingList: true, loadingListType: 'todos' }));
  const { userId } = action.payload;
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const result = yield firestore()
      .collection('todos')
      .where('content.userId', '==', userId)
      .get();
    const todos = snapshotToArray(result);

    // Event based todos
    const eventTodos = todos.filter((todo) => todo.type === todosTypes.eventTodos);
    // Contact based todos
    const contactTodos = todos.filter((todo) => todo.type === todosTypes.contactTodos);
    // Learn based todos
    const learnTodos = todos.filter((todo) => todo.type === todosTypes.learnTodos);

    // Save Event based todos to redux
    yield put(loadTodosSuccess({ todos: formatArrayToObject(eventTodos) }));
    // Save Contact based todos to redux
    yield put(loadContactTodosSuccess({ contactTodos: formatArrayToObject(contactTodos) }));

    // When the user registers to the app for the first time we add learn todos and never again
    // If in DB there are no learn todos associated with the user add them othervise save already added ones to DB
    if (learnTodos?.length > 0) {
      yield put(loadLearnTodosSuccess({ learnTodos: formatArrayToObject(learnTodos) }));
    } else {
      yield put(createLearnTodo({ userId }));
    }

    yield put(setLoadingList({ loadingList: false, loadingListType: 'todos' }));
  } catch (e) {
    bugsnag.notify(e, `Error loading todos for ${userId}`);
    yield put(setLoadingList({ loadingList: false, loadingListType: 'todos' }));
    yield put(loadTodosFailure());
  }
}

/**
 * @description Wipes the user's todos from firebase, used for the remove account feature
 * @author Ahmed Suljic
 */
function* deleteAllUserTodosSaga() {
  try {
    const { id: userId } = yield select((state) => state.user);
    const todosQuerySnapshot = yield firestore()
      .collection('todos')
      .where('content.userId', '==', userId)
      .get();
    const batch = firestore().batch();
    todosQuerySnapshot.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
    batch.commit();
    yield put(deleteAllUserTodosSuccess());
  } catch (e) {
    yield put(deleteAllUserTodosFailure());
    bugsnag.notify(e, `Error deleting all user's todos`);
  }
}

function* createTodoSagaWatcher() {
  yield takeEvery(CREATE_TODO, createTodoSaga);
}

function* updateTodoSagaWatcher() {
  yield takeEvery(UPDATE_TODO, updateTodoSaga);
}

function* deleteTodoSagaWatcher() {
  yield takeEvery(DELETE_TODO, deleteTodoSaga);
}

function* loadTodosSagaWatcher() {
  yield takeLatest(LOAD_TODOS, loadTodosSaga);
}

function* deleteAllUserTodosSagaWatcher() {
  yield takeLatest(DELETE_ALL_USER_TODOS, deleteAllUserTodosSaga);
}

/**
 * Exports
 */
export default [
  createTodoSagaWatcher,
  loadTodosSagaWatcher,
  updateTodoSagaWatcher,
  deleteTodoSagaWatcher,
  deleteAllUserTodosSagaWatcher,
];
