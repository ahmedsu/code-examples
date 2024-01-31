export default {
  attemptGetMealDetail: ['id', 'template_id'],
  doneAttemptGetMealDetail: null,
  setMealDetail: ['detail'],
  updateMealDetail: ['detail'],

  attemptRateMeal: ['payload'],
  doneAttemptRateMeal: null,

  attemptLogMeal: ['payload'],
  doneAttemptLogMeal: null,
  setLogMealSuccess: ['response'],

  attemptMoveMeal: ['payload'],
  doneAttemptMoveMeal: null,

  attemptBookmarkMeal: ['payload'],
  doneAttemptBookmarkMeal: null,
  setBookmarkMealSuccess: ['response'],

  attemptBatchMeal: ['payload'],
  doneAttemptBatchMeal: null,
  setBatchMealSuccess: ['response'],

  attemptGetCurrentMealPlan: ['payload'],
  doneAttemptGetCurrentMealPlan: null,
  setCurrentMealPlan: ['currentPlan'],
  updateCurrentMealPlan: ['data'],
  updateMealInCurrentMealPlan: ['meal_id', 'data'],

  setMealPlanFilterDate: ['from', 'to'],

  showThisWeekMealPlan: null,
  showNextWeekMealPlan: null,

  attemptGetMonthlyMealHistory: ['payload'],
  doneAttemptGetMonthlyMealHistory: null,
  setMonthlyMealHistory: ['history'],

  attemptGetWeeklyMealHistory: ['payload'],
  doneAttemptGetWeeklyMealHistory: null,
  setWeeklyMealHistory: ['history'],

  attemptGetCategorizedMealTemplates: ['payload'],
  doneAttemptGetCategorizedMealTemplates: [],
  setCategorizedMealTemplates: ['templates'],

  attemptGetMealTemplates: ['payload'],
  doneAttemptGetMealTemplates: [],
  setMealTemplates: ['templates'],
  resetMealTemplates: null,

  attemptGetMoreMealTemplates: ['payload'],
  doneAttemptGetMoreMealTemplates: [],
  setMoreMealTemplates: ['templates'],

  attemptGetMealReplacements: ['payload'],
  doneAttemptGetMealReplacements: null,
  setMealReplacements: ['replacements'],
  resetMealReplacements: null,

  attemptGetMoreMealReplacements: ['payload'],
  doneAttemptGetMoreMealReplacements: [],
  setMoreMealReplacements: ['replacements'],

  attemptReplaceMeal: ['payload'],
  doneAttemptReplaceMeal: null,

  attemptSkipMeal: ['payload'],
  doneAttemptSkipMeal: null,
  setSkipMealSuccess: null,

  attemptGetRepeatMealDays: ['payload'],
  doneAttemptGetRepeatMealDays: null,
  setRepeatMealDays: ['days'],

  attemptRepeatMeal: ['payload'],
  doneAttemptRepeatMeal: null,
  setRepeatMealSuccess: null,

  attemptSearchMeals: ['payload'],
  doneAttemptSearchMeals: null,
  setMealSearchResults: ['list'],

  attemptSearchRecipeByKeyword: ['keyword'],
  doneAttemptSearchRecipeByKeyword: null,
  setResultsForSearchRecipeByKeyword: ['results'],
  setSearchRecipeKeyword: ['keyword'],

  getMealTemplatesByRecipeAndFilters: ['params'],

  toggleFilterInSearchMeals: ['filter'],
  removeFilterInSearchMeals: ['filter'],
  clearFiltersInSearchMeals: null,

  attemptApplySearchFilters: ['sourceRoute'],
  setAppliedSearchFilters: null,
  clearAppliedSearchFilters: null,

  attemptAdjustMealPlan: ['payload'],
  doneAttemptAdjustMealPlan: null,
  setAdjustMealPlanSuccess: null,

  attemptUpdateMealTreatsConfig: ['payload'],
  doneAttemptUpdateMealTreatsConfig: null,
  setUpdateMealTreatsConfigSuccess: null,
  setMealTreatsConfig: ['config'],

  attemptClearMealTreatsConfig: null,
  doneAttemptClearMealTreatsConfig: null,

  attemptHostGuestsForMeal: ['payload'],
  doneAttemptHostGuestsForMeal: null,
  setHostGuestsForMealSuccess: ['response'],

  attemptRemoveGuestsFromMeal: ['payload'],
  doneAttemptRemoveGuestsFromMeal: null,
  setRemoveGuestsFromMealSuccess: ['response'],

  attemptSocialShareMeal: null,

  triggerHideActionButtons: null,

  updateCurrentMealPlanByTemplate: ['id', 'data'],
  setUserPreferenceToFilter: null,
  doneSetUserPreferenceToFilter: null,

  attemptAddToMealPlans: ['payload'],
  doneAttemptAddToMealPlans: null,
  addIngredientToExcludeFilter : ['ingredient'],

  attemptSaveMealNotes: ['payload'],
  doneAttemptSaveMealNotes: null,

  attemptLogFirstMeal: ['payload'],
  setPlayingTTS: null,
  donePlayingTTS: null,
};
