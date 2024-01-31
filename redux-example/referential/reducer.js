import { GET_REFERENTIAL_DATA } from './actions';
import {
  countries,
  eventTypes,
  eventTemplates,
  todoTemplates,
  messageTemplates,
  contactTodoTemplates,
  learnTodoTemplates,
} from '../../utils/constants';

const initialState = {
  countries,
  eventTypes,
  eventTemplates,
  todoTemplates,
  messageTemplates,
  contactTodoTemplates,
  learnTodoTemplates,
};

export default function referential(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case GET_REFERENTIAL_DATA:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
