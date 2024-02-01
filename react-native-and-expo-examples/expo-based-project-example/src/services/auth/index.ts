import { apiRequest } from "utils/helperFunctions";
import { AUTH_API_URL, MAIN_API_URL } from "utils/constants";
import { userAuthDataInterface, userRegisterDataInterface } from "./interfaces";
import { store } from "redux/store";
import { setIsLoading, signIn } from "redux/actions/loginActions";

/**
 * @description Sends login post request to API, if successful saves token to redux
 * @author Ahmed Suljic
 */
export const logIn = async (userAuthData: userAuthDataInterface) => {
  try {
    store.dispatch(setIsLoading(true));
    const { username, password } = userAuthData;
    const res = await apiRequest(
      {
        method: "post",
        data: {
          username: username,
          password: password,
        },
        url: "token",
      },
      AUTH_API_URL,
    );
    const userData = res?.data;
    const { token, email, firstName, lastName, displayName } = userData.data;
    store.dispatch(signIn(token, email, firstName, lastName, displayName));
    store.dispatch(setIsLoading(false));
    return res?.data;
  } catch (e) {
    store.dispatch(setIsLoading(false));
    console.log("Error logging in (logIn)");
    return null;
  }
};

/**
 * @description Sends register post request to API, if successful saves token to redux
 * @author Ahmed Suljic
 */
export const register = async (userAuthData: userRegisterDataInterface) => {
  try {
    store.dispatch(setIsLoading(true));
    const { firstNameField, lastNameField, passwordField, emailField } =
      userAuthData;
    const res = await apiRequest(
      {
        method: "post",
        data: {
          first_name: firstNameField,
          last_name: lastNameField,
          password: passwordField,
          email: emailField,
        },
        url: "register",
      },
      MAIN_API_URL,
    );
    const userData = res?.data;
    const { token, email, firstName, lastName, displayName } = userData.data;
    store.dispatch(signIn(token, email, firstName, lastName, displayName));
    store.dispatch(setIsLoading(false));
    return res?.data;
  } catch (e) {
    store.dispatch(setIsLoading(false));
    console.log("Error registering (register)");
    console.log(e);
    return null;
  }
};
