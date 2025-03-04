import { Socket, socketSend } from "../module"

const userNameSet = async (options: Socket["user.nameSet"]["request"]) => {
  const { response, error } = await socketSend("user.nameSet", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  return { response, error }
}

export default userNameSet
