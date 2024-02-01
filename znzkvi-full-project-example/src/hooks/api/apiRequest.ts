import axios, { AxiosRequestConfig } from 'axios'
import { Platform } from 'react-native'

export default async (request: AxiosRequestConfig, params?: any) => {
    request.url = 'https://znzkvi.ba/api/' + request.url
    request.method = request.method || 'get'
    request.withCredentials = true
    // If request.url is specified, append it to the baseURL, otherwise just use the baseURL
    if (Platform.OS === 'android') {
        request.data = request.data || {}
    }
    if (request.data && request.method === 'get') {
        // If data is set the get request won't be made
        request.data = null
    }
    request.headers = {
        ...request.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Device': 'mobile'
    }

    if (params) {
        request.params = params
    }

    return axios(request)
}
