import { create } from 'zustand'

interface AddNewModalStore {
  isAddNewModalOpened: boolean
  openAddNewModal: () => void
  closeAddNewModal: () => void
}

export const useAddNewModalStore = create<AddNewModalStore>(set => ({
  isAddNewModalOpened: false,
  openAddNewModal: () => set({ isAddNewModalOpened: true }),
  closeAddNewModal: () => set({ isAddNewModalOpened: false })
}))
