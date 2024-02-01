import React, { useRef, useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useNavigation } from '@react-navigation/native'
import {
  AlertDialog,
  Center,
  Button,
  Input,
  Select,
  Switch,
  View,
  FormControl
} from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import Flag from 'react-native-flags'

import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES, GLOBAL_ALERT } from '@/constants'
import { Tag, Text, Expiration } from '@/components'
import { useDocumentsStore, useEditStore, useGlobalAlertStore } from '@/store'
import { useValidation } from '@/hooks'
import {
  getDocumentBgColor,
  getDurationUntilDate,
  getLeftDays,
  getMonth
} from '@/utils'
import { dropShadow } from '@/theme'

export const EditForm = () => {
  const { t } = useTranslation('common')
  const { selectedItem, flag } = useEditStore(state => state)
  const { documents } = useDocumentsStore(state => state)
  const selectedDocument = (documents || []).find(
    doc => doc['id'] === selectedItem
  )
  const { alert } = useGlobalAlertStore(state => state)

  const [name, setName] = useState<DOCUMENT_TYPES>(
    (selectedDocument?.name as DOCUMENT_TYPES) ?? DOCUMENT_TYPES.ID_CARD
  )
  const [ownerName, setOwnerName] = useState<string>(
    selectedDocument?.ownerName ?? ''
  )
  const [category, setCategory] = useState<DOCUMENT_CATEGORIES>(
    selectedDocument?.category ?? DOCUMENT_CATEGORIES.MY_DOCUMENTS
  )
  const [expirationDate, setExpirationDate] = useState<Date>(
    new Date(selectedDocument?.expirationDate) ?? new Date()
  )
  const [tempExperiationDate, setTempExpirationDate] = useState<Date>(
    new Date(selectedDocument?.expirationDate ?? new Date())
  )
  const [isExpirationDatePickerOpened, setIsExpirationDatePickerOpened] =
    useState<boolean>(false)
  const [notifyMonthBefore, setNotifyMonthBefore] = useState<boolean>(
    selectedDocument?.notifyMonthBefore ?? false
  )
  const [notifyWeekBefore, setNotifyWeekBefore] = useState<boolean>(
    selectedDocument?.notifyWeekBefore ?? false
  )
  const [notifyDayBefore, setNotifyDayBefore] = useState<boolean>(
    selectedDocument?.notifyDayBefore ?? false
  )
  const { editDocument, removeDocument } = useDocumentsStore(state => state)
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] =
    useState<boolean>(false)
  const cancelRef = useRef(null)
  const navigation = useNavigation()
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Validations

  const { isNameValid } = useValidation()

  const [validations, setValidations] = useState({
    ownerNameInvalid: false
  })

  const renderComponent = () => {
    if (isExpirationDatePickerOpened) {
      return (
        <View>
          <View style={{ ...localStyles.centralText, marginTop: 24 }}>
            <Text fontSize="h3" typography="regular">
              {`${tempExperiationDate.getDate()}. ${getMonth(
                tempExperiationDate.getMonth()
              )} ${tempExperiationDate.getFullYear()}.`}
            </Text>
            {getLeftDays(selectedDate) > 0 && (
              <Text>{getDurationUntilDate(selectedDate)}</Text>
            )}
          </View>
          <View style={localStyles.form}>
            <Calendar
              current={tempExperiationDate.toString()}
              minDate={new Date().toString()}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  disableTouchEvent: true
                }
              }}
              onDayPress={day => {
                setSelectedDate(day.dateString)
                setTempExpirationDate(new Date(day.timestamp))
              }}
            />
          </View>
          <TouchableOpacity
            style={[localStyles.confirmBtn]}
            onPress={() => {
              setExpirationDate(tempExperiationDate)
              setIsExpirationDatePickerOpened(false)
            }}>
            <Text fontSize="h3" typography="regular" color="white">
              {t('Potvrdi datum')}
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <>
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
              onValueChange={(value: DOCUMENT_TYPES) => {
                setName(value)
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
              <Text fontSize="h4" typography="regular">
                {t('Mjesec dana do isteka')}
              </Text>
              <Switch
                size="sm"
                isChecked={notifyMonthBefore}
                onChange={() => setNotifyMonthBefore(prevState => !prevState)}
              />
            </View>
            <View style={localStyles.notifyRow}>
              <Text fontSize="h4" typography="regular">
                {t('Sedmicu do isteka')}
              </Text>
              <Switch
                size="sm"
                isChecked={notifyWeekBefore}
                onChange={() => setNotifyWeekBefore(prevState => !prevState)}
              />
            </View>
            <View style={localStyles.notifyRow}>
              <Text fontSize="h4" typography="regular">
                {t('Na dan isteka')}
              </Text>
              <Switch
                size="sm"
                isChecked={notifyDayBefore}
                onChange={() => setNotifyDayBefore(prevState => !prevState)}
              />
            </View>
          </View>
          <View style={localStyles.pickCategory}>
            <Text fontSize="h3" typography="regular">
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
            <TouchableOpacity
              style={localStyles.btnComponent}
              onPress={() => {
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
                  alert(
                    t('Dokument je uspješno izmijenjen'),
                    GLOBAL_ALERT.SUCCESS
                  )
                  editDocument({
                    id: selectedItem,
                    name: name,
                    expirationDate: expirationDate,
                    ownerName: ownerName,
                    notifyMonthBefore: notifyMonthBefore,
                    notifyWeekBefore: notifyWeekBefore,
                    notifyDayBefore: notifyDayBefore,
                    category: category
                  })
                  navigation.goBack()
                } else {
                  alert(
                    t('Validacija neuspješna. Molimo provjerite sva polja'),
                    GLOBAL_ALERT.ERROR
                  )
                }
              }}>
              <Text fontSize="h3" typography="regular" color="white">
                {t('Spasi promjene')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                localStyles.btnComponent,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  marginTop: 0
                }
              ]}
              onPress={() => {
                setIsDeleteDialogOpened(true)
              }}>
              <Text fontSize="h3" typography="regular" color="white">
                {t('Izbriši dokument')}
              </Text>
            </TouchableOpacity>
          </View>
          <Center>
            <AlertDialog
              leastDestructiveRef={cancelRef}
              isOpen={isDeleteDialogOpened}
              onClose={() => setIsDeleteDialogOpened(false)}>
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>{t('Izbriši dokument')}</AlertDialog.Header>
                <AlertDialog.Body>
                  {t('Da li ste sigurni da želite trajno izbrisati dokument?')}
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="unstyled"
                      colorScheme="coolGray"
                      onPress={() => {
                        setIsDeleteDialogOpened(false)
                      }}
                      ref={cancelRef}>
                      {t('Odustani')}
                    </Button>
                    <Button
                      colorScheme="danger"
                      onPress={() => {
                        alert(
                          t('Dokument je uspješno izbrisan'),
                          GLOBAL_ALERT.SUCCESS
                        )
                        // @ts-ignore
                        removeDocument({
                          id: selectedItem
                        })
                        navigation.goBack()
                        setIsDeleteDialogOpened(false)
                      }}>
                      {t('Izbriši')}
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
          </Center>
        </>
      )
    }
  }

  return (
    <>
      <View
        style={{
          ...localStyles.documentsSwiperItem,
          backgroundColor: getDocumentBgColor(selectedDocument?.name)
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}>
          <Text fontSize="h3" typography="semiBold">
            {t(selectedDocument?.name)}
          </Text>
          <Flag code={flag} size={32} />
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Text typography="semiBold">{selectedDocument?.ownerName}</Text>
          <Expiration
            expirationDate={selectedDocument?.expirationDate.toString()}
          />
        </View>
      </View>
      {renderComponent()}
    </>
  )
}

const localStyles = StyleSheet.create({
  editFormContainer: {},
  editFormIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24
  },
  editFormIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 4
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
    rowGap: 4
  },
  notifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pickCategory: {
    marginTop: 24
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 20
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 6
  },
  documentsSwiperItem: {
    height: 164,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    ...dropShadow
  },
  documentSwiperItemFlag: {
    position: 'absolute',
    top: 8,
    right: 16,
    height: 25,
    width: 36
  },
  btnComponent: {
    marginTop: 16,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#182E75'
  },
  loginFont: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  confirmBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#182E75',
    top: 30
  }
})
