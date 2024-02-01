import { create } from 'zustand'
import { MMKV } from 'react-native-mmkv'

interface WelcomeScreenStore {
  welcomeScreenCompleted: boolean
  completeWelcomeScreen: () => void
}

const storage = new MMKV()

export const useWelcomeScreenStore = create<WelcomeScreenStore>(set => ({
  welcomeScreenCompleted:
    !!storage.getString('welcomeScreenCompleted') ?? false,
  completeWelcomeScreen: () => {
    storage.set('welcomeScreenCompleted', 'true')
    return set({ welcomeScreenCompleted: true })
  }
}))
