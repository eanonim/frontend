import { Socket, socketSend } from "../module"

const taskBoost = async (options: Socket["task.boost"]["request"]) => {
  const { response, error } = await socketSend("task.boost", options)

  return { response, error }
}

export default taskBoost
