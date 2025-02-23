const isPremium = (value?: Date): boolean => {
  if (!value) return false
  return value?.getTime() >= Date.now()
}

export default isPremium
