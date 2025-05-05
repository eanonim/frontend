const isLockTime = (value?: Date): boolean => {
  if (!value) return false
  return value?.getTime() >= Date.now()
}

export default isLockTime
