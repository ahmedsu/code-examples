import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, useTheme, Image, View } from 'native-base'
import { StatusBar } from 'expo-status-bar'

import { Text } from '@/components'
import { WELCOME_DATA } from '@/constants'
import { useWelcomeScreenStore } from '@/store'

export const StartScreen = () => {
  const theme = useTheme()
  const [tab, setTab] = useState<number>(0)
  const { completeWelcomeScreen } = useWelcomeScreenStore(state => state)

  return (
    <View
      style={{
        ...localStyles.container,
        backgroundColor: theme.colors.primary[500]
      }}>
      <StatusBar style="light" />
      {WELCOME_DATA.map((item, index) => {
        return (
          <View
            style={{
              ...localStyles.item,
              display: tab === index ? 'flex' : 'none'
            }}
            key={index}>
            <Text
              style={localStyles.itemHeading}
              fontSize="h3"
              typography="regular"
              color="white">
              {item.heading}
            </Text>
            <Image
              style={{ marginTop: 100 }}
              source={item.image}
              alt={item.heading}
            />
            <View style={localStyles.itemBox}>
              <Text fontSize="h3" typography="bold" color="primary">
                {item.title}
              </Text>
              <Text style={localStyles.itemParagraph}>{item.paragraph}</Text>
              <View style={localStyles.footer}>
                <View style={localStyles.dots}>
                  <View
                    style={{
                      ...localStyles.dot,
                      width: index === 0 ? 25 : 7,
                      backgroundColor:
                        index === 0 ? theme.colors.primary[500] : 'grey'
                    }}
                  />
                  <View
                    style={{
                      ...localStyles.dot,
                      width: index === 1 ? 25 : 7,
                      backgroundColor:
                        index === 1 ? theme.colors.primary[500] : 'grey'
                    }}
                  />
                  <View
                    style={{
                      ...localStyles.dot,
                      width: index === 2 ? 25 : 7,
                      backgroundColor:
                        index === 2 ? theme.colors.primary[500] : 'grey'
                    }}
                  />
                </View>
                <Button
                  onPress={() => {
                    tab === 2
                      ? completeWelcomeScreen()
                      : setTab(prevState => prevState + 1)
                  }}>
                  {index === 2 ? 'Završi' : 'Dalje'}
                </Button>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const localStyles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemHeading: {
    marginTop: 64,
    marginBottom: 24
  },
  itemBox: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    rowGap: 16,
    width: '100%',
    padding: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },
  itemParagraph: {
    textAlign: 'left'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dots: {
    flexDirection: 'row',
    columnGap: 5
  },
  dot: {
    height: 7,
    width: 7,
    backgroundColor: 'grey',
    borderRadius: 10
  }
})
