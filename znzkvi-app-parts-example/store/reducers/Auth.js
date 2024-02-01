import Actions from '@actions';
import {createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = Immutable({
  isAttemptingLogin: false,
  isAttemptingNormalLogin: false,
  isAttemptingGoogleLogin: false,
  isAttemptingFacebookLogin: false,
  isAttemptingAppleLogin: false,
  isAttemptingSignup: false,
  isLoggedIn: false,
  appleSignInUserData: null,
  isAttemptingForcedLogout: false,
  isAfterSignupModalVisible: false,
  isDietitianSignupModalVisible: false
});

const doAttemptLogin = state =>
  state.merge({isAttemptingLogin: true, isAttemptingNormalLogin: true});
const doDoneAttemptLogin = state =>
  state.merge({isAttemptingLogin: false, isAttemptingNormalLogin: false});

const doAttemptGoogleLogin = state =>
  state.merge({isAttemptingLogin: true, isAttemptingGoogleLogin: true});
const doDoneAttemptGoogleLogin = state =>
  state.merge({isAttemptingLogin: false, isAttemptingGoogleLogin: false});

const doAttemptFacebookLogin = state =>
  state.merge({isAttemptingLogin: true, isAttemptingFacebookLogin: true});
const doDoneAttemptFacebookLogin = state =>
  state.merge({isAttemptingLogin: false, isAttemptingFacebookLogin: false});

const doAttemptAppleLogin = state =>
  state.merge({isAttemptingLogin: true, isAttemptingAppleLogin: true});
const doDoneAttemptAppleLogin = state =>
  state.merge({isAttemptingLogin: false, isAttemptingAppleLogin: false});

const doLogin = state => state.merge({isLoggedIn: true});
const doLogout = state =>
  state.merge({isLoggedIn: false, isAttemptingForcedLogout: false});

const doAttemptForcedLogout = state =>
  state.merge({isAttemptingForcedLogout: true});

const doAttemptSignup = state => state.merge({isAttemptingSignup: true});
const doDoneAttemptSignup = state => state.merge({isAttemptingSignup: false});

const doSetAppleSignInUserData = (state, {data}) =>
  state.merge({appleSignInUserData: data});

const doShowAfterSignupModal = state =>
  state.merge({isAfterSignupModalVisible: true});

const doHideAfterSignupModal = state =>
  state.merge({isAfterSignupModalVisible: false});

const doShowDietitianSignupModal = state =>
  state.merge({isDietitianSignupModalVisible: true});

const doHideDietitianSignupModal = state =>
  state.merge({isDietitianSignupModalVisible: false});

const doResetReducer = state =>
  state.merge({
    isAttemptingLogin: INITIAL_STATE.isAttemptingLogin,
    isAttemptingNormalLogin: INITIAL_STATE.isAttemptingNormalLogin,
    isAttemptingGoogleLogin: INITIAL_STATE.isAttemptingGoogleLogin,
    isAttemptingFacebookLogin: INITIAL_STATE.isAttemptingFacebookLogin,
    isAttemptingAppleLogin: INITIAL_STATE.isAttemptingAppleLogin,
    isAttemptingSignup: INITIAL_STATE.isAttemptingSignup,
    isAttemptingForcedLogout: INITIAL_STATE.isAttemptingForcedLogout,
    isAfterSignupModalVisible: INITIAL_STATE.isAfterSignupModalVisible,
    isDietitianSignupModalVisible: INITIAL_STATE.isDietitianSignupModalVisible
  });

const HANDLERS = {
  [Actions.Types.ATTEMPT_LOGIN]: doAttemptLogin,
  [Actions.Types.DONE_ATTEMPT_LOGIN]: doDoneAttemptLogin,

  [Actions.Types.ATTEMPT_GOOGLE_LOGIN]: doAttemptGoogleLogin,
  [Actions.Types.DONE_ATTEMPT_GOOGLE_LOGIN]: doDoneAttemptGoogleLogin,

  [Actions.Types.ATTEMPT_FACEBOOK_LOGIN]: doAttemptFacebookLogin,
  [Actions.Types.DONE_ATTEMPT_FACEBOOK_LOGIN]: doDoneAttemptFacebookLogin,

  [Actions.Types.ATTEMPT_APPLE_LOGIN]: doAttemptAppleLogin,
  [Actions.Types.DONE_ATTEMPT_APPLE_LOGIN]: doDoneAttemptAppleLogin,

  [Actions.Types.LOGIN]: doLogin,
  [Actions.Types.LOGOUT]: doLogout,

  [Actions.Types.ATTEMPT_FORCED_LOGOUT]: doAttemptForcedLogout,

  [Actions.Types.ATTEMPT_SIGNUP]: doAttemptSignup,
  [Actions.Types.DONE_ATTEMPT_SIGNUP]: doDoneAttemptSignup,

  [Actions.Types.SET_APPLE_SIGN_IN_USER_DATA]: doSetAppleSignInUserData,

  [Actions.Types.RESET_AUTH_REDUCER]: doResetReducer,

  [Actions.Types.SHOW_AFTER_SIGNUP_MODAL]: doShowAfterSignupModal,
  [Actions.Types.HIDE_AFTER_SIGNUP_MODAL]: doHideAfterSignupModal,
  [Actions.Types.SHOW_DIETITIAN_SIGNUP_MODAL]: doShowDietitianSignupModal,
  [Actions.Types.HIDE_DIETITIAN_SIGNUP_MODAL]: doHideDietitianSignupModal
};

export default createReducer(INITIAL_STATE, HANDLERS);
