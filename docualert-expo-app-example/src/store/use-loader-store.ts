import { create } from 'zustand'

interface LoaderStore {
  isLoading: boolean
  setLoader: () => void
  closeLoader: () => void
}

export const useLoaderStore = create<LoaderStore>(set => ({
  isLoading: false,
  setLoader: () => {
    set(() => {
      return {
        isLoading: true
      }
    })
  },
  closeLoader: () => {
    set(() => {
      return {
        isLoading: false
      }
    })
  }
}))
