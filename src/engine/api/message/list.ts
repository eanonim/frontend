import { Socket, socketSend } from "../module"

const messageList = async (options: Socket["message.list"]["request"]) => {
  const { response, error } = await socketSend("message.list", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageList
