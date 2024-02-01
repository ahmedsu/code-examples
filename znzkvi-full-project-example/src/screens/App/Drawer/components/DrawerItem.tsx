import { Pressable } from 'react-native'
import Text from '@components/Text'
import Divider from '@components/Divider'

interface Props {
    title: string
    onPress?: () => void
    largerDivider?: boolean
}
const DrawerItem = ({ title, onPress, largerDivider = false }: Props) => {
    return (
        <>
            <Pressable onPress={onPress}>
                <Text>{title}</Text>
            </Pressable>
            <Divider size={largerDivider ? 35 : 20} />
        </>
    )
}

export default DrawerItem
