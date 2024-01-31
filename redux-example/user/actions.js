export const INITIALIZE_USER = 'INITIALIZE_USER';
export const INITIALIZE_USER_SUCCESS = 'INITIALIZE_USER_SUCCESS';
export const INITIALIZE_USER_FAILURE = 'INITIALIZE_USER_FAILURE';

export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const LOGOUT_USER = 'LOGOUT_USER';
export const USER_TWITTER_INFO = 'USER_TWITTER_INFO';

export const DELETE_USER = 'DELETE_USER';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const SET_USER_CREDENTIAL = 'SET_USER_CREDENTIAL';

export const initializeUser = ({ id, country }) => ({
  type: INITIALIZE_USER,
  payload: { id, country },
});

export const initializeUserSuccess = (attributes) => ({
  type: INITIALIZE_USER_SUCCESS,
  payload: attributes,
});

export const initializeUserFailure = () => ({
  type: INITIALIZE_USER_FAILURE,
});

export const updateUser = (attributes) => ({
  type: UPDATE_USER,
  payload: attributes,
});

export const updateUserSuccess = (attributes) => ({
  type: UPDATE_USER_SUCCESS,
  payload: attributes,
});

export const updateUserFailure = () => ({
  type: UPDATE_USER_FAILURE,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const deleteUser = () => ({
  type: DELETE_USER,
});

export const deleteUserSuccess = () => ({
  type: DELETE_USER_SUCCESS,
});

export const deleteUserFailure = () => ({
  type: DELETE_USER_FAILURE,
});

export const setUserCredential = ({ userCredential }) => ({
  type: SET_USER_CREDENTIAL,
  payload: {
    userCredential,
  },
});

export const setUserTwitterInfo = (info) => ({
  type: USER_TWITTER_INFO,
  payload: info,
});
