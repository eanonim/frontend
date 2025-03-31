import { _fetch, type RequestError } from "../module/sender"
import { Mutex } from "@minsize/mutex"
import { getter } from "elum-state/solid"
import { AUTH_TOKEN_ATOM } from "engine/state"
import { HOST_CDN } from "root/configs"
import handlerError from "../handlerError"

export type Request = FormData

export type Response = {
  id: string
  user: number
  type: string
  hash: string
  created_at: Date
  updated_at: Date
}

const mutex = Mutex()

const imageUpload = async (
  body: Request,
): Promise<
  | { response: Response; error: undefined }
  | { response: undefined; error: RequestError }
> => {
  const resolve = await mutex.wait()

  let data = await _fetch<Response, Request>({
    host: HOST_CDN,
    name: `/v1/image.upload?${getter(AUTH_TOKEN_ATOM)}`,
    method: "POST",
    body,
  })

  if (data.error) {
    handlerError(data.error)
  }

  resolve()
  return data
}

export default imageUpload
