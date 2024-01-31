import { createSelector } from 'reselect';

const getTodos = (state) => state.learnTodos;

/**
 * @description Returns memoized todo list
 * @author Ahmed Suljic
 */
const getLearnTodoList = createSelector([getTodos], (todos) => {
  return Object.values(todos);
});

export default getLearnTodoList;
