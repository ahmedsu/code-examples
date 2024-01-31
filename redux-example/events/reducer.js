import {
  CREATE_EVENT_SUCCESS,
  UPDATE_EVENT_SUCCESS,
  DELETE_EVENT_SUCCESS,
  LOAD_EVENTS_SUCCESS,
  DELETE_ALL_USER_EVENTS_SUCCESS,
} from './actions';
import { DELETE_CONTACT_SUCCESS } from '../contacts/actions';
import { LOGOUT_USER } from '../user/actions';

const initialState = {};

export default function eventsReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case LOAD_EVENTS_SUCCESS:
      return {
        ...state,
        ...payload.events,
      };
    case CREATE_EVENT_SUCCESS:
    case UPDATE_EVENT_SUCCESS:
      return {
        ...state,
        [payload.event.id]: { ...payload.event },
      };
    case DELETE_EVENT_SUCCESS:
      return Object.fromEntries(Object.entries(state).filter(([key]) => key !== payload.eventId));
    case DELETE_ALL_USER_EVENTS_SUCCESS:
    case DELETE_CONTACT_SUCCESS:
      // Remove events that were only for the deleted contact
      // And otherwise remove the deleted contact from the contacts array of the event
      return Object.fromEntries(
        Object.entries(state)
          .filter(([key, value]) => {
            const { contacts } = value;
            return contacts.length > 1 || contacts[0] !== payload.contactId;
          })
          .map(([key, value]) => {
            const newValue = {
              ...value,
              contacts: value.contacts.filter((item) => item !== payload.contactId),
            };
            return [key, newValue];
          }),
      );
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
