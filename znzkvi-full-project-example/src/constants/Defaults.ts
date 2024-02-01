import { ICountry } from '@components/CountryPicker/CountryPickerModal'

const BOSNIA: ICountry = {
    id: 21,
    name: 'Bosnia',
    name_ba: 'Bosna I Hercegovina',
    code: 'BA',
    flag: 'https://media-1.api-sports.io/flags/ba.svg',
    phone_code: '+387'
}
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/

export default {
    BOSNIA,
    PASSWORD_REGEX
}
