import { StyleSheet, ScrollView, View } from 'react-native'
import Container from '@components/Container'
import RoundButton from '@components/RoundButton'
import Colors from '@constants/Colors'
import SvgIcons from '@assets/svgs/icons'
import Text from '@components/Text'
import InterText from '@components/InterText'
import ZnzkviBa from '@components/ZnzkviBa'
import Divider from '@components/Divider'
import useDrawerStore from '@zustand/drawerManagement/store'
import { selectSetCurrentDrawerTab } from '@zustand/drawerManagement/selectors'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'

interface Props {
    title: string
    content: string
}
const DrawerInfoPage = ({ title, content }: Props) => {
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)

    return (
        <Container style={localStyles.paddingHorizontal}>
            <View style={localStyles.alignItems}>
                <RoundButton
                    onPress={() => setCurrentDrawerTab('none')}
                    innerStyle={{ backgroundColor: Colors.lightBlue }}
                    icon={
                        <SvgIcons.Home
                            width={scaleByWidth(46)}
                            height={scaleByHeight(44)}
                        />
                    }
                />
            </View>
            <Divider />
            <Text fs={40} shouldScaleByWidth>
                {title}
            </Text>
            <Divider size={20} />
            <ScrollView
                style={localStyles.flexOne}
                contentContainerStyle={localStyles.flexGrowOne}>
                <InterText weight="regular" fs={16} shouldScaleByWidth>
                    {content}
                </InterText>
            </ScrollView>
            <Divider size={50} />
            <ZnzkviBa />
        </Container>
    )
}

const localStyles = StyleSheet.create({
    flexOne: {
        flex: 1
    },
    flexGrowOne: {
        flexGrow: 1
    },
    alignItems: {
        alignItems: 'flex-end',
        paddingTop: 5
    },
    paddingHorizontal: {
        paddingHorizontal: 20
    }
})
export default DrawerInfoPage
