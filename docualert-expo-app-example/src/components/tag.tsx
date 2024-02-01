import { FC } from 'react'
import { Pressable } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { dropShadow } from '@/theme'

import { CustomText as Text } from './text'

interface TagProps {
  bgColor: string
  isSelected: boolean
  label: string
  onPress: () => void
}

export const Tag: FC<TagProps> = ({ bgColor, isSelected, label, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '48%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        columnGap: 8,
        padding: 12,
        backgroundColor: `rgba(${bgColor},0.3)`,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: isSelected ? `rgb(${bgColor})` : 'transparent',
        ...dropShadow
      }}>
      <MaterialCommunityIcons
        name="circle-slice-8"
        style={{ color: `rgb(${bgColor})`, opacity: isSelected ? 1 : 0.3 }}
      />
      <Text color="black" fontSize="h6" typography="regular">
        {label}
      </Text>
    </Pressable>
  )
}
