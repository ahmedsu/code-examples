import React from 'react'
import useAuthStore from '@zustand/auth/store'
import { selectUserTokens } from '@zustand/auth/selectors'
import Loading from '@screens/Auth/Loading'
import AppStack from './AppStack'
import AuthStack from './AuthStack'

const RootStack = () => {
    const { hasToken } = useAuthStore(selectUserTokens)
    return (
        <>
            {hasToken === null ? (
                <Loading />
            ) : hasToken ? (
                <AppStack />
            ) : (
                <AuthStack />
            )}
        </>
    )
}

export default RootStack
