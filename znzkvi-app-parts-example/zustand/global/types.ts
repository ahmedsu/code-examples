import { Background } from '@components/Container'
import Sound from 'react-native-sound'

export interface IGlobal {
    shouldUseBottomInset: boolean
    guestMode: boolean
    currentlyPlaying: Sound | null
    setGuestMode: (val: boolean) => void
    setShouldUseBottomInset: (val: boolean) => void
    setCurrentlyPlaying: (val: Sound | null) => void
    background: Background
    setBackground: (val: Background) => void
    quizActive: boolean
    setQuizActive: (val: boolean) => void
    deleteAccountPressed: boolean
    setDeleteAccountPressed: (val: boolean) => void
}
