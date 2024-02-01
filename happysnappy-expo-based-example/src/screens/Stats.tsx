import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Dimensions,
    Pressable
} from 'react-native'
import Orientation from 'react-native-orientation-locker'
import DatePicker from 'react-native-date-picker'
import { momentDateFormat } from 'constants/SettingsContants'
import { successfulUploadsForUserForSelectedMonthAndYear } from 'helpers/uploadService'
import calculateStatsForUploads from 'helpers/uploadStatsCalc'
import moment from 'moment'
import { Container, Title, Divider } from 'components'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import colors from 'colors'
import AntIcon from 'react-native-vector-icons/AntDesign'

const win = Dimensions.get('window')

const Stats = () => {
    const [date, setDate] = useState<Date>(new Date())
    const [isDatepickerOpen, setIsDatepickerOpen] = useState(false)
    const [localStateStatsData, setLocalStateStatsData] = useState()
    const [totals, setTotals] = useState()
    const navigation = useNavigation()

    useEffect(() => {
        Orientation.lockToPortrait()
    }, [])
    useEffect(() => {
        updateStatsData(date)
    }, [date])

    const getUploads = (upload: any, numberOfDays: any) => {
        const uploadDate = moment(upload.uploadDate)
        return uploadDate.date() === numberOfDays
    }
    const updateStatsData = async (localDate: moment.MomentInput) => {
        const selectedDate = moment(localDate, momentDateFormat)
        const uploadsForSelectedMonth =
            successfulUploadsForUserForSelectedMonthAndYear({ selectedDate })
        let numberOfDaysInMonth = selectedDate.daysInMonth()
        const localStatsData = []
        const today = moment(new Date(), momentDateFormat)
        if (
            selectedDate.year() === today.year() &&
            selectedDate.month() === today.month() &&
            numberOfDaysInMonth > today.date()
        ) {
            numberOfDaysInMonth = today.date()
        }

        while (numberOfDaysInMonth > 0) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            const uploadsForDay = uploadsForSelectedMonth.filter(upload =>
                getUploads(upload, numberOfDaysInMonth)
            )
            const stats = calculateStatsForUploads(uploadsForDay)

            localStatsData.push({
                day: numberOfDaysInMonth,
                dataUsed: stats.dataUsedToDisplay,
                numberOfUploads: stats.numberOfUploadsToDisplay
            })

            numberOfDaysInMonth--
        }

        setDate(date)
        setLocalStateStatsData(localStatsData)

        let tempArr = { dataUsed: 0, uploads: 0 }
        localStatsData.map(item => {
            let tempData = item.dataUsed
            let numUploads = item.numberOfUploads
            if (tempData === '-') {
                tempData = 0
            }
            if (numUploads === '-') {
                numUploads = 0
            }
            tempArr = {
                dataUsed: parseFloat(tempArr.dataUsed + tempData),
                uploads: parseInt(tempArr.uploads) + parseInt(numUploads)
            }
        })

        setTotals(tempArr)
    }

    return (
        <Container style={{ paddingHorizontal: 0 }}>
            <Divider size={31} />
            <View
                style={{
                    marginLeft: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10
                }}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-circle-outline" size={25} color="#000" />
                </Pressable>
                <Title style={{ marginLeft: 10 }}>Stats</Title>
            </View>
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly'
                }}>
                <Pressable
                    onPress={() => {
                        setDate(
                            prev => new Date(moment(prev).subtract(1, 'months'))
                        )
                    }}>
                    <AntIcon name="leftcircleo" size={28} color={'gray'} />
                </Pressable>
                <Pressable
                    style={{
                        width: '60%',
                        paddingVertical: 12,
                        borderColor: colors.PRIMARY_COLOR_3,
                        alignItems: 'center',
                        borderWidth: 1
                        // borderRadius: 15
                    }}
                    onPress={() => {
                        setIsDatepickerOpen(true)
                    }}>
                    <Text>{moment(date).format('MMM YYYY')}</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        setDate(prev => new Date(moment(prev).add(1, 'months')))
                    }}>
                    <AntIcon name="rightcircleo" size={28} color={'gray'} />
                </Pressable>
            </View>
            <View style={styles.shadowCard}>
                <View style={styles.headerRow}>
                    <Text
                        style={[
                            styles.dayCell,
                            styles.headerCell,
                            { paddingLeft: 8 }
                        ]}>
                        Day
                    </Text>
                    <Text
                        style={[
                            styles.numberOfUploadsCell,
                            styles.rightTextAlign,
                            styles.headerCell
                        ]}>
                        No. of Uploads
                    </Text>
                    <Text
                        style={[
                            styles.dataUsedCell,
                            styles.rightTextAlign,
                            styles.headerCell,
                            { paddingRight: 8 }
                        ]}>
                        Data Used (MB)
                    </Text>
                    <Divider horizontal size={10} />
                </View>
                <FlatList
                    style={styles.statsFlatList}
                    data={localStateStatsData}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 10
                    }}
                    ListFooterComponent={() => (
                        <View style={styles.footerRow}>
                            <Text
                                style={[
                                    styles.dayCell,
                                    styles.headerCell
                                    //  { paddingLeft: 8 }
                                ]}>
                                Total
                            </Text>
                            <Text
                                style={[
                                    styles.numberOfUploadsCell,
                                    styles.rightTextAlign,
                                    styles.headerCell
                                ]}>
                                {totals?.uploads}
                            </Text>
                            <Text
                                style={[
                                    styles.dataUsedCell,
                                    styles.rightTextAlign,
                                    styles.headerCell
                                    // { paddingRight: 8 }
                                ]}>
                                {totals?.dataUsed}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={{ paddingHorizontal: 15 }}>
                            <View style={styles.separatorRow}></View>
                            <View
                                style={[
                                    styles.statsRow,
                                    {
                                        backgroundColor:
                                            index % 2 ? 'transparent' : 'white'
                                    }
                                ]}>
                                <Text style={styles.dayCell}>{item.day}</Text>
                                <Text
                                    style={[
                                        styles.numberOfUploadsCell,
                                        styles.rightTextAlign
                                    ]}>
                                    {item.numberOfUploads}
                                </Text>
                                <Text
                                    style={[
                                        styles.dataUsedCell,
                                        styles.rightTextAlign
                                    ]}>
                                    {item.dataUsed}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            </View>
            <DatePicker
                mode={'date'}
                modal
                open={isDatepickerOpen}
                date={date}
                onConfirm={newDate => {
                    setIsDatepickerOpen(false)
                    setDate(newDate)
                }}
                onCancel={() => {
                    setIsDatepickerOpen(false)
                }}
            />
        </Container>
    )
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10
    },
    mainView: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20
    },
    datePicker: {
        paddingLeft: 0,
        marginLeft: 0,
        alignSelf: 'center',
        width: win.width - 40
    },
    shadowCard: {
        borderRadius: 20,
        backgroundColor: 'white',
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

        marginHorizontal: 20,
        marginVertical: 20,
        overflow: 'hidden'
    },
    statsFlatList: {
        // alignSelf: 'center',
        width: win.width - 40,
        backgroundColor: 'white',
        borderRadius: 20
    },
    headerRow: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        borderBottomColor: 'rgba(182, 182, 182, 0.8)',
        borderBottomWidth: 1
    },
    footerRow: {
        marginTop: 10,
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        borderTopColor: 'rgba(182, 182, 182, 0.8)',
        borderTopWidth: 1,
        paddingHorizontal: 15
    },
    totalsRow: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#d6d7da',
        width: win.width - 40
    },
    separatorRow: {
        height: 2
    },
    statsRow: {
        flexDirection: 'row'
    },
    headerCell: {
        marginTop: 0,
        fontFamily: 'Poppins-Regular',
        fontWeight: '700',
        color: 'black'
    },
    dayCell: {
        flex: 0.15,
        paddingLeft: 10,
        justifyContent: 'center'
    },
    numberOfUploadsCell: {
        flex: 0.4,
        paddingRight: 5
    },
    dataUsedCell: {
        flex: 0.45,
        paddingRight: 5
    },
    rightTextAlign: {
        textAlign: 'right'
    },
    centerTextAlign: {
        textAlign: 'center'
    }
})

export default Stats
