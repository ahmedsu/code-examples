export const LOAD_TODOS = 'LOAD_TODOS';
export const LOAD_TODOS_SUCCESS = 'LOAD_TODOS_SUCCESS';
export const LOAD_TODOS_FAILURE = 'LOAD_TODOS_FAILURE';

export const CREATE_TODO = 'CREATE_TODO';
export const CREATE_TODO_SUCCESS = 'CREATE_TODO_SUCCESS';
export const CREATE_TODO_FAILURE = 'CREATE_TODO_FAILURE';

export const UPDATE_TODO = 'UPDATE_TODO';
export const UPDATE_TODO_SUCCESS = 'UPDATE_TODO_SUCCESS';
export const UPDATE_TODO_FAILURE = 'UPDATE_TODO_FAILURE';

export const DELETE_TODO = 'DELETE_TODO';
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS';
export const DELETE_TODO_FAILURE = 'DELETE_TODO_FAILURE';
export const DELETE_TODO_DATE_SUCCESS = 'DELETE_TODO_DATE_SUCCESS';
export const DELETE_TODO_DATE__FAILURE = 'DELETE_TODO_DATE__FAILURE';

export const DELETE_ALL_USER_TODOS = 'DELETE_ALL_USER_TODOS';
export const DELETE_ALL_USER_TODOS_SUCCESS = 'DELETE_ALL_USER_TODOS_SUCCESS';
export const DELETE_ALL_USER_TODOS_FAILURE = 'DELETE_ALL_USER_TODOS_FAILURE';

export const loadTodos = ({ userId }) => ({
  type: LOAD_TODOS,
  payload: { userId },
});

export const loadTodosSuccess = ({ todos }) => ({
  type: LOAD_TODOS_SUCCESS,
  payload: { todos },
});

export const loadTodosFailure = () => ({
  type: LOAD_TODOS_FAILURE,
});

export const createTodo = ({ todo, eventId, userId, type }) => ({
  type: CREATE_TODO,
  payload: { todo, eventId, userId, type },
});

export const createTodoSuccess = ({ todo }) => ({
  type: CREATE_TODO_SUCCESS,
  payload: { todo },
});

export const createTodoFailure = () => ({
  type: CREATE_TODO_FAILURE,
});
/**
 *
 * @param {boolean} completed  -> if user is completing todo we send 'true' value to the action
 */
export const updateTodo = ({ todo, completed }) => ({
  type: UPDATE_TODO,
  payload: { todo, completed },
});

export const updateTodoSuccess = ({ todo }) => ({
  type: UPDATE_TODO_SUCCESS,
  payload: { todo },
});

export const updateTodoFailure = () => ({
  type: UPDATE_TODO_FAILURE,
});

export const deleteTodo = ({ todo }) => ({
  type: DELETE_TODO,
  payload: { todo },
});

export const deleteTodoSuccess = ({ id }) => ({
  type: DELETE_TODO_SUCCESS,
  payload: { id },
});

export const deleteTodoFailure = () => ({
  type: DELETE_TODO_FAILURE,
});
// Deleting  todo only for specific date
export const deleteTodoDateSuccess = ({ todo }) => ({
  type: DELETE_TODO_DATE_SUCCESS,
  payload: { todo },
});
// Deleting  todo only for specific date
export const deleteTodoDateFailure = () => ({
  type: DELETE_TODO_DATE__FAILURE,
});

export const deleteAllUserTodos = () => ({
  type: DELETE_ALL_USER_TODOS,
});

export const deleteAllUserTodosSuccess = () => ({
  type: DELETE_ALL_USER_TODOS_SUCCESS,
});

export const deleteAllUserTodosFailure = () => ({
  type: DELETE_ALL_USER_TODOS_FAILURE,
});
