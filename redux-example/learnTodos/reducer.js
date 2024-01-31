import {
  LOAD_LEARN_TODOS_SUCCESS,
  CREATE_LEARN_TODO_SUCCESS,
  UPDATE_LEARN_TODO_SUCCESS,
  DELETE_LEARN_TODO_SUCCESS,
  DELETE_LEARN_TODO_DATE_SUCCESS,
  DELETE_ALL_LEARN_TODOS_SUCCESS,
} from './actions';
import { LOGOUT_USER } from '../user/actions';

const initialState = {};

export default function learnTodosReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case LOAD_LEARN_TODOS_SUCCESS:
      return {
        ...state,
        ...payload.learnTodos,
      };
    case CREATE_LEARN_TODO_SUCCESS:
    case UPDATE_LEARN_TODO_SUCCESS:
      return {
        ...state,
        [payload.todo.id]: { ...payload.todo },
      };
    case DELETE_LEARN_TODO_DATE_SUCCESS:
      return {
        ...state,
        [payload.todo.id]: { ...payload.todo },
      };
    case DELETE_ALL_LEARN_TODOS_SUCCESS:
      return initialState;
    case DELETE_LEARN_TODO_SUCCESS:
      return Object.fromEntries(Object.entries(state).filter(([key]) => key !== payload.id));
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
