import { takeEvery, takeLatest, put, select, all, call } from 'redux-saga/effects';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

import {
  formatArrayToObject,
  removeEmptyProperties,
  removeKeys,
  snapshotToArray,
  batchDelete,
  isConnected,
} from '../../utils/helperFunctions';
import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  LOAD_EVENTS,
  UPDATE_REPEATING_EVENT_AND_TODOS,
  createEventSuccess,
  createEventFailure,
  updateEventSuccess,
  updateEventFailure,
  deleteEventSuccess,
  deleteEventFailure,
  loadEventsSuccess,
  loadEventsFailure,
  updateRepeatingEventAndTodosSuccess,
  updateRepeatingEventAndTodosFailure,
  deleteAllUserEventsSuccess,
  deleteAllUserEventsFailure,
  DELETE_ALL_USER_EVENTS,
} from './actions';
import { createTodo, deleteTodo, updateTodo } from '../todos/actions';
import { setLoading, setLoadingList, setShowNoConnection } from '../app/actions';
import bugsnag from '../../utils/bugsnag';

import { todosTypes } from '../../utils/constants';

/**
 * @description Creates an event in the database
 * @author Ahmed Suljic
 */
function* createEventSaga(action) {
  yield put(setLoading({ loading: true, loadingType: 'events' }));

  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const { todos } = action.payload;
    let { event } = action.payload;

    // If it is a repeating event set nextRepeatDate equal to the scheduled date, otherwise to null.
    // Then clean any empty properties before saving event to the database
    event = removeEmptyProperties({
      ...event,
      nextRepeatDate: event.repeatMode !== 'none' ? event.scheduledDate : null,
    });

    const { id: userId } = yield select((state) => state.user);

    const { id } = yield firestore()
      .collection('events')
      .add({ ...event, userId });
    yield put(createEventSuccess({ event: { id, ...event } }));

    // Create event todos
    // TODO: Possible improvement - use batch create
    yield all(
      todos.map((todo) =>
        put(createTodo({ todo, eventId: id, userId, type: todosTypes.eventTodos })),
      ),
    );
    yield put(setLoading({ loading: false, loadingType: 'events' }));
  } catch (e) {
    yield put(createEventFailure());
    yield put(setLoading({ loading: false, loadingType: 'events' }));
    bugsnag.notify(e, 'Error creating event');
  }
}

/**
 * @description Updates an event in the database
 * @author Ahmed Suljic
 */
function* updateEventSaga(action) {
  yield put(setLoading({ loading: true, loadingType: 'events' }));
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    let { event } = action.payload;
    // Clean any empty properties before saving to the database
    event = removeEmptyProperties(event);

    yield firestore()
      .collection('events')
      .doc(event.id)
      .update(removeKeys(event, ['id']));

    yield put(updateEventSuccess({ event }));
    yield put(setLoading({ loading: false, loadingType: 'events' }));
  } catch (e) {
    yield put(updateEventFailure());
    yield put(setLoading({ loading: false, loadingType: 'events' }));
    bugsnag.notify(e, 'Error updating event');
  }
}

/**
 * @description Deletes an event from the database
 * @author Ahmed Suljic
 */
function* deleteEventSaga(action) {
  const { eventId } = action.payload;
  yield put(setLoading({ loading: true, loadingType: 'events' }));
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const resultUserTodos = yield firestore()
      .collection('todos')
      .where('content.eventId', '==', eventId)
      .get();

    const userTodos = snapshotToArray(resultUserTodos, 'id', true);
    // Delete todos
    yield batchDelete(userTodos);

    yield firestore().collection('events').doc(eventId).delete();
    yield put(deleteEventSuccess({ eventId, deletedTodoIds: userTodos.map(({ id }) => id) }));
    yield put(setLoading({ loading: false, loadingType: 'events' }));
  } catch (e) {
    yield put(deleteEventFailure());
    yield put(setLoading({ loading: false, loadingType: 'events' }));
    bugsnag.notify(e, `Failed to delete event ${eventId}`);
  }
}

/**
 * @description Loads user's events from the database
 * @author Ahmed Suljic
 */
function* loadEventsSaga(action) {
  yield put(setLoadingList({ loadingList: true, loadingListType: 'events' }));
  const { userId } = action.payload;
  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }
    const result = yield firestore().collection('events').where('userId', '==', userId).get();

    const events = snapshotToArray(result);

    yield put(
      loadEventsSuccess({
        events: formatArrayToObject(events),
      }),
    );
    yield put(setLoadingList({ loadingList: false, loadingListType: 'events' }));
  } catch (e) {
    bugsnag.notify(e, `Error loading events for ${userId}`);
    yield put(setLoadingList({ loadingList: false, loadingListType: 'events' }));
    yield put(loadEventsFailure());
  }
}

/**
 * @description Updates a repeating event and its todos
 * //TODO: Implement better error handling, if part of the operations fails, the others need to be reverted back to original state
 * @author Ahmed Suljic
 */
function* updateRepeatingEventAndTodosSaga(action) {
  yield put(setLoading({ loading: true, loadingType: 'events' }));
  const {
    oldEvent,
    newEventInstance,
    newEvent,
    newInstanceTodos,
    newTodos,
    todosToBeDeleted,
    todosToBeUpdated,
  } = action.payload;

  try {
    const hasConnection = yield call(isConnected);
    if (!hasConnection) {
      yield put(setShowNoConnection(true));
    }

    const oldEventId = oldEvent.id;

    // Add original scheduled date to the event object, as we don't want to overwrite/remove it
    // or remove it from the database
    const { scheduledDate: originalScheduledDate } = yield select(
      (state) => state.events[oldEventId],
    );

    // If original event scheduledDate is in the future and is equal to edited event's date, the event has not yet
    // ever occured and should be deleted. Otherwise it should be updated with it's repeatEndDate stopping before
    // the edited event instance original date
    oldEvent.scheduledDate === originalScheduledDate &&
    (oldEvent.allDay
      ? originalScheduledDate >= +moment().startOf('day')
      : originalScheduledDate >= +moment())
      ? yield put({
          type: DELETE_EVENT,
          payload: { eventId: oldEventId },
        })
      : yield put({
          type: UPDATE_EVENT,
          payload: {
            event: { ...oldEvent, scheduledDate: originalScheduledDate },
          },
        });

    // TODO: Possible improvement - use batch delete
    // Delete any edited event specific or any future todos that already exist in the database
    yield all(todosToBeDeleted.map((item) => put(deleteTodo({ todo: { id: item.id } }))));

    // TODO: Possible improvement - use batch update
    // Update repeatEndDate for any already in database existing future todos, that are scheduled for a past event instance
    // (todo still needs to happen, but for the last time)
    if (todosToBeUpdated.length) {
      yield all(
        todosToBeUpdated.map((item) =>
          put(
            updateTodo({
              todo: { ...item, repeatEndDate: oldEvent.repeatEndDate },
            }),
          ),
        ),
      );
    }

    // If editing only one event instance - create a new non repeating event instance and todos
    if (newEventInstance) {
      yield put({
        type: CREATE_EVENT,
        payload: { event: newEventInstance, todos: newInstanceTodos },
      });
    }

    // Create a new repeating event and todos, but only if event has no repeatEndDate or the new event
    // scheduledDate is before the repeatEndDate
    if (!newEvent.repeatEndDate || newEvent.scheduledDate <= newEvent.repeatEndDate) {
      yield put({
        type: CREATE_EVENT,
        payload: { event: newEvent, todos: newTodos },
      });
    }

    yield put(updateRepeatingEventAndTodosSuccess());
    yield put(setLoading({ loading: false, loadingType: 'events' }));
  } catch (e) {
    bugsnag.notify(
      e,
      `Error updating a repeating event instance ${{
        oldEvent,
        newEventInstance,
        newEvent,
        newInstanceTodos,
        newTodos,
        todosToBeDeleted,
        todosToBeUpdated,
      }}`,
    );
    yield put(setLoading({ loading: false, loadingType: 'events' }));
    yield put(updateRepeatingEventAndTodosFailure());
  }
}

/**
 * @description Wipes the user's events from firebase, used for the remove account feature
 * @author Ahmed Suljic
 */
function* deleteAllUserEventsSaga() {
  try {
    const { id: userId } = yield select((state) => state.user);
    const eventsQuerySnapshot = yield firestore()
      .collection('events')
      .where('userId', '==', userId)
      .get();
    const batch = firestore().batch();
    eventsQuerySnapshot.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
    batch.commit();
    yield put(deleteAllUserEventsSuccess());
  } catch (e) {
    yield put(deleteAllUserEventsFailure());
    bugsnag.notify(e, `Error deleting all user's events`);
  }
}

/**
 * Saga watchers
 */
function* createEventSagaWatcher() {
  yield takeEvery(CREATE_EVENT, createEventSaga);
}

function* updateEventSagaWatcher() {
  yield takeEvery(UPDATE_EVENT, updateEventSaga);
}

function* deleteEventSagaWatcher() {
  yield takeEvery(DELETE_EVENT, deleteEventSaga);
}

function* loadEventsSagaWatcher() {
  yield takeLatest(LOAD_EVENTS, loadEventsSaga);
}

function* updateRepeatingEventAndTodosSagaWatcher() {
  yield takeEvery(UPDATE_REPEATING_EVENT_AND_TODOS, updateRepeatingEventAndTodosSaga);
}

function* deleteAllUserEventsSagaWatcher() {
  yield takeLatest(DELETE_ALL_USER_EVENTS, deleteAllUserEventsSaga);
}

/**
 * Exports
 */
export default [
  createEventSagaWatcher,
  updateEventSagaWatcher,
  deleteEventSagaWatcher,
  loadEventsSagaWatcher,
  updateRepeatingEventAndTodosSagaWatcher,
  deleteAllUserEventsSagaWatcher,
];
