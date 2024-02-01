import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native'
import React, { useMemo } from 'react'
import SvgIcons from '@assets/svgs/icons'
import Svgs from '@assets/svgs'
import BottomTab from '@components/BottomTab'
import StatisticCard from '@components/StatisticCard'
import Divider from '@components/Divider'
import CategoryDataRow from '@components/CategoryDataRow'
import RoundButton from '@components/RoundButton'
import SettingsHeader from '@components/SettingsHeader'
import Text from '@components/Text'
import { scaleByWidth } from '@constants/Scaling'
import useGetUserStatistics from '@hooks/api/useGetUserStatistics'

const HORIZONTAL_PADDING = 20
const Statistics = () => {
    const screenWidth = useWindowDimensions().width
    const { data } = useGetUserStatistics()
    const ITEMS = useMemo(
        () => [
            { label: 'Broj pitanja', value: data?.data?.total_questions },
            { label: 'Uspješnost', value: data?.data?.success_rate },
            { label: 'Kvizovi', value: data?.data?.total_quizzes },
            { label: 'Rang', value: data?.data?.rang }
        ],
        [data]
    )
    return (
        <View style={localStyles.container}>
            <FlatList
                contentContainerStyle={localStyles.contentContainerStyle}
                ListHeaderComponent={
                    <>
                        <SettingsHeader
                            icon={<SvgIcons.Ranking />}
                            title="Statistike"
                        />
                        <Divider size={20} />
                    </>
                }
                ListFooterComponent={
                    <>
                        <Divider size={30} />
                        <View style={localStyles.fullWidth}>
                            <View style={localStyles.svgContainer}>
                                <Svgs.StatisticsContainer
                                    preserveAspectRatio={'none'}
                                    height={'100%'}
                                    width={'100%'}
                                    style={localStyles.svg}
                                />
                                <View style={localStyles.contentContainer}>
                                    <Text fs={36}>KATEGORIJE</Text>
                                    <Divider size={15} />
                                    <CategoryDataRow
                                        icon={
                                            <RoundButton
                                                icon={
                                                    <SvgIcons.MentalnoRazgibavanje />
                                                }
                                            />
                                        }
                                        percentage={
                                            data?.data?.category_1 || ''
                                        }
                                        title="Mentalno razgibavanje"
                                    />
                                    <Divider size={15} />
                                    <CategoryDataRow
                                        icon={
                                            <RoundButton
                                                icon={<SvgIcons.Stecak />}
                                            />
                                        }
                                        percentage={
                                            data?.data?.category_2 || ''
                                        }
                                        title="ZEMLJO TISUCLJETNA"
                                    />
                                    <Divider size={15} />
                                    <CategoryDataRow
                                        icon={
                                            <RoundButton
                                                icon={<SvgIcons.Umjetnost />}
                                            />
                                        }
                                        percentage={
                                            data?.data?.category_3 || ''
                                        }
                                        title="UMJETNOST I KULTURICA"
                                    />
                                    <Divider size={15} />
                                    <CategoryDataRow
                                        icon={
                                            <RoundButton
                                                icon={<SvgIcons.Sport />}
                                            />
                                        }
                                        percentage={
                                            data?.data?.category_5 || ''
                                        }
                                        title="LAGANO SPORTSKI"
                                    />
                                    <Divider size={15} />
                                    <CategoryDataRow
                                        icon={
                                            <RoundButton
                                                icon={<SvgIcons.Politicar />}
                                            />
                                        }
                                        percentage={
                                            data?.data?.category_4 || ''
                                        }
                                        title="NOVIJA POLITIČKA HISTORIJA BIH"
                                    />
                                    <Divider size={15} />
                                    <CategoryDataRow
                                        icon={
                                            <RoundButton
                                                icon={<SvgIcons.UspjesneZene />}
                                            />
                                        }
                                        percentage={
                                            data?.data?.category_6 || ''
                                        }
                                        title="USPJESNE ZENE"
                                    />
                                    <Divider size={15} />
                                    <CategoryDataRow
                                        icon={
                                            <RoundButton
                                                icon={<SvgIcons.Nobel />}
                                            />
                                        }
                                        percentage={
                                            data?.data?.category_7 || ''
                                        }
                                        title="PITANJE ZA NOBELA"
                                    />
                                </View>
                            </View>
                        </View>
                    </>
                }
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <StatisticCard
                        {...item}
                        itemWidth={
                            (screenWidth - HORIZONTAL_PADDING * 2 - 10) / 2
                        }
                    />
                )}
                data={ITEMS}
                numColumns={2}
                ItemSeparatorComponent={Divider}
                columnWrapperStyle={localStyles.columnWrapperStyle}
            />

            <BottomTab currentTab="ranking" />
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    contentContainerStyle: {
        flexGrow: 1
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
    fullWidth: {
        width: '100%'
    },
    svg: {
        ...StyleSheet.absoluteFillObject,
        left: 20,
        right: 20
    },
    columnWrapperStyle: {
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    svgContainer: {
        height: scaleByWidth(710),
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 30
    }
})
export default Statistics
