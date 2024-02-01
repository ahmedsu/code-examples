import { FC, useState } from 'react'
import {
  Alert as NBAlert,
  Box,
  CloseIcon,
  HStack,
  IconButton,
  VStack,
  View
} from 'native-base'

import { Text } from '@/components'
import { useDocumentsStore } from '@/store'
import { useTranslation } from 'react-i18next'
import { dropShadow } from '@/theme'

export const Alerts = () => {
  const { documents } = useDocumentsStore(state => state)
  const expiringDocuments = documents.filter(document => {
    const difference = Math.abs(
      new Date(document.expirationDate).getTime() - new Date().getTime()
    )
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30))
    const isExpiring = months < 1

    return isExpiring ? document : null
  })

  return (
    <View style={{ rowGap: 16 }}>
      {expiringDocuments.map((document, index) => (
        <Alert
          key={index}
          name={document.name}
          expirationDate={new Date(document.expirationDate).toLocaleDateString(
            'hr-HR'
          )}
          type="warning"
        />
      ))}
    </View>
  )
}

interface AlertProps {
  name?: string
  expirationDate?: string
  type: 'warning' | 'success' | 'error' | 'info'
}

const Alert: FC<AlertProps> = ({ name, expirationDate, type }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const { t } = useTranslation('common')
  const tName = t(name)

  return (
    <NBAlert
      shadow={2}
      colorScheme={type}
      style={{
        display: isVisible ? 'flex' : 'none',
        ...dropShadow
      }}>
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          space={2}
          alignItems="center"
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <NBAlert.Icon />
            <Text fontSize="h5" typography="semiBold">
              {t('Dokument pred istekom')}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size="3" color="coolGray.600" />}
            onPress={() => setIsVisible(false)}
          />
        </HStack>
        <Box pl="6">
          <Text>
            {t(
              'Vaš dokument {{name}} ističe na datum {{expirationDate}} godine!',
              {
                name: tName,
                expirationDate
              }
            )}
          </Text>
        </Box>
      </VStack>
    </NBAlert>
  )
}
