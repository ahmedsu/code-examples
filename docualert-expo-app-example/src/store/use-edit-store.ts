import { create } from 'zustand'
import { COUNTRY } from '@/constants'

interface EditStore {
  selectedItem: string
  setSelectedItem: (selectedItem: string) => void
  flag: COUNTRY
  setFlag: (flag: COUNTRY) => void
}

export const useEditStore = create<EditStore>(set => ({
  selectedItem: '',
  setSelectedItem: selectedItem => set({ selectedItem }),
  flag: COUNTRY.BA,
  setFlag: flag => set({ flag })
}))
