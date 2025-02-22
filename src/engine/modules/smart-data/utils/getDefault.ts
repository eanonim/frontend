import { unlink } from "@minsize/utils"

const getDefault = <T>(data: (() => T) | T): T => {
  if (typeof data === "function") {
    return (data as any)?.()
  }

  return unlink(data)
}

export default getDefault
