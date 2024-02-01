import { useState } from 'react'
import { Button, Checkbox, Center, Input, useTheme, View } from 'native-base'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import auth from '@react-native-firebase/auth'
import { appleAuth } from '@invertase/react-native-apple-authentication'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'

import { Text } from '@/components'
import { NAVIGATION_NAMES, GLOBAL_ALERT } from '@/constants'
import { useGlobalAlertStore, useLoaderStore } from '@/store'
import { NavigationNames } from '@/types'
import { dropShadow } from '@/theme'

export const LoginScreen = () => {
  const theme = useTheme()
  const navigation = useNavigation<StackNavigationProp<NavigationNames>>()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const { alert } = useGlobalAlertStore(state => state)
  const { setLoader, closeLoader } = useLoaderStore(state => state)
  const { t } = useTranslation('common')

  const loginWithApple = async () => {
    setLoader()

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
      })

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned')
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      )

      // Sign the user in with the credential
      closeLoader()
      alert(t('Uspješno ste se prijavili.'), GLOBAL_ALERT.SUCCESS)
      return auth().signInWithCredential(appleCredential)
    } catch {
      closeLoader()
      alert(t('Neuspješna prijava sa Apple ID.'), GLOBAL_ALERT.ERROR)
    }
  }

  const loginWithGoogle = async () => {
    setLoader()

    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn()

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)

      // Sign-in the user with the credential
      closeLoader()
      alert(t('Uspješno ste se prijavili.'), GLOBAL_ALERT.SUCCESS)
      return auth().signInWithCredential(googleCredential)
    } catch {
      closeLoader()
      alert(t('Neuspješna prijava sa Google.'), GLOBAL_ALERT.ERROR)
    }
  }

  const login = () => {
    setLoader()
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert(t('Prijava uspješna'), GLOBAL_ALERT.SUCCESS)
        closeLoader()
      })
      .catch(() => {
        alert(t('Prijava neušpješna'), GLOBAL_ALERT.ERROR)
        closeLoader()
      })
  }

  const renderPasswordVisibleIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => setPasswordVisible(prevState => !prevState)}>
        <Ionicons
          name={passwordVisible ? 'ios-eye' : 'ios-eye-off'}
          size={24}
          color="black"
          style={{
            opacity: 0.3,
            marginRight: 8
          }}
        />
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={{
        ...localStyles.background,
        backgroundColor: theme.colors.primary[500]
      }}>
      <StatusBar style="light" />
      <View style={localStyles.container}>
        <Text
          fontSize="header25"
          typography="bold"
          color="white"
          style={{ paddingLeft: 24 }}>
          {t('Prijavite se')}
        </Text>
        <View style={localStyles.absoluteContainer}>
          <Input
            size="2xl"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.nativeEvent.text.toLowerCase())}
          />
          <Input
            size="2xl"
            placeholder={t('Šifra')}
            value={password}
            type={passwordVisible ? 'text' : 'password'}
            onChange={e => setPassword(e.nativeEvent.text)}
            InputRightElement={renderPasswordVisibleIcon()}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}>
            <Text fontSize="h6" typography="bold" color="primary">
              {t('Zaboravili ste šifru?')}
            </Text>
          </View>
          <View style={localStyles.checkboxContainer}>
            <Checkbox value="Edin" />
            <Text>{t('Zapamti prijavu')}</Text>
          </View>
          <TouchableOpacity
            style={localStyles.loginBtn}
            onPress={() => login()}>
            <Text style={localStyles.loginFont}>{t('Prijavi se')}</Text>
          </TouchableOpacity>
          <View style={localStyles.orContainer}>
            <View
              style={{
                ...localStyles.line,
                backgroundColor: theme.colors.gray['100']
              }}
            />
            <Text>{t('ili')}</Text>
            <View
              style={{
                ...localStyles.line,
                backgroundColor: theme.colors.gray['100']
              }}
            />
          </View>
          <View style={localStyles.iconsContainer}>
            <AntDesign
              name="google"
              size={24}
              onPress={() => loginWithGoogle()}
            />
            <AntDesign
              name="apple1"
              size={24}
              onPress={() => loginWithApple()}
              style={localStyles.appleLogo}
            />
          </View>
          <Center>
            <Text fontSize="body11">
              {t('Prijavi se pomoću Google maila ili Apple ID-a')}
            </Text>
          </Center>
          <Center style={{ flexDirection: 'row', paddingVertical: 32 }}>
            <Text>{t('Nemaš profil?')} </Text>
            <Text
              typography="semiBold"
              color="primary"
              onPress={() => {
                navigation.navigate(NAVIGATION_NAMES.REGISTRATION)
              }}>
              {t('Registruj se')}
            </Text>
          </Center>
        </View>
      </View>
    </View>
  )
}

const localStyles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 64
  },
  absoluteContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    rowGap: 16,
    width: '100%',
    padding: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...dropShadow
  },
  checkboxContainer: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center'
  },
  orContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 8
  },
  line: {
    height: 2,
    width: 100
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 16,
    paddingTop: 10,
    paddingBottom: 10
  },
  appleLogo: {
    top: -3
  },
  loginFont: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#182E75'
  }
})
