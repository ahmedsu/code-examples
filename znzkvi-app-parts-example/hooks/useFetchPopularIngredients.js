import {useQuery} from 'react-query';
import {POPULAR_INGREDIENTS_KEY} from '@config';
import {getPopularIngredients} from '@api';



const useFetchPopularIngredients = () => {
  const {data: popularIngredients, isFetching} = useQuery(
    [POPULAR_INGREDIENTS_KEY],
    async () => {
      const {
        data: {data}
      } = await getPopularIngredients();

      return data.map(({name, id}) => ({name, id}));
    },
    {
      staleTime: 300000,
      keepPreviousData: true
    }
  );

  return {popularIngredients, isFetching};
};

export default useFetchPopularIngredients;