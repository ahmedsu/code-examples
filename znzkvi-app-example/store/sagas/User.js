import {takeLatest, call, put, select} from 'redux-saga/effects';
import store from '@store';
import Actions from '@actions';
import * as API from '@api';
import {
  navigate,
  replace,
  goBack,
  reset,
  isFeatureAccessible,
  navigator
} from '@services';
import {
  Routes,
  Highlights,
  IS_ANDROID,
  IS_DEV,
  PUSH_NOTIFICATION_CHANNEL,
  NOTIFICATION_ID,
  Tag,
  APP_NAME,
  UNITS,
  Events,
  UserMetricsConfiguration,
  UserStatsConfiguration,
  IS_BYPASS_NATIVE_SUBSCRIPTION,
  PRODUCT_IDS
} from '@config';
import {
  convertWeight,
  convertWaistSize,
  getCurrentDate,
  Say,
  logConsole,
  LocalPushNotification,
  formatHightlightName,
  setNextAppReviewPrompt
} from '@utils';
import {Colors} from '@themes';
import {logEvent} from '@lib';
import Immutable from 'seamless-immutable';
import moment from 'moment';
import * as RNLocalize from 'react-native-localize';
import IAP from 'react-native-iap';
import InAppReview, {isAvailable} from 'react-native-in-app-review';
import {Linking} from 'react-native';
import {Lottie} from '@assets';
import Intercom from '@intercom/intercom-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FAMILY_MEMBER_KEY,
  INGREDIENTS_TO_REMOVE_KEY
} from '../../screens/OnBoarding/config';
import {mixPanelPage} from '../../config/routes';

function* forgotPassword({email}) {
  try {
    yield put(Actions.Creators.showVeil());

    email = email.trim();

    if (email) {
      const res = yield call(API.passwordReset, email);

      logConsole('PASSWORD RESET RESPONSE!!!\n\n', res);

      if (res.status == 201) {
        navigate(Routes.resetPasswordCheckInbox);
      }
    } else {
      Say.info('Please enter your email address');
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptForgotPassword());
  yield put(Actions.Creators.hideVeil());
}

function* createNewPassword({uuid, token, payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('NEW PASSWORD PAYLOADS!!!\n\n', {
      uuid,
      token,
      ...payload
    });

    const res = yield call(API.confirmPasswordReset, uuid, token, {
      password: payload.password,
      confirmed_password: payload.confirmPassword
    });

    logConsole('NEW PASSWORD RESPONSE STATUS!!!\n\n', res.status);
    logConsole('NEW PASSWORD RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      replace(Routes.resetPasswordSuccess);
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptCreateNewPassword());
  yield put(Actions.Creators.hideVeil());
}

function* changePassword({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('CHANGE PASSWORD PAYLOAD!!!\n\n', payload);

    if (
      !payload.currentPassword ||
      !payload.newPassword ||
      !payload.confirmPassword
    ) {
      Say.info('Please enter all inputs');
    } else {
      const res = yield call(API.updateProfile, {
        current_password: payload.currentPassword,
        password: payload.newPassword,
        confirmed_password: payload.confirmPassword
      });

      logConsole('CHANGE PASSWORD RESPONSE STATUS!!!\n\n', res.status);
      logConsole('CHANGE PASSWORD RESPONSE DATA!!!\n\n', res.data);

      if (res.status == 200) {
        Say.ok('Password successfully changed');
        goBack();
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptChangePassword());
  yield put(Actions.Creators.hideVeil());
}

function* getUserProfile({params}) {
  try {
    yield put(Actions.Creators.showVeil());

    const state = yield select();

    const userRes = yield call(API.getProfile);
    const highlightSettingsRes = yield call(API.getUserHighlightSettings);

    const familyRes = yield call(API.getFamilyMembers);
    const familyCount = familyRes?.data?.data?.count ?? 0;
    const family_member = familyCount === 0 ? 'None' : familyCount;

    //const mealScheduleRes = yield call(API.getUserMealSchedule)

    logConsole('GET USER PROFILE RESPONSE STATUS!!!\n\n', userRes.status);
    logConsole('GET USER PROFILE RESPONSE DATA!!!\n\n', userRes.data);

    logConsole(
      'GET HIGHLIGHT SETTINGS RESPONSE STATUS!!!\n\n',
      highlightSettingsRes.status
    );
    logConsole(
      'GET HIGHLIGHT SETTINGS RESPONSE DATA!!!\n\n',
      highlightSettingsRes.data
    );

    //logConsole('GET USER MEAL NOTIFICATION SETTINGS RESPONSE STATUS!!!\n\n', mealScheduleRes.status)
    //logConsole('GET USER MEAL NOTIFICATION SETTINGS RESPONSE DATA!!!\n\n', mealScheduleRes.data)

    if (userRes.status == 200 && highlightSettingsRes.status == 200) {
      let existing_highlights = [];
      let highlights = [];

      yield put(Actions.Creators.attemptGetCartStatus());

      yield put(Actions.Creators.attemptGetUserMetricsConfiguration());

      userRes.data.data.highlights.map(h => {
        if (highlightSettingsRes.data.data[h.settings] !== undefined) {
          h.hidden = !highlightSettingsRes.data.data[h.settings];

          existing_highlights.push(h.settings);
        }

        if (Highlights[h.settings] !== undefined) {
          highlights.push({
            ...h,
            order: Highlights[h.settings].order
          });
        }

        if (h.settings == 'meal_completion') {
          highlights.push({
            ...h,
            hidden: true
          });
        }
      });

      for (let h in Highlights) {
        if (existing_highlights.indexOf(h) < 0) {
          let ok = true;

          if (h === Highlights.apple_health.key && IS_ANDROID) {
            ok = false;
          }

          if (ok) {
            highlights.push({
              name: Highlights[h].label,
              value: '',
              action: Highlights[h].action,
              settings: h,
              order: Highlights[h].order,
              hidden: !highlightSettingsRes.data.data[h]
            });
          }
        }
      }

      highlights.sort(function (a, b) {
        return a.order > b.order ? 1 : -1;
      });

      highlights = highlights.map(h => {
        return {
          ...h,
          name: formatHightlightName(h.name, h.settings)
        };
      });

      const excluded_ingredients =
        userRes.data.data.profile?.excluded_ingredients?.map(
          ({ingredient, ingredient_name}) => ({
            ingredient,
            name: ingredient_name
          })
        );

      yield put(
        Actions.Creators.addToOnboardingPlan({
          goal: userRes.data.data.profile.goal,
          diet: userRes.data.data.profile.diet,
          allergies: userRes.data.data.profile.allergies,
          kitchen_tools: userRes.data.data.profile.kitchen_tools,
          cuisines: userRes.data.data.profile.cuisines,
          meals_to_share: userRes.data.data.profile.meals_to_share || [],
          planning_day: userRes.data.data.profile.planning_day,
          planning_time: userRes.data.data.profile.planning_time,
          date_of_birth: userRes.data.data.profile.date_of_birth,
          current_weight: userRes.data.data.current_weight || {},
          current_height: userRes.data.data.profile.current_height || {},
          current_waist_size: userRes.data.data.current_waist_size || {},
          gender: userRes.data.data.profile.gender,
          fitness_level_assessment:
            userRes.data.data.profile.fitness_level_assessment,
          excluded_ingredients: excluded_ingredients ?? [],
          recipe_goal: userRes.data.data.profile.recipe_goal,
          family_member
        })
      );

      yield put(
        Actions.Creators.updateUserData({
          metrics: userRes.data.data.metrics,
          ...userRes.data.data.profile,
          subscription: {
            ...userRes.data.data.profile.subscription,
            product_id:
              userRes.data.data.profile.subscription?.product_id || null
          },
          current_weight: userRes.data.data.current_weight || {},
          current_waist_size: userRes.data.data.current_waist_size || {},
          current_height: userRes.data.data.profile.current_height || {},
          highlights,
          tag_names: userRes.data.data.tag_names,
          return_page: userRes.data.data.profile.done_onboarding
            ? userRes.data.data.profile.return_page
            : '',
          treats_enabled: false,
          skipped_onboarding: userRes.data.data.profile.done_onboarding
            ? false
            : userRes.data.data.profile.skipped_onboarding,
          family_member
          //meal_schedule: mealScheduleRes.data.data
        })
      );

      if (state.user.data && state.user.data.done_onboarding) {
        yield put(
          Actions.Creators.goToOnboardingPageByReturnPageData(
            userRes.data.data.profile.return_page,
            true
          )
        );
      }

      yield put(Actions.Creators.getReminders());

      if (params?.getPurchaseHistory) {
        yield put(Actions.Creators.attemptGetSubscriptionPurchaseHistory());
      }

      // SYNC USER PROFILE TO SEGMENT
      yield put(Actions.Creators.preStartUps());
    }
  } catch (err) {}

  logConsole('DONE GET USER PROFILE!!!!');
  yield put(Actions.Creators.doneAttemptGetUserProfile());
  yield put(Actions.Creators.hideVeil());
}

function* editUserProfile({data}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('EDIT USER PROFILE PAYLOAD!!!\n\n', data, true);

    const state = yield select();

    let image = null;

    if (data.image) {
      if (typeof data.image === 'object') {
        image = data.image;
      }
      delete data.image;
    }

    //
    //const current_waist_size = convertWaistSize(state.user.data.current_waist_size, data.units)

    let payload = {
      ...data
    };

    let current_weight = {},
      current_waist_size = {};

    if (!payload.current_height?.value) delete payload.current_height;
    if (!payload.gender) delete payload.gender;
    if (!payload.date_of_birth) delete payload.date_of_birth;

    if (state.user.data.current_weight?.value) {
      current_weight = convertWeight(
        state.user.data.current_weight,
        data.units
      );
      payload.current_weight = current_weight;
    }

    if (state.user.data.current_waist_size?.value) {
      current_waist_size = convertWaistSize(
        state.user.data.current_waist_size,
        data.units
      );
      payload.current_waist_size = current_waist_size;
    }

    const res = yield call(API.updateProfile, payload);

    if (image) {
      yield call(API.updateProfileImage, image);
    }

    logConsole('EDIT USER PROFILE RESPONSE STATUS!!!\n\n', res.status);
    logConsole('EDIT USER PROFILE RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(
        Actions.Creators.addToOnboardingPlan({
          units: data.units,
          gender: data.gender,
          date_of_birth: data.date_of_birth,
          current_height: data.current_height,
          current_weight,
          current_waist_size
        })
      );

      yield put(
        Actions.Creators.updateUserData({
          first_name: data.first_name,
          last_name: data.last_name,
          image: image || state.user.data.image,
          location: data.location,
          gender: data.gender,
          email: data.email,
          date_of_birth: data.date_of_birth,
          current_height: data.current_height,
          current_weight,
          current_waist_size,
          units: data.units
        })
      );

      Say.ok('You have successfully updated your profile!', undefined, {
        showIcon: true
      });
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptEditUserProfile());
  yield put(Actions.Creators.hideVeil());
}

function* updateMandatoryData({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('UPDATE MANDATORY USER PROFILE PAYLOAD!!!\n\n', payload);

    const state = yield select();

    const res = yield call(API.updateProfile, payload);

    logConsole(
      'UPDATE MANDATORY USER PROFILE RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole('UPDATE MANDATORY USER PROFILE RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(Actions.Creators.updateUserData(payload));

      replace(Routes.home);
      if (!state.user.data.done_onboarding) {
        navigate(Routes.welcome);
      } else if (!state.user.data.subscription_level) {
        navigate(Routes.onBoardingSummary);
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateUserMandatoryData());
  yield put(Actions.Creators.hideVeil());
}

function* updateWhy({payload}) {
  try {
    yield put(Actions.Creators.showVeil());
    yield call(logEvent, Events.my_why);

    logConsole('UPDATE USER WHY PAYLOAD!!!\n\n', payload);

    const res = yield call(API.updateProfile, payload);

    logConsole('UPDATE USER WHY RESPONSE STATUS!!!\n\n', res.status);
    logConsole('UPDATE USER WHY RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(
        Actions.Creators.updateUserData({
          why: payload.why
        })
      );

      goBack();
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateUserWhy());
  yield put(Actions.Creators.hideVeil());
}

function* getHighlightSettings() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getUserHighlightSettings);

    logConsole(
      'GET USER HIGHLIGHT SETTINGS RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole('GET USER HIGHLIGHT SETTINGS RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let data = {
        achievements: {
          badges: {
            key: Highlights.badges.key,
            name: Highlights.badges.label,
            value: res.data.data.badges
          },
          meal_streak: {
            key: Highlights.meal_streak.key,
            name: Highlights.meal_streak.label,
            value: res.data.data.meal_streak
          },
          meals_logged: {
            key: Highlights.meals_logged.key,
            name: Highlights.meals_logged.label,
            value: res.data.data.meals_logged
          },
          challenges: {
            key: Highlights.challenges.key,
            name: Highlights.challenges.label,
            value: res.data.data.challenges
          },
          time_saved: {
            key: Highlights.time_saved.key,
            name: Highlights.time_saved.label,
            value: res.data.data.time_saved
          },
          money_saved: {
            key: Highlights.money_saved.key,
            name: Highlights.money_saved.label,
            value: res.data.data.money_saved
          },
          daily_carb_intake: {
            key: Highlights.daily_carb_intake.key,
            name: Highlights.daily_carb_intake.label,
            value: res.data.data.daily_carb_intake
          }
        },
        stats: {
          total_points: {
            key: Highlights.total_points.key,
            name: Highlights.total_points.label,
            value: res.data.data.total_points
          },
          blood_sugar: {
            key: Highlights.blood_sugar.key,
            name: Highlights.blood_sugar.label,
            value: res.data.data.blood_sugar
          },
          a1c: {
            key: Highlights.a1c.key,
            name: Highlights.a1c.label,
            value: res.data.data.a1c
          },
          weight: {
            key: Highlights.weight.key,
            name: Highlights.weight.label,
            value: res.data.data.weight
          },
          body_fat: {
            key: Highlights.body_fat.key,
            name: Highlights.body_fat.label,
            value: res.data.data.body_fat
          },
          waist_size: {
            key: Highlights.waist_size.key,
            name: Highlights.waist_size.label,
            value: res.data.data.waist_size
          }
        },
        apps: {}
      };

      /*if(!IS_ANDROID) {
                data.apps.apple_health = {
                    key: Highlights.apple_health.key,
                    name: Highlights.apple_health.label,
                    value: res.data.data.apple_health
                }
            }*/

      yield put(Actions.Creators.setHighlightSettings(data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetHighlightSettings());
  yield put(Actions.Creators.hideVeil());
}

function* updateHighlightSettings({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('UPDATE USER HIGHLIGHT SETTINGS PAYLOAD!!!\n\n', payload);

    const state = yield select();

    const res = yield call(API.updateUserHighlightSettings, {
      [payload.key]: payload.value
    });

    logConsole(
      'UPDATE USER HIGHLIGHT SETTINGS RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole('UPDATE USER HIGHLIGHT SETTINGS RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let settings = Immutable.asMutable(state.user.highlightSettings, {
        deep: true
      });
      let userData = Immutable.asMutable(state.user.data, {deep: true});

      settings[payload.section][payload.key].value = payload.value;

      yield put(Actions.Creators.setHighlightSettings(settings));

      userData.highlights = userData.highlights.map(h => {
        if (h.settings == payload.key) {
          h.hidden = !payload.value;
        }

        return h;
      });

      yield put(Actions.Creators.updateUserData(userData));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateHighlightSettings());
  yield put(Actions.Creators.hideVeil());
}

function* restoreSubscription() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.restoreSubscription);

    logConsole('RESTORE SUBSCRIPTION RESPONSE STATUS', res.status);
    logConsole('RESTORE SUBSCRIPTION RESPONSE DATA', res.data);

    if (res.status == 200) {
      Say.ok('Subscription restored successfully');
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptRestoreSubscription());
  yield put(Actions.Creators.hideVeil());
}

function* getNotificationSettings() {
  try {
    const res = yield call(API.getUserNotificationSettings);

    logConsole(
      'GET USER NOTIFICATION SETTINGS RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole('GET USER NOTIFICATION SETTINGS RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      const excluded_keys = ['id', 'date_created', 'date_updated'];

      let settings = [];

      for (let r in res.data.data) {
        if (excluded_keys.indexOf(r) < 0) {
          settings.push({
            label: `${r[0].toUpperCase()}${r.substring(1)} Alerts`,
            type: r,
            value: res.data.data[r]
          });
        }
      }

      yield put(Actions.Creators.setUserNotificationSettings(settings));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetUserNotificationSettings());
}

function* getMealNotificationSettings() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getUserMealSchedule);

    logConsole(
      'GET USER MEAL NOTIFICATION SETTINGS RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole(
      'GET USER MEAL NOTIFICATION SETTINGS RESPONSE DATA!!!\n\n',
      res.data,
      true
    );

    if (res.status == 200) {
      yield put(
        Actions.Creators.setUserMealNotificationSettings(res.data.data)
      );
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetUserMealNotificationSettings());
  yield put(Actions.Creators.hideVeil());
}

function* updateMealNotificationSettings({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole(
      'UPDATE USER MEAL NOTIFICATION SETTINGS PAYLOAD!!!\n\n',
      payload
    );

    const state = yield select();

    //if(res.status == 200) {
    const today = moment();

    let schedules = Immutable.asMutable(state.user.data.meal_schedule, {
      deep: true
    });

    schedules[payload.key].time = payload.time;
    schedules[payload.key].enabled = payload.enabled;

    logConsole('MEAL SCHEDULES!!!\n\n', schedules, true);

    let notifId = NOTIFICATION_ID[payload.key];

    yield call(LocalPushNotification.cancelLocalNotificationById, notifId);

    //only schedule the notification if ENABLED and TIME is set
    if (schedules[payload.key].enabled && schedules[payload.key].time) {
      let time_value_splits = schedules[payload.key].time.split(' ');
      let time_splits = time_value_splits[0].split(':');

      let hour =
        parseInt(time_splits[0]) +
        (schedules[payload.key].time.indexOf('pm') >= 0 ? 12 : 0);
      let minute = parseInt(time_splits[1]);

      let fireDate = new Date(
        today.format('YYYY'),
        parseInt(today.format('MM')) - 1,
        today.format('DD'),
        hour,
        minute
      );

      yield call(
        LocalPushNotification.showScheduledNotification,
        notifId,
        'Meal Reminder',
        `You need to eat ${schedules[payload.key].name}`,
        null,
        {
          channelId: PUSH_NOTIFICATION_CHANNEL.mealReminder,
          date: fireDate,
          repeatType: 'day'
        }
      );
    }

    const formattedTime = moment(payload.time, 'hh:mm a').format('hh:mm A');

    yield put(
      Actions.Creators.updateUserMealNotificationSettings({
        ...payload,
        time: formattedTime
      })
    );

    const res = yield call(API.updateUserMealSchedule, {
      [payload.key]: {
        name: payload.name,
        time: formattedTime,
        enabled: payload.enabled
      }
    });

    logConsole(
      'UPDATE USER MEAL SCHEDULE API RESPONSE DATA!!!\n\n',
      res.data.data
    );
    //}
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateUserMealNotificationSettings());
  yield put(Actions.Creators.hideVeil());
}

function* calculatePlan({plan}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('calculatePlan PLAN!!!\n\n', plan);
    let modifiedPlan = {
      ...plan
    };

    delete modifiedPlan.goal;
    delete modifiedPlan.diet;
    delete modifiedPlan.allergies;
    delete modifiedPlan.time_for_magic;
    delete modifiedPlan.current_waist_size;
    // if(modifiedPlan.kitchen_tools[0] == "None") modifiedPlan.kitchen_tools = [];
    modifiedPlan.kitchen_tools = null;

    const state = yield select();
    if (
      state.user.allUpcomingMeals != null &&
      state.user.allUpcomingMeals.meals?.length == 0
    ) {
      const updateProfileData = {
        allergies: state.user.subscriptionOnboarding.allergies,
        goal: state?.user?.subscriptionOnboarding?.goal?.text ?? '',
        diet: {
          type: state.user.subscriptionOnboarding.diet.text,
          days_to_eat_meat:
            state.user.subscriptionOnboarding.diet.days_to_eat_meat
        }
      };
      logConsole(
        'CALCULATE PLAN UPDATE SUBSCRIPTION DATA !!!\n\n',
        updateProfileData
      );
      const userRes = yield call(API.updateProfile, updateProfileData);
      logConsole(
        'CALCULATE PLAN UPDATE SUBSCRIPTION RESPONSE STATUS!!!\n\n',
        userRes.status
      );
      logConsole(
        'CALCULATE PLAN UPDATE SUBSCRIPTION RESPONSE DATA!!!\n\n',
        userRes.data
      );
    }

    const timezone = RNLocalize.getTimeZone();
    logConsole('PAYLOAD PLAN!!!\n\n', modifiedPlan);
    logConsole('updateProfile PAYLOAD!!\n\n', {
      ...modifiedPlan,
      timezone,
      done_onboarding: true,
      skipped_onboarding: false,
      units: UNITS.british.value,
      recalculate:
        state.user.data && state.user.data.done_onboarding ? true : false
    });
    const res = yield call(API.updateProfile, {
      ...modifiedPlan,
      timezone,
      done_onboarding: true,
      skipped_onboarding: false,
      units: UNITS.british.value,
      recalculate:
        state.user.data && state.user.data.done_onboarding ? true : false
    });

    logConsole('CALCULATE PLAN RESPONSE STATUS!!!\n\n', res.status);
    logConsole('CALCULATE PLAN RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let members = [];

      const selectedMembersCount =
        plan.family_member == 'None' ? 0 : parseInt(plan.family_member);

      //check adult members
      for (let i = 1; i <= selectedMembersCount; i++) {
        let member = {
          name: `member ${i}`,
          age_class: 'adult',
          weight_class: '150 - 200 lbs',
          meals_to_share: plan.meals_to_share
        };
        members.push(member);
      }
      logConsole('ADDED MEMBERS!!!\n\n', members, true);

      //create members
      const addFamilyRes = yield call(API.addFamilyMembers, members);

      logConsole('ADD MEMBERS RESPONSE STATUS!!!\n\n', addFamilyRes.status);
      logConsole('ADD MEMBERS RESPONSE DATA!!!\n\n', addFamilyRes.data);

      yield put(
        Actions.Creators.updateUserData({
          ...state.user.data,
          goal: res.data.data.goal,
          diet: res.data.data.diet,
          allergies: res.data.data.allergies,
          kitchen_tools: res.data.data.kitchen_tools,
          meals_to_share: res.data.data.meals_to_share,
          done_onboarding: res.data.data.done_onboarding,
          skipped_onboarding: false,
          timezone: res.data.data.timezone
        })
      );

      replace(Routes.home);
      if (!state.user.data.done_onboarding) {
        logEvent(Events.screen_visit, {
          name: mixPanelPage.meal_plan_success
        });

        yield put(Actions.Creators.showFireworks());
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.hideVeil());
}

function* skipCalculatePlan() {
  try {
    yield put(Actions.Creators.showVeil());

    const state = yield select();

    const timezone = RNLocalize.getTimeZone();
    logConsole(
      'SKIP ONBOARDING onboardingPlan!!!\n\n',
      state.user.onboardingPlan
    );

    const payload = {
      allergies: state.user.subscriptionOnboarding.allergies,
      cuisines: state.user.subscriptionOnboarding.cuisines,
      diet: state.user.onboardingPlan.diet,
      kitchen_tools: state.user.onboardingPlan.kitchen_tools,
      meals_to_share: state.user.onboardingPlan.meals_to_share,
      goal: state.user.subscriptionOnboarding.goal,
      planning_day: state.user.onboardingPlan.planning_day,
      planning_time: state.user.onboardingPlan.planning_time,
      timezone,
      units: UNITS.british.value,
      skipped_onboarding: true,
      recalculate: false
    };

    logConsole('SKIP ONBOARDING CALCULATION PAYLOAD!!!\n\n', payload);

    const res = yield call(API.updateProfile, payload);

    logConsole(
      'SKIP ONBOARDING CALCULATION RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole(
      'SKIP ONBOARDING CALCULATION RESPONSE DATA!!!\n\n',
      res.data,
      true
    );

    if (res.status == 200) {
      yield put(
        Actions.Creators.updateUserData({
          ...state.user.data,
          goal: res.data.data.goal,
          diet: res.data.data.diet,
          allergies: res.data.data.allergies,
          // cuisines: res.data.data.cuisines,
          kitchen_tools: res.data.data.kitchen_tools,
          meals_to_share: state.data.data.meals_to_share,
          done_onboarding: res.data.data.done_onboarding,
          skipped_onboarding: true,
          timezone: res.data.data.timezone
        })
      );

      logConsole('CHECK DATA BEFORE REROUTING!!!\n\n', state.user.data);

      if (state.user.data.subscription_level) {
        reset({
          index: 0,
          routes: [{name: Routes.home}, {name: Routes.myPlan}]
        });
      } else if (!state.user.data.proceeded_to_home) {
        reset({
          index: 0,
          routes: [{name: Routes.home}]
        });
      } else if (state.user.data.skipped_onboarding) {
        reset({
          index: 0,
          routes: [{name: Routes.home}]
        });
      } else {
        replace(Routes.home);
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptSkipOnboardingCalculation());
  yield put(Actions.Creators.hideVeil());
}

function* getSubscriptionPurchaseHistory() {
  try {
    logConsole('ATTEMPT GET SUBSCRIPTION PURCHASE HISTORY');

    const state = yield select();

    // only execute if user has already subscribed before
    if (state.user.data.subscription?.product_id) {
      const res = yield call(IAP.getPurchaseHistory);
      logConsole('RAW SUBSCRIPTION TRANSACTIONS!!!', res);
      //if there are at least 1 purchase history
      if (res.length > 0) {
        logConsole('FOUND PREVIOUS SUBSCRIPTION TRANSACTIONS!!!');

        // sort the history chronologically in descending order, the latest purchase will be at index 0
        res.sort((a, b) => {
          if (IS_ANDROID) {
            return moment(b.transactionDate).isAfter(
              moment(a.transactionDate).format('YYYY-MM-DD HH:mm:ss')
            );
          } else {
            if (
              moment(a.originalTransactionDateIOS).isSame(
                moment(b.originalTransactionDateIOS)
              )
            ) {
              // Provide a format to moment so it knows how to parse the times:
              return moment(b.transactionDate).isAfter(
                moment(a.transactionDate).format('YYYY-MM-DD HH:mm:ss')
              );
            } else if (
              moment(a.originalTransactionDateIOS) <
              moment(b.originalTransactionDateIOS)
            ) {
              return 1;
            } else if (
              moment(a.originalTransactionDateIOS) >
              moment(b.originalTransactionDateIOS)
            ) {
              return -1;
            }
          }
        });

        const latestPurchase = res[0];

        logConsole('SUBSCRIPTION TRANSACTIONS!!!', res);
        // logConsole('SUBSCRIPTION TRANSACTIONS!!!',res);
        logConsole('DEVICE CURRENT latestPurchase!!!', latestPurchase);
        logConsole('LATEST SUBSCRIPTION PURCHASE!!!\n\n', {
          productId: latestPurchase.productId,
          transactionId: latestPurchase.transactionId,
          originalTransactionIdentifierIOS:
            latestPurchase.originalTransactionIdentifierIOS,
          transactionDate: moment(latestPurchase.transactionDate).format(
            'DD MMM YYYY HH:mm:ss'
          )
        });
        logConsole(
          'DEVICE CURRENT SUBSCRIPTION!!!',
          state.user.data.subscription
        );
        yield call(
          AsyncStorage.setItem,
          'previous_subscription',
          JSON.stringify(state.user.data.subscription)
        );

        const purchasePayload = {
          purchase: {
            receipt:
              latestPurchase.purchaseToken || latestPurchase.transactionReceipt,
            transactionId: latestPurchase.transactionId,
            transactionDate: latestPurchase.transactionDate,
            originalTransactionIdentifierIOS:
              latestPurchase.originalTransactionIdentifierIOS
          },
          product_id: latestPurchase.productId
        };
        yield put(Actions.Creators.attemptConfirmSubscription(purchasePayload));

        // const isSameProductId = latestPurchase.productId.substring(0,3) === state.user.data.subscription.product_id.substring(0,3);
        // if(!isSameProductId){
        //   const isLifestyle = latestPurchase.productId.indexOf('lifestyle') >= 0;
        //   if(isLifestyle){
        //     store.dispatch({type:Actions.Types.GO_TO_SUBSCRIPTION_ONBOARDING_PAGE, page:6})
        //     navigate(Routes.subscriptions, {
        //       skipPayment: true,
        //       purchase: purchasePayload,
        //       // changePlan:true,
        //       // includePageHideBackButton: 6
        //     });
        //   }

        // }else{
        //   yield call(AsyncStorage.setItem,'previous_subscription',JSON.stringify(state.user.data.subscription));
        //   yield put(Actions.Creators.attemptConfirmSubscription(purchasePayload));
        // }
        // res.data.data.profile.subscription?.product_id.substring(0,3) === JSON.parse(previous_subscription).product_id.substring(0,3);
        // if (!isSameProductId) {
        //   logConsole('SUBSCRIPTION CHANGED!!!');

        // const isStandard = latestPurchase.productId.indexOf('standard') >= 0;
        // const isDuo = latestPurchase.productId.indexOf('duo') >= 0;
        // const isFamily = latestPurchase.productId.indexOf('family') >= 0;
        // const isLifestyle = latestPurchase.productId.indexOf('lifestyle') >= 0;

        // if (isStandard) {
        //   yield call(API.addFamilyMembers, []);

        //   yield put(
        //     Actions.Creators.attemptConfirmSubscription(purchasePayload)
        //   );
        // } else if (isDuo || isFamily || isLifestyle) {
        // yield call(API.addFamilyMembers, []);
        //   yield put(
        //     Actions.Creators.addToSubscriptionOnboarding({
        //       plan: {
        //         product_id: latestPurchase.productId,
        //         name: isLifestyle ? 'lifestyle' : isDuo ? 'duo' : 'family'
        //       }
        //     })
        //   );

        //   yield put(Actions.Creators.goToSubscriptionOnboardingPage(6));

        //   navigate(Routes.subscriptions, {
        //     skipPayment: true,
        //     purchase: purchasePayload
        //   });
        // }
        // } else {
        //   yield put(
        //     Actions.Creators.attemptConfirmSubscription(purchasePayload)
        //   );
        // }
      } else {
        logConsole('NO SUBSCRIPTION PURCHASE HISTORY');
        yield put(Actions.Creators.checkSubscriptionExpiration());
      }
    }
  } catch (err) {
    // Sentry.captureException(err)
    yield put(Actions.Creators.checkSubscriptionExpiration());
    logConsole('ERROR GET SUBSCRIPTION PURCHASE HISTORY', err);
  }

  logConsole('DONE GET SUBSCRIPTION PURCHASE HISTORY');
}

function* attemptSubscribe({product_id}) {
  try {
    logConsole('ATTEMPT SUBSCRIBE!!!', product_id);

    yield put(Actions.Creators.showVeil());

    const TEST_RECEIPT =
      'dishquo-dev-secret-receipt-luRBqFHqM4d5i3tsruR1IBhNbRgquRXx7U6C62vyyUzp6LYq65iNJASBuLNDqGzZ';

    if (IS_BYPASS_NATIVE_SUBSCRIPTION) {
      logConsole('ATTEMPT CONFIRM TEST SUBSCRIPTION!!!');

      yield put(
        Actions.Creators.attemptConfirmSubscription({
          purchase: {
            receipt: TEST_RECEIPT,
            transactionId: 'test',
            transactionDate: null,
            originalTransactionIdentifierIOS: 'test'
          },
          product_id: product_id,
          is_test: IS_BYPASS_NATIVE_SUBSCRIPTION
        })
      );
    } else {
      logConsole(
        'ATTEMPT SUBSCRIBE getSubscriptions PRODUCT_IDS!!!',
        PRODUCT_IDS
      );
      yield call(IAP.getSubscriptions, PRODUCT_IDS);
      logConsole(
        'ATTEMPT SUBSCRIBE requestSubscription product_id!!!',
        product_id
      );
      yield call(IAP.requestSubscription, product_id);
    }
  } catch (err) {}
}

function* doneAttemptSubscribe() {
  try {
    yield put(Actions.Creators.hideVeil());
  } catch (err) {}
}

function* confirmSubscription({payload}) {
  let isSuccess = false;

  const state = yield select();

  try {
    yield put(Actions.Creators.showVeil());

    logConsole('ATTEMPT CONFIRM SUBSCRIPTION!!!');
    logConsole('ATTEMPT CONFIRM SUBSCRIPTION PAYLOAD!!!', payload);

    const finalPayload = {
      platform: IS_ANDROID ? 'android' : 'ios',
      receipt: payload.purchase.receipt,
      product_id: payload.product_id,
      transaction_id:
        payload.purchase.transactionId ||
        state.user.data.subscription?.transaction_id ||
        undefined,
      original_transaction_id:
        (IS_ANDROID
          ? payload.purchase.transactionId
          : payload.purchase.originalTransactionIdentifierIOS) ||
        state.user.data.subscription?.original_transaction_id ||
        undefined,
      transaction_date:
        payload.purchase.transactionDate || payload.purchase.transaction_date
    };

    logConsole('CONFIRM SUBSCRIPTION PAYLOAD!!!', finalPayload);

    let res;
    try {
      res = yield call(API.subscribe, finalPayload);
    } catch (err) {
      logConsole('CALL API SUBSCRIBE ERROR', err);
    }

    logConsole('CONFIRM SUBSCRIPTION RESPONSE STATUS!!!\n\n', res.status);
    logConsole('CONFIRM SUBSCRIPTION RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 201) {
      isSuccess = true;

      yield put(Actions.Creators.requestPushNotificationPermission(true));

      try {
        yield call(logEvent, Events.start_trial);
        yield put(Actions.Creators.attemptAwardReferrer());

        // if (
        //   (!state.user.data.subscription_status?.name ||
        //     state.user.data.subscription_status?.name.toLowerCase() ===
        //       'expired') &&
        //   state.user.subscriptionOnboarding.page > 0
        // ) {
        //   //update meals to share
        //   logConsole("Update User Profile subscriptionOnboarding",state.user.subscriptionOnboarding)
        //   const updateProfileData ={
        //     allergies:state.user.subscriptionOnboarding.allergies,
        //     goal:state.user.subscriptionOnboarding.goal.text,
        //     diet:{
        //       type:state.user.subscriptionOnboarding.diet.text,
        //       days_to_eat_meat:state.user.subscriptionOnboarding.diet.days_to_eat_meat
        //     }
        //   }
        //   logConsole("Update User data",updateProfileData)
        //   const userRes = yield call(API.updateProfile, updateProfileData);

        //   logConsole(
        //     'UPDATE USER MEALS TO SHARE RESPONSE STATUS!!!\n\n',
        //     userRes.status
        //   );
        //   logConsole(
        //     'UPDATE USER MEALS TO SHARE RESPONSE DATA!!!\n\n',
        //     userRes.data
        //   );
        // }
      } catch (err) {
        isSuccess = false;
        Say.err(err);
      }

      yield put(Actions.Creators.setConfirmSubscriptionSuccess());
    }
  } catch (err) {
    isSuccess = false;
  }

  if (isSuccess && state.user.data.subscription_status?.name) {
    yield put(
      Actions.Creators.updateUserData({
        subscription_level: payload.product_id,
        subscription: {
          ...state.user.data.subscription,
          product_id: payload.product_id
        }
      })
    );
    logConsole(
      'CONFIRM SUBSCRIPTION CURRENT ROUTE!!!\n\n',
      navigator()?.getCurrentRoute()?.name
    );
    if (navigator()?.getCurrentRoute()?.name == 'SUBSCRIPTIONS') {
      reset({
        index: 0,
        routes: [
          {
            name: Routes.home
          }
        ]
      });
      logConsole('CONFIRM SUBSCRIPTION CHANGE PREVIOUS!!!\n\n', payload);
    }
  }

  if (isSuccess) {
    yield put(Actions.Creators.checkSubscriptionExpiration());
  }

  logConsole('DONE CONFIRM SUBSCRIPTION!!!');

  yield put(Actions.Creators.doneAttemptConfirmSubscription());
  yield put(Actions.Creators.doneAttemptSubscribe());
  yield put(Actions.Creators.hideVeil());
}

function* changeSubscriptionPlan() {
  try {
    const state = yield select();

    if (state.user.data.subscription?.product_id) {
      let product_ids = state.user.data.subscription.product_id.split('_');
      let subscriptionName = product_ids?.length > 0 ? product_ids[0] : '';

      yield put(
        Actions.Creators.setCanGoToNextSubscriptionOnboardingPage(true)
      );

      yield put(
        Actions.Creators.addToSubscriptionOnboarding({
          plan: {
            product_id: state.user.data.subscription.product_id,
            name: subscriptionName
          }
        })
      );
    }

    navigate(Routes.changeSubscription, {showBackbutton: true});
  } catch (err) {}
}

function* getPlanSummary() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getPlanSummary);

    logConsole('PLAN SUMMARY RESPONSE STATUS!!!\n\n', res.status);

    const state = yield select();

    logConsole('PLAN SUMMARY RESPONSE!!!\n\n', res);
    logConsole(
      'PLAN SUMMARY state.user.onboardingPlan!!!\n\n',
      state.user.onboardingPlan
    );

    if (res.status == 200) {
      yield put(
        Actions.Creators.addToOnboardingPlan({
          goal:
            res.data.data.goal != null
              ? res.data.data.goal
              : state.user.onboardingPlan.goal,
          allergies:
            res.data.data.allergies != null
              ? res.data.data.allergies
              : state.user.onboardingPlan.allergies,
          // cuisines: res.data.data.cuisines != null ? res.data.data.cuisines : state.user.onboardingPlan.cuisines,
          diet: {
            type:
              res.data.data.diet?.type != null
                ? res.data.data.diet?.type
                : state.user.onboardingPlan.diet?.type,
            days_to_eat_meat:
              res.data.data.diet?.days_to_eat_meat != null
                ? res.data.data.diet?.days_to_eat_meat
                : state.user.onboardingPlan.diet?.days_to_eat_meat
          }
          // kitchen_tools: res.data.data.kitchen_tools
        })
      );

      yield put(
        Actions.Creators.updateUserData({
          diet: {
            type:
              res.data.data.diet?.type != null
                ? res.data.data.diet?.type
                : state.user.onboardingPlan.diet?.type,
            days_to_eat_meat:
              res.data.data.diet?.days_to_eat_meat != null
                ? res.data.data.diet?.days_to_eat_meat
                : state.user.onboardingPlan.diet?.days_to_eat_meat
          }
        })
      );

      yield put(Actions.Creators.setPlanSummary(res.data.data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetPlanSummary());
  yield put(Actions.Creators.hideVeil());
}

function* updatePlanSummary({key, data, changePlan}) {
  try {
    yield put(Actions.Creators.showVeil());
    const state = yield select();

    let payload = {};
    if (key == 'time_for_magic') {
      payload = {
        date_of_birth: state.user.onboardingPlan.date_of_birth,
        current_height: state.user.onboardingPlan.current_height,
        current_weight: state.user.onboardingPlan.current_weight,
        gender: state.user.onboardingPlan.gender,
        planning_day: state.user.onboardingPlan.planning_day,
        planning_time: state.user.onboardingPlan.planning_time,
        fitness_level_assessment:
          state.user.onboardingPlan.fitness_level_assessment,
        kitchen_tools: null,
        recalculate: false
      };
    } else if (key === INGREDIENTS_TO_REMOVE_KEY) {
      payload = {
        ...data,
        recalculate: false
      };
    } else {
      if (key == 'goal') data = data.text;
      // if(key == "kitchen_tools" &&  data[0] == "None") data = [];
      if (key == 'diet') {
        data = {
          type: data.text,
          days_to_eat_meat: data.days_to_eat_meat
        };
      }
      payload = {
        [key]: data,
        recalculate: false
      };
    }

    if (key == FAMILY_MEMBER_KEY) {
      logConsole('UPDATE PLAN SUMMARY Update Family Members!!!\n\n', data);
      logConsole(
        'UPDATE PLAN SUMMARY state.user.onboardingPlan!!!\n\n',
        state.user.onboardingPlan.meals_to_share
      );
      let members = [];

      const selectedMembersCount = data == 'None' ? 0 : parseInt(data);
      //check adult members
      for (let i = 1; i <= selectedMembersCount; i++) {
        let member = {
          name: `member ${i}`,
          age_class: 'adult',
          weight_class: '150 - 200 lbs',
          meals_to_share: state.user.onboardingPlan.meals_to_share
        };
        logConsole('UPDATE PLAN SUMMARY MEMBER !!!\n\n', member);
        members.push(member);
      }
      logConsole('UPDATE PLAN SUMMARY ADDED MEMBERS!!!\n\n', members, true);

      //create members
      const addFamilyRes = yield call(API.addFamilyMembers, members);

      logConsole(
        'UPDATE PLAN SUMMARYADD MEMBERS RESPONSE STATUS!!!\n\n',
        addFamilyRes.status
      );
      logConsole(
        'UPDATE PLAN SUMMARY ADD MEMBERS RESPONSE DATA!!!\n\n',
        addFamilyRes.data
      );
      if (addFamilyRes.status == 201) {
        if (changePlan) {
          const returnPageRes = yield call(API.updateProfile, {
            meals_to_share: state.user.onboardingPlan.meals_to_share,
            return_page: ''
          });
          if (returnPageRes.status == 200) {
            logConsole(
              'UPDATE PLAN SUMMARYADD returnPageRes STATUS!!!\n\n',
              returnPageRes.status
            );
            logConsole(
              'UPDATE PLAN SUMMARY ADD returnPageRes DATA!!!\n\n',
              returnPageRes.data
            );
            reset({
              index: 0,
              routes: [
                {
                  name: Routes.home
                }
              ]
            });
          }
        } else {
          const mealToSharePayload = {
            meals_to_share: state.user.onboardingPlan.meals_to_share
          };
          const res = yield call(API.updateProfile, mealToSharePayload);
          if (res.status == 200) {
            yield put(Actions.Creators.updateUserData(mealToSharePayload));
            yield put(Actions.Creators.showToastMessage());
          }
        }
      }
    } else {
      logConsole('UPDATE PLAN SUMMARY payload!!!\n\n', payload);
      const res = yield call(API.updateProfile, payload);

      logConsole('UPDATE PLAN SUMMARY RESPONSE STATUS!!!\n\n', res.status);
      logConsole('UPDATE PLAN SUMMARY RESPONSE DATA!!!\n\n', res.data);

      if (res.status == 200) {
        //yield put(Actions.Creators.attemptGetPlanSummary())
        yield put(Actions.Creators.updateUserData(payload));
        navigate(Routes.myPlan);
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdatePlanSummary());
  yield put(Actions.Creators.hideVeil());
}

function* getTodayDashboard() {
  try {
    const fixed_actions = {
      total_points: {
        name: 'Total Points',
        settings: 'total_points'
      },
      time_saved: {
        name: 'Time Saved',
        settings: 'time_saved'
      },
      money_saved: {
        name: 'Money Saved',
        settings: 'money_saved'
      }
    };

    const res = yield call(API.getTodayDashboard);

    const tipsRes = yield call(API.getVideoTips);

    const discoverRes = yield call(API.getDiscover);

    const categorizedMealsRes = yield call(API.getCategorizedMeals);

    logConsole('TODAY DASHBOARD RESPONSE STATUS!!!\n\n', res.status);
    logConsole('TODAY DASHBOARD RESPONSE DATA!!!\n\n', res.data);

    logConsole('VIDEO TIPS RESPONSE STATUS!!!\n\n', tipsRes.status);
    logConsole('VIDEO TIPS RESPONSE DATA!!!\n\n', tipsRes.data);

    logConsole('DISCOVER RESPONSE STATUS!!!\n\n', discoverRes.status);
    logConsole('DISCOVER RESPONSE DATA!!!\n\n', discoverRes.data);

    logConsole(
      'CATEGORIZED MEALS RESPONSE STATUS!!!\n\n',
      categorizedMealsRes.status
    );
    logConsole(
      'CATEGORIZED MEALS RESPONSE DATA!!!\n\n',
      categorizedMealsRes.data
    );

    if (res.status == 200) {
      let data = {
        meals: res.data.data.meals,
        highlights: [],
        featuredTip: null,
        discover: [],
        categorizedMeals: []
      };

      res.data.data.highlights.map(d => {
        if (fixed_actions[d.settings] !== undefined) {
          fixed_actions[d.settings] = d;
        }
      });

      for (let a in fixed_actions) {
        data.highlights.push(fixed_actions[a]);
      }

      data.highlights = data.highlights.map(h => {
        return {
          ...h,
          name: formatHightlightName(h.name, h.settings)
        };
      });

      if (tipsRes.data.data.results.length > 0) {
        const index = Math.floor(
          Math.random() * tipsRes.data.data.results.length
        );

        data.featuredTip = tipsRes.data.data.results[index];
      }

      if (discoverRes.data.data?.categories) {
        let discovers = [];
        let max = 0;

        discoverRes.data.data.categories.map(c => {
          discovers = discovers.concat(c.items);
        });

        if (discovers.length >= 4) {
          max = 4;
        } else {
          max = discovers.length;
        }

        if (discovers.length > 0) {
          while (data.discover.length < max) {
            const index = Math.floor(Math.random() * discovers.length);

            data.discover.push(discovers[index]);

            discovers.splice(index, 1);
          }
        }
      }

      if (categorizedMealsRes.data.data?.categories) {
        let categories = [];

        categorizedMealsRes.data.data.categories.map(c => {
          categories = categories.concat(c);
        });

        if (categories.length > 0) {
          data.categorizedMeals = categories[0];
        }

        //logConsole('CATEGORIZED MEALS CHECK!!!\n\n', categories[0], true)
      }

      yield put(Actions.Creators.setTodayDashboardData(data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetTodayDashboard());
}

function* getTodayUpcomingMeals() {
  try {
    const res = yield call(API.getTodayUpcomingMeals);

    logConsole('TODAY UPCOMING MEALS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('TODAY UPCOMING MEALS RESPONSE DATA!!!\n\n', res.data);

    const shoppingRes = yield call(API.getShoppingList, {
      hide_completed: true
    });

    logConsole(
      'GET FINAL SHOPPING LIST RESPONSE STATUS!!!\n\n',
      shoppingRes.status
    );
    logConsole(
      'GET FINAL SHOPPING LIST RESPONSE DATA!!!\n\n',
      shoppingRes.data
    );

    if (res.status == 200) {
      let final_shopping_list = [];
      const showFinalizeList = shoppingRes.data.data.show_finalized_list;

      if (shoppingRes.data.data.categories) {
        shoppingRes.data.data.categories.map((l, i) => {
          final_shopping_list = final_shopping_list.concat(l.items);
        });
      }

      yield put(Actions.Creators.setTodayUpcomingMealsData(res.data.data));
      yield put(
        Actions.Creators.setFinalShoppingListItemCount(
          final_shopping_list.length
        )
      );
      yield put(Actions.Creators.setShowFinalizedList(showFinalizeList));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetTodayUpcomingMeals());
}

function* getAllUpcomingMeals() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getAllUpcomingMeals);

    logConsole('ALL UPCOMING MEALS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('ALL UPCOMING MEALS RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(Actions.Creators.setAllUpcomingMeals(res.data.data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetAllUpcomingMeals());
  yield put(Actions.Creators.hideVeil());
}

function* logProgress({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    const finalPayload = {
      date: getCurrentDate(),
      ...payload
    };

    logConsole('LOG PROGRESS PAYLOAD!!!\n\n', finalPayload, true);

    const res = yield call(API.logProgress, finalPayload);

    /*const res = yield call(API.logProgress, {
            date: getCurrentDate(),
            current_weight: {
                date: payload.date,
                unit: payload.weight.unit,
                value: payload.weight.value
            },
            current_waist_size: {
                date: payload.date,
                unit: payload.waistSize.unit,
                value: payload.waistSize.value
            },
            image: payload.photo
        })*/

    logConsole('LOG PROGRESS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('LOG PROGRESS RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 201) {
      yield put(Actions.Creators.setLogProgressSuccess(res.data.data));
      yield put(Actions.Creators.attemptGetUserStatsConfiguration());
      yield put(Actions.Creators.attemptGetTodayDashboard());
      yield put(Actions.Creators.attemptGetUserProfile());
      yield put(Actions.Creators.attemptGetUserProgress());

      yield call(logEvent, Events.progress_log);
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptLogProgress());
  yield put(Actions.Creators.hideVeil());
}

function* getMetricsConfiguration() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getUserMetricsConfiguration);

    logConsole(
      'GET USER METRICS CONFIGURATION RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole('GET USER METRICS CONFIGURATION RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let data = {
        weight: {
          key: UserMetricsConfiguration.weight.key,
          name: UserMetricsConfiguration.weight.label,
          value: res.data.data.weight
        },
        waist_size: {
          key: UserMetricsConfiguration.waist_size.key,
          name: UserMetricsConfiguration.waist_size.label,
          value: res.data.data.waist_size
        },
        a1c: {
          key: UserMetricsConfiguration.a1c.key,
          name: UserMetricsConfiguration.a1c.label,
          value: res.data.data.a1c
        },
        blood_sugar: {
          key: UserMetricsConfiguration.blood_sugar.key,
          name: UserMetricsConfiguration.blood_sugar.label,
          value: res.data.data.blood_sugar
        },
        body_fat: {
          key: UserMetricsConfiguration.body_fat.key,
          name: UserMetricsConfiguration.body_fat.label,
          value: res.data.data.body_fat
        }
      };

      yield put(Actions.Creators.setUserMetricsConfiguration(data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetUserMetricsConfiguration());
  yield put(Actions.Creators.hideVeil());
}

function* updateMetricsConfiguration({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole(
      'UPDATE USER METRICS CONFIGURATION PAYLOAD!!!\n\n',
      payload,
      true
    );

    const state = yield select();

    const res = yield call(API.updateUserMetricsConfiguration, {
      [payload.key]: payload.value
    });

    logConsole(
      'UPDATE USER METRICS CONFIGURATION RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole(
      'UPDATE USER METRICS CONFIGURATION RESPONSE DATA!!!\n\n',
      res.data
    );

    if (res.status == 200) {
      //let userData = Immutable.asMutable(state.user.data, { deep: true })

      yield put(Actions.Creators.updateUserMetricsConfiguration(payload));

      /*userData.highlights = userData.highlights.map(h => {
                if (h.settings == payload.key) {
                    h.hidden = !payload.value
                }

                return h
            })

            yield put(Actions.Creators.updateUserData(userData))*/
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateUserMetricsConfiguration());
  yield put(Actions.Creators.hideVeil());
}

function* getStatsConfiguration() {
  try {
    yield put(Actions.Creators.showVeil());

    const profileRes = yield call(API.getProfile);
    const res = yield call(API.getUserStatsConfiguration);

    logConsole('GET USER PROFILE RESPONSE STATUS!!!\n\n', profileRes.status);
    logConsole('GET USER PROFILE RESPONSE DATA!!!\n\n', profileRes.data);

    logConsole(
      'GET USER STATS CONFIGURATION RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole('GET USER STATS CONFIGURATION RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      let profileHighlights = {};

      profileRes.data.data.highlights.map(h => {
        profileHighlights[h.settings] = {
          ...h
        };
      });

      //logConsole('CURRENT_WEIGHT!!!\n\n', profileRes.data.data.current_weight, true)

      let data = {
        weight: {
          //...profileHighlights[UserMetricsConfiguration.weight.key],
          key: UserMetricsConfiguration.weight.key,
          name: UserMetricsConfiguration.weight.label,
          value: `${profileRes.data.data.current_weight?.value} ${profileRes.data.data.current_weight?.unit}`,
          enabled: res.data.data.weight
        },
        waist_size: {
          ...profileHighlights[UserMetricsConfiguration.waist_size.key],
          key: UserMetricsConfiguration.waist_size.key,
          name: UserMetricsConfiguration.waist_size.label,
          enabled: res.data.data.waist_size
        },
        a1c: {
          ...profileHighlights[UserMetricsConfiguration.a1c.key],
          key: UserMetricsConfiguration.a1c.key,
          name: UserMetricsConfiguration.a1c.label,
          enabled: res.data.data.a1c
        },
        blood_sugar: {
          ...profileHighlights[UserMetricsConfiguration.blood_sugar.key],
          key: UserMetricsConfiguration.blood_sugar.key,
          name: UserMetricsConfiguration.blood_sugar.label,
          enabled: res.data.data.blood_sugar
        },
        body_fat: {
          ...profileHighlights[UserMetricsConfiguration.body_fat.key],
          key: UserMetricsConfiguration.body_fat.key,
          name: UserMetricsConfiguration.body_fat.label,
          enabled: res.data.data.body_fat
        }
      };

      yield put(Actions.Creators.setUserStatsConfiguration(data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetUserStatsConfiguration());
  yield put(Actions.Creators.hideVeil());
}

function* updateStatsConfiguration({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    const state = yield select();

    logConsole('UPDATE USER STATS CONFIGURATION PAYLOAD!!!\n\n', payload, true);

    const res = yield call(API.updateUserStatsConfiguration, {
      [UserStatsConfiguration.weight.key]:
        payload[UserStatsConfiguration.weight.key].enabled,
      [UserStatsConfiguration.waist_size.key]:
        payload[UserStatsConfiguration.waist_size.key].enabled,
      [UserStatsConfiguration.a1c.key]:
        payload[UserStatsConfiguration.a1c.key].enabled,
      [UserStatsConfiguration.blood_sugar.key]:
        payload[UserStatsConfiguration.blood_sugar.key].enabled,
      [UserStatsConfiguration.body_fat.key]:
        payload[UserStatsConfiguration.body_fat.key].enabled
    });

    logConsole(
      'UPDATE USER STATS CONFIGURATION RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole(
      'UPDATE USER STATS CONFIGURATION RESPONSE DATA!!!\n\n',
      res.data,
      true
    );

    if (res.status == 200) {
      let configuration = Immutable.asMutable(
        state.user.myStatsConfiguration.data,
        {deep: true}
      );

      configuration[UserStatsConfiguration.weight.key].enabled =
        payload[UserStatsConfiguration.weight.key].enabled;
      configuration[UserStatsConfiguration.waist_size.key].enabled =
        payload[UserStatsConfiguration.waist_size.key].enabled;
      configuration[UserStatsConfiguration.a1c.key].enabled =
        payload[UserStatsConfiguration.a1c.key].enabled;
      configuration[UserStatsConfiguration.blood_sugar.key].enabled =
        payload[UserStatsConfiguration.blood_sugar.key].enabled;
      configuration[UserStatsConfiguration.body_fat.key].enabled =
        payload[UserStatsConfiguration.body_fat.key].enabled;

      yield put(Actions.Creators.setUserStatsConfiguration(configuration));

      goBack();
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateUserStatsConfiguration());
  yield put(Actions.Creators.hideVeil());
}

function* shareProgress({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.shareProgress);

    logConsole('SHARE PROGRESS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('SHARE PROGRESS RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 201) {
      if (res.data.data.points > 0) {
        Say.ok(`You've earned ${res.data.data.points} points.`, 'Congrats', {
          showIcon: true,
          hideButtons: true
          //onClose: () => navigate(Routes.shareProgressSuccess, payload)
        });
      } else {
        //navigate(Routes.shareProgressSuccess, payload)
      }

      yield put(Actions.Creators.setShareProgressSuccess());
      yield put(Actions.Creators.attemptGetUserProfile());
      yield put(Actions.Creators.attemptGetTodayDashboard());
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptShareProgress());
  yield put(Actions.Creators.hideVeil());
}

function* logMeasurement({payload, source}) {
  try {
    yield put(Actions.Creators.showVeil());

    const date = getCurrentDate();

    logConsole(
      'LOG MEASUREMENT PAYLOAD!!!\n\n',
      {
        date,
        ...payload
      },
      true
    );

    const state = yield select();

    const res = yield call(API.logMeasurement, {
      date,
      ...payload
    });

    logConsole('LOG MEASUREMENT RESPONSE STATUS!!!\n\n', res.status);
    logConsole('LOG MEASUREMENT RESPONSE DATA!!!\n\n', res.data, true);

    if (res.status == 201) {
      const highlightsRes = yield call(API.getHighlights);

      logConsole(
        'GET HIGHLIGHTS (AFTER LOG MEASUREMENT) RESPONSE STATUS!!!\n\n',
        highlightsRes.status
      );
      logConsole(
        'GET HIGHLIGHTS (AFTER LOG MEASUREMENT) RESPONSE DATA!!!\n\n',
        highlightsRes.data,
        true
      );

      let userData = Immutable.asMutable(state.user.data, {deep: true});

      let weight_change = null;

      if (payload.type == Highlights.weight.key) {
        weight_change = highlightsRes.data.data.results.filter(
          r => r.settings == Highlights.weight.key
        )[0].value;

        userData.current_weight.value = res.data.data.value;
        userData.current_weight.change = weight_change; //res.data.data.change
      } else if (payload.type == Highlights.waist_size.key) {
        userData.current_waist_size.value = res.data.data.value;
        userData.current_waist_size.change = res.data.data.change;
      }

      userData.highlights = userData.highlights.map(h => {
        if (h.settings == payload.type) {
          const value =
            h.settings == Highlights.weight.key
              ? weight_change /*res.data.data.change*/
              : payload.value;

          h.value = value ? `${value}` : '';
          h.unit = payload.unit;
          h.change = res.data.data.change;
        }

        userData.metrics[payload.type] = {
          ...userData.metrics[payload.type],
          value: res.data.data.value,
          change: res.data.data.change
        };

        return h;
      });

      yield put(Actions.Creators.updateUserData(userData));

      if (source) {
        switch (source) {
          case 'screen_chart':
            yield put(
              Actions.Creators.attemptGetUserMeasurements({
                chartType: payload.type
              })
            );
            break;
        }
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptLogMeasurement());
  yield put(Actions.Creators.hideVeil());
}

function* getMeasurements({params: {chartType, endpoint}}) {
  try {
    yield put(Actions.Creators.showVeil());

    //const currentDate = moment()

    let queryString = `type=${chartType}&count=7`;

    if (endpoint) {
      const endpoint_split = endpoint.split('?');
      queryString = endpoint_split[1];
    }

    const res = yield call(API.getMeasurements, queryString);

    /*const res = yield call(API.getMeasurements, {
            from: moment(currentDate.clone().subtract(6, 'days')).format('YYYY-MM-DD'),
            days: 7,
            type: chartType
        })*/

    logConsole('GET MEASUREMENTS RESPONSE STATUS!!!\n\n', res.status);
    logConsole(
      'GET MEASUREMENTS RESPONSE DATA!!!\n\n',
      JSON.stringify(res.data, null, 2)
    );

    if (res.status == 200) {
      let chart = {
        currentIndex: 0,
        vLabels: [],
        hLabels: [],
        hiddenPoints: []
      };

      let vLabels = {};

      const hasData = [];

      //reorder graph (ascending or left to right) and logs (descending)
      res.data.data.days.sort(function (a, b) {
        return moment(a.date).isAfter(b.date);
      });

      if (res.data.data.days.length > 0) {
        res.data.data.days.map(d => {
          hasData.push(
            `${moment(d.date).format('M')}_${moment(d.date).format('D')}`
          );
          vLabels[
            `${moment(d.date).format('M')}_${moment(d.date).format('D')}`
          ] = d.value;

          chart.hLabels.push(moment(d.date).format('MMM D'));
        });
      } else {
        chart.hLabels.push(moment().format('MMM D'));
      }

      let index = 0;
      let latestInput = 0;
      if (Object.keys(vLabels).length > 0) {
        for (let v in vLabels) {
          if (hasData.indexOf(v) < 0) {
            chart.hiddenPoints.push(index);
          }

          if (vLabels[v] > 0.0) {
            latestInput = vLabels[v];
            chart.currentIndex = index;
          }

          chart.vLabels.push(vLabels[v]);

          index += 1;
        }
      } else {
        chart.vLabels.push(0);
      }

      yield put(
        Actions.Creators.setUserMeasurements({
          ...res.data.data,
          current_value: res.data.data.current_value || 0,
          days: res.data.data.days.filter(d => d.change !== null).reverse(),
          chart
        })
      );

      logConsole(JSON.stringify(chart.vLabels, null, 2));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetUserMeasurements());
  yield put(Actions.Creators.hideVeil());
}

function* deleteAccount() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.deleteUserAccount);

    logConsole('DELETE USER ACCOUNT RESPONSE STATUS!!!\n\n', res.status);
    logConsole('DELETE USER ACCOUNT RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 204) {
      yield call(logEvent, Events.unsubscribe);
      yield put(Actions.Creators.logout());
      Say.ok('Account successfully deleted');
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptDeleteUserAccount());
  yield put(Actions.Creators.hideVeil());
}

function* getAddresses({params}) {
  try {
    logConsole('GET ADDRESSES PAYLOAD', params);

    const res = yield call(API.getSavedAddresses, params);

    logConsole('GET ADDRESSES RESPONSE STATUS', res.status);
    logConsole('GET ADDRESSES RESPONSE DATA', res.data, true);

    if (res.status == 200) {
      const count = res.data.data.addresses.length;
      yield put(Actions.Creators.setSavedAddresses(res.data.data.addresses));

      if (count > 0) {
        const recentAddress = res.data.data.addresses[count - 1];

        logConsole('RECENT SAVED ADDRESS!!!\n', recentAddress, true);

        /*yield put(Actions.Creators.updateCart({
                    deliver_to: {
                        ...recentAddress
                    }
                }))*/

        //yield call(API.updateCart, recentAddress)

        /*if (params.getStores) {
                    yield put(Actions.Creators.attemptGetStores(recentAddress.id))
                }*/

        /*yield put(Actions.Creators.updateOrderDetails({
                    deliveryAddress: recentAddress,
                    latitude: recentAddress.latitude,
                    longitude: recentAddress.longitude
                }))*/

        /*if(params.getStores) {
                    yield put(Actions.Creators.attemptGetStores({
                        q: recentAddress.id
                    }))
                }*/
      }
      /*else {
                yield put(Actions.Creators.updateCart({
                    deliver_to: null
                }))
            }*/
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetSavedAddresses());
}

function* addAddress({payload}) {
  try {
    logConsole('ADD ADDRESS PAYLOAD', payload);

    const res = yield call(API.addAddress, {
      street: payload.street,
      unit: payload.unit,
      city: payload.city,
      state: payload.state,
      country: payload.country,
      zip_code: payload.zip_code
    });

    logConsole('ADD ADDRESS RESPONSE STATUS', res.status);
    logConsole('ADD ADDRESS RESPONSE DATA', res.data);

    if (res.status == 201) {
      yield put(
        Actions.Creators.attemptGetSavedAddresses({
          getStores: true
        })
      );

      navigate(Routes.selectStore);
      //yield put(Actions.Creators.goToNextSheetDialogPage())
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptAddAddress());
}

function* updateAddress({id, payload}) {
  try {
    logConsole('UPDATE ADDRESS ID', id);
    logConsole('UPDATE ADDRESS PAYLOAD', payload);

    const res = yield call(API.updateAddress, id, payload);

    logConsole('UPDATE ADDRESS RESPONSE STATUS', res.status);
    logConsole('UPDATE ADDRESS RESPONSE DATA', res.data);

    if (res.status == 200) {
      yield put(
        Actions.Creators.attemptGetSavedAddresses({
          getStores: true
        })
      );

      navigate(Routes.selectStore);
      //yield put(Actions.Creators.goToNextSheetDialogPage())
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateAddress());
}

function* deleteAddress({id}) {
  try {
    logConsole('DELETE ADDRESS ID', id);

    const res = yield call(API.deleteAddress, id);

    logConsole('DELETE ADDRESS RESPONSE STATUS', res.status);
    logConsole('DELETE ADDRESS RESPONSE DATA', res.data);

    if (res.status == 204) {
      yield put(
        Actions.Creators.attemptGetSavedAddresses({
          getStores: true
        })
      );

      navigate(Routes.selectStore);
      //yield put(Actions.Creators.goToNextSheetDialogPage())
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptDeleteAddress());
}

function* getProgress({params = {}}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('GET USER PROGRESS PARAMS', params);

    let queryString = '';

    if (params.endpoint) {
      const endpoint_split = params.endpoint.split('?');
      queryString = endpoint_split[1];
    }

    //yield put(Actions.Creators.attemptGetUserStatsConfiguration())

    const res = yield call(API.getUserProgress, queryString);

    logConsole('GET USER PROGRESS RESPONSE STATUS', res.status);
    logConsole('GET USER PROGRESS RESPONSE DATA', res.data, true);

    if (res.status == 200) {
      yield put(Actions.Creators.setUserProgress(res.data.data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetUserProgress());
  yield put(Actions.Creators.hideVeil());
}

function* getAchievements() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getUserAchievements);

    logConsole('GET USER ACHIEVEMENTS RESPONSE STATUS', res.status);
    logConsole('GET USER ACHIEVEMENTS RESPONSE DATA', res.data);

    if (res.status == 200) {
      let milestones = [
        {logged_meals: 4, source: 'milestone'},
        {logged_meals: 8, source: 'milestone'},
        {logged_meals: 12, source: 'milestone'},
        {logged_meals: 20, source: 'milestone'},
        {logged_meals: 25, source: 'milestone'},
        {logged_meals: 33, source: 'milestone'},
        {logged_meals: 41, source: 'milestone'},
        {logged_meals: 53, source: 'milestone'},
        {logged_meals: 65, source: 'milestone'},
        {logged_meals: 77, source: 'milestone'},
        {logged_meals: 100, source: 'milestone'}
      ];
      let user_milestones = [];

      if (res.data.data.milestones.length > 0) {
        res.data.data.milestones.map((m, i) => {
          user_milestones.push(m.logged_meals);

          if (i >= 11) {
            milestones.push(m);
          }
        });
      }

      yield put(
        Actions.Creators.setUserAchievements({
          ...res.data.data,
          milestones,
          user_milestones
        })
      );
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetUserAchievements());
  yield put(Actions.Creators.hideVeil());
}

function* getMeasurementGoals({chartType}) {
  try {
    const res = yield call(API.getUserMeasurementGoals);

    logConsole('GET USER MEASUREMENT GOALS RESPONSE STATUS!!!\n\n', res.status);
    logConsole(
      'GET USER MEASUREMENT GOALS RESPONSE DATA!!!\n\n',
      res.data,
      true
    );

    if (res.status == 200) {
      let data = null;

      res.data.data.map(d => {
        if (d.type == chartType) {
          data = d;
        }
      });

      yield put(Actions.Creators.setUserMeasurementGoals(data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetUserMeasurementGoals());
}

function* updateMeasurementGoal({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('UPDATE USER MEASUREMENT GOAL PAYLOAD!!!\n\n', payload, true);

    const res = yield call(API.updateUserMeasurementGoal, payload);

    logConsole(
      'UPDATE USER MEASUREMENT GOALS RESPONSE STATUS!!!\n\n',
      res.status
    );
    logConsole(
      'UPDATE USER MEASUREMENT GOALS RESPONSE DATA!!!\n\n',
      res.data,
      true
    );

    if (res.status == 201) {
      yield put(Actions.Creators.setUpdateUserMeasurementGoalSuccess());
      yield put(Actions.Creators.setUserMeasurementGoals(res.data.data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptUpdateUserMeasurementGoal());
  yield put(Actions.Creators.hideVeil());
}

function* addTag({tag_name}) {
  try {
    logConsole('ADD USER TAG', tag_name);

    const state = yield select();

    yield call(API.addUserTag, tag_name);

    yield put(
      Actions.Creators.updateUserData({
        tag_names: [...state.user.data.tag_names, tag_name]
      })
    );
  } catch (err) {}
}

function* sendSurveyReminder() {
  try {
    const state = yield select();

    if (
      state.user.data &&
      state.user.data.tag_names.indexOf(Tag.sendSurveyReminder) < 0
    ) {
      const today = moment().add(1, 'days');

      const fireDate = new Date(
        today.format('YYYY'),
        parseInt(today.format('MM')) - 1,
        today.format('DD')
      );

      yield call(
        LocalPushNotification.showScheduledNotification,
        PUSH_NOTIFICATION_CHANNEL.surveyReminder,
        `Make ${APP_NAME} better!!!`,
        `Help us make ${APP_NAME} better by participating our short survey.`,
        null,
        {
          date: fireDate
        }
      );

      yield put(Actions.Creators.attemptAddUserTag(Tag.sendSurveyReminder));

      logConsole('SEND SURVEY REMINDER SUCCESS', fireDate);
    }
  } catch (err) {
    logConsole('SEND SURVEY REMINDER ERROR!!!', err);
  }
}

function* goToOnboardingPageByReturnPageData({
  return_page,
  is_return_to_welcome
}) {
  try {
    if (return_page) {
      let hasProperValue = true;
      console.log(
        'goToOnboardingPageByReturnPageData return_page',
        return_page
      );
      switch (return_page) {
        // case 'diet':
        //   yield put(Actions.Creators.goToSubscriptionOnboardingPage(2));
        //   break;
        // case 'cuisine':
        //   yield put(Actions.Creators.goToOnboardingPage(1));
        //   break;
        case 'family_member':
          is_return_to_welcome = false;
          yield put(Actions.Creators.goToOnboardingPage(1));
          break;
        // case 'fitness_level_assessment':
        //   yield put(Actions.Creators.goToOnboardingPage(7));
        //   break;
        default:
          hasProperValue = false;
      }

      //make sure return_value is one of the cases indicated in switch block
      if (hasProperValue) {
        if (is_return_to_welcome) replace(Routes.welcome);
        else {
          if (return_page == FAMILY_MEMBER_KEY) {
            navigate(Routes.onBoarding, {
              pages: [1],
              isEditing: true,
              changePlan: true,
              key: FAMILY_MEMBER_KEY,
              fromReturnPage: true // JKF - this should bypass this conition :  if(allUpcomingMeals == null || allUpcomingMeals.meals?.length == 0){...} ON src/screens/OnBoarding/index.js
            });
          } else {
            replace(Routes.onBoarding);
          }
        }
      }
    }
  } catch (err) {}
}

function* checkSubscriptionExpiration() {
  try {
    const state = yield select();
    const previous_subscription = yield call(
      AsyncStorage.getItem,
      'previous_subscription'
    );
    const parsedPreviousSubscription = JSON.parse(previous_subscription);

    logConsole('CHECK SUBSCRIPTION EXPIRATION!!!');

    const res = yield call(API.getProfile);
    logConsole(
      'GET USER PROFILE FROM CHECK SUBSCRIPTION EXPIRATION RESPONSE STATUS!!!',
      res.status
    );
    logConsole(
      'GET USER PROFILE FROM CHECK SUBSCRIPTION EXPIRATION RESPONSE DATA!!!',
      res.data
    );

    logConsole(
      'checkSubscriptionExpiration NEW SUBSCRIPTION!!!',
      res.data.data.profile.subscription
    );
    logConsole(
      'checkSubscriptionExpiration PREVIOUS SUBSCRIPTION!!!',
      parsedPreviousSubscription
    );

    if (res.status == 200) {
      const isSameProductId =
        parsedPreviousSubscription &&
        parsedPreviousSubscription.product_id != null
          ? res.data.data.profile.subscription?.product_id.substring(0, 3) ===
            parsedPreviousSubscription.product_id.substring(0, 3)
          : true;
      logConsole(
        'checkSubscriptionExpiration isSameProductId!!!',
        isSameProductId
      );

      yield put(
        Actions.Creators.updateUserData({
          subscription_level: res.data.data.profile.subscription?.product_id,
          subscription: {
            ...res.data.data.profile.subscription,
            product_id: res.data.data.profile.subscription?.product_id || null
          },
          subscription_status: res.data.data.profile.subscription_status,
          previous_subscription: parsedPreviousSubscription
            ? isSameProductId
              ? parsedPreviousSubscription
              : undefined
            : undefined
        })
      );
      const isReceiptEmpty = res.data.data.profile.subscription.receipt == '{}';
      logConsole(
        `checkSubscriptionExpiration  SUBSCRIPTION OBJECT:`,
        res.data.data.profile.subscription
      );
      logConsole(
        `checkSubscriptionExpiration  SUBSCRIPTION STATUS OBJECT:`,
        res.data.data.profile.subscription_status
      );
      logConsole(
        `checkSubscriptionExpiration  SUBSCRIPTION STATUS:`,
        res.data.data.profile.subscription_status.name
      );
      logConsole(
        `checkSubscriptionExpiration  isReceiptEmpty:`,
        isReceiptEmpty
      );
      if (
        res.data.data.profile.subscription_status?.name.toLowerCase() ===
          'expired' ||
        isReceiptEmpty
        // true
      ) {
        logConsole(
          `SUBSCRIPTION STATUS: ${res.data.data.profile.subscription_status.name}`
        );
        Say.custom(
          'The latest payment for your subscription has failed. Please verify your payment method now',
          'Subscription expired',
          {
            showIcon: true,
            iconName: 'alert-circle-outline',
            positiveText: 'Verify payment method',
            iconColor: Colors.mute,
            positiveButtonProps: {
              sm: true
            },
            modalProps: {
              dismissable: false
            },
            forceShowButtons: true,
            onConfirm: () => {
              store.dispatch({
                type: Actions.Types.ATTEMPT_SUBSCRIBE,
                product_id:
                  res.data.data.profile.subscription?.product_id ||
                  state.user.data.subscription.product_id
              });
            },
            type: 'confirmation',
            negativeText: 'Manage Subscription', // ony show when previous subscription is sta or duo
            negativeButtonProps: {
              sm: true
            },
            onDeny: () => {
              logConsole('CHANGE PLAN');
              store.dispatch({
                type: Actions.Types.ADD_TO_SUBSCRIPTION_ONBOARDING,
                data: {
                  plan: {
                    product_id: 'lifestyle_84_annual',
                    name: 'lifestyle'
                  }
                }
              });

              navigate(Routes.changeSubscription);
            },
            onClose: () => store.dispatch({type: Actions.Types.LOGOUT})
          }
        );
      } else {
        if (!isSameProductId) {
          logConsole('goToOnboardingPageByReturnPageData open family_member');
          logConsole('SETTING RETURN PAGE TO FAMILY MEMBER');
          yield put(
            Actions.Creators.updateUserData({
              previous_subscription: res.data.data.profile.subscription
            })
          );
          yield call(
            AsyncStorage.setItem,
            'previous_subscription',
            JSON.stringify(res.data.data.profile.subscription)
          );
          const returnPageRes = yield call(API.updateProfile, {
            return_page: `family_member`
          });
          logConsole(
            'UPDATE RETURN PAGE STATUS TO FAMILY MEMBER STATUS',
            returnPageRes.status
          );
          logConsole(
            'UPDATE RETURN PAGE STATUS TO FAMILY MEMBER DATA',
            returnPageRes.data
          );
          if (returnPageRes.status == 200) {
            store.dispatch({
              type: Actions.Types.GO_TO_ONBOARDING_PAGE,
              page: 1
            });
            navigate(Routes.onBoarding, {
              pages: [1],
              isEditing: true,
              changePlan: true,
              key: FAMILY_MEMBER_KEY,
              fromReturnPage: true // JKF - this should bypass this conition :  if(allUpcomingMeals == null || allUpcomingMeals.meals?.length == 0){...} ON src/screens/OnBoarding/index.js
            });
          }
        }
      }
    }
  } catch (err) {}
}

function* accessFeature({feature, callbackIfAccessible}) {
  try {
    if (isFeatureAccessible(feature)) {
      if (callbackIfAccessible !== undefined) {
        callbackIfAccessible();
      }
    } else {
      Say.ask(
        'You need to upgrade your current subscription to access this feature.',
        'Upgrade Plan',
        {
          positiveText: 'Upgrade Now',
          onConfirm: () => {
            store.dispatch({type: Actions.Types.CHANGE_SUBSCRIPTION_PLAN});
          },
          showIcon: true,
          alertProps: {
            showClose: false,
            modalProps: {
              dismissable: false
            }
          }
        }
      );
    }
  } catch (err) {}
}

function* setNextAppReview() {
  try {
    yield call(setNextAppReviewPrompt);
  } catch (error) {}
}

function* rateApp() {
  try {
    const hasFlowFinishedSuccessfully = yield call(
      InAppReview.RequestInAppReview
    );

    logConsole('APP REVIEW RESPONSE', hasFlowFinishedSuccessfully);
    store.dispatch({type: Actions.Types.ATTEMPT_SET_NEXT_APP_REVIEW});
    // // Only tag user if rating is successful
    // if (hasFlowFinishedSuccessfully) {
    //   yield put(Actions.Creators.attemptAddUserTag(Tag.appReview));
    // } else {
    //   Say.ask(
    //     "We're working to improve the experience and would appreciate your feedback.",
    //     `Make ${APP_NAME} better`,
    //     {
    //       positiveText: 'Sure!',
    //       onConfirm: () => {
    //         Linking.openURL('https://www.surveymonkey.com/r/HKTLGL9');

    //         store.dispatch({
    //           type: Actions.Types.ATTEMPT_ADD_USER_TAG,
    //           tag_name: Tag.appReview
    //         });
    //       },
    //       negativeText: 'Not now',
    //       onDeny: () => {
    //         store.dispatch({type: Actions.Types.ATTEMPT_SET_NEXT_APP_REVIEW});
    //       },
    //       onClose: () => {
    //         store.dispatch({type: Actions.Types.ATTEMPT_SET_NEXT_APP_REVIEW});
    //       }
    //     }
    //   );
    // }
  } catch (err) {
    logConsole('APP REVIEW ERROR', err);
    store.dispatch({type: Actions.Types.ATTEMPT_SET_NEXT_APP_REVIEW});
  }
}

function* showIntercom({callback}) {
  try {
    const state = yield select();

    const res = yield call(Intercom.registerIdentifiedUser, {
      email: state.user.data.email,
      userId: `${state.user.data.id}`
    });

    logConsole('ShowIntercom', res);

    typeof callback === 'function' && callback();
  } catch (error) {
    logConsole('SHOW INTERCOM ERROR', error);
  }
}

function* setSubscriptionOnboardingProfile() {
  const state = yield select();

  try {
    yield put(Actions.Creators.showVeil());

    logConsole('SET SUBSCRIPTION ONBOARDING!!!');
    logConsole('Update User state.user', state.user);

    const updateProfileData = {
      allergies: state.user.subscriptionOnboarding.allergies,
      diet: {
        type: state.user.subscriptionOnboarding.diet.text,
        days_to_eat_meat:
          state.user.subscriptionOnboarding.diet.days_to_eat_meat
      }
    };
    logConsole('Update User data', updateProfileData);
    const userRes = yield call(API.updateProfile, updateProfileData);

    logConsole('UPDATE USER PROFILE RESPONSE STATUS!!!\n\n', userRes.status);
    logConsole('UPDATE USER PROFILE RESPONSE DATA!!!\n\n', userRes.data);

    yield put(Actions.Creators.updateUserData({...updateProfileData}));
    if (state.auth.isLoggedIn) {
      replace(Routes.home);
    }
  } catch (err) {
    Say.err(err, {
      onClose: () =>
        store.dispatch({
          type: Actions.Types.GO_TO_SUBSCRIPTION_ONBOARDING_PAGE,
          page: 0
        })
    });
  }

  yield put(Actions.Creators.hideVeil());
}

function* updateUsersAppsflyerProfile({payload}) {
  try {
    const res = yield call(API.updateProfile, {
      metadata: payload
    });

    if (res.status == 200) {
      yield put(Actions.Creators.updateUsersAppsFlyerProfileComplete(payload));
    }
  } catch (err) {}
}

function* attemptShowReferFriend({}) {
  const {user} = yield select();

  if (user?.data?.subscription?.trial) {
    return;
  }

  const dateToday = +moment().format('YYYYMMDD');
  if (!!user.referaFriendLastShown && user.referaFriendLastShown >= dateToday) {
    return;
  }

  yield put(Actions.Creators.showReferFriend());
}

function* attemptAwardReferrer() {
  const state = yield select();
  const metadata = state.user.data?.metadata;
  const isReffererRewarded = metadata?.is_referrer_rewarded;
  const referrer_id = metadata?.referrer_id;

  // JKF - if there is a referrer_id and isReffererRewarded is set to false
  // then reward the referrer
  if (!isReffererRewarded && !!referrer_id) {
    // JKF - rewarding the referrer
    const referrerRes = yield call(API.createUserReferral, {
      referrer: referrer_id
    });

    logEvent(Events.referral_subscribe);

    if (referrerRes.status === 201 || referrerRes.status === 200) {
      // JKF - this update the metadata of user to set is_referrer_rewarded to true
      // meaening the refferer is already rewarded
      yield call(API.updateProfile, {
        metadata: {...metadata, is_referrer_rewarded: true}
      });

      yield put(
        Actions.Creators.updateUserData({
          metadata: {...metadata, is_referrer_rewarded: true}
        })
      );
    }
  }
}

function* updateUsersMeta({payload}) {
  const state = yield select();

  const metadata = {...state.user.data.metadata, ...payload};

  const res = yield call(API.updateProfile, {
    metadata
  });

  if (res.status === 200) {
    yield put(Actions.Creators.doneUpdateUsersMeta(metadata));
  }
}

function* sendOtp({payload: {onSendOtp, ...payload}}) {
  let errorMessage =
    'Something went wrong while sending OTP, please try again later';
  try {
    const res = yield call(API.sendOtp, payload);

    if (res.status === 200) {
      onSendOtp?.();
    } else if (res.status !== 500 && res.data?.data?.message) {
      errorMessage = res.data?.data?.message;
      Say.err(errorMessage);
    }
  } catch (error) {
    Say.err(errorMessage);
  } finally {
    yield put(Actions.Creators.doneAttemptSendOtp());
  }
}

function* verifyOtp({payload: {onVerifyFail, fromEditProfile, ...payload}}) {
  let errorMessage =
    'Something went wrong while verifying your OTP, please try again later';

  try {
    // VALIDATE OTP
    let res = yield call(API.validateOtp, payload);
    const data = res.data?.data;
    const isSuccess = res.status === 200;

    if (isSuccess && data?.status === 'approved') {
      // UPDATE USER PROFILE
      const res = yield call(API.updateProfile, {
        phone_number: payload.number
      });

      if (res.status === 200) {
        yield put(
          Actions.Creators.updateUserData({
            phone_number: payload.number
          })
        );

        yield put(Actions.Creators.doneAttemptVerifyOtp());

        if (fromEditProfile) {
          goBack();
        } else {
          // NAVIGATE TO NEXT ROUTE
          const state = yield select();
          const userData = state.user.data;
          const userHasSubscription = !!userData.subscription?.product_id;
          const nextRoute = userHasSubscription
            ? Routes.home
            : Routes.subscriptions;

          replace(nextRoute);
        }
      }
    } else if (isSuccess && data?.status !== 'approved') {
      onVerifyFail('Invalid OTP');
    }

    if (res.status !== 500 && res.data?.data?.message) {
      errorMessage = res.data?.data?.message;
      Say.err(errorMessage);
    }
  } catch (error) {
    Say.err(errorMessage);
  } finally {
    yield put(Actions.Creators.doneAttemptVerifyOtp());
  }
}

export default function* () {
  yield takeLatest(Actions.Types.ATTEMPT_FORGOT_PASSWORD, forgotPassword);
  yield takeLatest(
    Actions.Types.ATTEMPT_CREATE_NEW_PASSWORD,
    createNewPassword
  );
  yield takeLatest(Actions.Types.ATTEMPT_CHANGE_PASSWORD, changePassword);
  yield takeLatest(Actions.Types.ATTEMPT_GET_USER_PROFILE, getUserProfile);
  yield takeLatest(Actions.Types.ATTEMPT_EDIT_USER_PROFILE, editUserProfile);
  yield takeLatest(
    Actions.Types.ATTEMPT_UPDATE_USER_MANDATORY_DATA,
    updateMandatoryData
  );
  yield takeLatest(Actions.Types.ATTEMPT_UPDATE_USER_WHY, updateWhy);
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_HIGHLIGHT_SETTINGS,
    getHighlightSettings
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_UPDATE_HIGHLIGHT_SETTINGS,
    updateHighlightSettings
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_RESTORE_SUBSCRIPTION,
    restoreSubscription
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_USER_NOTIFICATION_SETTINGS,
    getNotificationSettings
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_USER_MEAL_NOTIFICATION_SETTINGS,
    getMealNotificationSettings
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_UPDATE_USER_MEAL_NOTIFICATION_SETTINGS,
    updateMealNotificationSettings
  );
  yield takeLatest(Actions.Types.ATTEMPT_CALCULATE_PLAN, calculatePlan);
  yield takeLatest(
    Actions.Types.ATTEMPT_SKIP_ONBOARDING_CALCULATION,
    skipCalculatePlan
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_SUBSCRIPTION_PURCHASE_HISTORY,
    getSubscriptionPurchaseHistory
  );
  yield takeLatest(Actions.Types.ATTEMPT_SUBSCRIBE, attemptSubscribe);
  yield takeLatest(Actions.Types.DONE_ATTEMPT_SUBSCRIBE, doneAttemptSubscribe);
  yield takeLatest(
    Actions.Types.ATTEMPT_CONFIRM_SUBSCRIPTION,
    confirmSubscription
  );
  yield takeLatest(
    Actions.Types.CHANGE_SUBSCRIPTION_PLAN,
    changeSubscriptionPlan
  );
  yield takeLatest(Actions.Types.ATTEMPT_GET_PLAN_SUMMARY, getPlanSummary);
  yield takeLatest(
    Actions.Types.ATTEMPT_UPDATE_PLAN_SUMMARY,
    updatePlanSummary
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_TODAY_DASHBOARD,
    getTodayDashboard
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_TODAY_UPCOMING_MEALS,
    getTodayUpcomingMeals
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_ALL_UPCOMING_MEALS,
    getAllUpcomingMeals
  );
  yield takeLatest(Actions.Types.ATTEMPT_LOG_PROGRESS, logProgress);
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_USER_METRICS_CONFIGURATION,
    getMetricsConfiguration
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_UPDATE_USER_METRICS_CONFIGURATION,
    updateMetricsConfiguration
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_USER_STATS_CONFIGURATION,
    getStatsConfiguration
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_UPDATE_USER_STATS_CONFIGURATION,
    updateStatsConfiguration
  );
  yield takeLatest(Actions.Types.ATTEMPT_SHARE_PROGRESS, shareProgress);
  yield takeLatest(Actions.Types.ATTEMPT_LOG_MEASUREMENT, logMeasurement);
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_USER_MEASUREMENTS,
    getMeasurements
  );
  yield takeLatest(Actions.Types.ATTEMPT_DELETE_USER_ACCOUNT, deleteAccount);
  yield takeLatest(Actions.Types.ATTEMPT_GET_SAVED_ADDRESSES, getAddresses);
  yield takeLatest(Actions.Types.ATTEMPT_ADD_ADDRESS, addAddress);
  yield takeLatest(Actions.Types.ATTEMPT_UPDATE_ADDRESS, updateAddress);
  yield takeLatest(Actions.Types.ATTEMPT_DELETE_ADDRESS, deleteAddress);
  yield takeLatest(Actions.Types.ATTEMPT_GET_USER_PROGRESS, getProgress);
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_USER_ACHIEVEMENTS,
    getAchievements
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_USER_MEASUREMENT_GOALS,
    getMeasurementGoals
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_UPDATE_USER_MEASUREMENT_GOAL,
    updateMeasurementGoal
  );
  yield takeLatest(Actions.Types.ATTEMPT_ADD_USER_TAG, addTag);
  yield takeLatest(
    Actions.Types.ATTEMPT_SEND_SURVEY_REMINDER,
    sendSurveyReminder
  );
  yield takeLatest(
    Actions.Types.GO_TO_ONBOARDING_PAGE_BY_RETURN_PAGE_DATA,
    goToOnboardingPageByReturnPageData
  );
  yield takeLatest(
    Actions.Types.CHECK_SUBSCRIPTION_EXPIRATION,
    checkSubscriptionExpiration
  );
  yield takeLatest(Actions.Types.ATTEMPT_ACCESS_FEATURE, accessFeature);
  yield takeLatest(Actions.Types.ATTEMPT_RATE_APP, rateApp);
  yield takeLatest(Actions.Types.ATTEMPT_SET_NEXT_APP_REVIEW, setNextAppReview);
  yield takeLatest(Actions.Types.ATTEMPT_SHOW_INTERCOM, showIntercom);
  yield takeLatest(
    Actions.Types.ATTEMPT_SET_SUBSCRIPTION_ONBOARDING_PROFILE,
    setSubscriptionOnboardingProfile
  );
  yield takeLatest(
    Actions.Types.UPDATE_USERS_APPS_FLYER_PROFILE,
    updateUsersAppsflyerProfile
  );
  yield takeLatest(
    Actions.Types.ATTEMPT_SHOW_REFER_FRIEND,
    attemptShowReferFriend
  );
  yield takeLatest(Actions.Types.ATTEMPT_AWARD_REFERRER, attemptAwardReferrer);
  yield takeLatest(Actions.Types.UPDATE_USERS_META, updateUsersMeta);

  yield takeLatest(Actions.Types.ATTEMPT_SEND_OTP, sendOtp);
  yield takeLatest(Actions.Types.ATTEMPT_VERIFY_OTP, verifyOtp);
}
