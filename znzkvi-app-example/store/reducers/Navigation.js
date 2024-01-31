import Actions from '@actions';
import {createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = Immutable({
  currentRouteName: '',

  onboardingSuccessReturnRoute: '',

  onboardingSkipReturnRoute: ''
});

const doSetRouteName = (state, {routeName}) =>
  state.merge({currentRouteName: routeName});

const doSetOnboardingSuccessReturnRoute = (state, {routeName}) =>
  state.merge({onboardingSuccessReturnRoute: routeName});

const doSetOnboardingSkipReturnRoute = (state, {routeName}) =>
  state.merge({onboardingSkipReturnRoute: routeName});

const HANDLERS = {
  [Actions.Types.SET_CURRENT_ROUTE_NAME]: doSetRouteName,

  [Actions.Types
    .SET_ONBOARDING_SUCCESS_RETURN_ROUTE]: doSetOnboardingSuccessReturnRoute,

  [Actions.Types
    .SET_ONBOARDING_SKIP_RETURN_ROUTE]: doSetOnboardingSkipReturnRoute
};

export default createReducer(INITIAL_STATE, HANDLERS);
