import { Socket, socketSend } from "../module"

const messageList = async (
  options: Socket["message.list"]["request"],
  cbLoad?: () => void,
) => {
  const { response, error } = await socketSend("message.list", options)
  if (error) {
    return { response, error }
  }
  cbLoad?.()

  return { response, error }
}

export default messageList
