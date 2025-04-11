import { Socket, socketSend } from "../module"

const chatLast = async (options: Socket["chat.last"]["request"]) => {
  const { response, error } = await socketSend("chat.last", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }
  return { response, error }
}

export default chatLast
