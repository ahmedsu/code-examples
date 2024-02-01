import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Routes from './Routes'
import CapturePhoto from 'screens/CapturePhoto'
import ValidateBarcode from 'screens/ValidateBarcode'
import Failure from 'screens/Failure'
import CameraScreen from 'screens/Camera'
import NiceWork from 'screens/NiceWork'

const Stack = createNativeStackNavigator()

const CapturePhotoStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={Routes.CapturePhotoStack.CapturePhoto}>
            <Stack.Screen
                component={CapturePhoto}
                name={Routes.CapturePhotoStack.CapturePhoto}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                component={ValidateBarcode}
                name={Routes.CapturePhotoStack.ValidateBarcode}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                component={Failure}
                name={Routes.CapturePhotoStack.Failure}
            />
            <Stack.Screen
                options={{ headerShown: false, gestureEnabled: false }}
                component={CameraScreen}
                name={Routes.CapturePhotoStack.Camera}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                component={NiceWork}
                name={Routes.CapturePhotoStack.NiceWork}
            />
        </Stack.Navigator>
    )
}

export default CapturePhotoStack
