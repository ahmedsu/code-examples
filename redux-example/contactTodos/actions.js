export const LOAD_CONTACT_TODOS_SUCCESS = 'LOAD_CONTACT_TODOS_SUCCESS';
export const LOAD_CONTACT_TODOS_FAILURE = 'LOAD_CONTACT_TODOS_FAILURE';

export const CREATE_CONTACT_TODO = 'CREATE_CONTACT_TODO';
export const CREATE_CONTACT_TODO_SUCCESS = 'CREATE_CONTACT_TODO_SUCCESS';
export const CREATE_CONTACT_TODO_FAILURE = 'CREATE_CONTACT_TODO_FAILURE';

export const UPDATE_CONTACT_TODO = 'UPDATE_CONTACT_TODO';
export const UPDATE_CONTACT_TODO_SUCCESS = 'UPDATE_CONTACT_TODO_SUCCESS';
export const UPDATE_CONTACT_TODO_FAILURE = 'UPDATE_CONTACT_TODO_FAILURE';

export const DELETE_CONTACT_TODO_SUCCESS = 'DELETE_CONTACT_TODO_SUCCESS';

export const COMPLETE_CONTACT_TODO = 'COMPLETE_CONTACT_TODO';
export const COMPLETE_CONTACT_TODO_SUCCESS = 'COMPLETE_CONTACT_TODO_SUCCESS';
export const COMPLETE_CONTACT_TODO_FAILURE = 'COMPLETE_CONTACT_TODO_FAILURE';

export const DELETE_CONTACT_TODO_DATE_SUCCESS = 'DELETE_CONTACT_TODO_DATE_SUCCESS';
export const DELETE_CONTACT_TODO_DATE__FAILURE = 'DELETE_CONTACT_TODO_DATE__FAILURE';

export const loadContactTodosSuccess = ({ contactTodos }) => ({
  type: LOAD_CONTACT_TODOS_SUCCESS,
  payload: { contactTodos },
});

export const loadContactTodosFailure = () => ({
  type: LOAD_CONTACT_TODOS_FAILURE,
});

export const createContactTodo = ({ todo, userId }) => ({
  type: CREATE_CONTACT_TODO,
  payload: { todo, userId },
});
export const createContactTodoSuccess = ({ contactTodo }) => ({
  type: CREATE_CONTACT_TODO_SUCCESS,
  payload: { contactTodo },
});

export const createContactTodoFailure = () => ({
  type: CREATE_CONTACT_TODO_FAILURE,
});

export const updateContactTodo = ({ contactId, template, importance }) => ({
  type: UPDATE_CONTACT_TODO,
  payload: { contactId, template, importance },
});

export const updateContactTodoSuccess = ({ importance }) => ({
  type: UPDATE_CONTACT_TODO_SUCCESS,
  payload: { importance },
});

export const updateContactTodoFailure = () => ({
  type: UPDATE_CONTACT_TODO_FAILURE,
});

export const deleteContactTodoSuccess = ({ id }) => ({
  type: DELETE_CONTACT_TODO_SUCCESS,
  payload: { id },
});

export const completeContactTodo = ({ todo }) => ({
  type: COMPLETE_CONTACT_TODO,
  payload: { todo },
});

export const completeContactTodoSuccess = ({ todo }) => ({
  type: COMPLETE_CONTACT_TODO_SUCCESS,
  payload: { todo },
});

export const completeContactTodoFailure = () => ({
  type: COMPLETE_CONTACT_TODO_FAILURE,
});
// Deleting contact based todo only for specific date
export const deleteContactTodoDateSuccess = ({ todo }) => ({
  type: DELETE_CONTACT_TODO_DATE_SUCCESS,
  payload: { todo },
});
// Deleting contact based todo only for specific date
export const deleteContactTodoDateFailure = () => ({
  type: DELETE_CONTACT_TODO_DATE__FAILURE,
});
