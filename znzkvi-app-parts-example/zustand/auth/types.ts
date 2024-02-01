export interface IUser {
    token: string | null
    hasToken: boolean | null
}

export interface IUserFunctions {
    setTokenValues: ({ token, hasToken }: IUser) => void
}
