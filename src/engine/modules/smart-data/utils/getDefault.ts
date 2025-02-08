const getDefault = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data))
}

export default getDefault
