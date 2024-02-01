export const RESTORE_TOKEN = 'RESTORE_TOKEN'
export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'
export const SET_REMEMBER_ME = 'SET_REMEMBER_ME'

export type UserToken = string | null
export type IsRememberMe = boolean
export interface RestoreToken{
    type: typeof RESTORE_TOKEN
    userToken: UserToken
}

export interface SignIn{
    type: typeof SIGN_IN
    userToken: UserToken
}

export interface SignOut{
    type: typeof SIGN_OUT
}

export interface SetRememberMe{
    type: typeof SET_REMEMBER_ME
    isRememberMe: IsRememberMe
}

export const restoreToken = (userToken: UserToken): RestoreToken=>({
    type:RESTORE_TOKEN,
    userToken
})

export const signIn = (userToken: UserToken): SignIn=>({
    type:SIGN_IN,
    userToken,
})

export const signOut = (): SignOut=>({
    type:SIGN_OUT,
})

export const setRememberMe = (isRememberMe: IsRememberMe): SetRememberMe=>({
    type:SET_REMEMBER_ME,
    isRememberMe
})