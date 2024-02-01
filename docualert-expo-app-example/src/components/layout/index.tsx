import { FC, PropsWithChildren } from 'react'
import {
  Platform,
  SafeAreaView,
  StatusBar as StatusBarRN,
  StyleSheet
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, View } from 'native-base'

interface LayoutProps {
  scroll?: boolean
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  children,
  scroll
}) => {
  return (
    <SafeAreaView style={styles.layout}>
      <StatusBar style="dark" />
      {scroll ? (
        <ScrollView style={styles.container}>{children}</ScrollView>
      ) : (
        <View style={styles.container}>{children}</View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBarRN.currentHeight : 0,
    backgroundColor: '#f5f5f5'
  },
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: Platform.OS === 'android' && 10,
    paddingBottom: 16,
    marginBottom: Platform.OS === 'android' ? 60 : 42
  }
})
