import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { USER_ATOM } from "engine/state"

const userGet = async (options: Socket["user.get"]["request"]) => {
  const { response, error } = await socketSend("user.get", options)

  console.log("user.get")
  if (error) {
    console.log({ error })
    return
  }

  setter(USER_ATOM, "id", response.id)
}

export default userGet
