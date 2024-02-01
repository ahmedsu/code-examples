import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Select, View } from 'native-base'
import auth from '@react-native-firebase/auth'
import DeviceInfo from 'react-native-device-info'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from 'i18next'

import { Layout, Text } from '@/components'
import { COUNTRY, LANGUAGES } from '@/constants'
import { useEditStore, useLanguageStore } from '@/store'
import { TouchableOpacity } from 'react-native-gesture-handler'

export const Settings = () => {
  const { t, i18n } = useTranslation('common')
  const { language: storeLanguage } = useLanguageStore(state => state)
  const { setFlag } = useEditStore(state => state)
  const [language, setLanguage] = useState<string>(i18n.language)
  const [country, setCountry] = useState<string>(COUNTRY.BA)

  return (
    <Layout>
      <View style={localStyles.title}>
        <Text
          fontSize="h3"
          typography="semiBold"
          style={{
            marginBottom: 24
          }}>
          {t('Postavke')}
        </Text>
      </View>
      <View style={localStyles.container}>
        <View style={localStyles.selectContainer}>
          <Text>{t('Odaberite državu')}</Text>
          <Select
            selectedValue={country}
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
            onValueChange={(value: COUNTRY) => {
              setCountry(value)
              setFlag(value)
            }}>
            {(Object.keys(COUNTRY) as (keyof typeof COUNTRY)[]).map(
              (type, index) => (
                <Select.Item
                  label={t(COUNTRY[type])}
                  value={COUNTRY[type]}
                  key={index}
                />
              )
            )}
          </Select>
        </View>
        <View style={localStyles.selectContainer}>
          <Text>{t('Odaberite jezik')}</Text>
          <Select
            selectedValue={language}
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
            onValueChange={(value: LANGUAGES) => {
              setLanguage(value)
              changeLanguage(value)
            }}>
            {(Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]).map(
              (type, index) => (
                <Select.Item
                  label={t(LANGUAGES[type])}
                  value={LANGUAGES[type]}
                  key={index}
                />
              )
            )}
          </Select>
        </View>

        <TouchableOpacity
          style={localStyles.loginBtn}
          onPress={() => {
            auth().signOut()
          }}>
          <Text style={localStyles.loginFont}>{t('Odjavi se')}</Text>
        </TouchableOpacity>
        <Text>
          {t('Trenutna verzija aplikacije')}: {DeviceInfo.getVersion()}
        </Text>
      </View>
    </Layout>
  )
}

const localStyles = StyleSheet.create({
  title: {
    marginBottom: 20
  },
  container: {
    rowGap: 20
  },
  selectContainer: {
    rowGap: 4
  },
  loginBtn: {
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
  }
})
