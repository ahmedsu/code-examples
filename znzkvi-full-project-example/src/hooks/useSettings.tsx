import mmkvKeys from '@constants/mmkvKeys'
import { storage } from '@helpers/initMMKV'
import { useMMKVBoolean } from 'react-native-mmkv'

const useSettings = () => {
    const [music, setMusic] = useMMKVBoolean(mmkvKeys.MUSIC, storage)
    const [sounds, setSounds] = useMMKVBoolean(mmkvKeys.SOUNDS, storage)

    return {
        music,
        sounds,
        setMusic,
        setSounds
    }
}

export default useSettings
