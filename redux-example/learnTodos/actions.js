export const LOAD_LEARN_TODOS_SUCCESS = 'LOAD_LEARN_TODOS_SUCCESS';
export const LOAD_LEARN_TODOS_FAILURE = 'LOAD_LEARN_TODOS_FAILURE';

export const CREATE_LEARN_TODO = 'CREATE_LEARN_TODO';
export const CREATE_LEARN_TODO_SUCCESS = 'CREATE_LEARN_TODO_SUCCESS';
export const CREATE_LEARN_TODO_FAILURE = 'CREATE_LEARN_TODO_FAILURE';

export const UPDATE_LEARN_TODO = 'UPDATE_LEARN_TODO';
export const UPDATE_LEARN_TODO_SUCCESS = 'UPDATE_LEARN_TODO_SUCCESS';
export const UPDATE_LEARN_TODO_FAILURE = 'UPDATE_LEARN_TODO_FAILURE';

export const DELETE_LEARN_TODO_SUCCESS = 'DELETE_LEARN_TODO_SUCCESS';

export const DELETE_ALL_LEARN_TODOS = 'DELETE_ALL_LEARN_TODOS';
export const DELETE_ALL_LEARN_TODOS_SUCCESS = 'DELETE_ALL_LEARN_TODOS_SUCCESS';
export const DELETE_ALL_LEARN_TODOS_FAILURE = 'DELETE_ALL_LEARN_TODOS_FAILURE';

export const DELETE_LEARN_TODO_DATE_SUCCESS = 'DELETE_LEARN_TODO_DATE_SUCCESS';
export const DELETE_LEARN_TODO_DATE__FAILURE = 'DELETE_LEARN_TODO_DATE__FAILURE';

export const loadLearnTodosSuccess = ({ learnTodos }) => ({
  type: LOAD_LEARN_TODOS_SUCCESS,
  payload: { learnTodos },
});

export const loadLearnTodosFailure = () => ({
  type: LOAD_LEARN_TODOS_FAILURE,
});

export const createLearnTodo = ({ userId }) => ({
  type: CREATE_LEARN_TODO,
  payload: { userId },
});

export const createLearnTodoSuccess = ({ todo }) => ({
  type: CREATE_LEARN_TODO_SUCCESS,
  payload: { todo },
});

export const createLearnTodoFailure = () => ({
  type: CREATE_LEARN_TODO_FAILURE,
});

export const updateLearnTodo = ({ todo }) => ({
  type: UPDATE_LEARN_TODO,
  payload: { todo },
});

export const updateLearnTodoSuccess = ({ todo }) => ({
  type: UPDATE_LEARN_TODO_SUCCESS,
  payload: { todo },
});

export const updateLearnTodoFailure = () => ({
  type: UPDATE_LEARN_TODO_FAILURE,
});

export const deleteLearnTodoSuccess = ({ id }) => ({
  type: DELETE_LEARN_TODO_SUCCESS,
  payload: { id },
});

// Deleting contact based todo only for specific date
export const deleteLearnTodoDateSuccess = ({ todo }) => ({
  type: DELETE_LEARN_TODO_DATE_SUCCESS,
  payload: { todo },
});
// Deleting contact based todo only for specific date
export const deleteLearnTodoDateFailure = () => ({
  type: DELETE_LEARN_TODO_DATE__FAILURE,
});

export const deleteAllLearnTodos = ({ userId }) => ({
  type: DELETE_ALL_LEARN_TODOS,
  payload: { userId },
});

export const deleteAllLearnTodosSuccess = () => ({
  type: DELETE_ALL_LEARN_TODOS_SUCCESS,
});

export const deleteAllLearnTodosFailure = () => ({
  type: DELETE_ALL_LEARN_TODOS_FAILURE,
});
