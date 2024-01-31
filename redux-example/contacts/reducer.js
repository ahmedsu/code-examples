import {
  CREATE_CONTACTS_SUCCESS,
  LOAD_CONTACTS_SUCCESS,
  UPDATE_CONTACTS_SUCCESS,
  UPDATE_CONTACT,
  UPDATE_CONTACT_FAILURE,
  DELETE_CONTACT_SUCCESS,
} from './actions';
import { LOGOUT_USER } from '../user/actions';

const initialState = {};

export default function contactsReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case CREATE_CONTACTS_SUCCESS:
    case LOAD_CONTACTS_SUCCESS:
    case UPDATE_CONTACTS_SUCCESS:
      return {
        ...state,
        ...payload.contacts,
      };
    // Update contact in redux before the change has taken place in DB for better user experience
    case UPDATE_CONTACT:
      return {
        ...state,
        [payload.contact.id]: {
          ...state[payload.contact.id],
          ...payload.contact,
        },
      };
    // If updating a contact in DB has failed, revert the local redux change
    case UPDATE_CONTACT_FAILURE:
      return {
        ...state,
        [payload.oldContact.id]: payload.oldContact,
      };
    case DELETE_CONTACT_SUCCESS:
      return Object.fromEntries(Object.entries(state).filter(([key]) => key !== payload.contactId));
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
