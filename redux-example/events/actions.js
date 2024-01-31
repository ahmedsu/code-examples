export const CREATE_EVENT = 'CREATE_EVENT';
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAILURE = 'CREATE_EVENT_FAILURE';

export const UPDATE_EVENT = 'UPDATE_EVENT';
export const UPDATE_EVENT_SUCCESS = 'UPDATE_EVENT_SUCCESS';
export const UPDATE_EVENT_FAILURE = 'UPDATE_EVENT_FAILURE';

export const DELETE_EVENT = 'DELETE_EVENT';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';

export const LOAD_EVENTS = 'LOAD_EVENTS';
export const LOAD_EVENTS_SUCCESS = 'LOAD_EVENTS_SUCCESS';
export const LOAD_EVENTS_FAILURE = 'LOAD_EVENTS_FAILURE';

export const UPDATE_REPEATING_EVENT_AND_TODOS = 'UPDATE_REPEATING_EVENT_AND_TODOS';
export const UPDATE_REPEATING_EVENT_AND_TODOS_SUCCESS = 'UPDATE_REPEATING_EVENT_AND_TODOS_SUCCESS';
export const UPDATE_REPEATING_EVENT_AND_TODOS_FAILURE = 'UPDATE_REPEATING_EVENT_AND_TODOS_FAILURE';

export const DELETE_ALL_USER_EVENTS = 'DELETE_ALL_USER_EVENTS';
export const DELETE_ALL_USER_EVENTS_SUCCESS = 'DELETE_ALL_USER_EVENTS_SUCCESS';
export const DELETE_ALL_USER_EVENTS_FAILURE = 'DELETE_ALL_USER_EVENTS_FAILURE';

export const createEvent = ({ event, todos }) => ({
  type: CREATE_EVENT,
  payload: { event, todos },
});

export const createEventSuccess = ({ event }) => ({
  type: CREATE_EVENT_SUCCESS,
  payload: { event },
});

export const createEventFailure = () => ({
  type: CREATE_EVENT_FAILURE,
});

export const updateEvent = ({ event }) => ({
  type: UPDATE_EVENT,
  payload: { event },
});

export const updateEventSuccess = ({ event }) => ({
  type: UPDATE_EVENT_SUCCESS,
  payload: { event },
});

export const updateEventFailure = () => ({
  type: UPDATE_EVENT_FAILURE,
});

export const deleteEvent = ({ eventId }) => ({
  type: DELETE_EVENT,
  payload: { eventId },
});

export const deleteEventSuccess = ({ eventId, deletedTodoIds }) => ({
  type: DELETE_EVENT_SUCCESS,
  payload: { eventId, deletedTodoIds },
});

export const deleteEventFailure = () => ({
  type: DELETE_EVENT_FAILURE,
});

export const loadEvents = ({ userId }) => ({
  type: LOAD_EVENTS,
  payload: { userId },
});

export const loadEventsSuccess = ({ events }) => ({
  type: LOAD_EVENTS_SUCCESS,
  payload: { events },
});

export const loadEventsFailure = () => ({
  type: LOAD_EVENTS_FAILURE,
});

export const updateRepeatingEventAndTodos = ({
  oldEvent,
  newEventInstance,
  newEvent,
  newInstanceTodos,
  newTodos,
  todosToBeDeleted,
  todosToBeUpdated,
}) => ({
  type: UPDATE_REPEATING_EVENT_AND_TODOS,
  payload: {
    oldEvent,
    newEventInstance,
    newEvent,
    newInstanceTodos,
    newTodos,
    todosToBeDeleted,
    todosToBeUpdated,
  },
});

export const updateRepeatingEventAndTodosSuccess = () => ({
  type: UPDATE_REPEATING_EVENT_AND_TODOS_SUCCESS,
});

export const updateRepeatingEventAndTodosFailure = () => ({
  type: UPDATE_REPEATING_EVENT_AND_TODOS_FAILURE,
});

export const deleteAllUserEvents = () => ({
  type: DELETE_ALL_USER_EVENTS,
});

export const deleteAllUserEventsSuccess = () => ({
  type: DELETE_ALL_USER_EVENTS_SUCCESS,
});

export const deleteAllUserEventsFailure = () => ({
  type: DELETE_ALL_USER_EVENTS_FAILURE,
});
