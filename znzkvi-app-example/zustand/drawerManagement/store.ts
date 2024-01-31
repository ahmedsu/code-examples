import { create } from 'zustand'
import { DrawerTabType, IDrawerManagement } from './types'

const useDrawerStore = create<IDrawerManagement>()(set => ({
    currentDrawerTab: 'none',
    setCurrentDrawerTab: (currentDrawerTab: DrawerTabType = 'main') =>
        set({
            currentDrawerTab
        })
}))

export default useDrawerStore
