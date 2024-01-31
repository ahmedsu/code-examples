import { createSelector } from 'reselect';

const getContactTodos = (state) => state.contactTodos;

/**
 * @description Returns memoized contact todo list
 * @author Ahmed Suljic
 */
const getContactTodoList = createSelector([getContactTodos], (todos) => {
  return Object.values(todos);
});

export default getContactTodoList;
