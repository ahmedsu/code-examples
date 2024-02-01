import { Dimensions } from 'react-native'

const BASE_HEIGHT = 852
const BASE_WIDTH = 393
const { height, width } = Dimensions.get('window')

export const heightScale = height / BASE_HEIGHT
export const widthScale = width / BASE_WIDTH

export const scaleByHeight = (size: number) => heightScale * size
export const scaleByWidth = (size: number) => widthScale * size
