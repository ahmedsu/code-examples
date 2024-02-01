/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { FC } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Pressable, View } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'

import { Text } from '@/components'
import { Expiration } from '@/components'
import { NAVIGATION_NAMES } from '@/constants'
import { getDocumentBgColor } from '@/utils'
import { Document, NavigationNames } from '@/types'
import { useEditStore } from '@/store'
import { dropShadow } from '@/theme'

interface ListProps {
  category: string
  documents: Document[]
  index: number
}

export const List: FC<ListProps> = ({ category, documents, index }) => {
  const { t } = useTranslation('common')
  if (documents.length === 0) return null

  return (
    <View>
      <Text
        fontSize="h3"
        typography="regular"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          paddingTop: index === 0 ? 24 : 0
        }}>
        {t(category)}
      </Text>
      <View style={{ paddingTop: 16, paddingBottom: 24, rowGap: 16 }}>
        {documents.map((item, index) => (
          <ListItem item={item} key={index} />
        ))}
      </View>
    </View>
  )
}

const ListItem = ({ item }) => {
  const { id, name, expirationDate } = item
  const navigation = useNavigation<StackNavigationProp<NavigationNames>>()
  const { setSelectedItem } = useEditStore(state => state)
  const { t } = useTranslation('common')

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedItem(id)
        navigation.navigate(NAVIGATION_NAMES.EDIT)
      }}>
      <View
        style={{
          ...localStyles.listItemContainer,
          backgroundColor: getDocumentBgColor(name)
        }}>
        <View style={localStyles.listItem}>
          <Text fontSize="h5" typography="semiBold">
            {t(name)}
          </Text>
        </View>
        <Expiration expirationDate={expirationDate} />
      </View>
    </TouchableOpacity>
  )
}

const localStyles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ECFEFF',
    borderRadius: 10,
    ...dropShadow,
    maxHeight: 80
  },
  listItem: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center'
  }
})
