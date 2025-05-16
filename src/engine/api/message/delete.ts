import { Socket, socketSend } from "../module"

const messageDelete = async (options: Socket["message.delete"]["request"]) => {
  const { response, error } = await socketSend("message.delete", options)
  if (error) {
    return { response, error }
  }

  return { response, error }
}

export default messageDelete
