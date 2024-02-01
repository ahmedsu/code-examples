export interface IAlertManagement {
    title: string
    message: string
    type: AlertType
}
export type AlertType = 'success' | 'error' | 'none'
export interface IAlertManagementActions {
    setMessageAndType: (title: string, message: string, type: AlertType) => void
}
