import { Socket, socketSend } from "../module"

const taskWallet = async (options: Socket["task.wallet"]["request"]) => {
  const { response, error } = await socketSend("task.wallet", options)

  return { response, error }
}

export default taskWallet
