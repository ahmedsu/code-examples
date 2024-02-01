import * as actions from "redux/actions/loginActions";
import { Action } from "redux/interfaces";

interface LoginState {
  isSignout: boolean;
  isLoading: boolean;
  userToken: actions.UserToken;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

const initialState: LoginState = {
  isLoading: false,
  isSignout: false,
  userToken: null,
  email: "",
  firstName: "",
  lastName: "",
  displayName: "",
};
const loginReducer = (state = initialState, action: Action): LoginState => {
  switch (action.type) {
    case actions.RESTORE_TOKEN:
      return {
        ...state,
        userToken: action.userToken,
        isLoading: false,
      };
    case actions.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case actions.SIGN_IN:
      return {
        ...state,
        isSignout: false,
        isLoading: false,
        userToken: action.userToken,
        email: action.email,
        firstName: action.firstName,
        lastName: action.lastName,
        displayName: action.displayName,
      };
    case actions.SIGN_OUT:
      return {
        ...state,
        isSignout: true,
        isLoading: false,
        userToken: null,
      };
    case actions.SET_USER_DATA:
      return {
        ...state,
        email: action.email ? action.email : state.email,
      };
    default:
      return state;
  }
};

export default loginReducer;
