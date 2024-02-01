const Routes = {
    CapturePhotoStack: {
        title: 'CapturePhotoStack',
        CapturePhoto: 'CapturePhoto',
        Camera: 'Camera',
        ValidateBarcode: 'ValidateBarcode',
        Validate: 'Validate',
        NiceWork: 'NiceWork',
        Failure: 'Failure'
    },
    SettingsStack: {
        title: 'SettingsStack',
        Settings: 'Settings',

        UploadListing: 'UploadListing',
        UploadDetail: 'UploadDetail',
        Stats: 'Stats'
    },
    UserStack: {
        title: 'UserStack',
        User: 'User'
    },
    HomeStack: {
        title: 'HomeStack',
        Home: 'Home'
    },
    TemplateSelectorStack: {
        title: 'TemplateSelectorStack',
        ProjectSelector: 'ProjectSelector',
        TemplateSelector: 'TemplateSelector'
    },
    TabNavigator: {
        title: 'TabNavigator',
        Home: 'Home',
        Templates: 'TemplateSelectorStack',
        Photo: 'CapturePhotoStack',
        Settings: 'SettingsStack',
        User: 'User'
    },
    AuthStack: {
        Login: 'Login'
    }
}

export default Routes
