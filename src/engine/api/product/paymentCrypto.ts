import { Socket, socketSend } from "../module"
import handlerError from "../handlerError"

const paymentCrypto = async (options: Socket["payment.crypto"]["request"]) => {
  const { response, error } = await socketSend("payment.crypto", options)
  if (error) {
    handlerError(error)
    return { response, error }
  }

  return { response, error }
}

export default paymentCrypto
