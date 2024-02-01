import {Routes} from '@config'
import * as Scrn from '@screens'

export default [
    {
        name: Routes.appIntro,
        component: Scrn.AppIntro,
        options: {
            headerShown: false
        }
    },
    {
        name: Routes.marketingOnboarding,
        component: Scrn.MarketingOnboarding,
        options: {
            headerShown: false
        }
    },
    {
        name: Routes.login,
        component: Scrn.Login,
        options: {
            title: ''
        }
    },
    {
        name: Routes.forgotPassword,
        component: Scrn.ForgotPassword,
        options: {
            title: ''
        }
    },
    {
        name: Routes.resetPasswordCheckInbox,
        component: Scrn.ResetPasswordCheckInbox,
        options: {
            title: ''
        }
    },
    {
        name: Routes.newPassword,
        component: Scrn.NewPassword,
        options: {
            title: ''
        }
    },
    {
        name: Routes.resetPasswordSuccess,
        component: Scrn.ResetPasswordSuccess,
        options: {
            title: ''
        }
    },
    {
        name: Routes.signup,
        component: Scrn.SignUp,
        options: {
            title: ''
        }
    },
    {
        name: Routes.createPassword,
        component: Scrn.CreatePassword,
        options: {
            title: ''
        }
    },
    {
        name: Routes.termsOfService,
        component: Scrn.TermsOfService,
        options: {
            title: 'Terms of Service'
        }
    }
]