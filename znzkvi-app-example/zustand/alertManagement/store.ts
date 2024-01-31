import { create } from 'zustand'
import { AlertType, IAlertManagement, IAlertManagementActions } from './types'

const useAlertStore = create<IAlertManagement & IAlertManagementActions>()(
    set => ({
        message: '',
        type: 'none',
        title: '',
        setMessageAndType: (
            title: string,
            message: string,
            type: AlertType
        ) => {
            set({
                title,
                message,
                type
            })
        }
    })
)

export default useAlertStore
