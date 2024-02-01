export const SET_BOTTOM_TABS = 'SET_BOTTOM_TABS'

export interface SetBottomTabs {
    type: typeof SET_BOTTOM_TABS
    value: boolean
}

export const setBottomTabs = (value: boolean): SetBottomTabs => ({
    type: SET_BOTTOM_TABS,
    value
})
