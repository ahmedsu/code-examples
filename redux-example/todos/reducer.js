import {
  LOAD_TODOS_SUCCESS,
  CREATE_TODO_SUCCESS,
  UPDATE_TODO_SUCCESS,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_DATE_SUCCESS,
  DELETE_ALL_USER_TODOS_SUCCESS,
} from './actions';
import { DELETE_CONTACT_SUCCESS } from '../contacts/actions';
import { LOGOUT_USER } from '../user/actions';
import { DELETE_EVENT_SUCCESS } from '../events/actions';

const initialState = {
  // snoozedTodos: [],
};

export default function todosReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case LOAD_TODOS_SUCCESS:
      return {
        ...state,
        ...payload.todos,
      };
    case CREATE_TODO_SUCCESS:
    case UPDATE_TODO_SUCCESS:
      return {
        ...state,
        [payload.todo.id]: { ...payload.todo },
      };
    case DELETE_TODO_SUCCESS:
      return Object.fromEntries(Object.entries(state).filter(([key]) => key !== payload.id));
    // TODO: When we have contact specific todos these also have to be deleted when a contact is deleted
    case DELETE_TODO_DATE_SUCCESS:
      return {
        ...state,
        [payload.todo.id]: { ...payload.todo },
      };
    case DELETE_ALL_USER_TODOS_SUCCESS:
    case DELETE_EVENT_SUCCESS:
      // Remove todos for deleted event
      return Object.fromEntries(
        Object.entries(state).filter(([key]) => !payload?.deletedTodoIds.includes(key)),
      );
    case DELETE_CONTACT_SUCCESS:
      // Remove todos from deleted contact
      return Object.fromEntries(
        Object.entries(state).filter(([key]) => !payload?.deletedTodoIds.includes(key)),
      );
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
