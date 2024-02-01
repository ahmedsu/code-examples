import { create } from 'zustand'
import { IUser, IUserFunctions } from './types'

const useAuthStore = create<IUser & IUserFunctions>()(set => ({
    token: 'none',
    hasToken: null, //return to null when api calls are added
    setTokenValues: ({ token, hasToken }: IUser) =>
        set({
            token,
            hasToken
        })
}))

export default useAuthStore
