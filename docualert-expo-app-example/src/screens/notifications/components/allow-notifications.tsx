import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Alert, HStack, Switch, View } from 'native-base'
import notifee from '@notifee/react-native'

import { Text } from '@/components'
import { useTranslation } from 'react-i18next'

export const AllowNotifications = () => {
  const { t } = useTranslation('common')
  const [notificationsAllowed, setNotificationsAllowed] =
    useState<boolean>(false)

  // @ts-ignore
  useEffect(async () => {
    const settings = await notifee.requestPermission()
    settings.authorizationStatus !== undefined
      ? setNotificationsAllowed(true)
      : setNotificationsAllowed(false)
  }, [])

  return (
    <View>
      <View style={localStyles.notificationsContainer}>
        <Text>{t('Dopusti sva dopuštenja')}</Text>
        <Switch
          isChecked={notificationsAllowed}
          onChange={() => setNotificationsAllowed(true)}
        />
      </View>
      <Alert status="info" style={localStyles.alert}>
        <HStack>
          <Alert.Icon />
          <Text style={localStyles.alertText}>
            {t(
              'Ukoliko dopuštena, aplikacije će imati mogućnost poslati obavijest u određeno vrijeme za izabrane dokumente'
            )}
          </Text>
        </HStack>
      </Alert>
    </View>
  )
}

const localStyles = StyleSheet.create({
  notificationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  alert: {
    marginTop: 20
  },
  alertText: {
    paddingLeft: 12
  }
})
