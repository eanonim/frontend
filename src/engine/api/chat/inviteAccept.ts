import { Socket, socketSend } from "../module"

const inviteAccept = async (
  options: Socket["chat.inviteAccept"]["request"],
) => {
  const { response, error } = await socketSend("chat.inviteAccept", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  return { response, error }
}

export default inviteAccept
