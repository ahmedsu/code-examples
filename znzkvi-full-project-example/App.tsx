import Alert from '@components/Alert'
import Container from '@components/Container'
import DeleteAccountModal from '@components/DeleteAccountModal'
import useDeleteAccount from '@hooks/api/useDeleteAccount'
import useLogout from '@hooks/useLogout'
import useSettings from '@hooks/useSettings'
import RootStack from '@navigation/RootStack'
import Drawer from '@screens/App/Drawer'
import useGlobalStore from '@zustand/global/store'
import { useCallback, useEffect, useRef } from 'react'
import { AppState, AppStateStatus, StatusBar } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import Sound from 'react-native-sound'
//import { intro } from '@helpers/loadSounds'

Sound.setCategory('Playback')

const App = () => {
    const {
        currentlyPlaying,
        quizActive,
        deleteAccountPressed,
        setDeleteAccountPressed
    } = useGlobalStore()
    const previous = useRef<Sound | null>(null)
    const { music, setMusic, sounds, setSounds } = useSettings()
    const deleteUser = useDeleteAccount()
    const logout = useLogout()

    const deleteAndLogOut = useCallback(async () => {
        const res = await deleteUser()
        if (res.code === '0000') logout()
    }, [deleteUser, logout])
    const musicRef = useRef(music)
    musicRef.current = music
    const setMusicRef = useRef(setMusic)
    setMusicRef.current = setMusic
    const soundsRef = useRef(sounds)
    soundsRef.current = sounds
    const setSoundsRef = useRef(setSounds)
    setSoundsRef.current = setSounds
    const currentlyPlayingRef = useRef(currentlyPlaying)
    currentlyPlayingRef.current = currentlyPlaying
    useEffect(() => {
        if (musicRef.current === undefined || musicRef.current) {
            setMusicRef.current(true) //first time to turn on the music
        }
        if (soundsRef.current === undefined || musicRef.current) {
            setSoundsRef.current(true) //first time to turn on the sounds
        }
    }, [])

    //Stops music when app is in background
    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState: AppStateStatus) => {
                if (musicRef.current) {
                    if (nextAppState === 'active') {
                        currentlyPlayingRef.current?.play()
                    } else {
                        currentlyPlayingRef.current?.pause()
                    }
                }
            }
        )
        return () => {
            subscription.remove()
        }
    }, [])

    useEffect(() => {
        if (previous.current) previous.current.stop()
        currentlyPlaying?.setNumberOfLoops(-1)
        if (music) {
            currentlyPlaying?.play()
        }
        previous.current = currentlyPlaying
    }, [currentlyPlaying, music])

    useEffect(() => {
        // setGameSound()
        Orientation.lockToPortrait()
    }, [])

    return (
        <Container background={'BlueBg'} hideInset={quizActive}>
            <StatusBar translucent backgroundColor={'transparent'} />
            <Drawer />
            <RootStack />
            <Alert />
            <DeleteAccountModal
                setIsVisible={setDeleteAccountPressed}
                isVisible={deleteAccountPressed}
                onBackdropPress={() => setDeleteAccountPressed(false)}
                onPress={deleteAndLogOut}
            />
        </Container>
    )
}

export default App
