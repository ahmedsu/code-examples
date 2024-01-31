import { combineReducers } from 'redux';
import user from './user/reducer';
import todos from './todos/reducer';
import events from './events/reducer';
import contacts from './contacts/reducer';
import app from './app/reducer';
import referential from './referential/reducer';
import learn from './learn/reducer';
import contactTodos from './contactTodos/reducer';
import learnTodos from './learnTodos/reducer';
import calendarEvents from './calendarEvents/reducer';
import tweets from './tweets/reducer';

/**
 * Combine and export all reducers
 */
export default combineReducers({
  user,
  todos,
  events,
  contacts,
  app,
  referential,
  learn,
  contactTodos,
  learnTodos,
  calendarEvents,
  tweets,
});
