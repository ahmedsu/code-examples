import {
  SET_SKIP_ONBOARDING,
  SET_SKIP_TODOS_ONBOARDING,
  SET_SKIP_EVENTS_ONBOARDING,
  SET_SKIP_CONTACTS_ONBOARDING,
  SET_SKIP_ENABLE_NOTIFICATIONS,
  SET_SKIP_DASHBOARD_ONBOARDING,
  SET_CONTACTS_PERMISSION,
  SET_APP_STATE,
  SET_SUBSCRIPTIONS,
  SET_KEYBOARD_HEIGHT,
  SET_TODO_FILTER,
  SET_EVENT_FILTER,
  SET_SOCIAL_FEED_FILTER,
  SET_LOADING,
  SET_LOADING_LIST,
  SET_HAS_UNSCORED_CONTACTS,
  SET_SNOOZED_TODOS,
  SET_SKIP_WEEKLY_DIGEST,
  SET_NOTIFICATION_SETTINGS,
  SET_SKIP_SOCIAL_FEED,
  SET_SOCIAL_FEED_CONTACTS,
  SET_SELECTED_SOCIAL_SERVICES,
  SET_SHOW_NO_CONNECTION,
  SET_UPDATED_CONTACTS,
  SET_UPDATE_CONTACTS_MODAL,
  SET_UPDATE_CONTACTS_LOADER,
  SET_SHOW_COMPLETE_PROFILE_CARDS,
} from './actions';

import { DELETE_CONTACT_SUCCESS } from '../contacts/actions';
import { formatContactName } from '../../utils/helperFunctions';

const initialState = {
  skipOnboarding: false,
  skipTodosOnboarding: false,
  skipEventsOnboarding: false,
  skipContactsOnboarding: false,
  skipEnableNotifications: false,
  skipDashboardOnboarding: false,
  skipWeeklyDigest: { isSkipped: false, dateSkipped: Infinity },
  skipSocialFeed: false,
  contactsPermission: '',
  appState: '',
  subscriptions: [],
  keyboardHeight: 301,
  todoFilter: 'upcoming',
  eventFilter: 'day',
  socialFeedFilter: 'upcoming',
  socialFeedContacts: [],
  selectedSocialFeedServices: [],
  snoozedTodos: [],
  showNoConnection: false,
  notificationSettings: {
    frequency: 'none',
    time: '',
  },
  updatedContacts: [],
  updatedContactsNames: [],
  updatedContactsIds: [],
  showUpdateContactsModal: false,
  showUpdateContactLoader: false,
  showCompleteProfileCards: true,
};

export default function appReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SET_APP_STATE:
      return {
        ...state,
        appState: payload,
      };
    case SET_SKIP_ONBOARDING:
      return {
        ...state,
        skipOnboarding: payload,
      };
    case SET_SKIP_TODOS_ONBOARDING:
      return {
        ...state,
        skipTodosOnboarding: payload,
      };
    case SET_SKIP_EVENTS_ONBOARDING:
      return {
        ...state,
        skipEventsOnboarding: payload,
      };
    case SET_SKIP_CONTACTS_ONBOARDING:
      return {
        ...state,
        skipContactsOnboarding: payload,
      };
    case SET_SKIP_DASHBOARD_ONBOARDING:
      return {
        ...state,
        skipDashboardOnboarding: payload,
      };
    case SET_SKIP_WEEKLY_DIGEST:
      return {
        ...state,
        skipWeeklyDigest: payload,
      };
    case SET_SKIP_ENABLE_NOTIFICATIONS:
      return {
        ...state,
        skipEnableNotifications: payload,
      };
    case SET_SKIP_SOCIAL_FEED:
      return {
        ...state,
        skipSocialFeed: payload,
      };
    case SET_CONTACTS_PERMISSION:
      return {
        ...state,
        contactsPermission: payload,
      };
    case SET_SUBSCRIPTIONS:
      return {
        ...state,
        subscriptions: payload,
      };
    case SET_KEYBOARD_HEIGHT:
      return {
        ...state,
        keyboardHeight: payload,
      };
    case SET_TODO_FILTER:
      return {
        ...state,
        todoFilter: payload,
      };
    case SET_EVENT_FILTER:
      return {
        ...state,
        eventFilter: payload,
      };
    case SET_SOCIAL_FEED_FILTER:
      return {
        ...state,
        socialFeedFilter: payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case SET_LOADING_LIST:
      return {
        ...state,
        loadingList: payload,
      };
    case SET_HAS_UNSCORED_CONTACTS:
      return {
        ...state,
        unscoredContacts: payload,
      };
    case SET_SNOOZED_TODOS:
      return {
        ...state,
        snoozedTodos: payload,
      };
    case DELETE_CONTACT_SUCCESS: {
      const filteredUnscoredContacts = state?.unscoredContacts?.filter(
        (item) => item?.id !== payload?.contactId,
      );
      return {
        ...state,
        unscoredContacts: [...filteredUnscoredContacts],
      };
    }
    case SET_NOTIFICATION_SETTINGS: {
      return {
        ...state,
        notificationSettings: payload,
      };
    }
    case SET_SOCIAL_FEED_CONTACTS:
      return {
        ...state,
        socialFeedContacts: payload,
      };
    case SET_SELECTED_SOCIAL_SERVICES:
      return {
        ...state,
        selectedSocialFeedServices: payload,
      };

    case SET_SHOW_NO_CONNECTION:
      return {
        ...state,
        showNoConnection: payload,
      };

    case SET_UPDATED_CONTACTS:
      return {
        ...state,
        updatedContacts: payload,
        updatedContactsNames: payload.map((el) => formatContactName(el)),
        updatedContactsIds: payload.map((el) => el?.id),
      };
    case SET_UPDATE_CONTACTS_MODAL:
      return {
        ...state,
        showUpdateContactsModal: payload,
      };
    case SET_UPDATE_CONTACTS_LOADER:
      return {
        ...state,
        showUpdateContactLoader: payload,
      };
    case SET_SHOW_COMPLETE_PROFILE_CARDS:
      return {
        ...state,
        showCompleteProfileCards: payload,
      };
    default:
      return state;
  }
}
