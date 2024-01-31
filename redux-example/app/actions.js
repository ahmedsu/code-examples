export const SET_SKIP_ONBOARDING = 'SET_SKIP_ONBOARDING';
export const SET_SKIP_TODOS_ONBOARDING = 'SET_SKIP_TODOS_ONBOARDING';
export const SET_SKIP_EVENTS_ONBOARDING = 'SET_SKIP_EVENTS_ONBOARDING';
export const SET_SKIP_CONTACTS_ONBOARDING = 'SET_SKIP_CONTACTS_ONBOARDING';
export const SET_SKIP_DASHBOARD_ONBOARDING = 'SET_SKIP_DASHBOARD_ONBOARDING';
export const SET_SKIP_ENABLE_NOTIFICATIONS = 'SET_SKIP_ENABLE_NOTIFICATIONS';
export const SET_SKIP_WEEKLY_DIGEST = 'SET_SKIP_WEEKLY_DIGEST';
export const SET_SKIP_SOCIAL_FEED = 'SET_SKIP_SOCIAL_FEED';
export const SET_CONTACTS_PERMISSION = 'SET_CONTACTS_PERMISSION';
export const SET_SUBSCRIPTIONS = 'SET_SUBSCRIPTIONS';
export const SET_APP_STATE = 'SET_APP_STATE';
export const SET_KEYBOARD_HEIGHT = 'SET_KEYBOARD_HEIGHT';
export const SET_TODO_FILTER = 'SET_TODO_FILTER';
export const SET_EVENT_FILTER = 'SET_EVENT_FILTER';
export const SET_SOCIAL_FEED_FILTER = 'SET_SOCIAL_FEED_FILTER';
export const SET_LOADING = 'SET_LOADING';
export const SET_LOADING_LIST = 'SET_LOADING_LIST';
export const SET_HAS_UNSCORED_CONTACTS = 'SET_HAS_UNSCORED_CONTACTS';
export const SET_SOCIAL_FEED_CONTACTS = 'SET_SOCIAL_FEED_CONTACTS';
export const SET_SELECTED_SOCIAL_SERVICES = 'SET_SELECTED_SOCIAL_SERVICES';
export const SET_SNOOZED_TODOS = 'SET_SNOOZED_TODOS';
export const SET_SHOW_NO_CONNECTION = 'SET_SHOW_NO_CONNECTION';
export const SET_NOTIFICATION_SETTINGS = 'SET_NOTIFICATION_SETTINGS';
export const SET_UPDATED_CONTACTS = 'SET_UPDATED_CONTACTS';
export const SET_UPDATE_CONTACTS_MODAL = 'SET_UPDATE_CONTACTS_MODAL';
export const SET_UPDATE_CONTACTS_LOADER = 'SET_UPDATE_CONTACTS_LOADER';
export const SET_SHOW_COMPLETE_PROFILE_CARDS = 'SET_SHOW_COMPLETE_PROFILE_CARDS';

export const setSkipOnboarding = (status) => ({
  type: SET_SKIP_ONBOARDING,
  payload: status,
});

export const setSkipTodosOnboarding = (status) => ({
  type: SET_SKIP_TODOS_ONBOARDING,
  payload: status,
});

export const setSkipEventsOnboarding = (status) => ({
  type: SET_SKIP_EVENTS_ONBOARDING,
  payload: status,
});

export const setSkipContactsOnboarding = (status) => ({
  type: SET_SKIP_CONTACTS_ONBOARDING,
  payload: status,
});

export const setSkipDashboardOnboarding = (status) => ({
  type: SET_SKIP_DASHBOARD_ONBOARDING,
  payload: status,
});

export const setSkipWeeklyDigest = (status) => ({
  type: SET_SKIP_WEEKLY_DIGEST,
  payload: status,
});

export const setSkipEnableNotifications = (status) => ({
  type: SET_SKIP_ENABLE_NOTIFICATIONS,
  payload: status,
});

export const setSkipSocialFeed = (status) => ({
  type: SET_SKIP_SOCIAL_FEED,
  payload: status,
});

export const setContactsPermission = (status) => ({
  type: SET_CONTACTS_PERMISSION,
  payload: status,
});

export const setSubscriptions = (subscriptions) => ({
  type: SET_SUBSCRIPTIONS,
  payload: subscriptions,
});

export const setAppState = (state) => ({
  type: SET_APP_STATE,
  payload: state,
});

export const setKeyboardHeight = (height) => ({
  type: SET_KEYBOARD_HEIGHT,
  payload: height,
});

export const setTodoFilter = (filter) => ({
  type: SET_TODO_FILTER,
  payload: filter,
});

export const setEventFilter = (filter) => ({
  type: SET_EVENT_FILTER,
  payload: filter,
});

export const setSocialFeedFilter = (filter) => ({
  type: SET_SOCIAL_FEED_FILTER,
  payload: filter,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setLoadingList = (loadingList) => ({
  type: SET_LOADING_LIST,
  payload: loadingList,
});

export const setHasUnscoredContacts = (unscoredContacts) => ({
  type: SET_HAS_UNSCORED_CONTACTS,
  payload: unscoredContacts,
});

export const setSocialFeedContacts = (contacts) => ({
  type: SET_SOCIAL_FEED_CONTACTS,
  payload: contacts,
});

export const setSelectedSocialFeedServices = (services) => ({
  type: SET_SELECTED_SOCIAL_SERVICES,
  payload: services,
});

export const setSnoozedTodos = (snoozedTodos) => ({
  type: SET_SNOOZED_TODOS,
  payload: snoozedTodos,
});

export const setShowNoConnection = (showNoConnection) => ({
  type: SET_SHOW_NO_CONNECTION,
  payload: showNoConnection,
});

export const setNotificationSettings = (settings) => ({
  type: SET_NOTIFICATION_SETTINGS,
  payload: settings,
});

export const setUpdatedContacts = (contacts) => ({
  type: SET_UPDATED_CONTACTS,
  payload: contacts,
});

export const setShowUpdateContactsModal = (showModal) => ({
  type: SET_UPDATE_CONTACTS_MODAL,
  payload: showModal,
});

export const setUpdateContactsLoader = (showLoader) => ({
  type: SET_UPDATE_CONTACTS_LOADER,
  payload: showLoader,
});

export const setShowCompleteProfileCards = (showCards) => ({
  type: SET_SHOW_COMPLETE_PROFILE_CARDS,
  payload: showCards,
});
