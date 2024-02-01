import { create } from 'zustand'
import { Document } from '@/types'
import { MMKV } from 'react-native-mmkv'

interface DocumentsStore {
  documents: Document[]
  addDocument: (document: Document) => void
  removeDocument: (document: Document) => void
  editDocument: (document: Document) => void
}

const storage = new MMKV()

export const useDocumentsStore = create<DocumentsStore>(set => ({
  documents: JSON.parse(storage.getString('documents') || '[]') ?? [],
  addDocument: document =>
    set(state => {
      storage.set('documents', JSON.stringify([...state.documents, document]))
      return {
        documents: [...state.documents, document]
      }
    }),
  removeDocument: document =>
    set(state => {
      storage.set(
        'documents',
        JSON.stringify(state.documents.filter(doc => doc.id !== document.id))
      )
      return {
        documents: state.documents.filter(doc => doc.id !== document.id)
      }
    }),
  editDocument: document =>
    set(state => {
      storage.set(
        'documents',
        JSON.stringify(
          state.documents.map(doc => (doc.id === document.id ? document : doc))
        )
      )
      return {
        documents: state.documents.map(doc =>
          doc.id === document.id ? document : doc
        )
      }
    })
}))
