/* eslint-disable prefer-const */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
    ActivityIndicator,
    Platform
} from 'react-native'
import { Container, Text, Button as MyButton, Divider, Title } from 'components'
import ProjectCard from 'components/ProjectCard'

import { getPhotosOnCloud, getProjects } from '../helpers/restApi'
import StatsCard from 'components/StatsCard'
import { useSelector, useDispatch } from '../hooks/reduxHooks'
import {
    checkForLostImages,
    getTotalDiskSpaceByUser,
    uploadPhotosInPending
} from 'helpers/uploadService'
import Carousel from 'react-native-reanimated-carousel'
import SnapCarousel from 'react-native-snap-carousel'
import Dots from 'components/Dots'
import Routes from '../navigation/Routes'
import moment from 'moment'
import { setProject } from 'redux/actions/projectActions'
import store from 'redux/store'
import {
    setNewTotalFailedUploadsWithoutUUID,
    setNewTotalPendingUploads,
    setNewTotalPendingUploadsWithoutUUID,
    setNewTotalSuccessfulUploads,
    setNewTotalSuccessfulUploadsWithoutUUID,
    setTotalFailedUploadsWithoutUUID
} from 'redux/actions/uploadActions'
import RNFS from 'react-native-fs'
import { useIsFocused } from '@react-navigation/native'
import Orientation from 'react-native-orientation-locker'

interface IProjectCard {
    colors: string[]
    name: string
    date: string
    image: string
}

const Home = ({ navigation }: any) => {
    const {
        totalSuccessfulUploadsWithoutUUID,
        totalPendingUploadsWithoutUUID,
        totalFailedUploadsWithoutUUID,

        totalSuccessfulUploads
    } = useSelector(state => state.upload)
    const { width } = useWindowDimensions()

    const totalUploads =
        totalFailedUploadsWithoutUUID.length +
        totalPendingUploadsWithoutUUID.length +
        totalSuccessfulUploadsWithoutUUID.length
    const renderItem = ({ item }: { item: IProjectCard }) => (
        <ProjectCard {...item} />
    )
    const [currentIndex, setCurrentIndex] = useState(0)
    const [entries, setEntries] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [areProjectsEmpty, setAreProjectsEmpty] = useState(false)

    const dispatch = useDispatch()

    const scrollRef = useRef()
    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) Orientation.lockToPortrait()
        if (isFocused === false) {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true
            })
        }
    }, [isFocused])

    const setDataToRedux = (type, item) => {
        if (type === 'successful') {
            const tempArr1 = totalSuccessfulUploadsWithoutUUID.filter(
                filteredItem => filteredItem !== item
            )
            dispatch(setNewTotalSuccessfulUploadsWithoutUUID(tempArr1, true))

        } else if (type === 'falied') {
            const tempArr1 = totalFailedUploadsWithoutUUID.filter(
                filteredItem => filteredItem !== item
            )

            store.dispatch(setNewTotalFailedUploadsWithoutUUID(tempArr1))

        } else if (type === 'pending') {
            const tempArr1 = totalPendingUploadsWithoutUUID.filter(
                filteredItem => filteredItem !== item
            )

            store.dispatch(setNewTotalPendingUploadsWithoutUUID(tempArr1))


        }
    }

    const checkItem = async (
        item: {
            keepImageFor: number
            uploadDate: moment.MomentInput
            image: { fileName: string }
        },
        type: string
    ) => {
        let numOfDays = 7

        if (item.keepImageFor === 1) {
            numOfDays = 1
        } else if (item.keepImageFor === 2) {
            numOfDays = 7
        } else if (item.keepImageFor === 3) {
            numOfDays = 30
        }

        let uploadedOn = moment(item.uploadDate)

        // FOR TESTING ADD '2022-07-03T06:25:25.898Z' TO LINE 158 - moment() BELOW

        const checkDate = moment().diff(uploadedOn, 'days')

        if (Math.abs(checkDate) >= numOfDays) {
            const imageLocation =
                RNFS.DocumentDirectoryPath + '/' + item.image.fileName

            const exists = await RNFS.exists(imageLocation)

            if (exists) {
                // exists call delete
                await RNFS.unlink(imageLocation)

                setDataToRedux(type, item)
            }
        }
    }

    const checkDates = async () => {
        totalSuccessfulUploadsWithoutUUID.forEach(item => {
            checkItem(item, 'successful')
        })
        totalFailedUploadsWithoutUUID.forEach(item => {
            checkItem(item, 'failed')
        })
        totalPendingUploadsWithoutUUID.forEach(item => {
            checkItem(item, 'pending')
        })
    }

    const onPressTemplate = (clickedTemplate: any) => {
        dispatch(setProject(clickedTemplate))
        navigation.navigate(Routes.TemplateSelectorStack.title, {
            screen: Routes.TemplateSelectorStack.TemplateSelector,
            params: {
                templates: clickedTemplate?.templateGroupTemplates,
                projectName: clickedTemplate?.name
            }
        })
    }

    const getTemplatesFromApi = () => {
        try {
            getProjects().then(templates => {
                if (templates === 'Empty') {
                    setAreProjectsEmpty(true)
                    setIsLoaded(true)
                    return
                }
                const tempEntries = entries

                if (templates.status === 400) {
                    setTimeout(() => {
                        getTemplatesFromApi()
                    }, 1000)
                }

                templates.map(
                    (
                        item: {
                            name: any
                            createdDateTime: moment.MomentInput
                            sampleImageUrl: any
                        },
                        index: any
                    ) => tempEntries.push({
                        name: item?.name,
                        date: moment(item.createdDateTime).format(
                            'dddd, MMM D'
                        ),
                        image: item?.sampleImageUrl,
                        index: index,
                        onPress: () => onPressTemplate(item)
                    })
                )

                let entriesArr: React.SetStateAction<never[]> = []
                if (tempEntries?.[0]) entriesArr.push(tempEntries[0])
                if (tempEntries?.[1]) entriesArr.push(tempEntries[1])
                if (tempEntries?.[2]) entriesArr.push(tempEntries[2])

                setEntries(entriesArr)

                setIsLoaded(true)
            })
        } catch (err) {
            //
        }
    }

    useEffect(() => {
        checkForLostImages()
        getTemplatesFromApi()
        checkDates()

    }, [])

    const isAndroid = useMemo(() => Platform.OS === 'android', [])
    return (
        <Container style={{ paddingHorizontal: 0 }}>
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}>
                <Divider size={31} />
                <View style={[styles.heading, { paddingHorizontal: 30 }]}>
                    <Title>Upcoming projects</Title>
                    {/* <Image
                        style={styles.threeDots}
                        source={require('../assets/three-dots.png')}
                    /> */}
                    <View style={styles.threeDots}>
                        <Dots
                            maxSteps={entries.length}
                            currentStep={currentIndex}
                        />
                    </View>
                </View>
                {isLoaded && entries.length > 0 ? (
                    <View style={{ height: 170 }}>
                        {isAndroid ? (
                            <Carousel
                                renderItem={renderItem}
                                data={entries}
                                width={width}
                                loop
                                // data={entries}
                                // renderItem={renderItem}
                                // windowSize={2}
                                // sliderWidth={width}
                                // itemWidth={310}
                                onSnapToItem={setCurrentIndex}
                            />
                        ) : (
                            <SnapCarousel
                                loop
                                data={entries}
                                renderItem={renderItem}
                                windowSize={2}
                                sliderWidth={width}
                                itemWidth={310}
                                onSnapToItem={setCurrentIndex}
                            />
                        )}
                    </View>
                ) : areProjectsEmpty ? (
                    <Text
                        style={{
                            alignSelf: 'center',
                            marginVertical: 15
                        }}>
                        No projects avaliable
                    </Text>
                ) : (
                    <ActivityIndicator style={{ margin: 40 }} />
                )}
                <View style={{ paddingHorizontal: 30 }}>
                    <Divider size={20} />
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <MyButton
                            style={styles.button}
                            onPress={() =>
                                navigation.navigate(
                                    Routes.TemplateSelectorStack.title,
                                    {
                                        screen: Routes.TemplateSelectorStack
                                            .ProjectSelector
                                    }
                                )
                            }>
                            <Text style={{ color: 'white' }}>
                                View All Projects
                            </Text>
                        </MyButton>
                    </View>

                    <Title style={{ marginTop: 50 }}>Photography stats</Title>
                    <View style={styles.statsContainer}>
                        <StatsCard
                            color="#52C41A"
                            title="Successful Photos"
                            numbers={[
                                totalSuccessfulUploadsWithoutUUID.length,
                                totalUploads
                            ]}
                        />
                        <StatsCard
                            color="#45AEFF"
                            title="Disk Space Used"
                            numbers={[
                                getTotalDiskSpaceByUser(
                                    totalSuccessfulUploadsWithoutUUID,
                                    totalPendingUploadsWithoutUUID,
                                    totalFailedUploadsWithoutUUID
                                ),
                                1
                            ]}
                        />
                    </View>
                    <View style={styles.statsContainer}>
                        <StatsCard
                            color="#F39200"
                            title="Pending Photos"
                            numbers={[
                                totalPendingUploadsWithoutUUID.length,
                                totalUploads
                            ]}
                        />
                        <StatsCard
                            color="#FF6845"
                            title="Failed Photos"
                            numbers={[
                                totalFailedUploadsWithoutUUID.length,
                                totalUploads
                            ]}
                        />
                    </View>
                    <View style={styles.centeredView}>
                        <MyButton
                            onPress={() => { 
                                navigation.navigate(
                                    Routes.TabNavigator.Settings
                                )
                            }}>
                            <Text style={{ color: 'white' }}>
                                View All Stats
                            </Text>
                        </MyButton>
                    </View>
                </View>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    threeDots: {
        width: 55,
        height: 7
    },
    templates: {
        flexDirection: 'row',
        height: 153
    },
    button: {
        borderRadius: 100,
        backgroundColor: '#45AEFF',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 20
    },
    statsContainer: {
        flexDirection: 'row',
        flex: 1,
        // flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    centeredView: {
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center'
    }
})

export default Home
