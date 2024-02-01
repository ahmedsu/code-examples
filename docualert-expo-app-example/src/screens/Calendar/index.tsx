import React, { useEffect } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { View } from 'native-base'
import { useState } from 'react'
import { Agenda, AgendaEntry } from 'react-native-calendars'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { Layout, Text } from '@/components'
import { useDocumentsStore, useEditStore } from '@/store'
import { NavigationNames } from '@/types'
import { NAVIGATION_NAMES } from '@/constants'

export const CalendarScreen = () => {
  const { t } = useTranslation('common')
  const navigation = useNavigation<StackNavigationProp<NavigationNames>>()
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  )
  const { documents } = useDocumentsStore(state => state)
  const [expirationDates, setExpirationDates] = useState<any>({})

  const { setSelectedItem } = useEditStore(state => state)

  useEffect(() => {
    const expDates = {}
    documents.forEach(document => {
      expDates[dayjs(document.expirationDate).format('YYYY-MM-DD')] = [
        {
          id: document.id,
          name: document.name,
          height: 60,
          category: document.category
        }
      ]
    })
    setExpirationDates(expDates)
  }, [documents])

  const renderItem = (
    event: AgendaEntry & { id?: string; category?: string },
    isFirst: boolean
  ) => {
    return (
      <TouchableOpacity
        style={styles.documentInfo}
        onPress={() => {
          setSelectedItem(event?.id)
          navigation.navigate(NAVIGATION_NAMES.EDIT)
        }}>
        <Text>
          <Text style={styles.infoItemTitle}>{t('Istek dokumenta')}: </Text>
          <Text style={styles.infoItemValue}> {t(event.name)}</Text>
        </Text>

        <Text>
          <Text style={styles.infoItemTitle}>
            {t('Kategorija')}:{' '}
            <Text style={styles.infoItemValue}>{t(event.category)}</Text>
          </Text>
        </Text>
      </TouchableOpacity>
    )
  }

  const reservationsKeyExtractor = (item, index) => {
    return `${item?.reservation?.day}${index}`
  }

  return (
    <Layout scroll={false}>
      <Agenda
        // The list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key has to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={expirationDates}
        // Callback that gets called on day press
        onDayPress={day => {
          setSelectedDate(day.dateString)
        }}
        // Initially selected day
        selected={selectedDate}
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        minDate={dayjs().format('YYYY-MM-DD')}
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        // maxDate={'2023-12-01'}
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={6}
        // Max amount of months allowed to scroll to the future. Default = 50
        //futureScrollRange={50}
        // Specify how each item should be rendered in agenda
        renderItem={renderItem}
        // Specify how agenda knob should look like
        /* renderKnob={() => {
          return <View />
        }}*/
        // Specify what should be rendered instead of ActivityIndicator
        renderEmptyData={() => {
          return (
            <View style={styles.spaceTop}>
              <Text>
                {t('Nema dokumenata koji ističu na')} {selectedDate}
              </Text>
            </View>
          )
        }}
        // Specify your item comparison function for increased performance
        rowHasChanged={(r1, r2) => {
          return r1.name !== r2.name
        }}
        // Hide knob button. Default = false
        //hideKnob={true}
        // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
        showClosingKnob={true}
        // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
        //  disabledByDefault={true}
        // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
        onRefresh={() => console.log('refreshing...')}
        // Set this true while waiting for new data from a refresh
        refreshing={false}
        // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
        refreshControl={null}
        // Agenda theme
        theme={{
          agendaDayTextColor: '#172E75',
          agendaDayNumColor: '#172E75',
          agendaTodayColor: '#172E75',
          agendaKnobColor: '#172E75',
          dotColor: 'red',
          selectedDayBackgroundColor: '#172E75',
          todayTextColor: '#172E75'
        }}
        // Agenda container style
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  documentInfo: {
    height: 60,
    marginTop: 32
  },
  infoItemTitle: { fontFamily: 'Montserrat-600', fontSize: 15 },
  infoItemValue: {
    fontFamily: 'Montserrat-500',
    color: '#172E75',
    fontSize: 15
  },
  spaceTop: {
    marginTop: 45
  }
})
