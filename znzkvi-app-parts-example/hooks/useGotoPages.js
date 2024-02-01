import {Routes} from '@config';
import {navigate, navigator} from '@services';
import {useDispatch} from 'react-redux';
import Actions from '@actions';

export const useGotoPages = () => {
  const dispatch = useDispatch();

  const gotoOnboardingPage = () => {
    dispatch({
      type: Actions.Types.SET_ONBOARDING_SUCCESS_RETURN_ROUTE,
      routeName: navigator()?.getCurrentRoute()?.name
    });

    dispatch({
      type: Actions.Types.GO_TO_ONBOARDING_PAGE,
      page: 0
    });

    navigate(Routes.onBoarding);
  };

  return {gotoOnboardingPage};
};
