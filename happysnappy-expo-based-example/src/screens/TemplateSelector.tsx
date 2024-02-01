import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Pressable
} from 'react-native'
import Orientation from 'react-native-orientation-locker'
import Colors from '../colors'
import { useDispatch, useSelector } from '../hooks/reduxHooks'
import { setTemplate } from 'redux/actions/templateActions'
import Routes from 'navigation/Routes'
import { Navigation } from 'types/Index'
import { Container, Divider, Title } from 'components'
import TemplateItem from 'components/TemplateItem'
import Icon from 'react-native-vector-icons/Ionicons'
import { setBottomTabs } from 'redux/actions/bottomTabActions'
import { useIsFocused } from '@react-navigation/native'
import store from 'redux/store'


interface Props {
    navigation: Navigation
    route: {
        params: {
            templates: any[]
            projectName: string
        }
    }
}
const TemplateSelector = ({ navigation, route }: Props) => {
    const { project } = store.getState().project
    const [isBusyLoading, setIsBusyLoading] = useState<any>()
    const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState(route.params.templates)

    const isFocused = useIsFocused()

    const dispatch = useDispatch()

    const _onPressTemplate = (clickedTemplate: any) => {
        dispatch(setBottomTabs(false))
        dispatch(setTemplate(clickedTemplate))
        navigation.navigate(Routes.CapturePhotoStack.title, {
            screen: Routes.CapturePhotoStack.CapturePhoto,
            params: { linkMoreQR: true }
        })
    }

    useEffect(() => {
        Orientation.lockToPortrait()



        if (route.params.templates.length > 0) {
            setData(route.params.templates)
        } else {
            
            setData(project.templateGroupTemplates)
        }

    }, [isFocused])

    return (
        <Container>
            {isBusyLoading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    ListHeaderComponentStyle={{ width: '100%' }}
                    ListHeaderComponent={() => {
                        return (
                            <>
                                <Divider size={31} />
                                <View style={[styles.header]}>
                                    <Pressable
                                        onPress={() =>
                                            navigation.navigate(
                                                Routes.TemplateSelectorStack
                                                    .ProjectSelector
                                            )
                                        }>
                                        <Icon name="arrow-back-circle-outline" size={25} color="#000" />
                                    </Pressable>
                                    <Title style={{ marginLeft: 5 }}>
                                        {route.params.projectName} Templates
                                    </Title>
                                    {/*Don't put settings icon here yet, in next version */}
                                </View>
                            </>
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    style={styles.templateFlatList}
                    data={data}
                    contentContainerStyle={{
                        flexGrow: 1,
                        // alignItems: 'center',
                        paddingBottom: 20
                    }}
                    refreshControl={<RefreshControl refreshing={refresh} />}
                    ListEmptyComponent={
                        <View>
                            <Text>No Templates connected to this project</Text>
                        </View>
                    }
                    ItemSeparatorComponent={Divider}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, separators, index }) => (
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <TemplateItem
                                item={item}
                                name={item.template.name}
                                image={item.template.sampleImageUrl}
                                onPress={() => _onPressTemplate(item.template)}
                            />
                        </View>
                    )}
                />
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',

        paddingHorizontal: 5,
        marginBottom: 20
    },
    templateFlatList: {
        flex: 1,
        // marginTop: 10,
        paddingBottom: 50
    },
    templateRow: {
        height: 101,
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: Colors.PRIMARY_COLOR_1 + '80',
        borderRadius: 3
    },
    selectedTemplateRow: {
        height: 101,
        backgroundColor: Colors.PRIMARY_COLOR_1,
        borderWidth: 0.5,
        borderColor: Colors.PRIMARY_COLOR_1 + '80',
        borderRadius: 3
    },
    templateRowView: {
        flex: 1,
        flexDirection: 'row',
        height: 100,
        backgroundColor: 'transparent'
    },
    templateSampleImage: {
        flex: 1,
        alignSelf: 'flex-start',
        width: 100,
        height: 100
    },
    textIconContainerView: {
        flex: 1,
        flexDirection: 'row'
    },
    templateRowText: {
        flex: 0.9,
        fontWeight: '200',
        fontSize: 20,
        paddingTop: 2,
        color: 'black'
    },
    selectedTemplateRowText: {
        fontWeight: '400',
        fontSize: 20,
        paddingTop: 2,
        color: 'white'
    },
    greenScreenIcon: {
        position: 'absolute',
        right: 2,
        top: 2,
        alignSelf: 'center'
    }
})

export default TemplateSelector
