import { Layout, Text } from '@/components'
import { Alerts, List } from './components'
import { DOCUMENT_CATEGORIES } from '@/constants'
import { useDocumentsStore } from '@/store'
import { useTranslation } from 'react-i18next'

export const Documents = () => {
  const { documents } = useDocumentsStore(state => state)
  const { t } = useTranslation('common')

  return (
    <Layout scroll={true}>
      <Alerts />
      {documents.length === 0 && (
        <>
          <Text fontSize="h4" typography="bold">
            {t('Trenutno nemate dokumenata')}
          </Text>
          <Text fontSize="body12">
            {t('Nakon što dodate svoj prvi dokument, on će se pojaviti ovdje')}
          </Text>
        </>
      )}
      {(
        Object.keys(DOCUMENT_CATEGORIES) as (keyof typeof DOCUMENT_CATEGORIES)[]
      ).map((category, index) => (
        <List
          key={category}
          index={index}
          category={DOCUMENT_CATEGORIES[category]}
          documents={documents.filter(
            document => document.category === DOCUMENT_CATEGORIES[category]
          )}
        />
      ))}
    </Layout>
  )
}
