import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES } from '@/constants'

export interface Document {
  id: string
  name: DOCUMENT_TYPES
  expirationDate: Date
  ownerName: string
  notifyMonthBefore: boolean
  notifyWeekBefore: boolean
  notifyDayBefore: boolean
  notifyThreeDaysBefore: boolean
  category: DOCUMENT_CATEGORIES
}
