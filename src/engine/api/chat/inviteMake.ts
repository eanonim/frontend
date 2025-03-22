import { Socket, socketSend } from "../module"

const chatInviteMake = async (
  options: Socket["chat.inviteMake"]["request"],
) => {
  const { response, error } = await socketSend("chat.inviteMake", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  return { response, error }
}

export default chatInviteMake
