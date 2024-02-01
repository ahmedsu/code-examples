import { StyleSheet } from 'react-native'
import { Spinner, View } from 'native-base'

import { useLoaderStore } from '@/store'

export const Loader = () => {
  const { isLoading } = useLoaderStore(state => state)

  return (
    <View
      style={{
        ...localStyles.container,
        display: isLoading ? 'flex' : 'none'
      }}>
      <Spinner size="lg" />
    </View>
  )
}

const localStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10000
  }
})
