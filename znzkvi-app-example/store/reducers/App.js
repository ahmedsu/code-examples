import Actions from '@actions';
import {createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = Immutable({
  isFirstTime: true,
  isAttemptingDownloadOverTheAirUpdates: false,
  isVeilShown: false,
  hasAskedPushNotificationPermission: false,
  isAttemptingGetTermsOfService: false,
  termsOfService: null,
  isAttemptingGetPrivacyPolicy: false,
  privacyPolicy: null,
  sheetDialogPage: 1,
  closeSheetDialogs: false,
  isAttemptingGetAddresses: false,
  addresses: [],
  isAttemptingGetContactUs: false,
  contactUs: '',
  isAttemptingGetTipVideos: false,
  isAttemptingGetDiscover: false,
  discover: [],
  tipVideos: [],
  alert: {
    show: false,
    title: '',
    message: '',
    options: {}
  },
  isAttemptingGetSubscriptionPlans: false,
  subscriptionPlans: {},
  isAppReviewPromptShown: false,
  showToastMessage: false,

  isSurveyPromptShown: false,
  toastType: null,
  surveyData: [],
  activeSurvey: {},
  isAttemptingSubmitSurveyResponse: false,
  isVideoPromptShown: false,
  videoData: {},

  // for device contacts
  contacts: [],
  isGettingContacts: false,
  isFireworksShown: false,
  showSubscriptionSheet: false
});

const doSetIsNotFirstTime = state => state.merge({isFirstTime: false});

const doDownloadOverTheAirUpdates = state =>
  state.merge({isAttemptingDownloadOverTheAirUpdates: true});
const doDoneDownloadOverTheAirUpdates = state =>
  state.merge({isAttemptingDownloadOverTheAirUpdates: false});

const doShowVeil = state => state.merge({isVeilShown: true});
const doHideVeil = state => state.merge({isVeilShown: false});

const doShowFireworks = state => state.merge({isFireworksShown: true});
const doHideFireworks = state => state.merge({isFireworksShown: false});

const doSetHasAskedPushNotificationPermission = (state, {hasAsked}) =>
  state.merge({hasAskedPushNotificationPermission: hasAsked});

const doGetTermsOfService = state =>
  state.merge({isAttemptingGetTermsOfService: true});
const doDoneGetTermsOfService = state =>
  state.merge({isAttemptingGetTermsOfService: false});
const doSetTermsOfService = (state, {termsOfService}) =>
  state.merge({termsOfService});
const doResetTermsOfService = state =>
  state.merge({termsOfService: INITIAL_STATE.termsOfService});

const doGetPrivacyPolicy = state =>
  state.merge({isAttemptingGetPrivacyPolicy: true});
const doDoneGetPrivacyPolicy = state =>
  state.merge({isAttemptingGetPrivacyPolicy: false});
const doSetPrivacyPolicy = (state, {privacyPolicy}) =>
  state.merge({privacyPolicy});
const doResetPrivacyPolicy = state =>
  state.merge({privacyPolicy: INITIAL_STATE.privacyPolicy});

const doGoToNextSheetDialogPage = state =>
  state.merge({sheetDialogPage: state.sheetDialogPage + 1});
const doGoToPreviousSheetDialogPage = state =>
  state.merge({sheetDialogPage: state.sheetDialogPage - 1});
const doGoToSheetDialogPage = (state, {page}) =>
  state.merge({sheetDialogPage: page});
const doResetSheetDialogPage = state =>
  state.merge({sheetDialogPage: INITIAL_STATE.sheetDialogPage});
const doCloseSheetDialogs = state =>
  state.merge({
    closeSheetDialogs: true,
    sheetDialogPage: INITIAL_STATE.sheetDialogPage
  });
const doResetCloseSheetDialogs = state =>
  state.merge({closeSheetDialogs: false});

const doGetAddresses = state => state.merge({isAttemptingGetAddresses: true});
const doDoneGetAddresses = state =>
  state.merge({isAttemptingGetAddresses: false});
const doSetAddresses = (state, {list}) => state.merge({addresses: list});

const doGetContactUs = state => state.merge({isAttemptingGetContactUs: true});
const doDoneGetContactUs = state =>
  state.merge({isAttemptingGetContactUs: false});
const doSetContactUs = (state, {contactUs}) => state.merge({contactUs});
const doResetContactUs = state =>
  state.merge({contactUs: INITIAL_STATE.contactUs});

const doGetTipVideos = state => state.merge({isAttemptingGetTipVideos: true});
const doDoneGetTipVideos = state =>
  state.merge({isAttemptingGetTipVideos: false});
const doSetTipVideos = (state, {videos}) => state.merge({tipVideos: videos});

const doGetDiscover = state => state.merge({isAttemptingGetDiscover: true});
const doDoneGetDiscover = state =>
  state.merge({isAttemptingGetDiscover: false});
const doSetDiscover = (state, {data}) => state.merge({discover: data});

const doShowAlert = (state, {message, title, options = {}}) =>
  state.merge({
    alert: {
      show: true,
      title,
      message,
      options
    }
  });
const doCloseAlert = state =>
  state.merge({
    alert: {
      ...state.alert,
      show: false
    }
  });

const doAddStatesOnTheFly = (state, {data}) => state.merge({...data});

const doGetSubscriptionPlans = state =>
  state.merge({isAttemptingGetSubscriptionPlans: true});
const doDoneGetSubscriptionPlans = state =>
  state.merge({isAttemptingGetSubscriptionPlans: false});
const doSetSubscriptionPlans = (state, {plans}) =>
  state.merge({subscriptionPlans: plans});

const doShowAppReviewPrompt = state =>
  state.merge({isAppReviewPromptShown: true});
const doHideAppReviewPrompt = state =>
  state.merge({isAppReviewPromptShown: false});

const doResetReducer = state =>
  state.merge({
    isAttemptingDownloadOverTheAirUpdates:
      INITIAL_STATE.isAttemptingDownloadOverTheAirUpdates,
    isVeilShown: INITIAL_STATE.isVeilShown,
    isAttemptingGetTermsOfService: INITIAL_STATE.isAttemptingGetTermsOfService,
    isAttemptingGetPrivacyPolicy: INITIAL_STATE.isAttemptingGetPrivacyPolicy,
    sheetDialogPage: INITIAL_STATE.sheetDialogPage,
    closeSheetDialogs: INITIAL_STATE.closeSheetDialogs,
    isAttemptingGetAddresses: INITIAL_STATE.isAttemptingGetAddresses,
    isAttemptingGetContactUs: INITIAL_STATE.isAttemptingGetContactUs,
    isAttemptingGetTipVideos: INITIAL_STATE.isAttemptingGetTipVideos,
    isAttemptingGetDiscover: INITIAL_STATE.isAttemptingGetDiscover,
    isAttemptingGetSubscriptionPlans:
      INITIAL_STATE.isAttemptingGetSubscriptionPlans,
    subscriptionPlans: INITIAL_STATE.subscriptionPlans,
    alert: INITIAL_STATE.alert,
    isAppReviewPromptShown: INITIAL_STATE.isAppReviewPromptShown,
    isIntercomShown: INITIAL_STATE.isIntercomShown,
    showToastMessage: INITIAL_STATE.showToastMessage,
    isSurveyPromptShown: INITIAL_STATE.isSurveyPromptShown,
    surveyData: INITIAL_STATE.surveyData,
    activeSurvey: INITIAL_STATE.activeSurvey,
    isAttemptingSubmitSurveyResponse:
      INITIAL_STATE.isAttemptingSubmitSurveyResponse,
    toastType: INITIAL_STATE.toastType,
    isFireworksShown: INITIAL_STATE.isFireworksShown,
    showSubscriptionSheet: INITIAL_STATE.showSubscriptionSheet
  });

const doShowToastMessage = (state, {toastType}) =>
  state.merge({showToastMessage: true, toastType: toastType});

const doHideToastMessage = state =>
  state.merge({showToastMessage: false, toastType: null});

const doShowSurveyPrompt = (state, {data}) =>
  state.merge({isSurveyPromptShown: true, activeSurvey: data});
const doHideSurveyPrompt = state => state.merge({isSurveyPromptShown: false});

const doSubmitSurveyResponse = state =>
  state.merge({isAttemptingSubmitSurveyResponse: true});
const doDoneSubmitSurveyResponse = state =>
  state.merge({isAttemptingSubmitSurveyResponse: false});

const doShowVideoPrompt = (state, {data}) =>
  state.merge({isVideoPromptShown: true, videoData: data});
const doHideVideoPrompt = state =>
  state.merge({isVideoPromptShown: false, videoData: INITIAL_STATE.videoData});

const doAttemptGetContacts = state => state.merge({isGettingContacts: true});
const doDoneAttemptGetContacts = (state, {data}) =>
  state.merge({isGettingContacts: false, contacts: data});

const doShowSubscriptionSheet = state =>
  state.merge({showSubscriptionSheet: true});

const doHideSubscriptionSheet = state =>
  state.merge({showSubscriptionSheet: false});

const HANDLERS = {
  [Actions.Types.SET_IS_NOT_FIRST_TIME]: doSetIsNotFirstTime,

  [Actions.Types.ATTEMPT_DOWNLOAD_OVER_THE_AIR_UPDATES]:
    doDownloadOverTheAirUpdates,
  [Actions.Types.DONE_ATTEMPT_DOWNLOAD_OVER_THE_AIR_UPDATES]:
    doDoneDownloadOverTheAirUpdates,

  [Actions.Types.SHOW_VEIL]: doShowVeil,
  [Actions.Types.HIDE_VEIL]: doHideVeil,

  [Actions.Types.SHOW_FIREWORKS]: doShowFireworks,
  [Actions.Types.HIDE_FIREWORKS]: doHideFireworks,

  [Actions.Types.SET_HAS_ASKED_PUSH_NOTIFICATION_PERMISSION]:
    doSetHasAskedPushNotificationPermission,

  [Actions.Types.ATTEMPT_GET_TERMS_OF_SERVICE]: doGetTermsOfService,
  [Actions.Types.DONE_ATTEMPT_GET_TERMS_OF_SERVICE]: doDoneGetTermsOfService,
  [Actions.Types.SET_TERMS_OF_SERVICE]: doSetTermsOfService,
  [Actions.Types.RESET_TERMS_OF_SERVICE]: doResetTermsOfService,

  [Actions.Types.ATTEMPT_GET_PRIVACY_POLICY]: doGetPrivacyPolicy,
  [Actions.Types.DONE_ATTEMPT_GET_PRIVACY_POLICY]: doDoneGetPrivacyPolicy,
  [Actions.Types.SET_PRIVACY_POLICY]: doSetPrivacyPolicy,
  [Actions.Types.RESET_PRIVACY_POLICY]: doResetPrivacyPolicy,

  [Actions.Types.GO_TO_NEXT_SHEET_DIALOG_PAGE]: doGoToNextSheetDialogPage,
  [Actions.Types.GO_TO_PREVIOUS_SHEET_DIALOG_PAGE]:
    doGoToPreviousSheetDialogPage,
  [Actions.Types.GO_TO_SHEET_DIALOG_PAGE]: doGoToSheetDialogPage,
  [Actions.Types.RESET_SHEET_DIALOG_PAGE]: doResetSheetDialogPage,
  [Actions.Types.CLOSE_SHEET_DIALOGS]: doCloseSheetDialogs,
  [Actions.Types.RESET_CLOSE_SHEET_DIALOGS]: doResetCloseSheetDialogs,

  [Actions.Types.ATTEMPT_GET_ADDRESSES]: doGetAddresses,
  [Actions.Types.DONE_ATTEMPT_GET_ADDRESSES]: doDoneGetAddresses,
  [Actions.Types.SET_ADDRESSES]: doSetAddresses,

  [Actions.Types.ATTEMPT_GET_CONTACT_US]: doGetContactUs,
  [Actions.Types.DONE_ATTEMPT_GET_CONTACT_US]: doDoneGetContactUs,
  [Actions.Types.SET_CONTACT_US]: doSetContactUs,
  [Actions.Types.RESET_CONTACT_US]: doResetContactUs,

  [Actions.Types.ATTEMPT_GET_TIP_VIDEOS]: doGetTipVideos,
  [Actions.Types.DONE_ATTEMPT_GET_TIP_VIDEOS]: doDoneGetTipVideos,
  [Actions.Types.SET_TIP_VIDEOS]: doSetTipVideos,

  [Actions.Types.ATTEMPT_GET_DISCOVER]: doGetDiscover,
  [Actions.Types.DONE_ATTEMPT_GET_DISCOVER]: doDoneGetDiscover,
  [Actions.Types.SET_DISCOVER]: doSetDiscover,

  [Actions.Types.SHOW_ALERT]: doShowAlert,
  [Actions.Types.CLOSE_ALERT]: doCloseAlert,

  [Actions.Types.ADD_NEW_APP_STATES_ON_THE_FLY]: doAddStatesOnTheFly,

  [Actions.Types.ATTEMPT_GET_SUBSCRIPTION_PLANS]: doGetSubscriptionPlans,
  [Actions.Types.DONE_ATTEMPT_GET_SUBSCRIPTION_PLANS]:
    doDoneGetSubscriptionPlans,
  [Actions.Types.SET_SUBSCRIPTION_PLANS]: doSetSubscriptionPlans,

  [Actions.Types.SHOW_APP_REVIEW_PROMPT]: doShowAppReviewPrompt,
  [Actions.Types.HIDE_APP_REVIEW_PROMPT]: doHideAppReviewPrompt,

  [Actions.Types.RESET_APP_REDUCER]: doResetReducer,

  [Actions.Types.SHOW_TOAST_MESSAGE]: doShowToastMessage,
  [Actions.Types.HIDE_TOAST_MESSAGE]: doHideToastMessage,

  [Actions.Types.SHOW_SURVEY_PROMPT]: doShowSurveyPrompt,
  [Actions.Types.HIDE_SURVEY_PROMPT]: doHideSurveyPrompt,

  [Actions.Types.ATTEMPT_SUBMIT_SURVEY_RESPONSE]: doSubmitSurveyResponse,
  [Actions.Types.DONE_ATTEMPT_SUBMIT_SURVEY_RESPONSE]:
    doDoneSubmitSurveyResponse,

  [Actions.Types.SHOW_VIDEO_PROMPT]: doShowVideoPrompt,
  [Actions.Types.HIDE_VIDEO_PROMPT]: doHideVideoPrompt,

  [Actions.Types.ATTEMPT_GET_CONTACTS]: doAttemptGetContacts,
  [Actions.Types.DONE_ATTEMPT_GET_CONTACTS]: doDoneAttemptGetContacts,

  [Actions.Types.SHOW_SUBS_SHEET]: doShowSubscriptionSheet,
  [Actions.Types.HIDE_SUBS_SHEET]: doHideSubscriptionSheet
};

export default createReducer(INITIAL_STATE, HANDLERS);
