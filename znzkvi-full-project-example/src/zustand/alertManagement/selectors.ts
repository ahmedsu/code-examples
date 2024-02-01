import { IAlertManagement, IAlertManagementActions } from './types'

export const selectMessage = (state: IAlertManagement) => state.message

export const selectType = (state: IAlertManagement) => state.type

export const selectSetMessageAndType = (state: IAlertManagementActions) =>
    state.setMessageAndType
