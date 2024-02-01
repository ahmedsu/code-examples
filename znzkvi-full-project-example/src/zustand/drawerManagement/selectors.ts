import { IDrawerManagement } from './types'

export const selectCurrentDrawerTab = (state: IDrawerManagement) =>
    state.currentDrawerTab

export const selectSetCurrentDrawerTab = (state: IDrawerManagement) =>
    state.setCurrentDrawerTab
