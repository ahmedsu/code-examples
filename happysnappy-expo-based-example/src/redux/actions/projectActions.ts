export const SET_PROJECT = 'SET_PROJECT'
export interface IProject {
    createdByUserId: number
    createdDateTime: string
    description: string
    id: number
    lastUpdated: string
    lastUpdatedByUserId: number
    name: string
    status: number
    subscriptionId: number
    templateGroupTemplates: any[]
    templateGroupAppUsers: any[]
}

export interface SetProject {
    project: any
    type: typeof SET_PROJECT
}

export const setProject = (project: object): SetProject => ({
    type: SET_PROJECT,
    project
})
