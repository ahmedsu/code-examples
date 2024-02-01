import {
  RestoreToken,
  SetIsLoading,
  SignIn,
  SignOut,
  SetUserData,
} from "redux/actions/loginActions";

export type LoginInterface =
  | RestoreToken
  | SignIn
  | SignOut
  | SetIsLoading
  | SetUserData;
