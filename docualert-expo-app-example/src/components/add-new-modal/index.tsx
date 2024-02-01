/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prefer-const */
import { useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, FormControl, Input, Select, Switch, View } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Calendar } from 'react-native-calendars'
import dayjs from 'dayjs'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from 'react-i18next'

import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES, GLOBAL_ALERT } from '@/constants'
import {
  useAddNewModalStore,
  useDocumentsStore,
  useGlobalAlertStore,
  useLoaderStore
} from '@/store'
import { useValidation } from '@/hooks'
import {
  getMonth,
  getLeftDays,
  getDurationUntilDate,
  addNotification
} from '@/utils'

import { Tag } from '../tag'
import { CustomText as Text } from '../text'
import { YearPickerModal } from '../year-picker-modal'
import { dropShadow } from '@/theme'

export const AddNewModal = () => {
  const { t } = useTranslation('common')
  const { addDocument } = useDocumentsStore(state => state)
  const { alert } = useGlobalAlertStore(state => state)
  const { setLoader, closeLoader } = useLoaderStore(state => state)
  const { isAddNewModalOpened, closeAddNewModal, openAddNewModal } =
    useAddNewModalStore(state => state)
  const [name, setName] = useState<DOCUMENT_TYPES>(DOCUMENT_TYPES.ID_CARD)
  const [ownerName, setOwnerName] = useState<string>('')
  const [category, setCategory] = useState<DOCUMENT_CATEGORIES>(
    DOCUMENT_CATEGORIES.MY_DOCUMENTS
  )
  const [expirationDate, setExpirationDate] = useState<Date>(new Date())
  const [tempExperiationDate, setTempExpirationDate] = useState<Date>(
    new Date()
  )
  const [isExpirationDatePickerOpened, setIsExpirationDatePickerOpened] =
    useState<boolean>(false)

  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  )

  // NOTIFICATIONS
  const [notifyMonthBefore, setNotifyMonthBefore] = useState<boolean>(false)
  const [notifyWeekBefore, setNotifyWeekBefore] = useState<boolean>(false)
  const [notifyThreeDaysBefore, setNotifyThreeDaysBefore] =
    useState<boolean>(false)
  const [notifyDayBefore, setNotifyDayBefore] = useState<boolean>(false)

  const [touchY, setTouchY] = useState<number>(0)
  const [showYearPicker, setShowYearPicker] = useState(false)

  // Validations

  const { isNameValid } = useValidation()

  const [validations, setValidations] = useState({
    ownerNameInvalid: false
  })

  const setCalendarYear = (year: number) => {
    // Check if the selected year is current year, if so, set the selected date to today. Otherwise, set it to the first day of the year.
    if (year === dayjs().year()) {
      setSelectedDate(dayjs().format('YYYY-MM-DD'))
    } else {
      setSelectedDate(year + '-01-01')
    }

    // Disable year picker
    setShowYearPicker(false)
  }

  const renderComponent = () => {
    if (isExpirationDatePickerOpened) {
      return (
        <View
          onTouchStart={e => setTouchY(e.nativeEvent.pageY)}
          onTouchEnd={e => {
            if (touchY - e.nativeEvent.pageY < -50) {
              closeAddNewModal()
            }
          }}
          style={{
            ...localStyles.modal,
            height: isAddNewModalOpened ? 'auto' : 0,
            padding: isAddNewModalOpened ? 16 : 0
          }}>
          <View style={localStyles.centralText}>
            <Text fontSize="h3" typography="regular">
              {t('Dodaj novi dokument')}
            </Text>
          </View>
          <View style={{ ...localStyles.centralText, marginTop: 24 }}>
            <Text
              onPress={() => setShowYearPicker(true)}
              fontSize="h3"
              typography="regular">
              {`${selectedDate.split('-')[2]}. ${getMonth(
                dayjs(selectedDate).month()
              )} ${dayjs(selectedDate).year()}.`}
            </Text>
            {getLeftDays(selectedDate) > 0 && (
              <Text fontSize="h3" typography="regular">
                {getDurationUntilDate(selectedDate)}
              </Text>
            )}
          </View>
          <View style={localStyles.form}>
            <Calendar
              key={selectedDate}
              renderHeader={date => {
                return (
                  <View>
                    <Text
                      fontSize="h3"
                      typography="regular"
                      onPress={() => setShowYearPicker(true)}>
                      {getMonth(dayjs(date).month())}{' '}
                      <Text>{dayjs(date).year()}</Text>
                    </Text>
                  </View>
                )
              }}
              current={selectedDate}
              minDate={new Date().toString()}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  disableTouchEvent: true
                }
              }}
              onDayPress={day => {
                console.log(day)
                setSelectedDate(day.dateString)

                setTempExpirationDate(new Date(day.timestamp))
              }}
            />
          </View>
          <Button
            style={{
              marginTop: 16,
              marginBottom: 24
            }}
            onPress={() => {
              setExpirationDate(tempExperiationDate)
              setIsExpirationDatePickerOpened(false)
            }}>
            <Text fontSize="h3" typography="regular" color="white">
              {t('Potvrdi datum')}
            </Text>
          </Button>
          {showYearPicker && (
            <YearPickerModal setCalendarYear={setCalendarYear} />
          )}
        </View>
      )
    } else {
      return (
        <View
          onTouchStart={e => setTouchY(e.nativeEvent.pageY)}
          onTouchEnd={e => {
            if (touchY - e.nativeEvent.pageY < -50) {
              closeAddNewModal()
            }
          }}
          style={{
            ...localStyles.modal,
            height: isAddNewModalOpened ? 'auto' : 0,
            padding: isAddNewModalOpened ? 16 : 0
          }}>
          <View style={localStyles.centralText}>
            <Text fontSize="h3" typography="bold" color="primary">
              {t('Dodaj novi dokument')}
            </Text>
          </View>
          <View style={localStyles.form}>
            <Select
              selectedValue={name}
              _selectedItem={{
                bg: '#ecfeff',
                endIcon: (
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={24}
                    color="#000"
                  />
                )
              }}
              size="2xl"
              onOpen={() => closeAddNewModal()}
              onValueChange={(value: DOCUMENT_TYPES) => {
                setName(value)
                openAddNewModal()
              }}>
              {(
                Object.keys(DOCUMENT_TYPES) as (keyof typeof DOCUMENT_TYPES)[]
              ).map((type, index) => (
                <Select.Item
                  label={t(DOCUMENT_TYPES[type])}
                  value={DOCUMENT_TYPES[type]}
                  key={index}
                />
              ))}
            </Select>
            <FormControl isInvalid={validations.ownerNameInvalid}>
              <Input
                size="2xl"
                placeholder={t('Nosioc dokumenta')}
                value={ownerName}
                onChange={e => {
                  const text = e.nativeEvent.text
                  setOwnerName(text)
                  text.length > 2 &&
                    setValidations(prevState => ({
                      ...prevState,
                      ownerNameInvalid: !isNameValid(text)
                    }))
                }}
              />
              <FormControl.ErrorMessage>
                {ownerName.length > 2
                  ? t('Ime treba sadržavati samo slova.')
                  : t('Ime treba sadržavati najmanje tri karaktera')}
              </FormControl.ErrorMessage>
            </FormControl>
            <Input
              size="2xl"
              value={`${expirationDate.getDate()}. ${getMonth(
                expirationDate.getMonth()
              )} ${expirationDate.getFullYear()}.`}
              editable={Platform.OS !== 'ios'}
              onPressIn={() =>
                Platform.OS === 'ios' && setIsExpirationDatePickerOpened(true)
              }
              onTouchEnd={() =>
                Platform.OS === 'android' &&
                setIsExpirationDatePickerOpened(true)
              }
            />
          </View>
          <View style={localStyles.notifyForm}>
            <Text fontSize="h3" typography="regular">
              {t('Obavijesti me')}:
            </Text>
            <View style={localStyles.notifyRow}>
              <View style={localStyles.notifyDiv}>
                <Text typography="bold" fontSize="h3">
                  {t('Mjesec dana do isteka').split(' ')[0]}{' '}
                </Text>
                <Text fontSize="h4" typography="regular">
                  {t('Mjesec dana do isteka').substring(
                    t('Mjesec dana do isteka').indexOf(' ') + 1
                  )}
                </Text>
              </View>
              <Switch
                size="md"
                isChecked={notifyMonthBefore}
                onChange={() => setNotifyMonthBefore(prevState => !prevState)}
              />
            </View>
            <View style={localStyles.notifyRow}>
              <View style={localStyles.notifyDiv}>
                <Text typography="bold" fontSize="h3">
                  {t('7 dana do isteka').charAt(0)}
                </Text>
                <Text fontSize="h4" typography="regular">
                  {t('7 dana do isteka').substring(1)}
                </Text>
              </View>
              <Switch
                size="md"
                isChecked={notifyWeekBefore}
                onChange={() => setNotifyWeekBefore(prevState => !prevState)}
              />
            </View>
            <View style={localStyles.notifyRow}>
              <View style={localStyles.notifyDiv}>
                <Text typography="bold" fontSize="h3">
                  {t('3 dana do isteka').charAt(0)}
                </Text>
                <Text fontSize="h4" typography="regular">
                  {t('3 dana do isteka').substring(1)}
                </Text>
              </View>
              <Switch
                size="md"
                isChecked={notifyThreeDaysBefore}
                onChange={() =>
                  setNotifyThreeDaysBefore(prevState => !prevState)
                }
              />
            </View>
            <View style={localStyles.notifyRow}>
              <Text fontSize="h4" typography="regular">
                {t('Na dan isteka')}
              </Text>
              <Switch
                size="md"
                isChecked={notifyDayBefore}
                onChange={() => setNotifyDayBefore(prevState => !prevState)}
              />
            </View>
          </View>
          <View style={localStyles.pickCategory}>
            <Text fontSize="h4" typography="regular">
              {t('Izaberi kategoriju')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 8
              }}>
              <Tag
                bgColor="115, 91, 242"
                isSelected={category === DOCUMENT_CATEGORIES.MY_DOCUMENTS}
                label={t('Lični dokumenti')}
                onPress={() => setCategory(DOCUMENT_CATEGORIES.MY_DOCUMENTS)}
              />
              <Tag
                bgColor="0, 149, 255"
                isSelected={category === DOCUMENT_CATEGORIES.FAMILY_DOCUMENTS}
                label={t('Porodica')}
                onPress={() =>
                  setCategory(DOCUMENT_CATEGORIES.FAMILY_DOCUMENTS)
                }
              />
            </View>
          </View>
          <TouchableOpacity
            style={localStyles.saveDocumentBtn}
            onPress={() => {
              setLoader()
              if (notifyDayBefore) {
                let notifyDayDate = new Date(expirationDate)
                notifyDayDate.setDate(notifyDayDate.getDate() - 1)
                addNotification({
                  date: notifyDayDate,
                  title: `${t('Istek dokumenta')} - ${t(name)}`,
                  body: `${t(name)} ${t('na ime')} ${ownerName} ${t(
                    'ističe sutra.'
                  )}`
                })
              }
              if (notifyThreeDaysBefore) {
                let notifyThreeDaysDate = new Date(expirationDate)
                notifyThreeDaysDate.setDate(notifyThreeDaysDate.getDate() - 3)
                addNotification({
                  date: notifyThreeDaysDate,
                  title: `${t('Istek dokumenta')} - ${t(name)}`,
                  body: `${t(name)} ${t('na ime')} ${ownerName} ${t(
                    'ističe za tri dana.'
                  )}`
                })
              }
              if (notifyWeekBefore) {
                let notifyWeekDate = new Date(expirationDate)
                notifyWeekDate.setDate(notifyWeekDate.getDate() - 7)
                addNotification({
                  date: notifyWeekDate,
                  title: `${t('Istek dokumenta')} - ${name}`,
                  body: `${name} ${t('na ime')} ${ownerName} ${t(
                    'ističe za 7 dana.'
                  )}`
                })
              }
              if (notifyMonthBefore) {
                let notifyMonthDate = new Date(expirationDate)
                notifyMonthDate.setMonth(notifyMonthDate.getMonth() - 1)
                addNotification({
                  date: notifyMonthDate,
                  title: `${t('Istek dokumenta')} - ${name}`,
                  body: `${name} ${t('na ime')} ${ownerName} ${t(
                    'ističe za mjesec.'
                  )}`
                })
              }

              let valid = true

              if (ownerName.length <= 2) {
                setValidations(prevState => ({
                  ...prevState,
                  ownerNameInvalid: true
                }))
                valid = false
              }

              const isFormInvalid = Object.values(validations).some(
                val => val === true
              )

              if (isFormInvalid) {
                valid = false
              }

              if (valid) {
                setName(DOCUMENT_TYPES.ID_CARD)
                setExpirationDate(new Date())
                setOwnerName('')
                setNotifyMonthBefore(false)
                setNotifyWeekBefore(false)
                setNotifyDayBefore(false)
                setNotifyThreeDaysBefore(false)
                setCategory(DOCUMENT_CATEGORIES.MY_DOCUMENTS)
                addDocument({
                  id: uuidv4(),
                  name: name,
                  expirationDate: expirationDate,
                  ownerName: ownerName,
                  notifyMonthBefore: notifyMonthBefore,
                  notifyWeekBefore: notifyWeekBefore,
                  notifyDayBefore: notifyDayBefore,
                  category: category
                })
                alert(t('Dokument je uspješno dodan.'), GLOBAL_ALERT.SUCCESS)
                closeLoader()
                closeAddNewModal()
              } else {
                alert(
                  t('Validacija neuspješna. Molimo provjerite sva polja'),
                  GLOBAL_ALERT.ERROR
                )
                closeLoader()
              }
            }}>
            <Text fontSize="h3" typography="regular" color="white">
              {t('Spremi dokument')}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return renderComponent()
}

const localStyles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 0,
    width: '100%',
    padding: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...dropShadow,
    zIndex: 50
  },
  centralText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    position: 'relative',
    marginTop: 24,
    rowGap: 16
  },
  notifyForm: {
    marginTop: 16,
    rowGap: 8
  },
  notifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pickCategory: {
    marginTop: 24
  },
  saveDocumentBtn: {
    marginTop: 16,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#182E75',
    paddingTop: 10,
    paddingBottom: 10
  },
  loginFont: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#182E75'
  },
  notifyDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
