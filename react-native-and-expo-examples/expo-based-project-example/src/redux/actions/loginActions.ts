export const RESTORE_TOKEN = "RESTORE_TOKEN";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const SET_IS_LOADING = "SET_IS_LOADING";
export const SET_USER_DATA = "SET_USER_DATA";

export type UserToken = string | null;
export interface RestoreToken {
  type: typeof RESTORE_TOKEN;
  userToken: UserToken;
}

export interface SignIn {
  type: typeof SIGN_IN;
  userToken: UserToken;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

export interface SignOut {
  type: typeof SIGN_OUT;
}

export interface SetUserData {
  type: typeof SET_USER_DATA;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export interface SetIsLoading {
  type: typeof SET_IS_LOADING;
  isLoading: boolean;
}

export const restoreToken = (userToken: UserToken): RestoreToken => ({
  type: RESTORE_TOKEN,
  userToken,
});

export const signIn = (
  userToken: UserToken,
  email: string,
  firstName: string,
  lastName: string,
  displayName: string,
): SignIn => ({
  type: SIGN_IN,
  userToken,
  email,
  firstName,
  lastName,
  displayName,
});

export const signOut = (): SignOut => ({
  type: SIGN_OUT,
});

export const setUserData = (
  email?: string,
  firstName?: string,
  lastName?: string,
  displayName?: string,
): SetUserData => ({
  type: SET_USER_DATA,
  email,
  firstName,
  lastName,
  displayName,
});

export const setIsLoading = (isLoading: boolean): SetIsLoading => ({
  type: SET_IS_LOADING,
  isLoading,
});
