import handlerError from "../handlerError"
import ServerError from "../ServerError"
import { Socket, SocketError, socketSend } from "../module"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"

const debounces: Record<
  string,
  Scheduled<
    [
      resolve: (
        value:
          | { error: SocketError; response: undefined }
          | { error: undefined; response: Socket["store.set"]["response"] },
      ) => void,
      options: Socket["store.set"]["request"],
    ]
  >
> = {}

const storeSet = async (options: Socket["store.set"]["request"]) => {
  let key = String(options.key)

  if (options.key === "interest") {
    key = options.key + options.value
  }

  let func = debounces[key]
  if (!func) {
    func = debounces[key] = debounce(
      async (
        resolve: (
          value:
            | { error: SocketError; response: undefined }
            | { error: undefined; response: Socket["store.set"]["response"] },
        ) => void,
        options: Socket["store.set"]["request"],
      ) => {
        options.value = String(options.value)
        const { response, error } = await socketSend("store.set", options)

        resolve({ response, error } as any)
      },
      800,
    )
  }

  return await new Promise<
    | { error: SocketError; response: undefined }
    | { error: undefined; response: Socket["store.set"]["response"] }
  >((resolve) => {
    let errorServer

    if (options.key === "backgroundId") {
      errorServer = ServerError.isBackgroundId(options.value)
    } else if (options.key === "themeColor") {
      errorServer = ServerError.isThemeColor(options.value)
    }

    if (errorServer) {
      resolve({ response: undefined, error: errorServer } as any)
      handlerError(errorServer)
      return
    }

    func(resolve, options)
  })
}

export default storeSet
