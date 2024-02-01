export const SET_USER = 'SET_USER'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_TOTAL_STATS = 'SET_TOTAL_STATS'
export const SET_STATS_DATA = 'SET_STATS_DATA'

export interface IUser {
    email: string
    id: number | null
    isAdministrator: boolean
    isManager: boolean
    isPhotographer: boolean
    displayName: string
    subscriptionId: number
    subscriptionPackageId: 1
}
export type user = IUser | null
export type token = string | null

export interface SetUser {
    type: typeof SET_USER
    user: IUser | null
}

export interface SetToken {
    type: typeof SET_TOKEN
    token: string | null
}

export const setUser = (user: IUser | null): SetUser => ({
    type: SET_USER,
    user
})

export const setToken = (token: string | null): SetToken => ({
    type: SET_TOKEN,
    token
})
