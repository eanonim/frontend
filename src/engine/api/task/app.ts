import { Socket, socketSend } from "../module"

const taskApp = async (options: Socket["task.app"]["request"]) => {
  const { response, error } = await socketSend("task.app", options)

  return { response, error }
}

export default taskApp
