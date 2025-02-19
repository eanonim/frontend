import { Socket, socketSend } from "../module"

const messageRead = async (options: Socket["message.read"]["request"]) => {
  const { response, error } = await socketSend("message.read", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageRead
