import { Socket, socketSend } from "../module"

const taskAds = async (options: Socket["task.ads"]["request"]) => {
  const { response, error } = await socketSend("task.ads", options)

  return { response, error }
}

export default taskAds
