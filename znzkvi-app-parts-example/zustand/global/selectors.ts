import { IGlobal } from './types'

export const selectShouldUseBottomInset = (state: IGlobal) =>
    state.shouldUseBottomInset

export const selectSetShouldUseBottomInset = (state: IGlobal) =>
    state.setShouldUseBottomInset

export const selectCurrentlyPlaying = (state: IGlobal) => state.currentlyPlaying

export const selectSetCurrentlyPlaying = (state: IGlobal) =>
    state.setCurrentlyPlaying

export const selectBackground = (state: IGlobal) => state.background

export const selectSetBackground = (state: IGlobal) => state.setBackground

export const selectGuestMode = (state: IGlobal) => state.guestMode

export const selectSetGuestMode = (state: IGlobal) => state.setGuestMode

export const selectQuizActive = (state: IGlobal) => state.quizActive

export const selectSetQuizActive = (state: IGlobal) => state.setQuizActive

export const selectDeleteAccountPressed = (state: IGlobal) =>
    state.deleteAccountPressed

export const selectSetDeleteAccountPressed = (state: IGlobal) =>
    state.setDeleteAccountPressed
