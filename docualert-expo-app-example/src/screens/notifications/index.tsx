import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import { useTranslation } from 'react-i18next'

import { Layout, Text } from '@/components'
import { AllowNotifications } from './components'

export const Notifications = () => {
  const { t } = useTranslation('common')
  return (
    <Layout>
      <View style={localStyles.title}>
        <Text fontSize="h3" typography="semiBold">
          {t('Notifikacije')}
        </Text>
      </View>
      <AllowNotifications />
    </Layout>
  )
}

const localStyles = StyleSheet.create({
  title: {
    marginBottom: 20
  }
})
