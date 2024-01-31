import Actions from '@actions';
import {createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {UNITS, Routes, LOG_MEAL_POINTS, Highlights} from '@config';
import {logConsole} from '@utils';
import {replace, goBack, navigate, reset} from '@services';
import moment from 'moment';

const INITIAL_STATE = Immutable({
  isAttemptingForgotPassword: false,
  isAttemptingCreateNewPassword: false,
  isAttemptingChangePassword: false,
  data: null,
  isAttemptingGetProfile: false,
  isAttemptingEditProfile: false,
  isAttemptingUpdateWhy: false,
  isAttemptingGetHighlightSettings: false,
  isAttemptingUpdateHighlightSettings: false,
  highlightSettings: {
    achievements: {},
    stats: {},
    apps: {}
  },
  isAttemptingRestoreSubscription: false,
  isAttemptingGetNotificationSettings: false,
  notificationSettings: [],
  isAttemptingGetMealNotificationSettings: false,
  isAttemptingUpdateMealNotificationSettings: false,
  onboardingPage: 0,
  canGoToNextOnboardingPage: false,
  onboardingPlan: {
    // allergies: [],
    // diet: {},
    cuisines: [],
    kitchen_tools: [],
    meals_to_share: [],
    meal_positions: [],
    excluded_ingredients: [],
    recipe_goal: undefined,
    current_height: {},
    current_weight: {},
    current_waist_size: {},
    units: UNITS.british.value
  },
  isAttemptingSkipOnboardingCalculation: false,
  subscriptionOnboarding: {
    page: 0,
    canGoToNextPage: false,
    plan: null,
    payment_term: null,
    agree_terms: true,
    agree_disclaimer: false,
    meals: [],
    diet: {},
    allergies: [],
    days_to_eat_meat: null
  },
  isAttemptConfirmSubscription: false,
  confirmSubscription: {
    attempting: false,
    success: false
  },
  isAttemptingGetPlanSummary: false,
  planSummary: null,
  isAttemptingUpdatePlanSummary: false,
  isAttemptingGetTodayDashboard: false,
  todayDashboard: {
    highlights: [],
    meals: [],
    categorizedMeals: []
  },
  todayTabIndex: 0,
  isAttemptingGetTodayUpcomingMeals: false,
  todayUpcomingMeals: null,
  isAttemptingGetAllUpcomingMeals: false,
  allUpcomingMeals: null,
  isAttemptingLogProgress: false,
  logProgress: {
    attempting: false,
    success: false,
    data: null
  },
  metricsConfiguration: {
    fetching: false,
    data: null,
    updating: false
  },
  myStatsConfiguration: {
    fetching: false,
    data: null,
    updating: false
  },
  shareProgress: {
    attempting: false,
    success: false
  },
  isAttemptingLogMeasurement: false,
  isAttemptingGetMeasurements: false,
  measurements: null,
  isAttemptingGetMeasurementGoal: false,
  measurementGoal: null,
  updateMeasurementGoal: {
    attempting: false,
    success: false
  },
  isAttemptingDeleteAccount: false,
  isAttemptingGetAddresses: false,
  addresses: [],
  newAddressDetails: {},
  isAttemptingAddAddress: false,
  isAttemptingUpdateAddress: false,
  isAttemptingDeleteAddress: false,
  isAttemptingGetProgress: false,
  progress: {
    results: []
  },
  isAttemptingGetAchievements: false,
  achievements: {
    milestones: [],
    user_milestones: []
  },
  dataForCartRequest: {
    from: '',
    to: '',
    store: null
  },
  isAttemptingSubscribe: false,
  dataForAppsFlyer: {
    id: '',
    advertising_id: ''
  },
  referaFriendLastShown: undefined,
  showReferaFriend: false,
  referrer_id: undefined,
  firstRecipe: {
    included_ingredients: [],
    kitchen_tools: [],
    mealsFound: 0
  },
  isAttemptingVerifyPhoneNumber: false
});

const doForgotPassword = state =>
  state.merge({isAttemptingForgotPassword: true});
const doDoneForgotPassword = state =>
  state.merge({isAttemptingForgotPassword: false});

const doCreateNewPassword = state =>
  state.merge({isAttemptingCreateNewPassword: true});
const doDoneCreateNewPassword = state =>
  state.merge({isAttemptingCreateNewPassword: false});

const doChangePassword = state =>
  state.merge({isAttemptingChangePassword: true});
const doDoneChangePassword = state =>
  state.merge({isAttemptingChangePassword: false});

const doSetUserData = (state, {data}) => state.merge({data});
const doUpdateUserData = (state, {data}) => {
  return state.merge({
    data: {
      ...state.data,
      ...data
    }
  });
};
const doClearUserData = state =>
  state.merge({
    data: INITIAL_STATE.data,
    dataForCartRequest: INITIAL_STATE.dataForCartRequest
  });

const doGetProfile = state => state.merge({isAttemptingGetProfile: true});
const doDoneGetProfile = state => state.merge({isAttemptingGetProfile: false});

const doEditProfile = state => state.merge({isAttemptingEditProfile: true});
const doDoneEditProfile = state =>
  state.merge({isAttemptingEditProfile: false});

const doUpdateMandatoryProfile = state =>
  state.merge({isAttemptingEditProfile: true});
const doDoneUpdateMandatoryProfile = state =>
  state.merge({isAttemptingEditProfile: false});

const doUpdateWhy = state => state.merge({isAttemptingUpdateWhy: true});
const doDoneUpdateWhy = state => state.merge({isAttemptingUpdateWhy: false});

const doGetHighlightSettings = state =>
  state.merge({isAttemptingGetHighlightSettings: true});
const doDoneGetHighlightSettings = state =>
  state.merge({isAttemptingGetHighlightSettings: false});
const doSetHighlightSettings = (state, {settings}) =>
  state.merge({highlightSettings: settings});

const doUpdateHighlightSettings = state =>
  state.merge({isAttemptingUpdateHighlightSettings: true});
const doDoneUpdateHighlightSettings = state =>
  state.merge({isAttemptingUpdateHighlightSettings: false});

const doRestoreSubscription = state =>
  state.merge({isAttemptingRestoreSubscription: true});
const doDoneRestoreSubscription = state =>
  state.merge({isAttemptingRestoreSubscription: false});

const doGetNotificationSettings = state =>
  state.merge({isAttemptingGetNotificationSettings: true});
const doDoneGetNotificationSettings = state =>
  state.merge({isAttemptingGetNotificationSettings: false});
const doSetNotificationSettings = (state, {settings}) =>
  state.merge({notificationSettings: settings});

const doSetMealNotificationSettings = (state, {data}) =>
  state.merge({
    data: {
      ...state.data,
      meal_schedule: data
    }
  });

const doGetMealNotificationSettings = state =>
  state.merge({isAttemptingGetMealNotificationSettings: true});
const doDoneGetMealNotificationSettings = state =>
  state.merge({isAttemptingGetMealNotificationSettings: false});

const doAttemptUpdateMealNotificationSettings = state =>
  state.merge({isAttemptingUpdateMealNotificationSettings: true});
const doDoneUpdateMealNotificationSettings = state =>
  state.merge({isAttemptingUpdateMealNotificationSettings: false});
const doUpdateMealNotificationSettings = (state, {data}) =>
  state.merge({
    data: {
      ...state.data,
      meal_schedule: {
        ...state.data.meal_schedule,
        [data.key]: {
          ...state.data.meal_schedule[data.key],
          time: data.time || state.data.meal_schedule[data.key].time,
          enabled:
            data.enabled === undefined
              ? state.data.meal_schedule[data.key].enabled
              : data.enabled
        }
      }
    }
  });

const doGoToNextOnboardingPage = state => {
  if (state.data.done_onboarding && !state.data.return_page) {
    replace(Routes.calculatePlan);
    return state.merge({onboardingPage: state.onboardingPage});
  } else if (state.onboardingPage < 2) {
    return state.merge({onboardingPage: state.onboardingPage + 1});
  } else {
    replace(Routes.calculatePlan);
    return state.merge({onboardingPage: state.onboardingPage});
  }
};
const doGoToPreviousOnboardingPage = state => {
  if (state.onboardingPage === 1 || state.onboardingPage === 8) {
    /*
    - during days to eat meat/page selection, always go back to food preference selection
    - during fitness level assessment selection, always go back to blueprint
    */
    return state.merge({onboardingPage: state.onboardingPage - 1});
    // }
    // else if (state.onboardingPage === 1){
    //   if (state.onboardingPlan.family_member === 'None') {
    //     return state.merge({onboardingPage: state.onboardingPage - 2});
    //   }else{
    //     return state.merge({onboardingPage: state.onboardingPage - 1});
    //   }
  } else {
    /*
        if done onboarding OR currently in first onboarding screen AND return_page is an empty string
        */
    if (
      (state.data.done_onboarding ||
        state.onboardingPage <= 0 ||
        state.data.skipped_onboarding) &&
      !state.data.return_page
    ) {
      goBack();
      return state.merge({onboardingPage: state.onboardingPage});
    } else {
      if (state.onboardingPage > 0) {
        return state.merge({onboardingPage: state.onboardingPage - 1});
      } else {
        goBack();
        return state.merge({onboardingPage: state.onboardingPage});
      }
    }
  }
};
const doGoToOnboardingPage = (state, {page}) =>
  state.merge({onboardingPage: page});
const doSetCanGoToNextOnboardingPage = (state, {canGo}) =>
  state.merge({canGoToNextOnboardingPage: canGo});
const doAddToOnboardingPlan = (state, {data}) => {
  logConsole('ADDED ONBOARDING PLAN', data);

  let onboardingPlan = {
    ...state.onboardingPlan,
    ...data
  };

  return state.merge({onboardingPlan});
};

const doClearOnboardingPlan = state =>
  state.merge({
    onboardingPage: INITIAL_STATE.onboardingPage,
    canGoToNextOnboardingPage: INITIAL_STATE.canGoToNextOnboardingPage,
    onboardingPlan: INITIAL_STATE.onboardingPlan
  });

const doSkipOnboardingCalculation = state => {
  return state.merge({
    data: {
      ...state.data,
      //skipped_onboarding: true,
      return_page: ''
    },
    onboardingPlan: {
      ...state.onboardingPlan,
      date_of_birth: '',
      current_height: {},
      current_weight: {},
      gender: ''
    },
    isAttemptingSkipOnboardingCalculation: true
  });
};
const doDoneSkipOnboardingCalculation = state =>
  state.merge({isAttemptingSkipOnboardingCalculation: false});

const doGoToNextSubscriptionOnboardingPage = state => {
  let {page, diet} = state.subscriptionOnboarding;
  // if(page == 1){
  //   //Will only show Time to Eat Meat if Flexitarian and Pescetarian
  //   // Aug 2022 Update skip the Time to eat meat
  //   // page += (diet.text == 'Vegan' || diet.text == 'Vegetarian')  ? 2 : 1;
  //   page += 2;
  //   return state.merge({
  //     subscriptionOnboarding: {
  //       ...state.subscriptionOnboarding,
  //       page
  //     }
  //   })
  // }
  page += 1;

  return state.merge({
    subscriptionOnboarding: {
      ...state.subscriptionOnboarding,
      page
    }
  });
};
const doGoToPreviousSubscriptionOnboardingPage = state => {
  let {page, diet} = state.subscriptionOnboarding;

  if (page == 3) {
    //Will only show Time to Eat Meat if Flexitarian
    page -= diet.text == 'Flexitarian' ? 1 : 2;
    return state.merge({
      subscriptionOnboarding: {
        ...state.subscriptionOnboarding,
        page
      }
    });
  }
  page -= 1;

  if (page >= 0) {
    return state.merge({
      subscriptionOnboarding: {
        ...state.subscriptionOnboarding,
        page
      }
    });
  }
};
const doGoToSubscriptionOnboardingPage = (state, {page}) =>
  state.merge({
    subscriptionOnboarding: {
      ...state.subscriptionOnboarding,
      page
    }
  });
const doSetCanGoToNextSubscriptionOnboardingPage = (state, {canGo}) =>
  state.merge({
    subscriptionOnboarding: {
      ...state.subscriptionOnboarding,
      canGoToNextPage: canGo
    }
  });
const doAddToSubscriptionOnboarding = (state, {data}) => {
  let modifiedPlan = {};

  if ('days_to_eat_meat' in data) {
    modifiedPlan = {
      diet: {
        text: state.subscriptionOnboarding.diet.text,
        days_to_eat_meat: data.days_to_eat_meat
      },
      days_to_eat_meat: data.days_to_eat_meat
    };
  } else if ('diet' in data) {
    modifiedPlan = {
      ...data,
      days_to_eat_meat: data.diet.days_to_eat_meat
    };
  } else {
    modifiedPlan = data;
  }

  let subscriptionOnboarding = {
    ...state.subscriptionOnboarding,
    ...modifiedPlan
  };

  return state.merge({subscriptionOnboarding});
};

const doClearSubscriptionOnboarding = state =>
  state.merge({
    subscriptionOnboarding: INITIAL_STATE.subscriptionOnboarding
  });

const doAttemptSubscribe = state => state.merge({isAttemptingSubscribe: true});
const doDoneAttemptSubscribe = state =>
  state.merge({isAttemptingSubscribe: false});

const doConfirmSubscription = state =>
  state.merge({
    confirmSubscription: {
      ...INITIAL_STATE.confirmSubscription,
      attempting: true
    }
  });
const doDoneConfirmSubscription = state =>
  state.merge({
    confirmSubscription: {
      ...INITIAL_STATE.confirmSubscription,
      attempting: false
    }
  });
const doConfirmSubscriptionSuccess = state =>
  state.merge({
    confirmSubscription: {
      ...state.confirmSubscription,
      success: true
    }
  });

const doResetConfirmSubscription = state =>
  state.merge({confirmSubscription: INITIAL_STATE.confirmSubscription});

const doGetPlanSummary = state =>
  state.merge({isAttemptingGetPlanSummary: true});
const doDoneGetPlanSummary = state =>
  state.merge({isAttemptingGetPlanSummary: false});
const doSetPlanSummary = (state, {data}) => state.merge({planSummary: data});

const doUpdatePlanSummary = state =>
  state.merge({isAttemptingUpdatePlanSummary: true});
const doDoneUpdatePlanSummary = state =>
  state.merge({isAttemptingUpdatePlanSummary: false});

const doGetTodayDashboard = state =>
  state.merge({isAttemptingGetTodayDashboard: true});
const doDoneGetTodayDashboard = state =>
  state.merge({isAttemptingGetTodayDashboard: false});
const doSetTodayDashboardData = (state, {data}) =>
  state.merge({todayDashboard: data});
const doIncreaseTodayDashboardHighlights = (state, {data}) => {
  let highlights = Immutable.asMutable(state.todayDashboard.highlights, {
    deep: true
  });

  for (let h in highlights) {
    if (data.indexOf(highlights[h].settings) >= 0) {
      switch (highlights[h].settings) {
        case Highlights.total_points.key:
          highlights[h].value = (
            highlights[h].value
              ? parseInt(highlights[h].value) + LOG_MEAL_POINTS
              : LOG_MEAL_POINTS
          ).toString();
          break;
        default:
          highlights[h].value = (
            highlights[h].value ? parseInt(highlights[h].value) + 1 : 1
          ).toString();
      }
    }
  }

  return state.merge({
    todayDashboard: {
      ...state.todayDashboard,
      highlights
    }
  });
};
const doSetTodayTabIndex = (state, {tabIndex}) =>
  state.merge({todayTabIndex: tabIndex});
const doUpdateMealInTodayAndUpcomingMealsByTemplate = (state, {id, data}) => {
  let meals = Immutable.asMutable(state.todayDashboard.meals, {deep: true});

  let categorizedMeals = Immutable.asMutable(
    state.todayDashboard.categorizedMeals,
    {deep: true}
  );

  let todayUpcomingMeals = Immutable.asMutable(state.todayUpcomingMeals, {
    deep: true
  });

  if (meals?.length > 0) {
    meals = meals.map(m => {
      if (m.template == id) {
        m = {
          ...m,
          ...data
        };
      }

      return m;
    });
  }

  if (categorizedMeals?.items?.length > 0) {
    categorizedMeals.items = categorizedMeals.items.map(m => {
      if (m.id == id) {
        m = {
          ...m,
          ...data
        };
      }

      return m;
    });
  }

  if (todayUpcomingMeals) {
    if (todayUpcomingMeals.meals?.length > 0) {
      todayUpcomingMeals.meals = todayUpcomingMeals.meals.map(m => {
        if (m.template == id) {
          m = {
            ...m,
            ...data
          };
        }

        return m;
      });
    }
  }

  return state.merge({
    todayDashboard: {
      ...state.todayDashboard,
      meals,
      categorizedMeals
    },
    todayUpcomingMeals
  });
};

const doGetTodayUpcomingMeals = state =>
  state.merge({isAttemptingGetTodayUpcomingMeals: true});
const doDoneGetTodayUpcomingMeals = state =>
  state.merge({isAttemptingGetTodayUpcomingMeals: false});
const doSetTodayUpcomingMealsData = (state, {data}) =>
  state.merge({todayUpcomingMeals: data});
const doRemoveMealFromUpcomingMeals = (state, {meal_id}) => {
  if (!state.todayUpcomingMeals) {
    return state.merge({todayUpcomingMeals: state.todayUpcomingMeals});
  }

  return state.merge({
    todayUpcomingMeals: {
      ...state.todayUpcomingMeals,
      meals: Immutable.asMutable(state.todayUpcomingMeals.meals, {
        deep: true
      }).filter(m => m.id !== meal_id)
    }
  });
};

const doGetAllUpcomingMeals = state =>
  state.merge({isAttemptingGetAllUpcomingMeals: true});
const doDoneGetAllUpcomingMeals = state =>
  state.merge({isAttemptingGetAllUpcomingMeals: false});
const doSetAllUpcomingMeals = (state, {data}) =>
  state.merge({allUpcomingMeals: data});

const doLogProgress = state =>
  state.merge({
    isAttemptingLogProgress: true,
    logProgress: {
      ...INITIAL_STATE.logProgress,
      attempting: true
    }
  });
const doDoneLogProgress = state =>
  state.merge({
    isAttemptingLogProgress: false,
    logProgress: {
      ...state.logProgress,
      attempting: false
    }
  });
const doSetLogProgressSuccess = (state, {data}) =>
  state.merge({
    logProgress: {
      ...state.logProgress,
      success: true,
      data
    }
  });

const doGetMetricsConfiguration = state =>
  state.merge({
    metricsConfiguration: {
      ...INITIAL_STATE.metricsConfiguration,
      fetching: true
    }
  });
const doDoneGetMetricsConfiguration = state =>
  state.merge({
    metricsConfiguration: {
      ...state.metricsConfiguration,
      fetching: false
    }
  });
const doSetMetricsConfiguration = (state, {metrics}) =>
  state.merge({
    metricsConfiguration: {
      ...state.metricsConfiguration,
      data: metrics
    }
  });

const doAttemptUpdateMetricsConfiguration = state =>
  state.merge({
    metricsConfiguration: {
      ...state.metricsConfiguration,
      updating: true
    }
  });
const doDoneAttemptUpdateMetricsConfiguration = state =>
  state.merge({
    metricsConfiguration: {
      ...state.metricsConfiguration,
      updating: false
    }
  });
const doUpdateMetricsConfiguration = (state, {metrics}) => {
  const {data} = state.metricsConfiguration;

  return state.merge({
    metricsConfiguration: {
      ...state.metricsConfiguration,
      data: {
        ...data,
        [metrics.key]: {
          ...data[metrics.key],
          value: metrics.value
        }
      }
    }
  });
};

const doGetStatsConfiguration = state =>
  state.merge({
    myStatsConfiguration: {
      ...INITIAL_STATE.myStatsConfiguration,
      fetching: true
    }
  });
const doDoneGetStatsConfiguration = state =>
  state.merge({
    myStatsConfiguration: {
      ...state.myStatsConfiguration,
      fetching: false
    }
  });
const doSetStatsConfiguration = (state, {stats}) =>
  state.merge({
    myStatsConfiguration: {
      ...state.myStatsConfiguration,
      data: stats
    }
  });

const doAttemptUpdateStatsConfiguration = state =>
  state.merge({
    myStatsConfiguration: {
      ...state.myStatsConfiguration,
      updating: true
    }
  });
const doDoneAttemptUpdateStatsConfiguration = state =>
  state.merge({
    myStatsConfiguration: {
      ...state.myStatsConfiguration,
      updating: false
    }
  });
const doUpdateStatsConfiguration = (state, {stats}) => {
  const {data} = state.myStatsConfiguration;

  return state.merge({
    myStatsConfiguration: {
      ...state.myStatsConfiguration,
      data: {
        ...data,
        [stats.key]: {
          ...data[stats.key],
          value: stats.value
        }
      }
    }
  });
};

const doShareProgress = state =>
  state.merge({
    shareProgress: {
      ...INITIAL_STATE.shareProgress,
      attempting: true
    }
  });
const doDoneShareProgress = state =>
  state.merge({
    shareProgress: {
      ...INITIAL_STATE.shareProgress,
      attempting: false
    }
  });
const doSetShareProgressSuccess = state =>
  state.merge({
    shareProgress: {
      ...state.shareProgress,
      success: true
    }
  });

const doLogMeasurement = state =>
  state.merge({isAttemptingLogMeasurement: true});
const doDoneLogMeasurement = state =>
  state.merge({isAttemptingLogMeasurement: false});

const doGetMeasurements = state =>
  state.merge({isAttemptingGetMeasurements: true});
const doDoneGetMeasurements = state =>
  state.merge({isAttemptingGetMeasurements: false});
const doSetMeasurements = (state, {data}) => state.merge({measurements: data});

const doDeleteAccount = state => state.merge({isAttemptingDeleteAccount: true});
const doDoneDeleteAccount = state =>
  state.merge({isAttemptingDeleteAccount: false});

const doGetAddresses = state => state.merge({isAttemptingGetAddresses: true});
const doDoneGetAddresses = state =>
  state.merge({isAttemptingGetAddresses: false});
const doSetAddresses = (state, {list}) => state.merge({addresses: list});
const doSetNewAddressDetails = (state, {details}) =>
  state.merge({newAddressDetails: details});

const doAddAddress = state => state.merge({isAttemptingAddAddress: true});
const doDoneAddAddress = state => state.merge({isAttemptingAddAddress: false});

const doUpdateAddress = state => state.merge({isAttemptingUpdateAddress: true});
const doDoneUpdateAddress = state =>
  state.merge({isAttemptingUpdateAddress: false});

const doDeleteAddress = state => state.merge({isAttemptingDeleteAddress: true});
const doDoneDeleteAddress = state =>
  state.merge({isAttemptingDeleteAddress: false});

const doGetProgress = state => state.merge({isAttemptingGetProgress: true});
const doDoneGetProgress = state =>
  state.merge({isAttemptingGetProgress: false});
const doSetProgress = (state, {data}) => state.merge({progress: data});

const doGetAchievements = state =>
  state.merge({isAttemptingGetAchievements: true});
const doDoneGetAchievements = state =>
  state.merge({isAttemptingGetAchievements: false});
const doSetAchievements = (state, {data}) => state.merge({achievements: data});

const doGetMeasurementGoals = state =>
  state.merge({isAttemptingGetMeasurementGoal: true});
const doDoneGetMeasurementGoals = state =>
  state.merge({isAttemptingGetMeasurementGoal: false});
const doSetMeasurementGoals = (state, {goal}) =>
  state.merge({measurementGoal: goal});

const doUpdateMeasurementGoal = state =>
  state.merge({
    updateMeasurementGoal: {
      ...INITIAL_STATE.updateMeasurementGoal,
      attempting: true
    }
  });
const doDoneUpdateMeasurementGoal = state =>
  state.merge({
    updateMeasurementGoal: {
      ...INITIAL_STATE.updateMeasurementGoal,
      attempting: false
    }
  });
const doSetUpdateMeasurementGoalSuccess = state =>
  state.merge({
    updateMeasurementGoal: {
      ...state.updateMeasurementGoal,
      success: true
    }
  });

const doSetTreatsEnabled = (state, {status}) =>
  state.merge({
    data: {
      ...state.data,
      treats_enabled: status
    }
  });

const doSetDataForCartRequest = (state, {data}) => {
  return state.merge({
    dataForCartRequest: {
      ...state.dataForCartRequest,
      ...data
    }
  });
};

const doAddStatesOnTheFly = (state, {data}) => state.merge({...data});

const doResetReducer = state =>
  state.merge({
    isAttemptingForgotPassword: INITIAL_STATE.isAttemptingForgotPassword,
    isAttemptingCreateNewPassword: INITIAL_STATE.isAttemptingCreateNewPassword,
    isAttemptingChangePassword: INITIAL_STATE.isAttemptingChangePassword,
    isAttemptingGetProfile: INITIAL_STATE.isAttemptingGetProfile,
    isAttemptingEditProfile: INITIAL_STATE.isAttemptingEditProfile,
    isAttemptingUpdateWhy: INITIAL_STATE.isAttemptingUpdateWhy,
    isAttemptingGetHighlightSettings:
      INITIAL_STATE.isAttemptingGetHighlightSettings,
    isAttemptingUpdateHighlightSettings:
      INITIAL_STATE.isAttemptingUpdateHighlightSettings,
    isAttemptingRestoreSubscription:
      INITIAL_STATE.isAttemptingRestoreSubscription,
    isAttemptingGetNotificationSettings:
      INITIAL_STATE.isAttemptingGetNotificationSettings,
    isAttemptingUpdateMealNotificationSettings:
      INITIAL_STATE.isAttemptingUpdateMealNotificationSettings,
    isAttemptConfirmSubscription: INITIAL_STATE.isAttemptConfirmSubscription,
    confirmSubscription: INITIAL_STATE.confirmSubscription,
    isAttemptingGetPlanSummary: INITIAL_STATE.isAttemptingGetPlanSummary,
    isAttemptingUpdatePlanSummary: INITIAL_STATE.isAttemptingUpdatePlanSummary,
    isAttemptingGetTodayDashboard: INITIAL_STATE.isAttemptingGetTodayDashboard,
    isAttemptingGetTodayUpcomingMeals:
      INITIAL_STATE.isAttemptingGetTodayUpcomingMeals,
    isAttemptingGetAllUpcomingMeals:
      INITIAL_STATE.isAttemptingGetAllUpcomingMeals,
    allUpcomingMeals: INITIAL_STATE.allUpcomingMeals,
    isAttemptingLogProgress: INITIAL_STATE.isAttemptingLogProgress,
    logProgress: INITIAL_STATE.logProgress,
    shareProgress: INITIAL_STATE.shareProgress,
    isAttemptingLogMeasurement: INITIAL_STATE.isAttemptingLogMeasurement,
    isAttemptingGetMeasurements: INITIAL_STATE.isAttemptingGetMeasurements,
    measurements: null,
    isAttemptingDeleteAccount: INITIAL_STATE.isAttemptingDeleteAccount,
    isAttemptingGetAddresses: INITIAL_STATE.isAttemptingGetAddresses,
    newAddressDetails: INITIAL_STATE.newAddressDetails,
    isAttemptingAddAddress: INITIAL_STATE.isAttemptingAddAddress,
    isAttemptingUpdateAddress: INITIAL_STATE.isAttemptingUpdateAddress,
    isAttemptingDeleteAddress: INITIAL_STATE.isAttemptingDeleteAddress,
    isAttemptingGetProgress: INITIAL_STATE.isAttemptingGetProgress,
    isAttemptingGetAchievements: INITIAL_STATE.isAttemptingGetAchievements,
    isAttemptingGetMealNotificationSettings:
      INITIAL_STATE.isAttemptingGetMealNotificationSettings,
    isAttemptingSkipOnboardingCalculation:
      INITIAL_STATE.isAttemptingSkipOnboardingCalculation,
    isAttemptingSubscribe: INITIAL_STATE.isAttemptingSubscribe,
    isAttemptingGetMeasurementGoal:
      INITIAL_STATE.isAttemptingGetMeasurementGoal,
    dataForCartRequest: INITIAL_STATE.dataForCartRequest,
    updateMeasurementGoal: INITIAL_STATE.updateMeasurementGoal,
    metricsConfiguration: INITIAL_STATE.metricsConfiguration,
    myStatsConfiguration: INITIAL_STATE.myStatsConfiguration,
    todayTabIndex: INITIAL_STATE.todayTabIndex,
    onboardingPage: INITIAL_STATE.onboardingPage,
    subscriptionOnboarding: INITIAL_STATE.subscriptionOnboarding,
    firstRecipe: INITIAL_STATE.firstRecipe
  });

const doSetAppsFlyerData = (state, {payload}) => {
  return state.merge({
    dataForAppsFlyer: {
      ...state.dataForAppsFlyer,
      ...payload
    }
  });
};

const doSetUsersAppsFlyerProfile = (state, {payload}) => {
  return state.merge({
    data: {
      ...state.data,
      metadata: {...payload}
    }
  });
};

const doDoneUpdateUsersMeta = (state, {payload}) => {
  return state.merge({
    data: {
      ...state.data,
      metadata: {...payload}
    }
  });
};

const doShowReferFriend = state => {
  return state.merge({
    showReferaFriend: true,
    referaFriendLastShown: +moment().format('YYYYMMDD')
  });
};

const doHideReferFriend = state => {
  return state.merge({
    showReferaFriend: false
  });
};

const doSetReferredId = (state, {referrer_id}) => {
  return state.merge({
    referrer_id: referrer_id
  });
};

const doRemoveReferrerId = state => {
  return state.merge({
    referrer_id: undefined
  });
};

const doSetDietitianId = (state, {dietitian_id}) => {
  return state.merge({
    dietitian_id: dietitian_id
  });
};

const doRemoveDietitianId = state => {
  return state.merge({
    dietitian_id: undefined
  });
};

const doAddToFirstRecipe = (state, {data}) => {
  logConsole('doAddToFirstRecipe', data);
  let firstRecipe = {
    ...state.firstRecipe,
    ...data
  };
  return state.merge({firstRecipe});
};

const doClearFirstRecipe = state =>
  state.merge({firstRecipe: INITIAL_STATE.firstRecipe});

const doSendOtp = state => {
  return state.merge({
    isAttemptingVerifyPhoneNumber: true
  });
};
const doDoneSendOtp = state => {
  return state.merge({
    isAttemptingVerifyPhoneNumber: false
  });
};

const doVerifyOtp = state => {
  return state.merge({
    isAttemptingVerifyPhoneNumber: true
  });
};

const doDoneVerifyOtp = state => {
  return state.merge({
    isAttemptingVerifyPhoneNumber: false
  });
};

const HANDLERS = {
  [Actions.Types.ATTEMPT_FORGOT_PASSWORD]: doForgotPassword,
  [Actions.Types.DONE_ATTEMPT_FORGOT_PASSWORD]: doDoneForgotPassword,

  [Actions.Types.ATTEMPT_CREATE_NEW_PASSWORD]: doCreateNewPassword,
  [Actions.Types.DONE_ATTEMPT_CREATE_NEW_PASSWORD]: doDoneCreateNewPassword,

  [Actions.Types.ATTEMPT_CHANGE_PASSWORD]: doChangePassword,
  [Actions.Types.DONE_ATTEMPT_CHANGE_PASSWORD]: doDoneChangePassword,

  [Actions.Types.SET_USER_DATA]: doSetUserData,
  [Actions.Types.UPDATE_USER_DATA]: doUpdateUserData,
  [Actions.Types.CLEAR_USER_DATA]: doClearUserData,

  [Actions.Types.ATTEMPT_GET_USER_PROFILE]: doGetProfile,
  [Actions.Types.DONE_ATTEMPT_GET_USER_PROFILE]: doDoneGetProfile,

  [Actions.Types.ATTEMPT_EDIT_USER_PROFILE]: doEditProfile,
  [Actions.Types.DONE_ATTEMPT_EDIT_USER_PROFILE]: doDoneEditProfile,

  [Actions.Types.ATTEMPT_UPDATE_USER_MANDATORY_DATA]: doUpdateMandatoryProfile,
  [Actions.Types.DONE_ATTEMPT_UPDATE_USER_MANDATORY_DATA]:
    doDoneUpdateMandatoryProfile,

  [Actions.Types.ATTEMPT_UPDATE_USER_WHY]: doUpdateWhy,
  [Actions.Types.DONE_ATTEMPT_UPDATE_USER_WHY]: doDoneUpdateWhy,

  [Actions.Types.ATTEMPT_GET_HIGHLIGHT_SETTINGS]: doGetHighlightSettings,
  [Actions.Types.DONE_ATTEMPT_GET_HIGHLIGHT_SETTINGS]:
    doDoneGetHighlightSettings,
  [Actions.Types.SET_HIGHLIGHT_SETTINGS]: doSetHighlightSettings,

  [Actions.Types.ATTEMPT_UPDATE_HIGHLIGHT_SETTINGS]: doUpdateHighlightSettings,
  [Actions.Types.DONE_ATTEMPT_UPDATE_HIGHLIGHT_SETTINGS]:
    doDoneUpdateHighlightSettings,

  [Actions.Types.ATTEMPT_RESTORE_SUBSCRIPTION]: doRestoreSubscription,
  [Actions.Types.DONE_ATTEMPT_RESTORE_SUBSCRIPTION]: doDoneRestoreSubscription,

  [Actions.Types.ATTEMPT_GET_USER_NOTIFICATION_SETTINGS]:
    doGetNotificationSettings,
  [Actions.Types.DONE_ATTEMPT_GET_USER_NOTIFICATION_SETTINGS]:
    doDoneGetNotificationSettings,
  [Actions.Types.SET_USER_NOTIFICATION_SETTINGS]: doSetNotificationSettings,

  [Actions.Types.SET_USER_MEAL_NOTIFICATION_SETTINGS]:
    doSetMealNotificationSettings,

  [Actions.Types.ATTEMPT_GET_USER_MEAL_NOTIFICATION_SETTINGS]:
    doGetMealNotificationSettings,
  [Actions.Types.DONE_ATTEMPT_GET_USER_MEAL_NOTIFICATION_SETTINGS]:
    doDoneGetMealNotificationSettings,

  [Actions.Types.ATTEMPT_UPDATE_USER_MEAL_NOTIFICATION_SETTINGS]:
    doAttemptUpdateMealNotificationSettings,
  [Actions.Types.DONE_ATTEMPT_UPDATE_USER_MEAL_NOTIFICATION_SETTINGS]:
    doDoneUpdateMealNotificationSettings,
  [Actions.Types.UPDATE_USER_MEAL_NOTIFICATION_SETTINGS]:
    doUpdateMealNotificationSettings,

  [Actions.Types.GO_TO_NEXT_ONBOARDING_PAGE]: doGoToNextOnboardingPage,
  [Actions.Types.GO_TO_PREVIOUS_ONBOARDING_PAGE]: doGoToPreviousOnboardingPage,
  [Actions.Types.GO_TO_ONBOARDING_PAGE]: doGoToOnboardingPage,
  [Actions.Types.SET_CAN_GO_TO_NEXT_ONBOARDING_PAGE]:
    doSetCanGoToNextOnboardingPage,
  [Actions.Types.ADD_TO_ONBOARDING_PLAN]: doAddToOnboardingPlan,
  [Actions.Types.CLEAR_ONBOARDING_PLAN]: doClearOnboardingPlan,
  [Actions.Types.ATTEMPT_SKIP_ONBOARDING_CALCULATION]:
    doSkipOnboardingCalculation,
  [Actions.Types.DONE_ATTEMPT_SKIP_ONBOARDING_CALCULATION]:
    doDoneSkipOnboardingCalculation,

  [Actions.Types.GO_TO_NEXT_SUBSCRIPTION_ONBOARDING_PAGE]:
    doGoToNextSubscriptionOnboardingPage,
  [Actions.Types.GO_TO_PREVIOUS_SUBSCRIPTION_ONBOARDING_PAGE]:
    doGoToPreviousSubscriptionOnboardingPage,
  [Actions.Types.GO_TO_SUBSCRIPTION_ONBOARDING_PAGE]:
    doGoToSubscriptionOnboardingPage,
  [Actions.Types.SET_CAN_GO_TO_NEXT_SUBSCRIPTION_ONBOARDING_PAGE]:
    doSetCanGoToNextSubscriptionOnboardingPage,
  [Actions.Types.ADD_TO_SUBSCRIPTION_ONBOARDING]: doAddToSubscriptionOnboarding,
  [Actions.Types.CLEAR_SUBSCRIPTION_ONBOARDING]: doClearSubscriptionOnboarding,

  [Actions.Types.ATTEMPT_SUBSCRIBE]: doAttemptSubscribe,
  [Actions.Types.DONE_ATTEMPT_SUBSCRIBE]: doDoneAttemptSubscribe,

  [Actions.Types.ATTEMPT_CONFIRM_SUBSCRIPTION]: doConfirmSubscription,
  [Actions.Types.DONE_ATTEMPT_CONFIRM_SUBSCRIPTION]: doDoneConfirmSubscription,
  [Actions.Types.SET_CONFIRM_SUBSCRIPTION_SUCCESS]:
    doConfirmSubscriptionSuccess,
  [Actions.Types.RESET_CONFIRM_SUBSCRIPTION]: doResetConfirmSubscription,

  [Actions.Types.ATTEMPT_GET_PLAN_SUMMARY]: doGetPlanSummary,
  [Actions.Types.DONE_ATTEMPT_GET_PLAN_SUMMARY]: doDoneGetPlanSummary,
  [Actions.Types.SET_PLAN_SUMMARY]: doSetPlanSummary,

  [Actions.Types.ATTEMPT_UPDATE_PLAN_SUMMARY]: doUpdatePlanSummary,
  [Actions.Types.DONE_ATTEMPT_UPDATE_PLAN_SUMMARY]: doDoneUpdatePlanSummary,

  [Actions.Types.ATTEMPT_GET_TODAY_DASHBOARD]: doGetTodayDashboard,
  [Actions.Types.DONE_ATTEMPT_GET_TODAY_DASHBOARD]: doDoneGetTodayDashboard,
  [Actions.Types.SET_TODAY_DASHBOARD_DATA]: doSetTodayDashboardData,
  [Actions.Types.INCREASE_TODAY_DASHBOARD_HIGHLIGHTS]:
    doIncreaseTodayDashboardHighlights,
  [Actions.Types.SET_TODAY_TAB_INDEX]: doSetTodayTabIndex,
  [Actions.Types.UPDATE_MEAL_IN_TODAY_AND_UPCOMING_MEALS_BY_TEMPLATE]:
    doUpdateMealInTodayAndUpcomingMealsByTemplate,

  [Actions.Types.ATTEMPT_GET_TODAY_UPCOMING_MEALS]: doGetTodayUpcomingMeals,
  [Actions.Types.DONE_ATTEMPT_GET_TODAY_UPCOMING_MEALS]:
    doDoneGetTodayUpcomingMeals,
  [Actions.Types.SET_TODAY_UPCOMING_MEALS_DATA]: doSetTodayUpcomingMealsData,
  [Actions.Types.REMOVE_MEAL_FROM_UPCOMING_MEALS]:
    doRemoveMealFromUpcomingMeals,

  [Actions.Types.ATTEMPT_GET_ALL_UPCOMING_MEALS]: doGetAllUpcomingMeals,
  [Actions.Types.DONE_ATTEMPT_GET_ALL_UPCOMING_MEALS]:
    doDoneGetAllUpcomingMeals,
  [Actions.Types.SET_ALL_UPCOMING_MEALS]: doSetAllUpcomingMeals,

  [Actions.Types.ATTEMPT_LOG_PROGRESS]: doLogProgress,
  [Actions.Types.DONE_ATTEMPT_LOG_PROGRESS]: doDoneLogProgress,
  [Actions.Types.SET_LOG_PROGRESS_SUCCESS]: doSetLogProgressSuccess,

  [Actions.Types.ATTEMPT_GET_USER_METRICS_CONFIGURATION]:
    doGetMetricsConfiguration,
  [Actions.Types.DONE_ATTEMPT_GET_USER_METRICS_CONFIGURATION]:
    doDoneGetMetricsConfiguration,
  [Actions.Types.SET_USER_METRICS_CONFIGURATION]: doSetMetricsConfiguration,

  [Actions.Types.ATTEMPT_UPDATE_USER_METRICS_CONFIGURATION]:
    doAttemptUpdateMetricsConfiguration,
  [Actions.Types.DONE_ATTEMPT_UPDATE_USER_METRICS_CONFIGURATION]:
    doDoneAttemptUpdateMetricsConfiguration,
  [Actions.Types.UPDATE_USER_METRICS_CONFIGURATION]:
    doUpdateMetricsConfiguration,

  [Actions.Types.ATTEMPT_GET_USER_STATS_CONFIGURATION]: doGetStatsConfiguration,
  [Actions.Types.DONE_ATTEMPT_GET_USER_STATS_CONFIGURATION]:
    doDoneGetStatsConfiguration,
  [Actions.Types.SET_USER_STATS_CONFIGURATION]: doSetStatsConfiguration,

  [Actions.Types.ATTEMPT_UPDATE_USER_STATS_CONFIGURATION]:
    doAttemptUpdateStatsConfiguration,
  [Actions.Types.DONE_ATTEMPT_UPDATE_USER_STATS_CONFIGURATION]:
    doDoneAttemptUpdateStatsConfiguration,
  [Actions.Types.UPDATE_USER_STATS_CONFIGURATION]: doUpdateStatsConfiguration,

  [Actions.Types.ATTEMPT_SHARE_PROGRESS]: doShareProgress,
  [Actions.Types.DONE_ATTEMPT_SHARE_PROGRESS]: doDoneShareProgress,
  [Actions.Types.SET_SHARE_PROGRESS_SUCCESS]: doSetShareProgressSuccess,

  [Actions.Types.ATTEMPT_LOG_MEASUREMENT]: doLogMeasurement,
  [Actions.Types.DONE_ATTEMPT_LOG_MEASUREMENT]: doDoneLogMeasurement,

  [Actions.Types.ATTEMPT_GET_USER_MEASUREMENTS]: doGetMeasurements,
  [Actions.Types.DONE_ATTEMPT_GET_USER_MEASUREMENTS]: doDoneGetMeasurements,
  [Actions.Types.SET_USER_MEASUREMENTS]: doSetMeasurements,

  [Actions.Types.ATTEMPT_DELETE_USER_ACCOUNT]: doDeleteAccount,
  [Actions.Types.DONE_ATTEMPT_DELETE_USER_ACCOUNT]: doDoneDeleteAccount,

  [Actions.Types.ATTEMPT_GET_SAVED_ADDRESSES]: doGetAddresses,
  [Actions.Types.DONE_ATTEMPT_GET_SAVED_ADDRESSES]: doDoneGetAddresses,
  [Actions.Types.SET_SAVED_ADDRESSES]: doSetAddresses,
  [Actions.Types.SET_NEW_ADDRESS_DETAILS]: doSetNewAddressDetails,

  [Actions.Types.ATTEMPT_ADD_ADDRESS]: doAddAddress,
  [Actions.Types.DONE_ATTEMPT_ADD_ADDRESS]: doDoneAddAddress,

  [Actions.Types.ATTEMPT_UPDATE_ADDRESS]: doUpdateAddress,
  [Actions.Types.DONE_ATTEMPT_UPDATE_ADDRESS]: doDoneUpdateAddress,

  [Actions.Types.ATTEMPT_DELETE_ADDRESS]: doDeleteAddress,
  [Actions.Types.DONE_ATTEMPT_DELETE_ADDRESS]: doDoneDeleteAddress,

  [Actions.Types.ATTEMPT_GET_USER_PROGRESS]: doGetProgress,
  [Actions.Types.DONE_ATTEMPT_GET_USER_PROGRESS]: doDoneGetProgress,
  [Actions.Types.SET_USER_PROGRESS]: doSetProgress,

  [Actions.Types.ATTEMPT_GET_USER_ACHIEVEMENTS]: doGetAchievements,
  [Actions.Types.DONE_ATTEMPT_GET_USER_ACHIEVEMENTS]: doDoneGetAchievements,
  [Actions.Types.SET_USER_ACHIEVEMENTS]: doSetAchievements,

  [Actions.Types.ATTEMPT_GET_USER_MEASUREMENT_GOALS]: doGetMeasurementGoals,
  [Actions.Types.DONE_ATTEMPT_GET_USER_MEASUREMENT_GOALS]:
    doDoneGetMeasurementGoals,
  [Actions.Types.SET_USER_MEASUREMENT_GOALS]: doSetMeasurementGoals,

  [Actions.Types.ATTEMPT_UPDATE_USER_MEASUREMENT_GOAL]: doUpdateMeasurementGoal,
  [Actions.Types.DONE_ATTEMPT_UPDATE_USER_MEASUREMENT_GOAL]:
    doDoneUpdateMeasurementGoal,
  [Actions.Types.SET_UPDATE_USER_MEASUREMENT_GOAL_SUCCESS]:
    doSetUpdateMeasurementGoalSuccess,

  [Actions.Types.SET_TREATS_ENABLED]: doSetTreatsEnabled,

  [Actions.Types.SET_DATA_FOR_CART_REQUEST]: doSetDataForCartRequest,

  [Actions.Types.ADD_NEW_USER_STATES_ON_THE_FLY]: doAddStatesOnTheFly,

  [Actions.Types.RESET_USER_REDUCER]: doResetReducer,

  [Actions.Types.UPDATE_USER_APPS_FLYER_DATA]: doSetAppsFlyerData,

  [Actions.Types.UPDATE_USERS_APPS_FLYER_PROFILE_COMPLETE]:
    doSetUsersAppsFlyerProfile,

  [Actions.Types.SHOW_REFER_FRIEND]: doShowReferFriend,
  [Actions.Types.HIDE_REFER_FRIEND]: doHideReferFriend,
  [Actions.Types.SET_REFERRER_ID]: doSetReferredId,
  [Actions.Types.REMOVE_REFERRER_ID]: doRemoveReferrerId,

  [Actions.Types.SET_DIETITIAN_ID]: doSetDietitianId,
  [Actions.Types.REMOVE_DIETITIAN_ID]: doRemoveDietitianId,

  [Actions.Types.DONE_UPDATE_USERS_META]: doDoneUpdateUsersMeta,
  [Actions.Types.ADD_TO_FIRST_RECIPE]: doAddToFirstRecipe,
  [Actions.Types.CLEAR_FIRST_RECIPE]: doClearFirstRecipe,

  [Actions.Types.ATTEMPT_SEND_OTP]: doSendOtp,
  [Actions.Types.DONE_ATTEMPT_SEND_OTP]: doDoneSendOtp,

  [Actions.Types.ATTEMPT_VERIFY_OTP]: doVerifyOtp,
  [Actions.Types.DONE_ATTEMPT_VERIFY_OTP]: doDoneVerifyOtp
};

export default createReducer(INITIAL_STATE, HANDLERS);
