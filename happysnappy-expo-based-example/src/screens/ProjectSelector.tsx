import React, { useEffect, useState } from 'react'
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Text
} from 'react-native'
import { getProjects } from '../helpers/restApi'
import Orientation from 'react-native-orientation-locker'
import Colors from '../colors'
import { useDispatch } from '../hooks/reduxHooks'
import { setProject } from 'redux/actions/projectActions'
import Routes from 'navigation/Routes'
import { Navigation } from 'types/Index'
import { Container, Divider, Title } from 'components'
import ProjectCard from 'components/ProjectCard'
import moment from 'moment'
import NetInfo from '@react-native-community/netinfo'
import { ScrollView } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'

interface Props {
    navigation: Navigation
}
const ProjectSelector = ({ navigation }: Props) => {
    const [isBusyLoading, setIsBusyLoading] = useState<any>()
    const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [areProjectsEmpty, setAreProjectsEmpty] = useState(false)

    const dispatch = useDispatch()

    const _onRefresh = () => {
        getProjects().then(templates => {
            setData(templates)

            setRefresh(false)
        })
    }

    const _onPressTemplate = (clickedTemplate: any) => {
        dispatch(setProject(clickedTemplate))
        navigation.navigate(Routes.TemplateSelectorStack.TemplateSelector, {
            templates: clickedTemplate?.templateGroupTemplates,
            projectName: clickedTemplate?.name
        })
    }

    const loadTemplates = () => {
        setIsBusyLoading(true)
        getProjects().then(templates => {
            if (templates === 'Empty') {
                setAreProjectsEmpty(true)
                setIsBusyLoading(false)
                return
            }
            setData(templates)
            setIsBusyLoading(false)
        })
    }

    useEffect(() => {
        Orientation.lockToPortrait()

        NetInfo.addEventListener(state => {
            if (state.isConnected === true) {
                loadTemplates()
            }
        })
    }, [])

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
                                    <Title>Projects</Title>
                                    {/*Don't put settings icon here yet, in next version */}
                                </View>
                            </>
                        )
                    }}
                    ListEmptyComponent={<Text>No Projects available</Text>}
                    showsVerticalScrollIndicator={false}
                    style={styles.templateFlatList}
                    data={data}
                    contentContainerStyle={{
                        flexGrow: 1,
                        // alignItems: 'center',
                        paddingBottom: 20
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => _onRefresh}
                        />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, separators, index }) => (
                        <ProjectCard
                            index={index}
                            name={item.name}
                            date={moment(item?.createdDateTime).format(
                                'dddd, MMM D'
                            )}
                            // image={item.sampleImageUrl.replace('http', 'https')}
                            style={{ width: '100%' }}
                            onPress={() => {
                                _onPressTemplate(item)
                            }}
                        />
                    )}
                />
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 5
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

export default ProjectSelector
