import handlerError from "../handlerError"
import { Socket, socketSend } from "../module"
import ServerError from "../ServerError"

const userEmojiSet = async (options: Socket["user.emojiSet"]["request"]) => {
  let errorServer = ServerError.isEmoji()

  if (errorServer) {
    handlerError(errorServer)
    return { response: undefined, error: errorServer }
  }

  const { response, error } = await socketSend("user.emojiSet", options)

  if (error) {
    return { response, error }
  }

  return { response, error }
}

export default userEmojiSet
