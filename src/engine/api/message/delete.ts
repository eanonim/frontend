import { Socket, socketSend } from "../module"

const messageDelete = async (options: Socket["message.delete"]["request"]) => {
  const { response, error } = await socketSend("message.delete", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageDelete
