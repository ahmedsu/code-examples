export const SET_IS_LOADING = 'SET_IS_LOADING'

export interface SetIsLoading {
    type: typeof SET_IS_LOADING
    value: boolean
}

export const setIsLoading = (value: boolean): SetIsLoading => ({
    type: SET_IS_LOADING,
    value
})
