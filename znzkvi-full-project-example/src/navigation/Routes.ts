export default {
    AuthStack: {
        Email: 'Email',
        Register: 'Register',
        Login: 'Login',
        ForgotPassword: {
            Email: 'ForgotPassword_Email',
            Code: 'ForgotPassword_Code',
            Password: 'ForgotPassword_Password'
        }
    },
    AppStack: {
        GetReady: 'GetReady',
        Home: 'Home',
        Profile: 'Profile',
        Quiz: 'Quiz',
        Settings: 'Settings',
        Statistics: 'Statistics',
        Success: 'Success'
    }
} as const
