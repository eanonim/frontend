import { Socket, socketSend } from "../module"
import handlerError from "../handlerError"

const paymentCrypto = async (options: Socket["payment.coin"]["request"]) => {
  const { response, error } = await socketSend("payment.coin", options)
  if (error) {
    handlerError(error)
    return { response, error }
  }

  return { response, error }
}

export default paymentCrypto
