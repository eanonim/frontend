import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { USER_ATOM } from "engine/state"

const userGet = async (options: Socket["user.get"]["request"]) => {
  const { response, error } = await socketSend("user.get", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  response.image = "https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg"

  setter(USER_ATOM, response)
  setter([USER_ATOM, "edit"], response)
  return { response, error }
}

export default userGet
