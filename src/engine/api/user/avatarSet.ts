import { Socket, socketSend } from "../module"
import userGet from "./get"

const userAvatarSet = async (options: Socket["user.avatarSet"]["request"]) => {
  const { response, error } = await socketSend("user.avatarSet", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  if (response) {
    userGet({})
  }

  return { response, error }
}

export default userAvatarSet
