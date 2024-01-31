import Actions from '@actions';
import {createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import moment from 'moment';

const INITIAL_STATE = Immutable({
  isAttemptingGetDetail: false,
  detail: null,
  isAttemptingRate: false,
  log: {
    attempting: false,
    success: false,
    response: null
  },
  isAttemptingMove: false,
  filterDate: null,
  planDateFilter: {
    from: null,
    to: null
  },
  isNextWeekPlanShown: false,
  isAttemptingGetPlan: false,
  currentPlan: {
    weeks: [],
    shownMeals: []
  },
  isAttemptingGetReplacements: false,
  isAttemptingReplace: false,
  skip: {
    attempting: false,
    success: false
  },
  repeat: {
    fetching: false,
    attempting: false,
    success: false,
    days: null
  },
  bookmark: {
    attempting: false,
    success: false,
    response: null
  },
  batch: {
    attempting: false,
    success: false,
    response: null
  },
  replacements: [],
  // replacements: {
  //   next: null,
  //   list: []
  // },
  isAttemptingGetMoreReplacements: false,
  isAttemptingGetCategorizedTemplates: false,
  categorizedTemplates: [],
  isAttemptingGetTemplates: false,
  templates: {
    categories: [],
    next: null,
    list: []
  },
  isAttemptingGetMoreTemplates: false,
  isAttemptingSearch: false,
  searchKeyword: null,
  searchResults: [],
  searchFilters: {},
  isAttemptingGetMonthlyHistory: false,
  monthlyHistory: null,
  isAttemptingGetWeeklyHistory: false,
  weeklyHistory: null,
  adjustPlan: {
    attempting: false,
    success: false
  },
  treats: {
    attempting: false,
    success: false,
    config: null
  },
  hostGuests: {
    attempting: false,
    success: false,
    response: null
  },
  removeGuests: {
    attempting: false,
    success: false,
    response: null
  },
  isAttemptingClearTreatsConfig: false,
  hideActionButtonsTrigger: 0,
  searchedRecipesByKeyword: {
    requesting: false,
    results: null
  },
  appliedSearchFilters: [],
  isAttemptingSetUserPreference: false,
  isAttemptingAddToMealPlans: false,
  isAttemptingSaveMealNotes: false,
  isPlayingTTS: false,
});

const doGetDetail = state => state.merge({isAttemptingGetDetail: true});
const doDoneGetDetail = state => state.merge({isAttemptingGetDetail: false});

const doSetDetail = (state, {detail}) => state.merge({detail});
const doUpdateDetail = (state, {detail}) => {
  if (state.detail) {
    return state.merge({
      detail: {
        ...state.detail,
        ...detail
      }
    });
  }

  return state.merge({detail: state.detail});
};

const doRate = state => state.merge({isAttemptingRate: true});
const doDoneRate = state => state.merge({isAttemptingRate: false});

const doLog = state =>
  state.merge({
    log: {
      ...INITIAL_STATE.log,
      attempting: true
    }
  });
const doDoneLog = state =>
  state.merge({
    log: {
      ...INITIAL_STATE.log,
      attempting: false
    }
  });
const doSetLogSuccess = (state, {response}) =>
  state.merge({
    log: {
      ...state.log,
      success: true,
      response
    }
  });

const doMove = state => state.merge({isAttemptingMove: true});
const doDoneMove = state => state.merge({isAttemptingMove: false});

const doSetFilterDate = (state, {from, to}) => {
  let shownMeals = [];

  if (from) {
    state.currentPlan.weeks.map(mealWeek => {
      mealWeek.map(m => {
        if (m.rawDate == from) {
          shownMeals.push(m);
        }
      });
    });
  } else {
    if (state.currentPlan.weeks.length > 0) {
      if (!state.isNextWeekPlanShown) {
        shownMeals = state.currentPlan.weeks[0];
      } else {
        if (state.currentPlan.weeks[1]) {
          shownMeals = state.currentPlan.weeks[1];
        }
      }
    }
  }

  return state.merge({
    planDateFilter: {
      from,
      to
    },
    currentPlan: {
      ...state.currentPlan,
      shownMeals
    }
  });
};

const doShowThisWeekPlan = state => {
  let shownMeals = [];

  if (state.currentPlan.weeks.length > 0) {
    shownMeals = state.currentPlan.weeks[0];
  }

  return state.merge({
    isNextWeekPlanShown: false,
    currentPlan: {
      ...state.currentPlan,
      shownMeals
    }
  });
};
const doShowNextWeekPlan = state => {
  let shownMeals = [];

  if (state.currentPlan.weeks[1]) {
    shownMeals = state.currentPlan.weeks[1];
  }

  return state.merge({
    isNextWeekPlanShown: true,
    currentPlan: {
      ...state.currentPlan,
      shownMeals
    }
  });
};

const doGetCurrentPlan = state =>
  state.merge({
    isAttemptingGetPlan: true,
    adjustPlan: INITIAL_STATE.adjustPlan,
    skip: INITIAL_STATE.skip,
    repeat: INITIAL_STATE.repeat,
    treats: {
      ...state.treats,
      success: false
    }
  });
const doDoneGetCurrentPlan = state => state.merge({isAttemptingGetPlan: false});
const doSetCurrentPlan = (state, {currentPlan}) => state.merge({currentPlan});
const doUpdateCurrentPlan = (state, {data}) =>
  state.merge({
    currentPlan: {
      ...state.currentPlan,
      ...data
    }
  });
const doUpdateMealInCurrentPlan = (state, {meal_id, data}) => {
  let plan = Immutable.asMutable(state.currentPlan, {deep: true});

  plan.weeks.map(p => {
    p.map(pp => {
      pp.data.map(m => {
        if (m.id == meal_id) {
          for (let d in data) {
            m[d] = data[d];
          }
        }
      });
    });
  });

  plan.shownMeals.map(p => {
    p.data.map(m => {
      if (m.id == meal_id) {
        for (let d in data) {
          m[d] = data[d];
        }
      }
    });
  });

  return state.merge({currentPlan: plan});
};

const doGetCategorizedTemplates = state =>
  state.merge({isAttemptingGetCategorizedTemplates: true});
const doDoneGetCategorizedTemplates = state =>
  state.merge({isAttemptingGetCategorizedTemplates: false});
const doSetCategorizedTemplates = (state, {templates}) =>
  state.merge({categorizedTemplates: templates});

const doGetTemplates = state => state.merge({isAttemptingGetTemplates: true});
const doDoneGetTemplates = state =>
  state.merge({isAttemptingGetTemplates: false});
const doSetTemplates = (state, {templates}) => state.merge({templates});
const doResetTemplates = state =>
  state.merge({templates: INITIAL_STATE.templates});

const doGetMoreTemplates = state =>
  state.merge({isAttemptingGetMoreTemplates: true});
const doDoneGetMoreTemplates = state =>
  state.merge({isAttemptingGetMoreTemplates: false});
const doSetMoreTemplates = (state, {templates}) =>
  state.merge({
    templates: {
      categories: templates.categories,
      next: templates.next,
      list: [...state.templates.list, ...templates.list]
    }
  })

const doGetReplacements = state =>
  state.merge({isAttemptingGetReplacements: true});
const doDoneGetReplacements = state =>
  state.merge({isAttemptingGetReplacements: false});
const doSetReplacements = (state, {replacements}) =>
  state.merge({replacements});
const doResetReplacements = state =>
  state.merge({replacements: INITIAL_STATE.replacements});

const doGetMoreReplacements = state =>
  state.merge({isAttemptingGetMoreReplacements: true});
const doDoneGetMoreReplacements = state =>
  state.merge({isAttemptingGetMoreReplacements: false});
const doSetMoreReplacements = (state, {replacements}) =>{
  state.merge({replacements});
  // console.log("doSetMoreReplacements state.replacements",state.replacements);
  // console.log("doSetMoreReplacements replacements",replacements);
  // let newReplacements = replacements[0].data.find(data => data.name == state.replacements[0].data[0].name);
  // console.log("doSetMoreReplacements newReplacements",state.replacements[0].data[0]);
  console.log("doSetMoreReplacements replacements.data",[...state.replacements[0].data[0], ...newReplacements]);
  return state.merge([{
    replacements: {
      next: replacements.next,
      data: [...state.replacements[0].data[0], ...newReplacements]
    }
  }])
};

const doSaveMealNotes = state =>
  state.merge({isAttemptingSaveMealNotes: true});
const doDoneSaveMealNotes = state =>
  state.merge({isAttemptingSaveMealNotes: false});

const doReplace = state => state.merge({isAttemptingReplace: true});
const doDoneReplace = state => state.merge({isAttemptingReplace: false});

const doSkip = state =>
  state.merge({
    skip: {
      ...INITIAL_STATE.skip,
      attempting: true
    }
  });
const doDoneSkip = state =>
  state.merge({
    skip: {
      ...INITIAL_STATE.skip,
      attempting: false
    }
  });
const doSetSkipSuccess = state =>
  state.merge({
    skip: {
      ...state.skip,
      success: true
    }
  });

const doGetRepeatDays = state =>
  state.merge({
    repeat: {
      ...INITIAL_STATE.repeat,
      fetching: true
    }
  });
const doDoneGetRepeatDays = state =>
  state.merge({
    repeat: {
      ...state.repeat,
      fetching: false
    }
  });
const doSetRepeatDays = (state, {days}) =>
  state.merge({
    repeat: {
      ...state.repeat,
      days
    }
  });

const doRepeat = state =>
  state.merge({
    repeat: {
      ...INITIAL_STATE.repeat,
      days: state.repeat.days,
      attempting: true
    }
  });
const doDoneRepeat = state =>
  state.merge({
    repeat: {
      ...INITIAL_STATE.repeat,
      attempting: false
    }
  });
const doSetRepeatSuccess = state =>
  state.merge({
    repeat: {
      ...state.repeat,
      success: true
    }
  });

const doBookmark = state =>
  state.merge({
    bookmark: {
      ...INITIAL_STATE.bookmark,
      attempting: true
    }
  });
const doDoneBookmark = state =>
  state.merge({
    bookmark: {
      ...INITIAL_STATE.bookmark,
      attempting: false
    }
  });
const doSetBookmarkSuccess = (state, {response}) =>
  state.merge({
    bookmark: {
      ...state.bookmark,
      success: true,
      response
    }
  });

const doBatch = state =>
  state.merge({
    batch: {
      ...INITIAL_STATE.batch,
      attempting: true
    }
  });
const doDoneBatch = state =>
  state.merge({
    batch: {
      ...INITIAL_STATE.batch,
      attempting: false
    }
  });
const doSetBatchSuccess = (state, {response}) =>
  state.merge({
    batch: {
      ...state.batch,
      success: true,
      response
    }
  });

const doSearch = state => state.merge({isAttemptingSearch: true});
const doDoneSearch = state => state.merge({isAttemptingSearch: false});
const doSetSearchResults = (state, {list}) => state.merge({searchResults: list});

const doGetMonthlyHistory = state =>
  state.merge({isAttemptingGetMonthlyHistory: true});
const doDoneGetMonthlyHistory = state =>
  state.merge({isAttemptingGetMonthlyHistory: false});
const doSetMonthlyHistory = (state, {history}) =>
  state.merge({monthlyHistory: history});

const doGetWeeklyHistory = state =>
  state.merge({isAttemptingGetWeeklyHistory: true});
const doDoneGetWeeklyHistory = state =>
  state.merge({isAttemptingGetWeeklyHistory: false});
const doSetWeeklyHistory = (state, {history}) =>
  state.merge({weeklyHistory: history});

const doAdjustPlan = state =>
  state.merge({
    adjustPlan: {
      ...INITIAL_STATE.adjustPlan,
      attempting: true
    }
  });
const doDoneAdjustPlan = state =>
  state.merge({
    adjustPlan: {
      ...INITIAL_STATE.adjustPlan,
      attempting: false
    }
  });
const doSetAdjustPlanSuccess = state =>
  state.merge({
    adjustPlan: {
      ...state.adjustPlan,
      success: true
    }
  });

const doUpdateTreatsConfig = state =>
  state.merge({
    treats: {
      ...state.treats,
      attempting: true
    }
  });
const doDoneUpdateTreatsConfig = state =>
  state.merge({
    treats: {
      ...state.treats,
      attempting: false
    }
  });
const doSetUpdateTreatsConfigSuccess = state =>
  state.merge({
    treats: {
      ...state.treats,
      success: true
    }
  });
const doSetTreatsConfig = (state, {config}) =>
  state.merge({
    treats: {
      ...state.treats,
      config
    }
  });

const doClearTreatsConfig = state =>
  state.merge({isAttemptingClearTreatsConfig: true});
const doDoneClearTreatsConfig = state =>
  state.merge({isAttemptingClearTreatsConfig: false});

const doHostGuests = state =>
  state.merge({
    hostGuests: {
      ...INITIAL_STATE.hostGuests,
      attempting: true
    }
  });
const doDoneHostGuests = state =>
  state.merge({
    hostGuests: {
      ...INITIAL_STATE.hostGuests,
      attempting: false
    }
  });
const doSetHostGuestsSuccess = (state, {response}) =>
  state.merge({
    hostGuests: {
      ...state.hostGuests,
      success: true,
      response
    }
  });

const doRemoveGuests = state =>
  state.merge({
    removeGuests: {
      ...INITIAL_STATE.removeGuests,
      attempting: true
    }
  });
const doDoneRemoveGuests = state =>
  state.merge({
    removeGuests: {
      ...INITIAL_STATE.removeGuests,
      attempting: false
    }
  });
const doSetRemoveGuestsSuccess = (state, {response}) =>
  state.merge({
    removeGuests: {
      ...state.removeGuests,
      success: true,
      response
    }
  });

const doSearchRecipeByKeyword = state =>
  state.merge({
    searchedRecipesByKeyword: {
      ...INITIAL_STATE.searchedRecipesByKeyword,
      requesting: true
    }
  });
const doDoneSearchRecipeByKeyword = state =>
  state.merge({
    searchedRecipesByKeyword: {
      ...state.searchedRecipesByKeyword,
      requesting: false
    }
  });
const doSetResultsForSearchRecipeByKeyword = (state, {results}) =>
  state.merge({
    searchedRecipesByKeyword: {
      ...state.searchedRecipesByKeyword,
      results
    }
  });

const doSetSearchRecipeKeyword = (state, {keyword}) =>{
  console.log("MEAL REDUCER doSetSearchRecipeKeyword keyword",keyword)
  return state.merge({searchKeyword: keyword});
}

const doTriggerHideActionButtons = state =>
  state.merge({
    hideActionButtonsTrigger: state.hideActionButtonsTrigger === 0 ? 1 : 0
  });

const doUpdateCurrentPlanMealsByTemplate = (state, {id, data}) => {
  let shownMeals = state.currentPlan.shownMeals;
  let newShownMeals = [];
  if (shownMeals?.length > 0) {
    shownMeals.map(shownMealData => {
      const newData = shownMealData.data.map(mealData => {
        if (mealData.template == id) {
          return {
            ...mealData,
            ...data
          };
        }
        return mealData;
      });
      newShownMeals.push({
        ...shownMealData,
        data: newData
      });
    });
  }
  return state.merge({
    currentPlan: {
      ...state.currentPlan,
      shownMeals: newShownMeals
    }
  });
};

const doToggleFilterInSearchResults = (state, {filter}) => {
  let searchFilters = Immutable.asMutable(state.searchFilters, {deep: true});
  if (searchFilters[filter.section]) {
    const itemIndex = searchFilters[filter.section].indexOf(filter.item);

    if (itemIndex >= 0) {
      searchFilters[filter.section].splice(itemIndex, 1);

      if (searchFilters[filter.section].length == 0) {
        delete searchFilters[filter.section];
      }
    } else {
      searchFilters[filter.section].push(filter.item);
    }
  } else {
    searchFilters[filter.section] = [filter.item];
  }
  return state.merge({searchFilters});
};

const doRemoveFilterInSearchResults = (state, {filter}) => {
  let searchFilters = Immutable.asMutable(state.searchFilters, {deep: true});

  if (filter.section) {
    if (searchFilters[filter.section]) {
      delete searchFilters[filter.section];
    }
  }

  if (filter.item) {
    for (let f in searchFilters) {
      if (searchFilters[f]?.length > 0) {
        let itemIndex = searchFilters[f].indexOf(filter.item);

        if (itemIndex >= 0) {
          searchFilters[f].splice(itemIndex, 1);
        }

        if (searchFilters[f].length == 0) {
          delete searchFilters[f];
        }
      }
    }
  }

  return state.merge({searchFilters});
};

const doClearFiltersInSearchResults = state =>
  state.merge({searchFilters: INITIAL_STATE.searchFilters});

const doSetAppliedSearchFilters = state => {
  let appliedSearchFilters = [];

  for (let f in state.searchFilters) {
    if (state.searchFilters[f]?.length > 0) {
      appliedSearchFilters = appliedSearchFilters.concat(
        state.searchFilters[f]
      );
    }
  }

  return state.merge({appliedSearchFilters});
};

const doClearAppliedSearchFilters = state =>
  state.merge({appliedSearchFilters: INITIAL_STATE.appliedSearchFilters});

const doSetUserPreferenceToFilter = state => 
  state.merge({isAttemptingSetUserPreference: true})

const doneSetUserPreferenceToFilter = state => 
  state.merge({isAttemptingSetUserPreference: false})

const doAddToMealPlans = state =>
  state.merge({isAttemptingAddToMealPlans: true});

const doDoneAddToMealPlans = state =>
  state.merge({isAttemptingAddToMealPlans: false});

const doSetPlayingTTS = state =>
  state.merge({isPlayingTTS: true});

const doneSetPlayingTTS = state =>
  state.merge({isPlayingTTS: false});

const doAddIngredientToExcludeFilter = (state, {ingredient}) => {
  let searchResults = Immutable.asMutable(state.searchResults, {deep: true});
  const objIndex = searchResults.findIndex(obj => obj.key === 'excluded_ingredients');
  const ingredientIndex = searchResults[objIndex].items.findIndex(ing => ing === ingredient);
  if(ingredientIndex != -1){
    return state.merge({searchResults})
  }
  const currentIngredients = searchResults[objIndex].items;
  currentIngredients.push(ingredient);
  const updatedObj = { ...searchResults[objIndex], items: currentIngredients};
  console.log("doAddIngredientToExcludeFilter updatedObj",updatedObj);
  return state.merge({searchResults})
}

const HANDLERS = {
  [Actions.Types.ATTEMPT_GET_MEAL_DETAIL]: doGetDetail,
  [Actions.Types.DONE_ATTEMPT_GET_MEAL_DETAIL]: doDoneGetDetail,
  [Actions.Types.SET_MEAL_DETAIL]: doSetDetail,
  [Actions.Types.UPDATE_MEAL_DETAIL]: doUpdateDetail,

  [Actions.Types.ATTEMPT_RATE_MEAL]: doRate,
  [Actions.Types.DONE_ATTEMPT_RATE_MEAL]: doDoneRate,

  [Actions.Types.ATTEMPT_LOG_MEAL]: doLog,
  [Actions.Types.ATTEMPT_LOG_FIRST_MEAL]: doLog,
  [Actions.Types.DONE_ATTEMPT_LOG_MEAL]: doDoneLog,
  [Actions.Types.SET_LOG_MEAL_SUCCESS]: doSetLogSuccess,

  [Actions.Types.ATTEMPT_MOVE_MEAL]: doMove,
  [Actions.Types.DONE_ATTEMPT_MOVE_MEAL]: doDoneMove,

  [Actions.Types.ATTEMPT_GET_CURRENT_MEAL_PLAN]: doGetCurrentPlan,
  [Actions.Types.DONE_ATTEMPT_GET_CURRENT_MEAL_PLAN]: doDoneGetCurrentPlan,
  [Actions.Types.SET_CURRENT_MEAL_PLAN]: doSetCurrentPlan,
  [Actions.Types.UPDATE_CURRENT_MEAL_PLAN]: doUpdateCurrentPlan,
  [Actions.Types.UPDATE_MEAL_IN_CURRENT_MEAL_PLAN]: doUpdateMealInCurrentPlan,

  [Actions.Types.SET_MEAL_PLAN_FILTER_DATE]: doSetFilterDate,

  [Actions.Types.SHOW_THIS_WEEK_MEAL_PLAN]: doShowThisWeekPlan,
  [Actions.Types.SHOW_NEXT_WEEK_MEAL_PLAN]: doShowNextWeekPlan,

  [Actions.Types
    .ATTEMPT_GET_CATEGORIZED_MEAL_TEMPLATES]: doGetCategorizedTemplates,
  [Actions.Types
    .DONE_ATTEMPT_GET_CATEGORIZED_MEAL_TEMPLATES]: doDoneGetCategorizedTemplates,
  [Actions.Types.SET_CATEGORIZED_MEAL_TEMPLATES]: doSetCategorizedTemplates,

  [Actions.Types.ATTEMPT_GET_MEAL_TEMPLATES]: doGetTemplates,
  [Actions.Types.DONE_ATTEMPT_GET_MEAL_TEMPLATES]: doDoneGetTemplates,
  [Actions.Types.SET_MEAL_TEMPLATES]: doSetTemplates,
  [Actions.Types.RESET_MEAL_TEMPLATES]: doResetTemplates,

  [Actions.Types.ATTEMPT_GET_MORE_MEAL_TEMPLATES]: doGetMoreTemplates,
  [Actions.Types.DONE_ATTEMPT_GET_MORE_MEAL_TEMPLATES]: doDoneGetMoreTemplates,
  [Actions.Types.SET_MORE_MEAL_TEMPLATES]: doSetMoreTemplates,

  [Actions.Types.ATTEMPT_GET_MEAL_REPLACEMENTS]: doGetReplacements,
  [Actions.Types.DONE_ATTEMPT_GET_MEAL_REPLACEMENTS]: doDoneGetReplacements,
  [Actions.Types.SET_MEAL_REPLACEMENTS]: doSetReplacements,
  [Actions.Types.RESET_MEAL_REPLACEMENTS]: doResetReplacements,

  [Actions.Types.ATTEMPT_GET_MORE_MEAL_REPLACEMENTS]: doGetMoreReplacements,
  [Actions.Types
    .DONE_ATTEMPT_GET_MORE_MEAL_REPLACEMENTS]: doDoneGetMoreReplacements,
  [Actions.Types.SET_MORE_MEAL_REPLACEMENTS]: doSetMoreReplacements,

  [Actions.Types.ATTEMPT_REPLACE_MEAL]: doReplace,
  [Actions.Types.DONE_ATTEMPT_REPLACE_MEAL]: doDoneReplace,

  [Actions.Types.ATTEMPT_SKIP_MEAL]: doSkip,
  [Actions.Types.DONE_ATTEMPT_SKIP_MEAL]: doDoneSkip,
  [Actions.Types.SET_SKIP_MEAL_SUCCESS]: doSetSkipSuccess,

  [Actions.Types.ATTEMPT_GET_REPEAT_MEAL_DAYS]: doGetRepeatDays,
  [Actions.Types.DONE_ATTEMPT_GET_REPEAT_MEAL_DAYS]: doDoneGetRepeatDays,
  [Actions.Types.SET_REPEAT_MEAL_DAYS]: doSetRepeatDays,

  [Actions.Types.ATTEMPT_REPEAT_MEAL]: doRepeat,
  [Actions.Types.DONE_ATTEMPT_REPEAT_MEAL]: doDoneRepeat,
  [Actions.Types.SET_REPEAT_MEAL_SUCCESS]: doSetRepeatSuccess,

  [Actions.Types.ATTEMPT_BOOKMARK_MEAL]: doBookmark,
  [Actions.Types.DONE_ATTEMPT_BOOKMARK_MEAL]: doDoneBookmark,
  [Actions.Types.SET_BOOKMARK_MEAL_SUCCESS]: doSetBookmarkSuccess,

  [Actions.Types.ATTEMPT_BATCH_MEAL]: doBatch,
  [Actions.Types.DONE_ATTEMPT_BATCH_MEAL]: doDoneBatch,
  [Actions.Types.SET_BATCH_MEAL_SUCCESS]: doSetBatchSuccess,

  [Actions.Types.ATTEMPT_SEARCH_MEALS]: doSearch,
  [Actions.Types.DONE_ATTEMPT_SEARCH_MEALS]: doDoneSearch,
  [Actions.Types.SET_MEAL_SEARCH_RESULTS]: doSetSearchResults,

  [Actions.Types.ATTEMPT_GET_MONTHLY_MEAL_HISTORY]: doGetMonthlyHistory,
  [Actions.Types
    .DONE_ATTEMPT_GET_MONTHLY_MEAL_HISTORY]: doDoneGetMonthlyHistory,
  [Actions.Types.SET_MONTHLY_MEAL_HISTORY]: doSetMonthlyHistory,

  [Actions.Types.ATTEMPT_GET_WEEKLY_MEAL_HISTORY]: doGetWeeklyHistory,
  [Actions.Types.DONE_ATTEMPT_GET_WEEKLY_MEAL_HISTORY]: doDoneGetWeeklyHistory,
  [Actions.Types.SET_WEEKLY_MEAL_HISTORY]: doSetWeeklyHistory,

  [Actions.Types.ATTEMPT_ADJUST_MEAL_PLAN]: doAdjustPlan,
  [Actions.Types.DONE_ATTEMPT_ADJUST_MEAL_PLAN]: doDoneAdjustPlan,
  [Actions.Types.SET_ADJUST_MEAL_PLAN_SUCCESS]: doSetAdjustPlanSuccess,

  [Actions.Types.ATTEMPT_UPDATE_MEAL_TREATS_CONFIG]: doUpdateTreatsConfig,
  [Actions.Types
    .DONE_ATTEMPT_UPDATE_MEAL_TREATS_CONFIG]: doDoneUpdateTreatsConfig,
  [Actions.Types
    .SET_UPDATE_MEAL_TREATS_CONFIG_SUCCESS]: doSetUpdateTreatsConfigSuccess,
  [Actions.Types.SET_MEAL_TREATS_CONFIG]: doSetTreatsConfig,

  [Actions.Types.ATTEMPT_CLEAR_MEAL_TREATS_CONFIG]: doClearTreatsConfig,
  [Actions.Types
    .DONE_ATTEMPT_CLEAR_MEAL_TREATS_CONFIG]: doDoneClearTreatsConfig,

  [Actions.Types.ATTEMPT_HOST_GUESTS_FOR_MEAL]: doHostGuests,
  [Actions.Types.DONE_ATTEMPT_HOST_GUESTS_FOR_MEAL]: doDoneHostGuests,
  [Actions.Types.SET_HOST_GUESTS_FOR_MEAL_SUCCESS]: doSetHostGuestsSuccess,

  [Actions.Types.ATTEMPT_REMOVE_GUESTS_FROM_MEAL]: doRemoveGuests,
  [Actions.Types.DONE_ATTEMPT_REMOVE_GUESTS_FROM_MEAL]: doDoneRemoveGuests,
  [Actions.Types.SET_REMOVE_GUESTS_FROM_MEAL_SUCCESS]: doSetRemoveGuestsSuccess,

  [Actions.Types.TRIGGER_HIDE_ACTION_BUTTONS]: doTriggerHideActionButtons,

  [Actions.Types.ATTEMPT_SEARCH_RECIPE_BY_KEYWORD]: doSearchRecipeByKeyword,
  [Actions.Types
    .DONE_ATTEMPT_SEARCH_RECIPE_BY_KEYWORD]: doDoneSearchRecipeByKeyword,
  [Actions.Types
    .SET_RESULTS_FOR_SEARCH_RECIPE_BY_KEYWORD]: doSetResultsForSearchRecipeByKeyword,
  [Actions.Types.SET_SEARCH_RECIPE_KEYWORD]: doSetSearchRecipeKeyword,

  [Actions.Types
    .UPDATE_CURRENT_MEAL_PLAN_BY_TEMPLATE]: doUpdateCurrentPlanMealsByTemplate,

  [Actions.Types.TOGGLE_FILTER_IN_SEARCH_MEALS]: doToggleFilterInSearchResults,
  [Actions.Types.REMOVE_FILTER_IN_SEARCH_MEALS]: doRemoveFilterInSearchResults,
  [Actions.Types.CLEAR_FILTERS_IN_SEARCH_MEALS]: doClearFiltersInSearchResults,

  [Actions.Types.SET_APPLIED_SEARCH_FILTERS]: doSetAppliedSearchFilters,
  [Actions.Types.CLEAR_APPLIED_SEARCH_FILTERS]: doClearAppliedSearchFilters,

  [Actions.Types.SET_USER_PREFERENCE_TO_FILTER]:  doSetUserPreferenceToFilter,
  [Actions.Types.DONE_SET_USER_PREFERENCE_TO_FILTER]:  doneSetUserPreferenceToFilter,

  [Actions.Types.ATTEMPT_ADD_TO_MEAL_PLANS]: doAddToMealPlans,
  [Actions.Types.DONE_ATTEMPT_ADD_TO_MEAL_PLANS]: doDoneAddToMealPlans,

  [Actions.Types.ADD_INGREDIENT_TO_EXCLUDE_FILTER]: doAddIngredientToExcludeFilter,

  [Actions.Types.ATTEMPT_SAVE_MEAL_NOTES]: doSaveMealNotes,
  [Actions.Types.DONE_ATTEMPT_SAVE_MEAL_NOTES]: doDoneSaveMealNotes,

  [Actions.Types.SET_PLAYING_TTS]: doSetPlayingTTS,
  [Actions.Types.DONE_PLAYING_TTS]: doneSetPlayingTTS,
};

export default createReducer(INITIAL_STATE, HANDLERS);
