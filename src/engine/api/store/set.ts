import handlerError from "../handlerError"
import ServerError from "../ServerError"
import { Socket, socketSend } from "../module"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"

const debounces: Record<
  string,
  Scheduled<[options: Socket["store.set"]["request"]]>
> = {}

const storeSet = async (options: Socket["store.set"]["request"]) => {
  let func = debounces[options.key]
  if (!func) {
    func = debounces[options.key] = debounce(
      async (options: Socket["store.set"]["request"]) => {
        let errorServer

        if (options.key === "backgroundId") {
          errorServer = ServerError.isBackgroundId(options.value)
        } else if (options.key === "themeColor") {
          errorServer = ServerError.isThemeColor(options.value)
        }

        try {
          if (errorServer) {
            return { response: undefined, error: errorServer }
          }
          options.value = String(options.value)
          const { response, error } = await socketSend("store.set", options)

          if (error) {
            errorServer = error
          }

          return { response, error }
        } finally {
          if (errorServer) {
            handlerError(errorServer)
          }
        }
      },
      2000,
    )
  }

  func(options)
}

export default storeSet
