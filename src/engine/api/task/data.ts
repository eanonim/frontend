import { Socket, socketSend } from "../module"

const taskData = async (options: Socket["task.data"]["request"]) => {
  const { response, error } = await socketSend("task.data", options)

  return { response, error }
}

export default taskData
