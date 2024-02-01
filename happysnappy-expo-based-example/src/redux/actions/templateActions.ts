export const SET_TEMPLATE = 'SET_TEMPLATE'
export type template = object | null

export interface SetTemplate {
    template: any
    type: typeof SET_TEMPLATE
}

export const setTemplate = (template: object | null): SetTemplate => ({
    type: SET_TEMPLATE,
    template
})
