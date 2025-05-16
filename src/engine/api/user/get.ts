import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { USER_ATOM } from "engine/state"

const userGet = async (options: Socket["user.get"]["request"]) => {
  const { response, error } = await socketSend("user.get", options)

  if (error) {
    return { response, error }
  }

  setter(USER_ATOM, response)
  setter([USER_ATOM, "edit"], response)
  return { response, error }
}

export default userGet
