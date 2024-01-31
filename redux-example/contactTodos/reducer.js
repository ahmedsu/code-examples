import {
  LOAD_CONTACT_TODOS_SUCCESS,
  CREATE_CONTACT_TODO_SUCCESS,
  UPDATE_CONTACT_TODO_SUCCESS,
  DELETE_CONTACT_TODO_SUCCESS,
  COMPLETE_CONTACT_TODO_SUCCESS,
  DELETE_CONTACT_TODO_DATE_SUCCESS,
} from './actions';

import { DELETE_CONTACT_SUCCESS } from '../contacts/actions';
import { LOGOUT_USER } from '../user/actions';

import { formatArrayToObject } from '../../utils/helperFunctions';

const initialState = {};

export default function contactTodosReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case LOAD_CONTACT_TODOS_SUCCESS:
      return {
        ...state,
        ...payload.contactTodos,
      };
    case CREATE_CONTACT_TODO_SUCCESS:
      return {
        ...state,
        [payload.contactTodo.id]: { ...payload.contactTodo },
      };
    case UPDATE_CONTACT_TODO_SUCCESS: {
      // Update repeat mode for all contact todos
      const contactTodos = Object.entries(state);
      const updatedTodos = [];
      for (let i = 0; i < contactTodos.length; i++) {
        updatedTodos.push({
          ...contactTodos[i][1],
          content: {
            ...contactTodos[i][1].content,
            repeatMode: payload.importance,
          },
        });
      }
      return formatArrayToObject(updatedTodos);
    }
    case DELETE_CONTACT_TODO_SUCCESS:
      return Object.fromEntries(Object.entries(state).filter(([key]) => key !== payload.id));
    case DELETE_CONTACT_TODO_DATE_SUCCESS:
      return {
        ...state,
        [payload.todo.id]: { ...payload.todo },
      };
    case COMPLETE_CONTACT_TODO_SUCCESS:
      return {
        ...state,
        [payload.todo.id]: { ...payload.todo },
      };
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
