import {takeLatest, put, call, select} from 'redux-saga/effects';
import {PUSH_NOTIFICATION_CHANNEL, Events} from '@config';
import Actions from '@actions';
import * as API from '@api';
import * as Lib from '@lib';
import {Say, logConsole, FCM, LocalPushNotification, getAge} from '@utils';
import store from '@store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Intercom from '@intercom/intercom-react-native';
import {logEvent} from '@lib';
import {hasExistingReceipt, promptReceiptAlreadyExist} from '@utils';

function* login({
  payload: {email, password, facebookToken, googleToken, appleToken, extra}
}) {
  try {
    yield put(Actions.Creators.showVeil());

    const state = yield select();

    let res = null;

    if (facebookToken) {
      logConsole('logging in via FACEBOOK', facebookToken);
      res = yield call(API.loginByFacebook, facebookToken);
    } else if (googleToken) {
      logConsole('logging in via GOOGLE', googleToken);
      res = yield call(API.loginByGoogle, googleToken);
    } else if (appleToken) {
      logConsole('logging in via APPLE', appleToken);
      logConsole('extra payload', extra);
      res = yield call(API.loginByApple, {
        token: appleToken,
        ...extra
      });
    } else {
      logConsole('logging in via USERNAME and PASSWORD');
      if (!email || !password) Say.warn('Please enter your credentials');
      else {
        res = yield call(API.login, {email, password});
      }
    }

    logConsole('LOGIN RESPONSE STATUS!!!\n\n', res.status);
    logConsole('LOGIN RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 201) {
      const referrer_id = state.user.referrer_id;

      yield call(logEvent, Events.user_sign_in);

      yield put(Actions.Creators.requestPushNotificationPermission(true));

      yield put(
        Actions.Creators.setUserData({
          token: res.data.data.token
        })
      );

      // patch profile to set metadata:{ new_user: false }
      const isNewUser = res.data.data.metadata?.new_user;
      if (isNewUser) {
        yield call(logEvent, Events.user_sign_up);

        const hasReceipts = yield call(hasExistingReceipt);
        if (hasReceipts) {
          yield put(Actions.Creators.doneAttemptLogin());
          yield put(Actions.Creators.doneAttemptGoogleLogin());
          yield put(Actions.Creators.doneAttemptFacebookLogin());
          yield put(Actions.Creators.doneAttemptAppleLogin());
          yield put(Actions.Creators.hideVeil());
          yield call(promptReceiptAlreadyExist);
          return;
        } else {
          // turn off new_user flag only if no receipt found
          yield call(API.updateProfile, {
            metadata: {...res.data.data.metadata, new_user: false, referrer_id}
          });

          yield put(
            Actions.Creators.updateUserData({
              metadata: {
                ...res.data.data.metadata,
                new_user: false,
                referrer_id
              } // for signup with email, we could automatically set new_user to false since we handle the checking of receipt before navigating to sign up page
            })
          );

          if (!!referrer_id) {
            logEvent(Events.referral_signup);
          }
        }
        // REGARDLESS if user signed up successfully or NOT, always remove referred id
        yield put(Actions.Creators.removeReferrerId());
      }

      const userRes = yield call(API.getProfile);

      logConsole('GET MY PROFILE RESPONSE STATUS!!!\n\n', userRes.status);
      logConsole('GET MY PROFILE RESPONSE DATA!!!\n\n', userRes.data);

      if (userRes.status == 200) {
        const userAge = getAge(userRes.data.data.profile.date_of_birth);
        //yield put(Actions.Creators.attemptGetUserMealNotificationSettings())

        // Register user to intercom
        yield call(Intercom.registerIdentifiedUser, {
          email: userRes.data.data.profile.email,
          userId: `${userRes.data.data.profile.id}`
        });

        const familyRes = yield call(API.getFamilyMembers);
        const familyCount = familyRes?.data?.data?.count ?? 0;
        const family_member = familyCount === 0 ? 'None' : familyCount;

        const excluded_ingredients =
          userRes.data.data.profile?.excluded_ingredients?.map(
            ({ingredient, ingredient_name}) => ({
              ingredient,
              name: ingredient_name
            })
          );

        yield put(
          Actions.Creators.addToOnboardingPlan({
            date_of_birth: userRes.data.data.profile.date_of_birth,
            gender: userRes.data.data.profile.gender,
            allergies: userRes.data.data.profile.allergies,
            kitchen_tools: userRes.data.data.profile.kitchen_tools,
            cuisines: userRes.data.data.profile.cuisines,
            meals_to_share: userRes.data.data.profile.meals_to_share || [],
            goal: userRes.data.data.profile.goal,
            planning_day: userRes.data.data.profile.planning_day,
            fitness_level_assessment:
              userRes.data.data.profile.fitness_level_assessment,
            current_weight: userRes.data.data.profile.current_weight || {},
            current_waist_size:
              userRes.data.data.profile.current_waist_size || {},
            current_height: userRes.data.data.profile.current_height || {},
            units: userRes.data.data.profile.units,
            planning_time: userRes.data.data.profile.planning_time,
            diet: userRes.data.data.profile.diet,
            calorie_target: userRes.data.data.profile.calorie_target,
            family_member,
            excluded_ingredients: excluded_ingredients ?? []
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
            current_weight: userRes.data.data.profile.current_weight || {},
            current_waist_size:
              userRes.data.data.profile.current_waist_size || {},
            current_height: userRes.data.data.profile.current_height || {},
            highlights: userRes.data.data.highlights,
            tag_names: userRes.data.data.tag_names,
            treats_enabled: false,
            age: userAge,
            return_page: userRes.data.data.profile.done_onboarding
              ? userRes.data.data.profile.return_page
              : '',
            skipped_onboarding: userRes.data.data.profile.done_onboarding
              ? false
              : userRes.data.data.profile.skipped_onboarding,
            family_member
          })
        );

        yield put(Actions.Creators.attemptGetSubscriptionPurchaseHistory());

        // SYNC USER PROFILE TO SEGMENT
        yield put(Actions.Creators.preStartUps());

        yield put(Actions.Creators.login());

        yield put(Actions.Creators.attemptGetCartStatus());

        //yield put(Actions.Creators.checkSubscriptionExpiration())
      }
    }
  } catch (err) {
    console.log('JKF Error', err);
  }

  yield put(Actions.Creators.doneAttemptLogin());
  yield put(Actions.Creators.doneAttemptGoogleLogin());
  yield put(Actions.Creators.doneAttemptFacebookLogin());
  yield put(Actions.Creators.doneAttemptAppleLogin());
  yield put(Actions.Creators.hideVeil());
}

function* signup({payload}) {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('SIGNUP PAYLOAD!!!\n\n', payload);
    const state = yield select();
    const dietitian_id = state.user.dietitian_id;

    const referredByDietitian = payload.referredByDietitian;
    const res = yield call(API.signup, {
      first_name: payload.first_name,
      email: payload.email,
      password: payload.password,
      confirmed_password: payload.confirmed_password, // JKF - backend requires this
      dietitian_id: dietitian_id
    });

    logConsole('SIGNUP RESPONSE STATUS!!!\n\n', res.status);
    logConsole('SIGNUP RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 201) {
      const referrer_id = state.user.referrer_id;
      const goal = state?.user?.subscriptionOnboarding?.goal?.text ?? '';

      yield call(logEvent, Events.user_sign_up);
      // Register user to intercom
      yield call(Intercom.registerIdentifiedUser, {
        email: res.data.data.email,
        userId: `${res.data.data.id}`
      });

      yield put(
        Actions.Creators.setUserData({
          ...res.data.data,
          has_dietitian_invitation: !!(referredByDietitian || dietitian_id),
          pro_client_status: !!(referredByDietitian || dietitian_id)
            ? 'new_client'
            : undefined,
          metadata: {...res.data.data.metadata, new_user: false, referrer_id}, // for signup with email, we could automatically set new_user to false since we handle the checking of receipt before navigating to sign up page
          skipped_onboarding: false, //temporary, backend must default to false
          tag_names: [],
          goal
        })
      );

      // for signup with email, we could automatically set new_user to false since we handle the checking of receipt before navigating to sign up page
      yield call(API.updateProfile, {
        metadata: {...res.data.data.metadata, new_user: false, referrer_id}
      });

      if (!!referrer_id) {
        logEvent(Events.referral_signup);
      }

      if (referredByDietitian) {
        yield call(API.proAcceptInvitation);
      }

      yield put(Actions.Creators.removeReferrerId());
      yield put(Actions.Creators.removeDietitianId());

      // SYNC USER PROFILE TO SEGMENT
      console.log(
        'SIGNUP SET SUBSCRIPTION ONBOARDING ON NEW USER',
        state.user.subscriptionOnboarding
      );
      // yield put(Actions.Creators.attemptSetSubscriptionOnboardingProfile());

      if (res.data.data.has_dietitian_invitation) {
        yield put(Actions.Creators.showAfterSignupModal());
        yield put(Actions.Creators.showDietitianSignupModal());
      } else {
        yield put(Actions.Creators.showAfterSignupModal());
      }
    }
  } catch (err) {
    console.log('Error signup*: ', err);
  }

  yield put(Actions.Creators.doneAttemptSignup());
  yield put(Actions.Creators.hideVeil());
}

function* logout() {
  const state = yield select();

  try {
    Intercom.logout();
  } catch (err) {
    logConsole('ERROR!!! Intercom: ', err);
  }

  try {
    yield call(LocalPushNotification.cancelAllLocalNotifications);
    logConsole('CANCEL SCHEDULED MEAL NOTIFICATIONS');
  } catch (err) {}

  try {
    yield call(FCM.deleteToken);
    logConsole('FCM TOKEN DELETED');
  } catch (err) {}

  try {
    yield call(Lib.facebookLogout);
    logConsole('FACEBOOK LOGOUT');
  } catch (err) {}

  try {
    yield call(GoogleSignin.signOut);
    logConsole('GOOGLE SIGNOUT');
  } catch (err) {}

  try {
    yield call(
      AsyncStorage.removeItem,
      PUSH_NOTIFICATION_CHANNEL.logWeightReminder
    );
    logConsole('CLEAR WEIGHT REMINDER');

    yield call(
      AsyncStorage.removeItem,
      PUSH_NOTIFICATION_CHANNEL.logWaistSizeReminder
    );
    logConsole('CLEAR HEIGHT REMINDER');

    yield call(AsyncStorage.removeItem, 'previous_subscription');
    logConsole('CLEAR PREVIOUS SUBSCRIPTION');

    yield call(AsyncStorage.removeItem, 'first_launch_today');
    logConsole('CLEAR FIRST LAUNCH TODAY');
  } catch (err) {}

  try {
    yield put(Actions.Creators.clearUserData());
    yield put(Actions.Creators.clearOnboardingPlan());
    yield put(Actions.Creators.clearSubscriptionOnboarding());

    yield put(
      Actions.Creators.setCartStatus({
        status: ''
      })
    );

    //yield put(Actions.Creators.hideCartRequestTicker())

    yield put(Actions.Creators.resetAppReducer());
    yield put(Actions.Creators.resetAuthReducer());
    yield put(Actions.Creators.resetUserReducer());
  } catch (err) {}
}

function* forceLogout() {
  const state = yield select();

  logConsole('TRIGGER FORCED LOGOUT');

  if (!state.auth.isAttemptingForcedLogout) {
    logConsole('FORCE LOGOUT');

    yield put(Actions.Creators.attemptForcedLogout());

    Say.info(
      'Sorry, your session has expired or is no longer active',
      'Session Expired',
      {
        onClose: () => store.dispatch({type: Actions.Types.LOGOUT})
      }
    );
  }
}

export default function* () {
  yield takeLatest(Actions.Types.ATTEMPT_LOGIN, login);
  yield takeLatest(Actions.Types.ATTEMPT_GOOGLE_LOGIN, login);
  yield takeLatest(Actions.Types.ATTEMPT_FACEBOOK_LOGIN, login);
  yield takeLatest(Actions.Types.ATTEMPT_APPLE_LOGIN, login);
  yield takeLatest(Actions.Types.ATTEMPT_SIGNUP, signup);
  yield takeLatest(Actions.Types.LOGOUT, logout);
  yield takeLatest(Actions.Types.TRIGGER_FORCE_LOGOUT, forceLogout);
}
