export default {
  attemptLogin: ['payload'],
  doneAttemptLogin: null,

  attemptGoogleLogin: ['payload'],
  doneAttemptGoogleLogin: null,

  attemptFacebookLogin: ['payload'],
  doneAttemptFacebookLogin: null,

  attemptAppleLogin: ['payload'],
  doneAttemptAppleLogin: null,

  login: null,
  logout: null,

  triggerForceLogout: null,
  attemptForcedLogout: null,

  attemptSignup: ['payload'],
  doneAttemptSignup: null,

  setAppleSignInUserData: ['data'],

  resetAuthReducer: null,
  showAfterSignupModal: null,
  hideAfterSignupModal: null,
  showDietitianSignupModal: null,
  hideDietitianSignupModal: null
};
