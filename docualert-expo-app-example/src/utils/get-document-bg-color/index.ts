import { DOCUMENT_TYPES } from '@/constants'

export const getDocumentBgColor = (name: DOCUMENT_TYPES) => {
  switch (name) {
    case DOCUMENT_TYPES.ID_CARD:
      return '#ecfeff'
    case DOCUMENT_TYPES.DRIVING_LICENSE:
      return '#fdf2f8'
    case DOCUMENT_TYPES.PASSPORT:
      return '#ecfdf5'
    case DOCUMENT_TYPES.CAR_REGISTRATION:
      return '#fefce8'
    default:
      return '#ecfeff'
  }
}
