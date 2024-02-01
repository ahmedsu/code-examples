import QueryKeys from '@constants/QueryKeys'
import { useQuery } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'

const useGetCountries = () => {
    const showMessage = useShowMessageWithCondition()

    const { data, refetch } = useQuery(QueryKeys.GET_COUNTRIES, async () => {
        const res = await apiRequest({
            url: 'core/countries/get-countries',
            method: 'post'
        })
        showMessage(res, false)
        return res.data
    })
    return { data, getCountries: refetch }
}

export default useGetCountries
