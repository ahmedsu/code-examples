import axios, { AxiosRequestConfig } from "axios";
// import Config from 'react-native-dotenv'
import jwt_decode, { JwtPayload } from "jwt-decode";
import { Platform } from "react-native";
import { MAIN_API_URL } from "utils/constants";
import { store } from "redux/store";
import { signOut } from "redux/actions/loginActions";

/**
 * @description Base function for making any API calls.
 * baseURL and accessToken are optional based on the circumstance.
 * @author Haris Handzic
 * @author Ahmed Suljic
 */
export default async (request: AxiosRequestConfig, baseURL?: string) => {
  request.method = request.method || "get";
  const URL = baseURL ? baseURL : MAIN_API_URL;
  // If request.url is specified, append it to the baseURL, otherwise just use the baseURL
  request.url ? (request.url = `${URL}/${request.url}`) : (request.url = URL);
  if (Platform.OS === "android") {
    request.data = request.data || {};
  }
  if (request.data && request.method === "get") {
    // If data is set the get request won't be made
    request.data = null;
  }
  request.headers = {
    ...request.headers,
    "Content-Type": "application/json",
    "X-Device": "mobile",
  };

  const userToken = store.getState().login.userToken;
  if (userToken) {
    const decodedToken: JwtPayload = jwt_decode(userToken as string);

    if (
      decodedToken &&
      decodedToken.exp &&
      decodedToken.exp * 1000 < Date.now()
    ) {
      store.dispatch(signOut());
    }
  }

  if (userToken) {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${userToken}`,
    };
  }
  return axios(request);
};
