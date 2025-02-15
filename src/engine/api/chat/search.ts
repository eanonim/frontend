import { Socket, socketSend } from "../module"

const chatSearch = async (options: Socket["chat.search"]["request"]) => {
  const { response, error } = await socketSend("chat.search", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  return { response, error }
}

export default chatSearch
