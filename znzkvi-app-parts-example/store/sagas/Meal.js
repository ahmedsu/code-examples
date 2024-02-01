import {takeLatest, put, call, select, all} from 'redux-saga/effects';
import Actions from '@actions';
import * as API from '@api';
import {Highlights, Events, Routes, Tag} from '@config';
import {getCurrentDate, logConsole, getNextURL, convertTime} from '@utils';
import {goBack, navigate} from '@services';
import {logEvent, postRecipeFeedbackResponse} from '@lib';
import moment from 'moment';
import Immutable from 'seamless-immutable';

function* getDetail({id, template_id}) {
  try {
    yield put(Actions.Creators.showVeil());

    let res = null;
    let mealNotesRes = null;
    logConsole('getDetail params',{id, template_id});

    if (template_id) {
      logConsole('IS TRYING TO GET MEAL TEMPLATE');

      res = yield call(API.getMealTemplateDetail, template_id);
      mealNotesRes = yield call(API.getRecipeNotes, template_id)

      logConsole('GET MEAL TEMPLATE DETAIL RESPONSE STATUS!!!\n\n', res.status);
      logConsole(
        'GET MEAL TEMPLATE DETAIL RESPONSE DATA!!!\n\n',
        res.data);
    } else {
      res = yield call(API.getMealDetail, id);
      logConsole('GET MEAL DETAIL RESPONSE STATUS!!!\n\n', res.status);
      mealNotesRes = yield call(API.getRecipeNotes, res.data.data.template)
      logConsole('GET MEAL DETAIL RESPONSE DATA!!!\n\n', res.data);
    }

    if (res.status == 200) {
      const DELIMETER = '\r\n';      
      const allow_log = res.data.data.date == getCurrentDate() && res.data.data.template !== undefined;      
      const splitted = res.data.data.instructions.split('Notes');

      let instructions = [], instructions_v2 = [], notes = [], meal_notes = {};

      splitted[0].split(DELIMETER).map((instruction, index) => {
        if (instruction) {
          instructions.push({
            title: `Step ${index + 1}`,
            description: instruction.slice(3)
          });
        }
      });

      if (splitted[1]) {
        splitted[1].split(DELIMETER).map((note, index) => {
          if (note) {
            notes.push(note);
          }
        });
      }

      if(mealNotesRes.status == 200){
        if(mealNotesRes.data.data.count > 0){
          meal_notes = mealNotesRes.data.data.results[0];
        }
      }

      res.data.data.instructions_v2.map((step) =>{
        let ingredients = [], kitchen_tools = [];
        step.ingredients.split(`\n`).map((ingredient) =>{
          ingredients.push(ingredient)
        })
        step.kitchen_tools.split(`\n`).map((tool) =>{
          if(tool != ""){
            kitchen_tools.push(tool)
          }
        })
        instructions_v2.push({...step,ingredients,kitchen_tools})
      })

      /*let kitchen_tools = []

            if(Array.isArray(res.data.data.kitchen_tools)) {
                res.data.data.kitchen_tools.map(tool => {
                    if(tool) {
                        kitchen_tools.push({name: tool})
                    }
                })
            }*/

      let utensils = [];

      if (res.data.data.utensils) {
        res.data.data.utensils.split(DELIMETER).map(tool => {
          if (tool) {
            utensils.push({name: tool});
          }
        });
      }

      let cooking_pages = []
      
       
        let firstPage = {};

        if(res.data.data.components){
          let recipeComponents = [];
          const components = res.data.data.components;
          components.map((component) => {
            component.ingredients.map((ingredient) => {
              recipeComponents.push(ingredient)
            })
          })
          firstPage = {page:0, components:recipeComponents, utensils, servings:res.data.data.servings}
          cooking_pages.push(firstPage);
        }
        let steppers = res.data.data[allow_log ? 'template_detailed_instructions':'detailed_instructions'] ? instructions_v2 : instructions ;
        steppers.map((data) =>{
          let formattedTime = "";
          if(data.time_seconds){
            if(data.time_seconds >= 60){
              let minutes = convertTime(data.time_seconds,'s','min')
              let sec = convertTime((minutes % 1).toFixed(4),'min','s'); 
              formattedTime = `${Math.floor(minutes)} minute/s` +  (Math.floor(sec) > 0 ? ` ${Math.floor(sec)} second/s` : "");
              if(minutes >= 60){
                let hours = convertTime(data.time_seconds,'s','h')
                let mins = convertTime((hours % 1).toFixed(4), 'h','min'); 
                formattedTime = `${Math.floor(hours)} hours ` +  (Math.floor(mins) > 0 ? ` ${Math.floor(mins)} minutes` : "" );
              }
            }else{
              formattedTime =`${data.time_seconds} seconds`;
            }
          }
          data.formattedTime = formattedTime;
          cooking_pages.push({page:cooking_pages.length, step:data})
        })

      yield put(
        Actions.Creators.setMealDetail({
          ...res.data.data,
          is_template: res.data.data.template === undefined,
          instructions,
          instructions_v2,
          notes,
          utensils,
          //kitchen_tools,
          meal_notes,
          cooking_pages,
          allow_log
        })
      );
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetMealDetail());
  yield put(Actions.Creators.hideVeil());
}

function* rate({payload}) {
  try {
    logConsole('RATE MEAL PAYLOAD!!!\n\n', payload);

    const state = yield select();

    const res = yield call(API.rateMeal, payload);

    logConsole('RATE MEAL RESPONSE STATUS!!!\n\n', res.status);
    logConsole('RATE MEAL RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 201) {
      yield call(logEvent, Events.meal_rate, {
        rating: res.data.data.rating
      });

      yield put(
        Actions.Creators.updateMealDetail({rating: res.data.data.rating})
      );

      let todayUpcomingMeals = Immutable.asMutable(
        state.user.todayUpcomingMeals,
        {deep: true}
      );
      todayUpcomingMeals.meals = todayUpcomingMeals.meals.map(m => {
        if (m.id == payload.id) {
          m.rating = res.data.data.rating;
        }

        return m;
      });
      yield put(Actions.Creators.setTodayUpcomingMealsData(todayUpcomingMeals));

      let todayDashboard = Immutable.asMutable(state.user.todayDashboard, {
        deep: true
      });
      todayDashboard.meals = todayDashboard.meals.map(m => {
        if (m.id == payload.id) {
          m.rating = res.data.data.rating;
        }

        return m;
      });
      yield put(Actions.Creators.setTodayDashboardData(todayDashboard));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptRateMeal());
}

function* log({payload}) {
  try {
    logConsole('LOG MEAL PAYLOAD!!!\n\n', payload);

    const state = yield select();

    const logRes = yield call(API.patchMeal, payload.id, {
      completed: true
    });

    const rateRes = yield call(API.rateMeal, {
      id: payload.id,
      rating: payload.rating
    });

    logConsole('LOG MEAL RESPONSE STATUS!!!\n\n', logRes.status);
    logConsole('LOG MEAL RESPONSE DATA!!!\n\n', logRes.data);

    logConsole('RATE MEAL RESPONSE STATUS!!!\n\n', rateRes.status);
    logConsole('RATE MEAL RESPONSE DATA!!!\n\n', rateRes.data);

    if (logRes.status == 200 && rateRes.status == 201) {
      yield call(logEvent, Events.meal_log);

      if (payload.rating !== null) {
        yield call(logEvent, Events.meal_rate, {
          rating: payload.rating
        });
        const feedbackRes = yield call(postRecipeFeedbackResponse, payload.name, payload.rating, payload.comment)
        logConsole('RATE MEAL RESPONSE DATA feedbackRes!!!\n\n', feedbackRes);
      }

      if (state.meal.detail) {
        yield put(
          Actions.Creators.setMealDetail({
            ...state.meal.detail,
            completed: true
          })
        );
      }

      yield put(
        Actions.Creators.updateMealInCurrentMealPlan(payload.id, {
          completed: true,
          rating: payload.rating
        })
      );
      yield put(Actions.Creators.removeMealFromUpcomingMeals(payload.id));
      /*yield put(Actions.Creators.increaseTodayDashboardHighlights([
                Highlights.meal_streak.key,
                Highlights.meals_logged.key,
                Highlights.total_points.key
            ]))*/
      yield put(Actions.Creators.setLogMealSuccess(logRes.data.data));

      yield put(Actions.Creators.attemptGetTodayDashboard());
      yield put(Actions.Creators.attemptGetUserProfile());
      if(payload.returnPage){
        navigate(payload.returnPage)
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptLogMeal());
}

function* move({payload}) {
  try {
    logConsole('MOVE MEAL PAYLOAD!!!\n\n', payload);

    const state = yield select();

    const res = yield call(API.patchMeal, payload.id, {
      date: payload.date
    });

    logConsole('MOVE MEAL RESPONSE STATUS!!!\n\n', res.status);
    logConsole('MOVE MEAL RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let mealPlan = Immutable.asMutable(state.meal.currentPlan, {deep: true});

      mealPlan.weeks = mealPlan.weeks.map(p => {
        return p.map(pp => {
          pp.data = pp.data.filter(m => m.id != payload.id);

          return pp;
        });
      });

      mealPlan.shownMeals = mealPlan.shownMeals.map(p => {
        p.data = p.data.filter(m => m.id != payload.id);

        return p;
      });

      yield put(Actions.Creators.setCurrentMealPlan(mealPlan));

      yield put(Actions.Creators.attemptGetTodayDashboard());
      yield put(Actions.Creators.attemptGetTodayUpcomingMeals());
    }
  } catch (err) {}

  yield put(Actions.Creators.closeSheetDialogs());
  yield put(Actions.Creators.doneAttemptMoveMeal());
}

function* getCurrentPlan({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    const state = yield select();

    logConsole('CURRENT MEAL PLAN PAYLOAD!!!\n\n', payload);

    const params = {
      from: payload.from,
      days: payload.from ? 1 : undefined
    };

    logConsole('CURRENT MEAL PLAN PARAMS!!!\n\n', params);

    const res = yield call(API.getCurrentMealPlan, params);
    const treatsConfigRes = yield call(API.getMealTreatsConfig);
    const mealScheduleRes = yield call(API.getUserMealSchedule);

    logConsole('CURRENT MEAL PLAN RESPONSE STATUS!!!\n\n', res.status);
    logConsole('CURRENT MEAL PLAN RESPONSE DATA!!!\n\n', res.data);

    logConsole(
      'GET MEAL TREATS CONFIG RESPONSE STATUS!!!\n\n',
      treatsConfigRes.status
    );
    logConsole(
      'GET MEAL TREATS CONFIG RESPONSE DATA!!!\n\n',
      treatsConfigRes.data
    );

    logConsole(
      'GET USER MEAL NOTIFICATION SETTINGS RESPONSE STATUS!!!\n\n',
      mealScheduleRes.status
    );
    logConsole(
      'GET USER MEAL NOTIFICATION SETTINGS RESPONSE DATA!!!\n\n',
      mealScheduleRes.data
    );

    if (res.status == 200) {
      let mealPlan = {
        from: payload.from ? state.meal.currentPlan.from : res.data.data.from,
        to: payload.from ? state.meal.currentPlan.to : res.data.data.to,
        hasNextWeek: payload.from
          ? state.meal.currentPlan.from
          : res.data.data.meal_weeks.length > 1,
        weeks: [],
        shownMeals: [],
        dates: []
      };

      if (res.data.data.meal_weeks.length > 0) {
        mealPlan.from = res.data.data.meal_weeks[0].from;

        mealPlan.dates.push({
          from: mealPlan.from,
          to: res.data.data.meal_weeks[0].to
        });

        if (res.data.data.meal_weeks[1]) {
          mealPlan.dates.push({
            from: res.data.data.meal_weeks[1].from,
            to: res.data.data.meal_weeks[1].to
          });
        }
      }

      res.data.data.meal_weeks.map(mealWeek => {
        let week = [];

        for (let mwd in mealWeek.days) {
          week.push({
            rawDate: mwd,
            day: moment(mwd).format('dddd'),
            date: moment(mwd).format('dddd, MMM DD'),
            data: mealWeek.days[mwd]
          });
        }

        mealPlan.weeks.push(week);
      });

      if (mealPlan.weeks.length > 0) {
        if (!state.meal.isNextWeekPlanShown) {
          mealPlan.shownMeals = mealPlan.weeks[0];
        } else {
          if (mealPlan.weeks[1]) {
            mealPlan.shownMeals = mealPlan.weeks[1];
          }
        }
      }

      yield put(
        Actions.Creators.updateUserData({
          meal_schedule: mealScheduleRes.data.data
        })
      );

      yield put(Actions.Creators.setCurrentMealPlan(mealPlan));

      yield put(
        Actions.Creators.setMealPlanFilterDate(state.meal.planDateFilter.from)
      );

      yield put(
        Actions.Creators.setMealTreatsConfig(treatsConfigRes.data.data.results)
      );
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetCurrentMealPlan());
  yield put(Actions.Creators.hideVeil());
}

function* getCategorizedTemplates({payload}) {
  try {
    yield put(Actions.Creators.showVeil());
    
    const state = yield select();

    let finalPayload = {
      ...payload
    };

    if (
      Object.keys(state.meal.searchFilters).length > 0
    ) {
      finalPayload.extras = [];
      logConsole('GET CATEGORIZED MEAL TEMPLATES state.meal.searchFilters!!!\n\n', state.meal.searchFilters);

      for (let f in state.meal.searchFilters) {
        finalPayload.extras.push(
          `${f.toLowerCase()}=${state.meal.searchFilters[f].join(',')}`
        );
      }
    }
    console.log('GET CATEGORIZED MEAL TEMPLATES finalPayload!!!\n\n', finalPayload);
    const res = yield call(API.searchRecipe, finalPayload);

    logConsole(
      'GET CATEGORIZED MEAL TEMPLATES RESPONSE STATUS!!!\n\n',
      res.status
    );
    console.log('GET CATEGORIZED MEAL TEMPLATES RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let templates = [];
      let finalResult = res; 
      // logConsole('GET CATEGORIZED MEAL TEMPLATES!!!\n\n', templates);
      // if(res.data.data?.unlocked_category != null) {
      //   logConsole('GET CATEGORIZED MEAL res.data.data?.unlocked_category!!!\n\n', res.data.data?.unlocked_category);
      //   finalResult = yield call(API.searchRecipe,{q:""});
      // }

      finalResult.data.data.categories.map(c => {
        if(c.meals.length > 0){
          templates.push({
            name: c.name,
            data: [c.meals.splice(0,2)]
          });
        }
      });

      console.log('GET CATEGORIZED MEAL TEMPLATES!!!\n\n', templates);
      yield put(Actions.Creators.setCategorizedMealTemplates(templates));
      // if(res.data.data?.unlocked_category != null) {
      //   yield put(Actions.Creators.showToastMessage("SecretCategory"));
      // }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetCategorizedMealTemplates());
  yield put(Actions.Creators.hideVeil());
}

function* getTemplates({payload}) {
  try {
    yield put(Actions.Creators.showVeil());
    const state = yield select();
    const isSeeAll = payload.category == "See All";

    let finalPayload = {
      ...payload
    };

    if (
      Object.keys(state.meal.searchFilters).length > 0
    ) {
      finalPayload.extras = [];

      for (let f in state.meal.searchFilters) {
        finalPayload.extras.push(
          `${f.toLowerCase()}=${state.meal.searchFilters[f].join(',')}`
        );
      }
    }

    if(isSeeAll){
      delete finalPayload.category;
    }

    const res = yield call(API.searchRecipe,finalPayload)

    logConsole('GET MEAL TEMPLATES RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET MEAL TEMPLATES RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let finalResult = res;

      if(res.data.data?.unlocked_category != null) {
        const secretPayload = {category: res.data.data?.unlocked_category, q: null}
        finalPayload = {...finalPayload,...secretPayload};
        finalResult = yield call(API.searchRecipe,finalPayload);
        if(payload.source == Routes.browseMeals){
          console.log("RELOAD BROWSE MEALS")
          yield put(Actions.Creators.attemptGetCategorizedMealTemplates({q:null}));
        }else if(payload.source == Routes.replaceMeals){
          console.log("RELOAD REPLACE MEALS")
          yield put(Actions.Creators.attemptGetMealReplacements({q:null}));
        }
      }

      if(payload.source == Routes.addIngredients){
        yield put(Actions.Creators.addToFirstRecipe({mealsFound:finalResult.data.data.count}))
      }

      let templates = {
        categories:[],
        next: getNextURL(finalResult.data.data.next),
        list: []
      };

      if (finalResult.data.data.categories) {
        if(!isSeeAll){
          finalResult.data.data.categories.map(c => {
            if(c.meals.length > 0){
              templates.categories.push({
                name: c.name,
                data: [c.meals]
              });
            }
          });
        }
      }
      if (finalResult.data.data.results) {
        finalResult.data.data.results.map(r => {
          templates.list.push(r);
        });
      }
      console.log('GET MEAL TEMPLATES SET TEMPALTE!!!\n\n', templates);
      if (res.data.data?.unlocked_category != null) {
        yield put(Actions.Creators.showToastMessage("SecretCategory"));
      }

      yield put(Actions.Creators.setMealTemplates(templates));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetMealTemplates());
  yield put(Actions.Creators.hideVeil());
}

function* getMoreTemplates({payload}) {
  try {
    logConsole('GET MORE MEAL TEMPLATES PAYLOAD!!!\n\n', payload);

    const state = yield select();
    
    const {templates} = state.meal;
    const isSeeAll = payload.category == "See All";

    logConsole('GET MORE MEAL TEMPLATES CURRENT TEMPLATES!!!\n\n', templates);

    // const res = yield call(
    //   payload.q ? API.searchRecipe : API.getMealTemplates,
    //   payload
    // );
    
    const res = yield call(API.searchRecipe,payload);

    logConsole('GET MORE MEAL TEMPLATES RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET MORE MEAL TEMPLATES RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let moreTemplates = {
        categories:[],
        next: getNextURL(res.data.data.next),
        list: []
      };
      if (res.data.data.categories) {
        if(!isSeeAll){
          res.data.data.categories.map(c => {
            if(c.meals.length > 0){
              moreTemplates.categories.push({
                name: c.name,
                data: [c.meals]
              });
            }
          });
        }
      }
      if (res.data.data.results) {
        res.data.data.results.map(r => {
          moreTemplates.list.push(r);
        });
      }

      // if (res.data.data.categories) {
      //   res.data.data.categories.map(c => {
      //     moreTemplates.list.push(...c.meals);
      //   });
      // } else if (res.data.data.results) {
      //   res.data.data.results.map(r => {
      //     moreTemplates.list.push(r);
      //   });
      // }
      logConsole('GET MORE MEAL TEMPLATES NEW TEMPLATES!!!\n\n', moreTemplates);

      yield put(Actions.Creators.setMoreMealTemplates(moreTemplates));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetMoreMealTemplates());
}

function* getReplacements({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    const state = yield select();

    let finalPayload = {
      ...payload
    };
    if (
      Object.keys(state.meal.searchFilters).length > 0
    ) {
      finalPayload.extras = [];

      for (let f in state.meal.searchFilters) {
        finalPayload.extras.push(
          `${f.toLowerCase()}=${state.meal.searchFilters[f].join(',')}`
        );
      }
    }

    logConsole('GET MEAL REPLACEMENTS payload categories!!!\n\n', payload.category);
    logConsole('GET MEAL REPLACEMENTS PAYLOAD!!!\n\n', finalPayload, true);

    // const res = yield call(
    //   state.meal.searchKeyword != '' ? API.searchRecipe : API.getMealTemplates,
    //   finalPayload
    // );
    const res = yield call(API.searchRecipe, finalPayload);

    logConsole('GET MEAL REPLACEMENTS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET MEAL REPLACEMENTS RESPONSE DATA!!!\n\n', res.data);

    
    if (res.status == 200) {
      let replacements = [];
      let finalResult = res; 
      // if(res.data.data?.unlocked_category != null) {
      //   logConsole('GET MEAL REPLACEMENTS res.data.data?.unlocked_category!!!\n\n', res.data.data?.unlocked_category);
      //   finalResult = yield call(API.searchRecipe,{q:""});
      // }
      if (finalResult.data.data.categories) {
        finalResult.data.data.categories.map(c => {
          if(c.meals.length > 0){
            replacements.push({
              name: c.name,
              next: getNextURL(finalResult.data.data.next),
              data: [c.meals]
            });
          }
        });;
      }

      // else if (res.data.data.results) {
      //   res.data.data.results.map(r => {
      //     replacements.list.push(r);
      //   });
      // }

      logConsole('GET MEAL REPLACEMENTS replacements!!!\n\n', replacements);
      yield put(Actions.Creators.setMealReplacements(replacements));
      // if(res.data.data?.unlocked_category != null) {
      //   yield put(Actions.Creators.showToastMessage("SecretCategory"));
      // }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetMealReplacements());
  yield put(Actions.Creators.hideVeil());
}

function* getMoreReplacements({payload}) {
  try {
    const state = yield select();
    logConsole('GET MORE MEAL REPLACEMENTS PAYLOAD!!!\n\n', payload);

    const {replacements} = state.meal;

    const res = yield call(API.searchRecipe, payload);

    logConsole('GET MORE MEAL REPLACEMENTS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET MORE MEAL REPLACEMENTS RESPONSE DATA!!!\n\n', res.data);
    logConsole('GET MORE MEAL REPLACEMENTS CURRENT REPLACEMENT DATA!!!\n\n', replacements);

    if (res.status == 200) {
      let moreReplacements = [];
      let currentReplacements = replacements[0];

      if (res.data.data.categories) {
        res.data.data.categories.map(c => {
          if(c.name == currentReplacements.name){
            moreReplacements.push({
              name: c.name,
              next: getNextURL(res.data.data.next),
              data: [c.meals]
            });
          }
        });
        moreReplacements[0].data[0] = [...currentReplacements.data[0], ...moreReplacements[0].data[0]];
      }
    // const res = yield call(
    //   payload.q ? API.searchRecipe : API.getMealTemplates,
    //   payload
    // );

    // logConsole('GET MORE MEAL REPLACEMENTS RESPONSE STATUS!!!\n\n', res.status);
    // logConsole('GET MORE MEAL REPLACEMENTS RESPONSE DATA!!!\n\n', res.data);

    // if (res.status == 200) {
    //   let replacements = {
    //     next: getNextURL(res.data.data.next),
    //     list: []
    //   };

    //   if (res.data.data.categories) {
    //     res.data.data.categories.map(c => {
    //       replacements.list.push(...c.meals);
    //     });
    //   } else if (res.data.data.results) {
    //     res.data.data.results.map(r => {
    //       replacements.list.push(r);
    //     });
    //   }

      logConsole('GET MORE MEAL REPLACEMENTS moreReplacements!!!\n\n', moreReplacements);
      yield put(Actions.Creators.setMealReplacements(moreReplacements));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetMoreMealReplacements());
}

function* replace({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('REPLACE MEAL PAYLOAD!!!\n\n', payload);

    const state = yield select();

    const res = yield call(API.patchMeal, payload.id, {
      swap_meal_id: payload.swap_meal_id
    });

    logConsole('REPLACE MEAL RESPONSE STATUS!!!\n\n', res.status);
    logConsole('REPLACE MEAL RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      if(payload.redirectPage){
        yield put(Actions.Creators.attemptGetCurrentMealPlan({}));
        yield put(Actions.Creators.attemptGetTodayDashboard());
        yield put(Actions.Creators.attemptGetTodayUpcomingMeals());

        navigate(payload.redirectPage);
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptReplaceMeal());
  yield put(Actions.Creators.hideVeil());
}

function* skip({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('SKIP MEAL PAYLOAD!!!\n\n', payload);

    const res = yield call(API.patchMeal, payload.id, {
      skipped: true
    });

    logConsole('SKIP MEAL RESPONSE STATUS!!!\n\n', res.status);
    logConsole('SKIP MEAL RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(
        Actions.Creators.updateMealInCurrentMealPlan(payload.id, {
          skipped: true
        })
      );
      yield put(Actions.Creators.removeMealFromUpcomingMeals(payload.id));
      //yield put(Actions.Creators.increaseTodayDashboardHighlights([Highlights.meal_streak.key]))
      yield put(Actions.Creators.setSkipMealSuccess());

      yield put(Actions.Creators.attemptGetTodayDashboard());
      yield put(Actions.Creators.attemptGetUserProfile());

      yield call(logEvent, Events.meal_skip);
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptSkipMeal());
  yield put(Actions.Creators.hideVeil());
}

function* getRepeatDays({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('GET REPEAT MEAL DAYS PAYLOAD!!!\n\n', payload);

    const res = yield call(API.getMealRepeatDays, {
      meal_position: payload.meal_position
    });

    logConsole('GET REPEAT MEAL DAYS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET REPEAT MEAL DAYS RESPONSE DATA!!!\n\n', res.data, true);

    if (res.status == 200) {
      const days = res.data.data.results.filter(
        r => r.template === payload.templateId
      );
      yield put(Actions.Creators.setRepeatMealDays(days));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetRepeatMealDays());
  yield put(Actions.Creators.hideVeil());
}

function* repeat({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('REPEAT MEAL PAYLOAD!!!\n\n', payload);

    const state = yield select();

    let removedIds = [];

    let {meal_position, days, template} = payload;

    if (state.meal.repeat.days?.length > 0) {
      state.meal.repeat.days.map(c => {
        let index = days.indexOf(c.day_of_week);

        if (index < 0) {
          removedIds.push(c.id);
        } else {
          days.splice(index, 1);
        }
      });
    }

    if (days?.length > 0) {
      for (let i = 0; i <= days.length - 1; i++) {
        let updateRepeatMealRes = yield call(API.updateMealRepeatDays, {
          meal_position,
          day_of_week: days[i],
          template
        });
        logConsole('REPEAT MEAL UPDATE MEALS RES!!!\n\n', updateRepeatMealRes);
      }
    }

    if (removedIds.length > 0) {
      for (let i = 0; i <= removedIds.length - 1; i++) {
        let removeRepeatMealRes = yield call(API.removeMealRepeatDays, removedIds[i]);
        logConsole('REPEAT MEAL REMOVE MEALS RES!!!\n\n', removeRepeatMealRes);
      }
    }

    if (days?.length > 0 || removedIds.length > 0) {
      yield put(Actions.Creators.attemptGetCurrentMealPlan({}));
      yield put(Actions.Creators.setRepeatMealSuccess());
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptRepeatMeal());
  yield put(Actions.Creators.hideVeil());
}

function* bookmark({payload}) {
  try {
    //yield put(Actions.Creators.showVeil())

    logConsole('BOOKMARK MEAL PAYLOAD!!!\n\n', payload);

    const state = yield select();

    const res = yield call(API.bookmarkMeal, payload.template);

    logConsole('BOOKMARK MEAL RESPONSE STATUS!!!\n\n', res.status);
    logConsole('BOOKMARK MEAL RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 201) {
      yield put(
        Actions.Creators.updateMealInTodayAndUpcomingMealsByTemplate(
          payload.template,
          {
            bookmarked: res.data.data.bookmarked
          }
        )
      );

      // update current meal plan meals
      yield put(
        Actions.Creators.updateCurrentMealPlanByTemplate(payload.template, {
          bookmarked: res.data.data.bookmarked
        })
      );

      yield put(
        Actions.Creators.setBookmarkMealSuccess({
          ...res.data.data,
          template: payload.template
        })
      );

      yield put(Actions.Creators.updateMealDetail(res.data.data));

      yield call(logEvent, Events.meal_bookmark);
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptBookmarkMeal());
  //yield put(Actions.Creators.hideVeil())
}

function* batch({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('BATCH MEAL PAYLOAD!!!\n\n', payload, true);

    const res = yield call(API.batchMeal, payload);

    logConsole('BATCH MEAL RESPONSE STATUS!!\n\n', res.status);
    logConsole('BATCH MEAL RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200 || res.status == 201) {
      yield put(Actions.Creators.attemptGetAllUpcomingMeals())
      yield put(Actions.Creators.attemptGetCurrentMealPlan({}))
      goBack();
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptBatchMeal());
  yield put(Actions.Creators.hideVeil());
}

function* searchMeals({payload}) {
  try {
    const res = yield call(API.searchMeals);

    logConsole('SEARCH MEALS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('SEARCH MEALS RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let results = [];

      for (let r in res.data.data) {
        results.push({
          section: res.data.data[r].label,
          key: res.data.data[r].key,
          items: res.data.data[r].values
        });
      }
      logConsole('SEARCH MEALS results!!!\n\n', results);

      yield put(Actions.Creators.setMealSearchResults(results));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptSearchMeals());
}

function* applySearchFilters({sourceRoute}) {
  try {
    console.log("applySearchFilters",sourceRoute)
    yield put(Actions.Creators.setAppliedSearchFilters());
    navigate(sourceRoute);
  } catch (err) {}
}

function* searchRecipeByKeyword({keyword}) {
  try {
    const state = yield select();
    let payload = {};

    logConsole('SEARCH RECIPE BY KEYWORD state.meal.searchFilters!!!\n\n', state.meal.searchFilters);
    if (
      Object.keys(state.meal.searchFilters).length > 0
    ) {
      payload.extras = [];

      for (let f in state.meal.searchFilters) {
        payload.extras.push(
          `${f.toLowerCase()}=${state.meal.searchFilters[f].join(',')}`
        );
      }
    }
    logConsole('SEARCH RECIPE BY KEYWORD PAYLOAD!!!\n\n', payload);
    const res = yield call(API.searchRecipeByKeyword, keyword, payload);

    logConsole('SEARCH RECIPE BY KEYWORD RESPONSE STATUS!!!\n\n', res.status);
    logConsole('SEARCH RECIPE BY KEYWORD RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(
        Actions.Creators.setResultsForSearchRecipeByKeyword(res.data.data)
      );
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptSearchRecipeByKeyword());
}

function* getMonthlyHistory({payload}) {
  try {
    logConsole('GET MONTHLY MEAL HISTORY PARAMS!!!', payload);

    const res = yield call(API.getMealHistory, payload);

    logConsole('GET MONTHLY MEAL HISTORY RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET MONTHLY MEAL HISTORY RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let history = {};

      res.data.data.map(d => {
        history[d.date] = d;
      });

      yield put(Actions.Creators.setMonthlyMealHistory(history));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetMonthlyMealHistory());
}

function* getWeeklyHistory({payload}) {
  try {
    logConsole('GET WEEKLY MEAL HISTORY PARAMS!!!', payload);

    const res = yield call(API.getMealHistory, payload);

    logConsole('GET WEEKLY MEAL HISTORY RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET WEEKLY MEAL HISTORY RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let history = {};

      res.data.data.map(d => {
        history[d.date] = d;
      });

      yield put(Actions.Creators.setWeeklyMealHistory(history));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetWeeklyMealHistory());
}

function* adjustPlan({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('ADJUST MEAL PLAN PAYLOAD!!!', payload);

    const res = yield call(API.adjustMealPlan, payload);

    logConsole('ADJUST MEAL PLAN RESPONSE STATUS!!!\n\n', res.status);
    logConsole('ADJUST MEAL PLAN RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 201) {
      yield put(Actions.Creators.setAdjustMealPlanSuccess());
      yield put(Actions.Creators.attemptGetCurrentMealPlan({}));
      yield put(Actions.Creators.attemptGetTodayDashboard());
      yield put(Actions.Creators.attemptGetTodayUpcomingMeals());
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptAdjustMealPlan());
  yield put(Actions.Creators.hideVeil());
}

function* updateTreatsConfig({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('UPDATE MEAL TREATS CONFIG PAYLOAD!!!\n\n', payload);

    //const state = yield select()

    //let removedIds = []

    //let {days} = payload

    //logConsole('TREAT DAYS CONFIG BEFORE UPDATE!!!\n\n', state.meal.treats.config, true)

    /*if(state.meal.treats.config?.length > 0) {
            state.meal.treats.config.map(c => {

                let index = days.indexOf(c.day_of_week)

                if(index < 0) {
                    removedIds.push(c.id)
                }
                else {
                    days.splice(index, 1)
                }
            })
        }*/

    /*if(days?.length > 0) {
            for(let i=0; i<=days.length - 1; i++) {
                yield call(API.updateMealTreatsConfig, {
                    day_of_week: days[i]
                })
            }
        }*/

    /*if(removedIds.length > 0) {
            for(let i=0; i<=removedIds.length - 1; i++) {
                yield call(API.removeMealTreatsConfig, removedIds[i])
            }
        }*/

    //logConsole('TO ADD', days)
    //logConsole('TO REMOVE', removedIds)

    /*if(days?.length > 0 || removedIds.length > 0) {
            yield put(Actions.Creators.attemptGetCurrentMealPlan({}))
            yield put(Actions.Creators.setUpdateMealTreatsConfigSuccess())
        }*/

    const res = yield call(
      API.updateMealTreatsConfig,
      payload.days.map(d => ({
        day_of_week: d
      }))
    );

    logConsole('UPDATE MEAL TREATS CONFIG STATUS!!!\n\n', res.status);
    logConsole('UPDATE MEAL TREATS CONFIG DATA!!!\n\n', res.data);

    if (res.status == 201) {
      yield put(Actions.Creators.attemptGetCurrentMealPlan({}));
      yield put(Actions.Creators.setUpdateMealTreatsConfigSuccess());
      yield put(Actions.Creators.closeSheetDialogs());

      yield call(logEvent, Events.treats_add);
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateMealTreatsConfig());
  yield put(Actions.Creators.hideVeil());
}

function* clearTreatsConfig() {
  try {
    logConsole('CLEAR MEAL TREATS CONFIG');

    yield put(Actions.Creators.showVeil());

    /*const state = yield select()

        if(state.meal.treats.config?.length > 0) {
            for(let i=0; i<=state.meal.treats.config.length - 1; i++) {
                yield call(API.removeMealTreatsConfig, state.meal.treats.config[i].id)
            }
        }*/

    const res = yield call(API.updateMealTreatsConfig, []);

    logConsole('CLEAR MEAL TREATS CONFIG STATUS!!!\n\n', res.status);
    logConsole('CLEAR MEAL TREATS CONFIG DATA!!!\n\n', res.data);

    if (res.status == 201) {
      yield put(Actions.Creators.attemptGetCurrentMealPlan({}));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptClearMealTreatsConfig());
  yield put(Actions.Creators.hideVeil());
}

function* hostGuests({payload}) {
  try {
    logConsole('HOST GUESTS FOR MEAL PAYLOAD!!!\n\n', payload);

    // yield put(Actions.Creators.showVeil());

    const res = yield call(API.patchMeal, payload.meal_id, {
      additional_servings: payload.additional_servings
    });

    logConsole('HOST GUESTS FOR MEAL STATUS!!!\n\n', res.status);
    logConsole('HOST GUESTS FOR MEAL DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(Actions.Creators.setHostGuestsForMealSuccess({}));
      yield put(
        Actions.Creators.updateMealInCurrentMealPlan(payload.meal_id, {
          additional_servings: payload.additional_servings,
          total_time: res.data.data.total_time,
          servings: res.data.data.servings
        })
      );
      yield put(Actions.Creators.removeMealFromUpcomingMeals(payload.meal_id));
      yield put(Actions.Creators.attemptGetTodayDashboard());
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptHostGuestsForMeal());
  // yield put(Actions.Creators.hideVeil());
}

function* removeGuests({payload}) {
  try {
    logConsole('REMOVE GUESTS FOR MEAL PAYLOAD!!!\n\n', payload);

    yield put(Actions.Creators.showVeil());

    const additional_servings = 0;

    const res = yield call(API.patchMeal, payload.meal_id, {
      additional_servings
    });

    logConsole('REMOVE GUESTS FOR MEAL STATUS!!!\n\n', res.status);
    logConsole('REMOVE GUESTS FOR MEAL DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(Actions.Creators.setRemoveGuestsFromMealSuccess({}));
      yield put(
        Actions.Creators.updateMealInCurrentMealPlan(payload.meal_id, {
          additional_servings,
          total_time: res.data.data.total_time,
          servings: res.data.data.servings
        })
      );
      yield put(Actions.Creators.removeMealFromUpcomingMeals(payload.meal_id));
      // yield put(Actions.Creators.attemptGetTodayDashboard()); <- JKF - takes long time to load, not sure if this is really needed
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptRemoveGuestsFromMeal());
  yield put(Actions.Creators.hideVeil());
}

function* socialShareMeal() {
  try {
    logConsole('SHARE SOCIAL MEAL');

    yield call(logEvent, Events.meal_share);
  } catch (err) {}
}

function* setAddToMealPlans({payload}){
  logConsole("SET ADD TO MEAL PLANS payload",payload)
  try {
    yield put(Actions.Creators.showVeil());

    const {selectedMeal, selectedDays} = payload;
    console.log("SET ADD TO MEAL PLANS PROMISE PAYLOAD",payload)

    for (let i = 0; i <= selectedDays.length - 1; i++) {
      const original_meal = selectedDays[i].data.find(meal => meal.meal_position == selectedDays[i].type);
      const finalPayload =  {
        id: original_meal.id,
        swap_meal_id: selectedMeal.id
      }
      console.log("SET ADD TO MEAL PLANS PROMISE finalPayload",finalPayload)
      const results = yield call(API.patchMeal, finalPayload.id, {swap_meal_id: finalPayload.swap_meal_id});
      console.log("SET ADD TO MEAL PLANS PROMISE RESULTS",results)
    }
  } catch (err) {}
  yield put(Actions.Creators.doneAttemptAddToMealPlans());
  yield put(Actions.Creators.attemptGetCurrentMealPlan({}));
  yield put(Actions.Creators.hideVeil()); 
  yield put(Actions.Creators.showToastMessage("AddToMealPlan"));
}

function* setUserPreferenceToFilter(){
  try{
    const state = yield select()
    const {onboardingPlan:{kitchen_tools, diet, allergies:tags, excluded_ingredients}} = state.user;

    console.log("setUserPreferenceToFilter state.user.onboardingPlan",state.user.onboardingPlan)
    console.log("setUserPreferenceToFilter state.user.subscriptionOnboarding",state.user.subscriptionOnboarding)
    console.log("setUserPreferenceToFilter tags",tags)
    console.log("setUserPreferenceToFilter diet?.type",diet)
    console.log("setUserPreferenceToFilter diet?.type",diet?.type)
    const userPreference = {
      // kitchen_tools, 
      diet:diet?.type || state.user.subscriptionOnboarding.diet.text, 
      tags: tags || state.user.subscriptionOnboarding.allergies,
      excluded_ingredients};
    console.log("setUserPreferenceToFilter userPreference ",userPreference)
    const sections = Object.getOwnPropertyNames(userPreference);
    for (let i = 0; i <= sections.length - 1; i++) {
      let filter = {};
      if(sections[i] != "diet"){
        for (let c = 0; c <= userPreference[sections[i]].length - 1; c++) {
          let filterItem = "";
          if(sections[i] == "tags"){
            filterItem = userPreference[sections[i]][c].toLowerCase();
          }else if(sections[i] == "excluded_ingredients"){
            filterItem = userPreference[sections[i]][c].name.toLowerCase()
          }else{
            filterItem = userPreference[sections[i]][c]
          }
          filter =  {
            section:sections[i],
            item: filterItem
          }
          yield put(Actions.Creators.toggleFilterInSearchMeals(filter));
        }
      }else{
        filter =  {
          section:sections[i],
          item: userPreference[sections[i]]
        }
        yield put(Actions.Creators.toggleFilterInSearchMeals(filter));
      }
    }
    yield put(Actions.Creators.doneSetUserPreferenceToFilter());
  }catch(err){}
}

function* saveMealNotes({payload}){
  try{
    const state = yield select();
    logConsole("MEAL SAGA saveMealNotes payload",payload)
    let finalPayload = {}
    if(payload.id){
      finalPayload = {id:payload.id, notes:payload.notes};
    }else{
      finalPayload = {meal_template:payload.meal_template, notes:payload.notes}
    }
    logConsole("MEAL SAGA saveMealNotes finalPayload",finalPayload)
    let res = yield call(API.setRecipeNotes, finalPayload);
    logConsole("MEAL SAGA saveMealNotes res",res)
    
    yield put(
      Actions.Creators.setMealDetail({
        ...state.meal.detail,
        meal_notes: res.data.data
      })
    );
  }catch(err){}
  yield put(Actions.Creators.doneAttemptSaveMealNotes());
  goBack()
}

function* logFirstMeal({payload}) {
  try {
    logConsole(' FIRST LOG MEAL PAYLOAD!!!\n\n', payload);

    const rateRes = yield call(API.rateRecipe, {
      id: payload.id,
      rating: payload.rating
    });

    logConsole('RATE MEAL RESPONSE STATUS!!!\n\n', rateRes.status);
    logConsole('RATE MEAL RESPONSE DATA!!!\n\n', rateRes.data);

    if (rateRes.status == 201) {
      yield call(logEvent, Events.first_recipe_meal);

      yield call(logEvent, Events.meal_rate, {
        rating: payload.rating
      });
      const feedbackRes = yield call(postRecipeFeedbackResponse, payload.name, payload.rating, payload.comment)
      logConsole('RATE MEAL RESPONSE DATA feedbackRes!!!\n\n', feedbackRes);

      yield put(Actions.Creators.attemptAddUserTag(Tag.firstRecipe));
      yield put(Actions.Creators.attemptGetTodayDashboard());
      yield put(Actions.Creators.attemptGetUserProfile());
      if(payload.returnPage){
        navigate(payload.returnPage)
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptLogMeal());
}

export default function* () {
  yield takeLatest(Actions.Types.ATTEMPT_GET_MEAL_DETAIL, getDetail);
  yield takeLatest(Actions.Types.ATTEMPT_RATE_MEAL, rate);
  yield takeLatest(Actions.Types.ATTEMPT_LOG_MEAL, log);
  yield takeLatest(Actions.Types.ATTEMPT_MOVE_MEAL, move);
  yield takeLatest(Actions.Types.ATTEMPT_GET_CURRENT_MEAL_PLAN, getCurrentPlan);
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_CATEGORIZED_MEAL_TEMPLATES,
    getCategorizedTemplates
  );
  yield takeLatest(Actions.Types.ATTEMPT_GET_MEAL_TEMPLATES, getTemplates);
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_MORE_MEAL_TEMPLATES,
    getMoreTemplates
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_MEAL_REPLACEMENTS,
    getReplacements
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_MORE_MEAL_REPLACEMENTS,
    getMoreReplacements
  );
  yield takeLatest(Actions.Types.ATTEMPT_REPLACE_MEAL, replace);
  yield takeLatest(Actions.Types.ATTEMPT_SKIP_MEAL, skip);
  yield takeLatest(Actions.Types.ATTEMPT_GET_REPEAT_MEAL_DAYS, getRepeatDays);
  yield takeLatest(Actions.Types.ATTEMPT_REPEAT_MEAL, repeat);
  yield takeLatest(Actions.Types.ATTEMPT_BOOKMARK_MEAL, bookmark);
  yield takeLatest(Actions.Types.ATTEMPT_BATCH_MEAL, batch);
  yield takeLatest(Actions.Types.ATTEMPT_SEARCH_MEALS, searchMeals);
  yield takeLatest(
    Actions.Types.ATTEMPT_APPLY_SEARCH_FILTERS,
    applySearchFilters
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_SEARCH_RECIPE_BY_KEYWORD,
    searchRecipeByKeyword
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_MONTHLY_MEAL_HISTORY,
    getMonthlyHistory
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_WEEKLY_MEAL_HISTORY,
    getWeeklyHistory
  );
  yield takeLatest(Actions.Types.ATTEMPT_ADJUST_MEAL_PLAN, adjustPlan);
  yield takeLatest(
    Actions.Types.ATTEMPT_UPDATE_MEAL_TREATS_CONFIG,
    updateTreatsConfig
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_CLEAR_MEAL_TREATS_CONFIG,
    clearTreatsConfig
  );
  yield takeLatest(Actions.Types.ATTEMPT_HOST_GUESTS_FOR_MEAL, hostGuests);
  yield takeLatest(Actions.Types.ATTEMPT_REMOVE_GUESTS_FROM_MEAL, removeGuests);
  yield takeLatest(Actions.Types.ATTEMPT_SOCIAL_SHARE_MEAL, socialShareMeal);
  yield takeLatest(Actions.Types.SET_USER_PREFERENCE_TO_FILTER, setUserPreferenceToFilter);
  yield takeLatest(Actions.Types.ATTEMPT_ADD_TO_MEAL_PLANS, setAddToMealPlans);
  yield takeLatest(Actions.Types.ATTEMPT_SAVE_MEAL_NOTES, saveMealNotes);
  yield takeLatest(Actions.Types.ATTEMPT_LOG_FIRST_MEAL, logFirstMeal)
}
