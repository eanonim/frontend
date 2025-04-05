import { Socket, socketSend } from "../module"

const taskSub = async (options: Socket["task.sub"]["request"]) => {
  const { response, error } = await socketSend("task.sub", options)

  return { response, error }
}

export default taskSub
