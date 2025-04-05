import { Socket, socketSend } from "../module"

const taskLink = async (options: Socket["task.link"]["request"]) => {
  const { response, error } = await socketSend("task.link", options)

  return { response, error }
}

export default taskLink
