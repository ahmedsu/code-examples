import { create } from 'zustand'

interface LanguageStore {
  language: string
  setLanguage: (value: string) => void
}

export const useLanguageStore = create<LanguageStore>(set => ({
  language: '',
  setLanguage: language => set({ language })
}))
