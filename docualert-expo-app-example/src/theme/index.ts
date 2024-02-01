import { extendTheme } from 'native-base'

export const theme = extendTheme({
  colors: {
    primary: {
      400: '#182e75',
      500: '#182e75',
      600: '#182e75',
      700: '#182e75',
      800: '#182e75'
    },
    light: {
      100: '#f9f9f9'
    }
  },
  fontConfig: {
    Montserrat: {
      100: {
        normal: 'Montserrat-100',
        italic: 'Montserrat-100'
      },
      200: {
        normal: 'Montserrat-200',
        italic: 'Montserrat-200'
      },
      300: {
        normal: 'Montserrat-300',
        italic: 'Montserrat-300'
      },
      400: {
        normal: 'Montserrat-400',
        italic: 'Montserrat-400'
      },
      500: {
        normal: 'Montserrat-500',
        italic: 'Montserrat-500'
      },
      600: {
        normal: 'Montserrat-600',
        italic: 'Montserrat-600'
      },
      700: {
        normal: 'Montserrat-700',
        italic: 'Montserrat-700'
      },
      800: {
        normal: 'Montserrat-800',
        italic: 'Montserrat-800'
      }
    }
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
    mono: 'Montserrat'
  }
})

export { dropShadow } from './drop-shadow'
