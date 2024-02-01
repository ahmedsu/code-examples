import QueryKeys from '@constants/QueryKeys'
import { useQuery } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'
import useAuthStore from '@zustand/auth/store'
import { IStatistics } from '@customTypes/IStatistics'

const useGetUserStatistics = () => {
    const showMessage = useShowMessageWithCondition()
    const { token } = useAuthStore()
    const { refetch, data } = useQuery(
        QueryKeys.GET_USER_STATISTICS,
        async (): Promise<IStatistics> => {
            const res = await apiRequest({
                url: 'users/get-statistics',
                data: {
                    api_token: token
                },
                method: 'post'
            })
            showMessage(res, false)
            return res.data
        }
    )

    return { getUserStatistics: refetch, data }
}

export default useGetUserStatistics
