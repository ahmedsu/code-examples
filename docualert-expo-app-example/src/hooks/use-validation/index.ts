export const useValidation = () => {
  const isNameValid = (name: string) => {
    const regex = /^[a-zA-Z šđčćžŠĐČĆŽ]{2,30}$/
    return regex.test(name)
  }

  return {
    isNameValid
  }
}
