import {
  INITIALIZE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  LOGOUT_USER,
  DELETE_USER_SUCCESS,
  SET_USER_CREDENTIAL,
  USER_TWITTER_INFO,
} from './actions';

const initialState = {};

export default function userReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case INITIALIZE_USER_SUCCESS:
      return {
        ...state,
        ...payload,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        ...payload,
      };
    case USER_TWITTER_INFO:
      return {
        ...state,
        ...payload,
      };
    case LOGOUT_USER:
      return initialState;
    case DELETE_USER_SUCCESS:
    case SET_USER_CREDENTIAL:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
