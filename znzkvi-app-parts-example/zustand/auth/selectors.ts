import { IUser, IUserFunctions } from './types'

export const selectUserTokens = (state: IUser) => ({
    token: state.token,
    hasToken: state.hasToken
})

export const selectSetUserTokens = (state: IUserFunctions) =>
    state.setTokenValues
