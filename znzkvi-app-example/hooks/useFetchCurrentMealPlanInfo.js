import {BANNER_TO_REDIRECT_KEY} from '@config';
import {useQuery} from 'react-query';
import {getExtraMealPlanInfo} from '@api';

export const useFetchCurrentMealPlanInfo = () => {
  const {
    data: mealPlanInfo,
    isFetching,
    refetch
  } = useQuery(
    [BANNER_TO_REDIRECT_KEY],
    async () => {
      const {
        data: {data}
      } = await getExtraMealPlanInfo();

      return data;
    },
    {
      staleTime: 5000,
      keepPreviousData: true
    }
  );

  return {
    mealPlanInfo,
    isFetching,
    refetch
  };
};
