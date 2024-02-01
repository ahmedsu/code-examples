import useGlobalStore from '@zustand/global/store'
import Sound from 'react-native-sound'

export const intro = new Sound(
    'znzkvi_mobile_intro_audio_v1.wav',
    Sound.MAIN_BUNDLE,
    error => {
        if (!error) {
            useGlobalStore.getState().setCurrentlyPlaying(intro)
        }
    }
)
export const dugme = new Sound('dugme_v1.wav', Sound.MAIN_BUNDLE, error => {
    if (!error) {
        //
    }
})
export const netacanOdg = new Sound('netacan.wav', Sound.MAIN_BUNDLE, error => {
    if (!error) {
        //
    }
})

export const tacanOdg = new Sound('tacan.wav', Sound.MAIN_BUNDLE, error => {
    if (!error) {
        //
    }
})

export const nobelOtvorio = new Sound(
    'nobel_otvorio_v1.wav',
    Sound.MAIN_BUNDLE,
    error => {
        if (!error) {
            //
        }
    }
)

export const nobelUzeo = new Sound(
    'nobel_uzeo_v1.wav',
    Sound.MAIN_BUNDLE,
    error => {
        if (!error) {
            //
        }
    }
)

export const odbrojavanje = new Sound(
    'odbrojavanje_beep_v1.wav',
    Sound.MAIN_BUNDLE,
    error => {
        if (!error) {
            //
        }
    }
)

export const gameplay = new Sound(
    'znzkvi_mobile_gameplay_audio_v1.wav',
    Sound.MAIN_BUNDLE,
    error => {
        if (!error) {
            //
        }
    }
)

export const loadSounds = () => {
    //
}
