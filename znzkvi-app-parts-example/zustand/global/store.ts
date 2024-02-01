import { create } from 'zustand'
import { IGlobal } from './types'
import Sound from 'react-native-sound'
import { Background } from '@components/Container'

const useGlobalStore = create<IGlobal>()(set => ({
    currentlyPlaying: null,
    setCurrentlyPlaying: (val: Sound | null) => {
        set({
            currentlyPlaying: val
        })
    },
    shouldUseBottomInset: true,
    setShouldUseBottomInset: (val: boolean) =>
        set({
            shouldUseBottomInset: val
        }),
    guestMode: false,
    setGuestMode: (val: boolean) =>
        set({
            guestMode: val
        }),
    background: 'BlueBg',
    setBackground: (val: Background) => {
        set({
            background: val
        })
    },
    quizActive: false,
    setQuizActive: (val: boolean) => {
        set({
            quizActive: val
        })
    },
    deleteAccountPressed: false,
    setDeleteAccountPressed: (val: boolean) => {
        set({
            deleteAccountPressed: val
        })
    }
}))

export default useGlobalStore
