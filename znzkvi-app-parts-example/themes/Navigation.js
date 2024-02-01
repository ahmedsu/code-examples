import Colors from './Colors'

export default {
    defaultScreenOptions: {
        headerTintColor: Colors.primary,
        headerBackTitle: ' ',
        headerTitleStyle: {
            fontFamily: 'Montserrat-Regular'
        }
    },
    noHeader: {
        headerStyle: {
            //backgroundColor: 'rgb(242, 242, 242)',
            elevation: 0,
            shadowOffset: {
                height: 0
            }
        }
    }
}