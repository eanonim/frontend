const getDefault = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data))
  // return Array.isArray(data) ? ([...data] as T) : Object.assign({}, data)
}

export default getDefault
