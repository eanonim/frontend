import { Socket, socketSend } from "../module"

const inviteReject = async (
  options: Socket["chat.inviteReject"]["request"],
) => {
  const { response, error } = await socketSend("chat.inviteReject", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  return { response, error }
}

export default inviteReject
