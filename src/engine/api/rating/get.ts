import { Socket, socketSend } from "../module"
import handlerError from "../handlerError"
import { setter } from "engine/modules/smart-data"
import { RATING_ATOM } from "engine/state"

const ratingGet = async (options: Socket["rating.get"]["request"]) => {
  const { response, error } = await socketSend("rating.get", options)
  if (error) {
    handlerError(error)
    return { response, error }
  }

  setter(RATING_ATOM, "data", response)

  return { response, error }
}

export default ratingGet
