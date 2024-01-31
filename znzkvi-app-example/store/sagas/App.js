import {Linking} from 'react-native';
import {takeLatest, put, call, select, delay} from 'redux-saga/effects';
import Actions from '@actions';
import * as API from '@api';
import {
  APPSFLYER_DEV_KEY,
  IS_APPSFLYER_DEBUG,
  SEGMENT_WRITE_KEY,
  APPLE_ID,
  IS_ANDROID,
  IS_DEV,
  Tag,
  Events,
  METERED_TIME_DAYS
} from '@config';
import {logConsole, Say, isProAccount} from '@utils';
import {
  setUser,
  postSurveyResponse,
  getSurveyCollector,
  getSurveyQuestions,
  isSurveyNPSOnly
} from '@lib';
import {request, PERMISSIONS} from 'react-native-permissions';
import appsFlyer from 'react-native-appsflyer';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {goBack} from '@services';
import {Lottie} from '@assets';
import store from '@store';
import Immutable from 'seamless-immutable';
import Contacts from 'react-native-contacts';
import {mixPanelPage} from '../../config/routes';
import {logEvent} from '@lib';

function* startUp() {
  try {
    const state = yield select();

    yield put(Actions.Creators.resetAppReducer());
    yield put(Actions.Creators.resetAuthReducer());
    yield put(Actions.Creators.resetUserReducer());
    logConsole('REDUCERS RESET');

    yield put(Actions.Creators.initializeAppsflyer());

    //refresh user's profile, but make sure the user is currently logged-in
    if (state.auth.isLoggedIn && state.user.data) {
      //yield call(IAP.initConnection)

      if (state.user.onboardingPage < 0) {
        yield put(Actions.Creators.goToOnboardingPage(0));
      }

      yield put(
        Actions.Creators.attemptGetUserProfile({getPurchaseHistory: true})
      );

      logConsole('GET USER PROFILE: STARTUP');
    }

    yield call(SplashScreen.hide);
    logConsole('SPLASH SCREEN IS NOW HIDDEN');
  } catch (err) {}
}

function* initializeAppsflyer() {
  try {
    yield call(
      appsFlyer.initSdk,
      {
        devKey: APPSFLYER_DEV_KEY,
        isDebug: IS_APPSFLYER_DEBUG,
        appId: APPLE_ID,
        onInstallConversionDataListener: true, //Optional
        onDeepLinkListener: true, //Optional
        timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
      },
      result => logConsole('APPSFLYER INIT RESPONSE!!!', result),
      error => logConsole('APPSFLYER INIT ERROR!!!', error)
    );
  } catch (err) {}
}

function codePushSync() {
  codePush.sync(
    {
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE
    },
    syncStatus => syncStatus
  );
}

function* preStartUps() {
  try {
    const currentDate = moment();

    const state = yield select();

    const {
      id,
      age,
      gender,
      email,
      name,
      first_name,
      last_name,
      allergies,
      kitchen_tools,
      cuisines,
      goal,
      planning_day,
      fitness_level_assessment,
      diet,
      meals_to_share,
      date_created,
      location,
      date_of_birth,
      timezone,
      subscription,
      subscription_status,
      done_onboarding,
      phone_number,
      has_dietitian_invitation,
      type,
      pro_client_status
    } = state.user.data;

    /*yield call(
            appsFlyer.setCustomerUserId,
            id,
            appsFlyerSetCustomerUserIdRes => {
                logConsole(`APPSFLYER SET CUSTOMER USER ID ${id} RESPONSE!!!`, appsFlyerSetCustomerUserIdRes)
            }
        )*/

    yield call(setUser, {
      id,
      age,
      gender
    });

    yield put(Actions.Creators.initializeAppsflyer());

    const accountCreationDateDuration = moment.duration(
      currentDate.diff(moment(date_created, 'YYYY-MM-DD'))
    );

    const accountCreationDateDifference = Math.floor(
      accountCreationDateDuration.asDays()
    );

    const isProUser = isProAccount({has_dietitian_invitation, type});

    if (id !== undefined) {
      const segmentTraits = {
        name,
        first_name,
        last_name,
        email,
        age,
        gender,
        allergies: allergies?.length > 0 ? allergies.join(', ') : '',
        kitchen_tools:
          kitchen_tools?.length > 0 ? kitchen_tools.join(', ') : '',
        cuisines: cuisines?.length > 0 ? cuisines.join(', ') : '',
        goal,
        planning_day,
        fitness_level_assessment,
        diet: diet
          ? `${diet.type}, ${diet.days_to_eat_meat} days to eat meat`
          : '',
        diet_type: diet?.type || '',
        diet_days_to_eat_meat: diet?.days_to_eat_meat || '',
        meals_to_share:
          meals_to_share?.length > 0 ? meals_to_share.join(', ') : '',
        createdAt: date_created,
        location,
        date_of_birth,
        timezone,
        done_onboarding,
        platform: subscription?.platform || '',
        subscription: subscription?.product_id || '',
        subscription_status: subscription_status?.name || '',
        phone_number,
        has_dietitian_invitation: isProUser,
        pro_client_status: pro_client_status || ''
      };

      logConsole('SEGMENT TRAITS', segmentTraits, true);

      yield call(segmentClient.identify(), id.toString(), segmentTraits);
    }

    if (state.user.data.tag_names?.indexOf(Tag.appReview) < 0) {
      logConsole('CHECK NEXT APP REVIEW DATE');
      const checkNextDays = yield call(
        AsyncStorage.getItem,
        '@app_review_next_prompt'
      );

      if (checkNextDays || accountCreationDateDifference >= 14) {
        logConsole(
          'NEXT APP REVIEW IS ON: ',
          checkNextDays || accountCreationDateDifference
        );
        if (
          !checkNextDays ||
          (checkNextDays && moment().isSameOrAfter(checkNextDays))
        ) {
          yield put(Actions.Creators.attemptRateApp());
        }
      }
    } else {
      logConsole('USER HAS TAKEN THE APP REVIEW');
    }

    if (state.user.data.tag_names?.indexOf(Tag.metered_use_expired) < 0) {
      logConsole('CHECK IF USER HAS FINISHED METERED USE');
      if (accountCreationDateDifference >= METERED_TIME_DAYS) {
        logConsole('USER METERED USE IS FINISHED');
        yield put(Actions.Creators.attemptAddUserTag(Tag.metered_use_expired));
      } else {
        logConsole('USER IS STILL USING METERED USE');
      }
    }

    if (state.user.data.done_onboarding) {
      yield put(Actions.Creators.requestPushNotificationPermission(true));
    }

    if (!IS_ANDROID) {
      const appTrackingTransparencyRes = yield call(
        request,
        PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
      );
      logConsole(
        'IOS APP TRACKING TRANSPARENT PERMISSION RESPONSE',
        appTrackingTransparencyRes
      );
    }
  } catch (err) {
    logConsole('PRE-START UPS ERROR!!!', err);
  }
}

function* getSubscriptionPlans() {
  try {
    yield put(Actions.Creators.showVeil());

    const state = yield select();

    const res = yield call(API.getSubscriptionPlans);

    logConsole('GET SUBSCRIPTION PLANS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET SUBSCRIPTION PLANS RESPONSE DATA!!!\n\n', res.data, true);

    if (res.status == 200) {
      let data = {};

      res.data.data.results.sort(function (a, b) {
        return parseInt(a.id) > parseInt(b.id) ? 1 : -1;
      });

      res.data.data?.results?.map(r => {
        const name = r.type.name.toLowerCase();
        const product_id = r.product_id;
        const isQuarterly = product_id.indexOf('quarterly') >= 0;
        const isAnnually = product_id.indexOf('annual') >= 0;

        let isAllowed = true;
        let has_quarterly = true;

        if (state.user.data.subscription?.product_id) {
          const user_product_id = state.user.data.subscription.product_id;

          if (name == 'standard') {
            if (
              user_product_id.indexOf('duo') >= 0 ||
              user_product_id.indexOf('family') >= 0
            ) {
              isAllowed = false;
            }

            if (
              user_product_id.indexOf('standard') >= 0 &&
              user_product_id.indexOf('annual') >= 0
            ) {
              has_quarterly = false;
            }
          } else if (name == 'duo') {
            if (user_product_id.indexOf('family') >= 0) {
              isAllowed = false;
            }

            if (
              (user_product_id.indexOf('standard') >= 0 ||
                user_product_id.indexOf('duo') >= 0) &&
              user_product_id.indexOf('annual') >= 0
            ) {
              has_quarterly = false;
            }
          } else if (name == 'family') {
            if (
              (user_product_id.indexOf('standard') >= 0 ||
                user_product_id.indexOf('duo') >= 0 ||
                user_product_id.indexOf('family') >= 0) &&
              user_product_id.indexOf('annual') >= 0
            ) {
              has_quarterly = false;
            }
          }
        }

        if (isAllowed) {
          if (data[name] === undefined) {
            data[name] = {};
          }

          let icon = '';
          if (name === 'standard') icon = 'account-outline';
          else if (name === 'duo') icon = 'account-multiple-outline';
          else if (name === 'family') icon = 'account-group-outline';

          const DELIMETER = '\r\n';

          let inclusions = [];

          r.type.inclusion_description.split(DELIMETER).map((inc, index) => {
            if (inc && inc !== 'null') {
              inclusions.push(inc);
            }
          });

          let exclusions = [];

          r.type.exclusion_description.split(DELIMETER).map((ex, index) => {
            if (ex && ex !== 'null') {
              exclusions.push(ex);
            }
          });

          let plan = {
            ...r.type,
            product_id,
            name,
            icon,
            price: isQuarterly ? r.type.price_quarterly : r.type.price_annually,
            billing_term: isQuarterly ? 'quarterly' : 'annually',
            inclusions,
            exclusions,
            discount_text: `${r.type.price_quarterly.replace('month', 'mo')}`
          };

          if (!isQuarterly) {
            let quarterly_price = r.type.price_quarterly.replace('$', '');
            quarterly_price = quarterly_price.replace('/mo.', '');
            quarterly_price = quarterly_price.replace('/month', '');
            const prev_price = parseFloat(quarterly_price) * 12;

            let annual_price = r.type.price_annually.replace('$', '');
            annual_price = annual_price.replace('/mo.', '');
            annual_price = annual_price.replace('/month', '');
            const new_price = parseFloat(annual_price) * 12 - 0.01;

            plan = {
              ...plan,
              prev_price: `$${prev_price}`,
              new_price: `$${new_price}`
            };
          } else {
            let quarterly_price = r.type.price_quarterly.replace('$', '');
            quarterly_price = quarterly_price.replace('/mo.', '');
            quarterly_price = quarterly_price.replace('/month', '');
            const new_price = parseFloat(quarterly_price) * 3 - 0.01;

            plan = {
              ...plan,
              discount: 'none',
              new_price: `$${new_price}`
            };
          }

          data[name].has_quarterly = has_quarterly;

          if (isQuarterly) {
            data[name].quarterly = plan;
          } else if (isAnnually) {
            data[name].annually = plan;
          }
        }
      });

      yield put(Actions.Creators.setSubscriptionPlans(data));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetSubscriptionPlans());
  yield put(Actions.Creators.hideVeil());
}

function* getTermsOfService() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getTermsOfService);

    if (res.status == 200) {
      yield put(
        Actions.Creators.setTermsOfService(res.data.data.terms_of_service)
      );
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetTermsOfService());
  yield put(Actions.Creators.hideVeil());
}

function* getPrivacyPolicy() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getPrivacyPolicy);

    if (res.status == 200) {
      yield put(
        Actions.Creators.setPrivacyPolicy(res.data.data.privacy_policy)
      );
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetPrivacyPolicy());
  yield put(Actions.Creators.hideVeil());
}

function* getAddresses({payload}) {
  try {
    logConsole('GET ADDRESSES PAYLOAD', payload);

    const res = yield call(API.getAddresses, {
      query: payload.query,
      lat: payload.lat,
      long: payload.long
    });

    logConsole('GET ADDRESSES RESPONSE STATUS', res.status);
    logConsole('GET ADDRESSES RESPONSE DATA', res.data);

    if (res.status == 200) {
      yield put(Actions.Creators.setAddresses(res.data.addresses));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetAddresses());
}

function* getContactUs() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getContactUs);

    logConsole('GET CONTACT US RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET CONTACT US RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(Actions.Creators.setContactUs(res.data.data.email));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetContactUs());
  yield put(Actions.Creators.hideVeil());
}

function* getTipVideos() {
  try {
    yield put(Actions.Creators.showVeil());

    const res = yield call(API.getVideoTips);

    logConsole('GET TIP VIDEOS RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET TIP VIDEOS RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      yield put(Actions.Creators.setTipVideos(res.data.data.results));
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetTipVideos());
  yield put(Actions.Creators.hideVeil());
}

function* getDiscover() {
  try {
    yield put(Actions.Creators.showVeil());

    logConsole('GET SUBSCRIPTION PLANS');

    const res = yield call(API.getDiscover);

    logConsole('GET DISCOVER RESPONSE STATUS!!!\n\n', res.status);
    logConsole('GET DISCOVER RESPONSE DATA!!!\n\n', res.data);

    if (res.status == 200) {
      if (res.data.data?.categories) {
        yield put(Actions.Creators.setDiscover(res.data.data.categories));
      }
    }
  } catch (err) {}

  yield put(Actions.Creators.doneAttemptGetDiscover());
  yield put(Actions.Creators.hideVeil());
}

function* submitSurvey({answers}) {
  const state = yield select();
  const {surveyData, activeSurvey} = state.app;
  try {
    yield put(Actions.Creators.attemptSubmitSurveyResponse());
    logConsole('SUBMIT SURVEY ANSWERS!!', answers);

    const res = yield call(postSurveyResponse, activeSurvey, answers);

    logConsole('SUBMIT SURVEY RESULT!!', res);
    if (res.response_status == 'completed') {
      logConsole('SET SURVEY AS DONE!!!');
      const markRes = yield call(API.markSurveyDone, {survey: activeSurvey.id});
      logConsole('API.markSurveyDone RES', markRes);
      if (markRes.status == 201) {
        yield put(Actions.Creators.attemptGetUserProfile());
        yield put(Actions.Creators.attemptGetTodayDashboard());
        if (activeSurvey.questions) {
          goBack();
        } else if (activeSurvey.npsQuestion) {
          yield put(Actions.Creators.hideSurveyPrompt());
        }
        let newSurveyData = Immutable.asMutable(surveyData, {deep: true});
        let currentActiveIndex = newSurveyData.findIndex(
          obj => obj.id == activeSurvey.id
        );
        let isLastSurveyID = newSurveyData[newSurveyData.length - 1].id;
        newSurveyData.splice(currentActiveIndex, 1);
        store.dispatch({
          type: Actions.Types.ADD_NEW_APP_STATES_ON_THE_FLY,
          data: {surveyData: newSurveyData}
        });

        logEvent(Events.screen_visit, {
          name: mixPanelPage.feedback_prompt_reward_100
        });

        yield put(
          Actions.Creators.showAlert(
            `Thanks you for the Feedback! \n You have earned ${activeSurvey.points} points!`,
            '',
            {
              lottieData: Lottie.star_succcess,
              forceShowButtons: true,
              modalProps: {
                dismissable: true
              },
              onClose: () => {
                if (newSurveyData.length > 0) {
                  if (isLastSurveyID == newSurveyData[0].id) {
                    store.dispatch({
                      type: Actions.Types.SHOW_SURVEY_PROMPT,
                      data: newSurveyData[0]
                    });
                  }
                }
              }
            }
          )
        );
      }
    }
    if (res.error?.http_status_code) {
      Say.err(
        res.error.message + '\n' + `Code: ${res.error.id}`,
        res.error.name
      );
      goBack();
    }
    yield put(Actions.Creators.doneAttemptSubmitSurveyResponse());
  } catch (err) {
    logConsole('SUBMIT SURVEY ERR', err);
    Say.err(err);
  }
}

// PermissionStatus = 'granted' | 'denied' | 'never_ask_again';
function* doAttemptGetContacts() {
  let mappedContacts = [];

  try {
    let response = '';

    if (IS_ANDROID) {
      response = yield call(request, PERMISSIONS.ANDROID.READ_CONTACTS);
    } else {
      response = yield call(Contacts.checkPermission);
      if (response === 'undefined') {
        response = yield call(Contacts.requestPermission);
      }
    }

    if (response === 'granted' || response === 'authorized') {
      const contacts = yield call(Contacts.getAll);

      mappedContacts = contacts.map(
        ({familyName, givenName, phoneNumbers, recordID}) => ({
          familyName,
          givenName,
          phoneNumbers,
          recordID
        })
      );
      mappedContacts = mappedContacts.sort((a, b) =>
        a.givenName.localeCompare(b.givenName)
      );
    }

    // yield put(Actions.Creators.addNewAppStatesOnTheFly({surveyData:newSurveyData}));
  } catch (err) {
    console.log('err', err);
    // Say.err(err);
  } finally {
    yield put(Actions.Creators.doneAttemptGetContacts(mappedContacts));
  }
}

export default function* () {
  yield takeLatest(Actions.Types.START_UP, startUp);
  yield takeLatest(Actions.Types.INITIALIZE_APPSFLYER, initializeAppsflyer);
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_TERMS_OF_SERVICE,
    getTermsOfService
  );
  yield takeLatest(Actions.Types.ATTEMPT_GET_PRIVACY_POLICY, getPrivacyPolicy);
  yield takeLatest(Actions.Types.ATTEMPT_GET_ADDRESSES, getAddresses);
  yield takeLatest(Actions.Types.ATTEMPT_GET_CONTACT_US, getContactUs);
  yield takeLatest(Actions.Types.ATTEMPT_GET_TIP_VIDEOS, getTipVideos);
  yield takeLatest(Actions.Types.ATTEMPT_GET_DISCOVER, getDiscover);
  yield takeLatest(Actions.Types.PRE_START_UPS, preStartUps);
  yield takeLatest(
    Actions.Types.ATTEMPT_GET_SUBSCRIPTION_PLANS,
    getSubscriptionPlans
  );
  yield takeLatest(Actions.Types.SUBMIT_SURVEY_RESPONSE, submitSurvey);

  yield takeLatest(Actions.Types.ATTEMPT_GET_CONTACTS, doAttemptGetContacts);
}
