import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './languages/en'
import bs from './languages/bs'
import hr from './languages/hr'

const resources = {
  en,
  bs,
  hr
}
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3', //To make it work for Android devices, add this line.
    resources,
    lng: 'en', // default language to use.
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false
    }
  })
export default i18n
