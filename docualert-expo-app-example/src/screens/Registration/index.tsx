import { useState } from 'react'
import { Button, Checkbox, Center, Input, useTheme, View } from 'native-base'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import { appleAuth } from '@invertase/react-native-apple-authentication'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Ionicons } from '@expo/vector-icons'

import { Text } from '@/components'
import { GLOBAL_ALERT, NAVIGATION_NAMES } from '@/constants'
import { useGlobalAlertStore, useLoaderStore } from '@/store'
import { NavigationNames } from '@/types'
import { dropShadow } from '@/theme'

export const RegistrationScreen = () => {
  const { t } = useTranslation('common')
  const theme = useTheme()
  const navigation = useNavigation<StackNavigationProp<NavigationNames>>()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const { alert } = useGlobalAlertStore(state => state)
  const { setLoader, closeLoader } = useLoaderStore(state => state)
  const [tosAccepted, setTosAccepted] = useState(false)

  const loginWithApple = async () => {
    setLoader()

    if (!tosAccepted) {
      closeLoader()
      alert(t('Morate prihvatiti uslove korištenja.'), GLOBAL_ALERT.ERROR)
      return
    }

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
      alert(t('Uspješno ste se registrovali.'), GLOBAL_ALERT.SUCCESS)
      return auth().signInWithCredential(appleCredential)
    } catch {
      closeLoader()
      alert(t('Neuspješna registracija sa Apple ID.'), GLOBAL_ALERT.ERROR)
    }
  }

  const loginWithGoogle = async () => {
    setLoader()

    if (!tosAccepted) {
      closeLoader()
      alert(t('Morate prihvatiti uslove korištenja.'), GLOBAL_ALERT.ERROR)
      return
    }

    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn()

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)

      // Sign-in the user with the credential
      closeLoader()
      alert(t('Uspješno ste se registrovali.'), GLOBAL_ALERT.SUCCESS)
      return auth().signInWithCredential(googleCredential)
    } catch {
      closeLoader()
      alert(t('Neuspješna registracija sa Google.'), GLOBAL_ALERT.ERROR)
    }
  }

  const register = () => {
    setLoader()

    if (!tosAccepted) {
      closeLoader()
      alert(t('Morate prihvatiti uslove korištenja.'), GLOBAL_ALERT.ERROR)
      return
    }

    if (password === passwordConfirm) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          alert(t('Uspješno ste se registrovali.'), GLOBAL_ALERT.SUCCESS)
          closeLoader()
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            alert(t('Email adresa je već u upotrebi.'), GLOBAL_ALERT.ERROR)
          } else if (error.code === 'auth/invalid-email') {
            alert(t('Email nije validan.'), GLOBAL_ALERT.ERROR)
          } else if (error.code === 'auth/weak-password') {
            alert(t('Šifra nije sigurna.'), GLOBAL_ALERT.ERROR)
          } else {
            alert(t('Registracija neuspješna.'), GLOBAL_ALERT.ERROR)
          }
          closeLoader()
        })
    } else {
      closeLoader()
      alert(t('Šifre se ne poklapaju.'), GLOBAL_ALERT.ERROR)
    }
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
          {t('Registrujte se')}
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
          <Input
            size="2xl"
            placeholder={t('Potvrdi šifru')}
            value={passwordConfirm}
            type={passwordVisible ? 'text' : 'password'}
            onChange={e => setPasswordConfirm(e.nativeEvent.text)}
            InputRightElement={renderPasswordVisibleIcon()}
          />
          <View style={localStyles.checkboxContainer}>
            <Checkbox
              value="tosAccepted"
              isChecked={tosAccepted}
              onChange={() => setTosAccepted(prevState => !prevState)}
            />
            <Text fontSize="body11">
              {t('Prihvatam Uslove korištenja i Uslove privatnosti')}
            </Text>
          </View>
          <Button onPress={() => register()}>{t('Registruj se')}</Button>
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
            />
          </View>
          <Center>
            <Text fontSize="body11">
              {t('Registruj se pomoću Google maila ili Apple ID-a')}
            </Text>
          </Center>
          <Center style={{ flexDirection: 'row', paddingVertical: 32 }}>
            <Text>{t('Već imaš profil?')} </Text>
            <Text
              typography="semiBold"
              color="primary"
              onPress={() => navigation.navigate(NAVIGATION_NAMES.LOGIN)}>
              {t('Prijavi se')}
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
    alignItems: 'center',
    marginVertical: 16
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
    columnGap: 16
  }
})
