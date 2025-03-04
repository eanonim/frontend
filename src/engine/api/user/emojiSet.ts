import { Socket, socketSend } from "../module"

const userEmojiSet = async (options: Socket["user.emojiSet"]["request"]) => {
  const { response, error } = await socketSend("user.emojiSet", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  return { response, error }
}

export default userEmojiSet
