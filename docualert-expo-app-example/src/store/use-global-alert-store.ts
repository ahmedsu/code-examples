import { create } from 'zustand'
import { GLOBAL_ALERT } from '@/constants'

interface GlobalAlertStore {
  message: string
  type?: GLOBAL_ALERT
  alert: (message, type) => void
}

export const useGlobalAlertStore = create<GlobalAlertStore>(set => ({
  message: '',
  type: undefined,
  alert: (message: string, type?: GLOBAL_ALERT) => {
    set(() => {
      return {
        message: message,
        type: type
      }
    })
  }
}))
