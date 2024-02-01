import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native'

interface AddNotificationProps {
  date: Date
  title: string
  body: string
}

export const addNotification = async ({
  date,
  title,
  body
}: AddNotificationProps) => {
  const devDate = new Date()
  devDate.setSeconds(devDate.getSeconds() + 1)

  const channelId = await notifee.createChannel({
    id: 'docualert',
    name: 'DocuAlert Channel'
  })

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: __DEV__ ? devDate.getTime() : date.getTime()
  }

  await notifee.createTriggerNotification(
    {
      title: title,
      body: body,
      android: {
        channelId,
        pressAction: {
          id: 'docualert'
        }
      }
    },
    trigger
  )
}
