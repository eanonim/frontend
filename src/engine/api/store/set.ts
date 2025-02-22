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
        let errorServer

        if (options.key === "backgroundId") {
          errorServer = ServerError.isBackgroundId(options.value)
        } else if (options.key === "themeColor") {
          errorServer = ServerError.isThemeColor(options.value)
        }

        try {
          if (errorServer) {
            resolve({ response: undefined, error: errorServer } as any)
            return
          }
          options.value = String(options.value)
          const { response, error } = await socketSend("store.set", options)

          if (error) {
            errorServer = error
          }

          if (response?.result) {
            if (options.key === "themeColor") {
              document.documentElement.setAttribute(
                "theme-color",
                options.value,
              )
            }
          }

          resolve({ response, error } as any)
          return
        } finally {
          if (errorServer) {
            handlerError(errorServer)
          }
        }
      },
      2000,
    )
  }

  return await new Promise<
    | { error: SocketError; response: undefined }
    | { error: undefined; response: Socket["store.set"]["response"] }
  >((resolve) => {
    func(resolve, options)
  })
}

export default storeSet
