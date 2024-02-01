import dayjs from 'dayjs'

export const getLeftDays = (selectedDate: string) => {
  return dayjs(selectedDate).diff(dayjs(), 'day') + 1
}

export const getDurationUntilDate = (selectedDate: string) => {
  const today = dayjs()
  const targetDate = dayjs(selectedDate, 'YYYY-MM-DD')

  const duration = targetDate.diff(today, 'day')
  const years = Math.floor(duration / 365)
  const months = Math.floor((duration % 365) / 30)
  const days = duration - years * 365 - months * 30

  let durationString = ''

  if (years !== 0) {
    durationString += `${years} godin${years > 1 && years < 5 ? 'e' : 'a'}, `
  }

  if (months !== 0) {
    durationString += `${months} mjesec${
      months === 1 ? '' : months > 1 && months < 5 ? 'a' : 'i'
    } i `
  }

  durationString += `${days + 1} dan${days === 0 ? '' : 'a'}`

  return `Još ${durationString} do isteka`
}
