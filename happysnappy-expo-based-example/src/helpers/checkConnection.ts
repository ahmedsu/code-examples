import NetInfo from '@react-native-community/netinfo'

const checkConnection = async () => {
    const network = await NetInfo.fetch()

    //return false
    return network.isConnected
}

export default checkConnection
