import { getAppData } from "@apiteam/twa-bridge/solid"
import { _fetch, type RequestError } from "../module/sender"
import { Mutex } from "@minsize/mutex"

export type Request = {
  referrer?: string
}

export type Response = {
  token: string
}

const mutex = Mutex()

const authTwa = async (
  body: Request,
): Promise<
  | { response: Response; error: undefined }
  | { response: undefined; error: RequestError }
> => {
  const resolve = await mutex.wait()
  let hash = getAppData()
  if (!hash && !!import.meta.env.TELEGRAM_SIGN) {
    hash = import.meta.env.TELEGRAM_SIGN
  }

  const { error, response } = await _fetch<Response, Request>({
    name: `/v1/auth.tma?${hash}`,
    method: "POST",
    body,
  })

  if (error) {
    if (error.code === 2) {
      setTimeout(resolve, 2000)
      return await authTwa(body)
    }
    resolve()
    return { response, error }
  }
  resolve()
  return { response, error }
}

export default authTwa
