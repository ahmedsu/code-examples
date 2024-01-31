export default {
  attemptForgotPassword: ['email'],
  doneAttemptForgotPassword: null,

  attemptCreateNewPassword: ['code', 'payload'],
  doneAttemptCreateNewPassword: null,

  attemptChangePassword: ['payload'],
  doneAttemptChangePassword: null,

  setUserData: ['data'],
  updateUserData: ['data'],
  clearUserData: null,

  attemptUpdateUserMandatoryData: ['payload'],
  doneAttemptUpdateUserMandatoryData: null,

  attemptGetUserProfile: ['params'],
  doneAttemptGetUserProfile: null,

  attemptEditUserProfile: ['data'],
  doneAttemptEditUserProfile: null,

  attemptUpdateUserWhy: ['why'],
  doneAttemptUpdateUserWhy: null,

  attemptGetHighlightSettings: null,
  doneAttemptGetHighlightSettings: null,
  setHighlightSettings: ['settings'],

  attemptUpdateHighlightSettings: ['payload'],
  doneAttemptUpdateHighlightSettings: null,

  attemptRestoreSubscription: null,
  doneAttemptRestoreSubscription: null,

  attemptGetUserNotificationSettings: null,
  doneAttemptGetUserNotificationSettings: null,
  setUserNotificationSettings: ['settings'],

  attemptGetUserMealNotificationSettings: null,
  doneAttemptGetUserMealNotificationSettings: null,
  setUserMealNotificationSettings: ['data'],

  attemptUpdateUserMealNotificationSettings: ['payload'],
  doneAttemptUpdateUserMealNotificationSettings: null,
  updateUserMealNotificationSettings: ['data'],

  attemptCalculatePlan: ['plan'],
  attemptSkipOnboardingCalculation: null,
  doneAttemptSkipOnboardingCalculation: null,

  attemptGetSubscriptionPurchaseHistory: null,

  attemptSubscribe: ['product_id'],
  doneAttemptSubscribe: null,

  attemptConfirmSubscription: ['payload'],
  doneAttemptConfirmSubscription: null,
  setConfirmSubscriptionSuccess: null,
  resetConfirmSubscription: null,

  changeSubscriptionPlan: null,

  goToNextOnboardingPage: null,
  goToPreviousOnboardingPage: null,
  goToOnboardingPage: ['page'],
  goToOnboardingPageByReturnPageData: ['return_page', 'is_return_to_welcome'],
  setCanGoToNextOnboardingPage: ['canGo'],
  addToOnboardingPlan: ['data'],
  clearOnboardingPlan: null,

  goToNextSubscriptionOnboardingPage: null,
  goToPreviousSubscriptionOnboardingPage: null,
  goToSubscriptionOnboardingPage: ['page'],
  setCanGoToNextSubscriptionOnboardingPage: ['canGo'],
  addToSubscriptionOnboarding: ['data'],
  clearSubscriptionOnboarding: null,

  attemptGetPlanSummary: null,
  doneAttemptGetPlanSummary: null,
  setPlanSummary: ['data'],

  attemptUpdatePlanSummary: ['key','data','changePlan'],
  doneAttemptUpdatePlanSummary: null,

  attemptGetTodayDashboard: null,
  doneAttemptGetTodayDashboard: null,
  setTodayDashboardData: ['data'],
  increaseTodayDashboardHighlights: ['data'],
  setTodayTabIndex: ['tabIndex'],
  updateMealInTodayAndUpcomingMealsByTemplate: ['id', 'data'],

  attemptLogProgress: ['payload'],
  doneAttemptLogProgress: null,
  setLogProgressSuccess: ['data'],

  attemptGetUserMetricsConfiguration: null,
  doneAttemptGetUserMetricsConfiguration: null,
  setUserMetricsConfiguration: ['metrics'],

  attemptUpdateUserMetricsConfiguration: ['payload'],
  doneAttemptUpdateUserMetricsConfiguration: null,
  updateUserMetricsConfiguration: ['metrics'],

  attemptGetUserStatsConfiguration: null,
  doneAttemptGetUserStatsConfiguration: null,
  setUserStatsConfiguration: ['stats'],

  attemptUpdateUserStatsConfiguration: ['payload'],
  doneAttemptUpdateUserStatsConfiguration: null,
  updateUserStatsConfiguration: ['stats'],

  attemptShareProgress: ['payload'],
  doneAttemptShareProgress: null,
  setShareProgressSuccess: null,

  attemptLogMeasurement: ['payload'],
  doneAttemptLogMeasurement: null,

  attemptGetUserMeasurements: ['params'],
  doneAttemptGetUserMeasurements: null,
  setUserMeasurements: ['data'],

  attemptGetTodayUpcomingMeals: null,
  doneAttemptGetTodayUpcomingMeals: null,
  setTodayUpcomingMealsData: ['data'],
  removeMealFromUpcomingMeals: ['meal_id'],

  attemptGetAllUpcomingMeals: null,
  doneAttemptGetAllUpcomingMeals: null,
  setAllUpcomingMeals: ['data'],

  attemptDeleteUserAccount: ['id'],
  doneAttemptDeleteUserAccount: null,

  attemptGetSavedAddresses: ['params'],
  doneAttemptGetSavedAddresses: null,
  setSavedAddresses: ['list'],

  setNewAddressDetails: ['details'],

  attemptAddAddress: ['payload'],
  doneAttemptAddAddress: null,

  attemptUpdateAddress: ['id', 'payload'],
  doneAttemptUpdateAddress: null,

  attemptDeleteAddress: ['id'],
  doneAttemptDeleteAddress: null,

  attemptGetUserProgress: ['params'],
  doneAttemptGetUserProgress: null,
  setUserProgress: ['data'],

  attemptGetUserAchievements: null,
  doneAttemptGetUserAchievements: null,
  setUserAchievements: ['data'],

  attemptGetUserMeasurementGoals: ['chartType'],
  doneAttemptGetUserMeasurementGoals: null,
  setUserMeasurementGoals: ['goal'],

  attemptUpdateUserMeasurementGoal: ['payload'],
  doneAttemptUpdateUserMeasurementGoal: null,
  setUpdateUserMeasurementGoalSuccess: null,

  attemptAddUserTag: ['tag_name'],

  attemptSendSurveyReminder: null,

  setTreatsEnabled: ['status'],

  triggerTesterSurvey: ['surveyCode'],

  attemptAccessFeature: ['feature', 'callbackIfAccessible'],

  setDataForCartRequest: ['data'],

  checkSubscriptionExpiration: null,

  addNewUserStatesOnTheFly: ['data'],

  resetUserReducer: null,

  attemptRateApp: null,

  attemptSetNextAppReview: null,

  attemptShowIntercom: ['callback'],

  attemptSetSubscriptionOnboardingProfile: null,
  
  updateUserAppsFlyerData: ['payload'],

  updateUsersAppsFlyerProfile: ['payload'],

  updateUsersAppsFlyerProfileComplete: ['payload'],

  updateUsersMeta: ['payload'],
  doneUpdateUsersMeta: ['payload'],
  
  attemptShowReferFriend: null,
  showReferFriend: null,
  hideReferFriend: null,
  setReferrerId: ['referrer_id'],
  removeReferrerId: null,

  setDietitianId: ['dietitian_id'],
  removeDietitianId: null,

  attemptAwardReferrer: null,
  addToFirstRecipe: ['data'],
  clearFirstRecipe:null,

  attemptSendOtp: ['payload'],
  doneAttemptSendOtp: null,

  attemptVerifyOtp: ['payload'],
  doneAttemptVerifyOtp: null
};
