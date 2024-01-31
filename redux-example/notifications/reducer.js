import { CREATE_NEW_NOTIFICATIONS_SUCCESS } from './actions';

const initialState = {};

export default function notificationsReducer(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case CREATE_NEW_NOTIFICATIONS_SUCCESS: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
