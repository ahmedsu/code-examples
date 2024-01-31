import { removeKeys } from '../../utils/helperFunctions';

export const GET_REFERENTIAL_DATA = 'GET-REFERENTIAL_DATA';

export const getReferentialData = ({
  eventTypes,
  countries,
  eventTemplates,
  todoTemplates,
  messageTemplates,
  contactTodoTemplates,
  learnTodoTemplates,
}) => ({
  type: GET_REFERENTIAL_DATA,
  payload: {
    eventTypes: removeKeys(eventTypes, ['id']),
    countries: removeKeys(countries, ['id']),
    eventTemplates: removeKeys(eventTemplates, ['id']),
    todoTemplates: removeKeys(todoTemplates, ['id']),
    messageTemplates: removeKeys(messageTemplates, ['id']),
    contactTodoTemplates: removeKeys(contactTodoTemplates, ['id']),
    learnTodoTemplates: removeKeys(learnTodoTemplates, ['id']),
  },
});
