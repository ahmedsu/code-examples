import userSagas from './user/sagas';
import todoSagas from './todos/sagas';
import eventSagas from './events/sagas';
import contactSagas from './contacts/sagas';
import learnSagas from './learn/sagas';
import contactTodosSagas from './contactTodos/sagas';
import learnTodosSaga from './learnTodos/sagas';
import notificationSagas from './notifications/sagas';

/**
 * Combine and export all sagas
 */
const sagaAccumulator = [
  ...userSagas,
  ...todoSagas,
  ...eventSagas,
  ...contactSagas,
  ...contactTodosSagas,
  ...learnTodosSaga,
  ...learnSagas,
  ...notificationSagas,
];

export default sagaAccumulator;
