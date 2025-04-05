import { Socket, socketSend } from "../module"

const taskIntegration = async (
  options: Socket["task.integration"]["request"],
) => {
  const { response, error } = await socketSend("task.integration", options)

  return { response, error }
}

export default taskIntegration
