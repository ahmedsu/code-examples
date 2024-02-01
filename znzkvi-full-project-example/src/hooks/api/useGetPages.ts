import QueryKeys from '@constants/QueryKeys'
import { useQuery } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'
import { DrawerTabType } from '@zustand/drawerManagement/types'
import { useEffect } from 'react'

const useGetPages = ({ pageName }: { pageName: DrawerTabType }) => {
    const showMessage = useShowMessageWithCondition()

    const { data, refetch } = useQuery(QueryKeys.GET_PAGES, async () => {
        const res = await apiRequest({
            url: `core/pages/get-pages?page=${pageName}`,
            method: 'post'
        })
        showMessage(res, false)
        return res.data
    })
    useEffect(() => {
        refetch()
    }, [pageName, refetch])
    return { data, getPages: refetch }
}

export default useGetPages
