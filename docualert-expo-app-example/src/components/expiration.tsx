import { FC } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import { useTranslation } from 'react-i18next'

import { CustomText as Text } from './text'

interface ExpirationProps {
  expirationDate: string
}

export const Expiration: FC<ExpirationProps> = ({ expirationDate }) => {
  const { t } = useTranslation('common')
  const isExpired = new Date(expirationDate) < new Date()
  const difference = Math.abs(
    new Date(expirationDate).getTime() - new Date().getTime()
  )
  const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30))
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const years = Math.floor(months / 12)

  const renderCorrectMonthLabel = (months: number) => {
    if (months === 0) {
      return t('dana')
    } else if (months > 5) {
      return t('mjeseci')
    } else {
      return t('mjeseca')
    }
  }

  const renderExpiration = () => {
    if (isExpired) {
      return (
        <Text
          fontSize="body13"
          typography="semiBold"
          style={{ color: '#dc2626' }}>
          {t('Dokument je istekao!')}
        </Text>
      )
    } else if (years >= 1) {
      return (
        <>
          <Text fontSize="body13" typography="regular">
            {t('Istek dokumenta za:')}
          </Text>
          <Text style={{ lineHeight: 0 }} fontSize="h1" typography="bold">
            {years}+
          </Text>
          <Text fontSize="body13" typography="regular">
            {t('godina')}
          </Text>
        </>
      )
    } else {
      return (
        <>
          <Text
            fontSize="body13"
            typography="regular"
            style={{ color: '#dc2626' }}>
            {t('Istek dokumenta za:')}
          </Text>
          <Text fontSize="h1" typography="bold" style={{ color: '#dc2626' }}>
            {months === 0 ? days : months}
          </Text>
          <Text
            fontSize="body13"
            typography="regular"
            style={{ color: '#dc2626' }}>
            {renderCorrectMonthLabel(months)}
          </Text>
        </>
      )
    }
  }

  return (
    <View style={localStyles.expirationContainer}>{renderExpiration()}</View>
  )
}

const localStyles = StyleSheet.create({
  expirationContainer: {
    alignItems: 'flex-end'
  }
})
