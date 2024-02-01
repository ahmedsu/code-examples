import React, { useEffect, useState } from 'react'
import { Alert, HStack, VStack } from 'native-base'

import { CustomText as Text } from '../text'
import { useGlobalAlertStore } from '@/store'

export const GlobalAlert = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { message, type, alert } = useGlobalAlertStore(state => state)

  useEffect(() => {
    if (message && type) {
      setIsVisible(true)
      setTimeout(() => {
        setIsVisible(false)
        alert('', undefined)
      }, 3000)
    } else {
      setIsVisible(false)
    }
  }, [message, type])

  return (
    <Alert
      colorScheme={type}
      status={type}
      style={{
        display: isVisible ? 'flex' : 'none',
        position: 'absolute',
        top: 50,
        left: 18,
        right: 18
      }}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          space={2}
          alignItems="center"
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text color="black">{message}</Text>
          </HStack>
        </HStack>
      </VStack>
    </Alert>
  )
}
