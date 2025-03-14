import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { PRODUCT_ATOM } from "engine/state"
import handlerError from "../handlerError"

const productGet = async (options: Socket["product.get"]["request"]) => {
  const { response, error } = await socketSend("product.get", options)
  if (error) {
    handlerError(error)
    return { response, error }
  }

  if (response) {
    for (const product of response[options.group].product || []) {
      if (!product.title) product.title = "undefined"
    }

    setter(
      [PRODUCT_ATOM, options.group + options.currency + options.lang],
      response[options.group],
    )
  }

  return { response, error }
}

export default productGet
