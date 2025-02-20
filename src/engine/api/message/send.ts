import { Socket, socketSend } from "../module"

const messageSend = async (options: Socket["message.send"]["request"]) => {
  const { response, error } = await socketSend("message.send", options)
  // setter([MESSAGE_INFO_ATOM,options.dialog], (messages) => {
  //   messages.push({
  //     id: Math.random(),
  //     message: options.message.message,
  //   })

  //   return messages
  // })

  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageSend
