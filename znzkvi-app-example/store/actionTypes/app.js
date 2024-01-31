export default {
  startUp: null,

  preStartUps: null,

  setIsNotFirstTime: null,

  attemptDownloadOverTheAirUpdates: null,
  doneAttemptDownloadOverTheAirUpdates: null,

  showVeil: null,
  hideVeil: null,

  showFireworks: null,
  hideFireworks: null,

  setHasAskedPushNotificationPermission: ['hasAsked'],

  initializeAppsflyer: null,

  attemptGetSubscriptionPlans: null,
  doneAttemptGetSubscriptionPlans: null,
  setSubscriptionPlans: ['plans'],

  attemptGetTermsOfService: null,
  doneAttemptGetTermsOfService: null,
  setTermsOfService: ['termsOfService'],
  resetTermsOfService: null,

  attemptGetPrivacyPolicy: null,
  doneAttemptGetPrivacyPolicy: null,
  setPrivacyPolicy: ['privacyPolicy'],
  resetPrivacyPolicy: null,

  goToNextSheetDialogPage: null,
  goToPreviousSheetDialogPage: null,
  goToSheetDialogPage: ['page'],
  resetSheetDialogPage: null,
  closeSheetDialogs: null,
  resetCloseSheetDialogs: null,

  attemptGetAddresses: ['payload'],
  doneAttemptGetAddresses: null,
  setAddresses: ['list'],

  attemptGetContactUs: null,
  doneAttemptGetContactUs: null,
  setContactUs: ['contactUs'],
  resetContactUs: null,

  takeSurvey: null,

  attemptGetTipVideos: null,
  doneAttemptGetTipVideos: null,
  setTipVideos: ['videos'],

  attemptGetDiscover: null,
  doneAttemptGetDiscover: null,
  setDiscover: ['data'],

  showAppReviewPrompt: null,
  hideAppReviewPrompt: null,

  showAlert: ['message', 'title', 'options'],
  closeAlert: null,

  addNewAppStatesOnTheFly: ['data'],

  resetAppReducer: null,

  showToastMessage: ['toastType'],
  hideToastMessage: null,
  showSurveyPrompt: ['data'],
  hideSurveyPrompt: null,

  attemptCheckSurvey: null,
  submitSurveyResponse: ['surveyData', 'answers'],
  attemptSubmitSurveyResponse: null,
  doneAttemptSubmitSurveyResponse: null,

  showVideoPrompt: ['data'],
  hideVideoPrompt: null,

  attemptGetContacts: null,
  doneAttemptGetContacts: ['data'],

  showSubsSheet: null,
  hideSubsSheet: null
};
