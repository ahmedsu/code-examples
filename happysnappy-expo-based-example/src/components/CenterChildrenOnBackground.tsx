import React from 'react'
import { ImageBackground } from 'react-native'

const CenterChildrenOnBackground: React.FC = ({ children }) => {
    return (
        <ImageBackground
            source={require('../assets/background/background_image.png')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {children}
        </ImageBackground>
    )
}

export default CenterChildrenOnBackground
