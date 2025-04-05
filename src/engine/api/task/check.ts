import { bridgeOpenLink, bridgeOpenTgLink } from "@apiteam/twa-bridge/solid"
import { Socket, socketSend } from "../module"
import taskData from "./data"
import taskList from "./list"
import { getLocale } from "engine/languages"
import userGet from "../user/get"
import handlerError from "../handlerError"
import taskSub from "./sub"
import taskBoost from "./boost"
import taskWallet from "./wallet"
import taskLink from "./link"
import taskApp from "./app"

const taskCheck = async (
  options: Socket["task.sub"]["request"] &
    Socket["task.list"]["request"] & {
      action: Socket["task.list"]["response"][""]["tasks"][0][0]["action"]
    },
) => {
  const handler = async () => {
    const { response, error } = await taskData({ task: options.task })
    if (response) {
      if ((response.url.match("t.me") || [])?.length >= 1) {
        bridgeOpenTgLink({
          path_full: response.url
            .replace("https://t.me/", "")
            .replace("http://t.me/", ""),
        })
      } else {
        bridgeOpenLink({
          url: response.url,
        })
      }

      await taskList({ lang: getLocale(), group: options.group })
      return { response, error }
    }
    return { response, error }
  }

  const handlerSuccess = async (response: { result: boolean }) => {
    const { error } = await handler()
    if (!!error) {
      handlerError(error)
      return { error }
    }

    if (response.result) {
      await taskList({ lang: getLocale(), group: options.group })
      await userGet({})
    }
  }

  if (options.action === "sub") {
    const { response, error } = await taskSub({ task: options.task })
    if (error) {
      handlerError(error)
    } else if (response) {
      handlerSuccess(response)
    }

    return { response, error }
  }

  if (options.action === "boost") {
    const { response, error } = await taskBoost({ task: options.task })
    if (error) {
      handlerError(error)
    } else if (response) {
      handlerSuccess(response)
    }

    return { response, error }
  }

  if (options.action === "wallet") {
    const { response, error } = await taskWallet({ task: options.task })

    if (error) {
      handlerError(error)
    } else if (response) {
      handlerSuccess(response)
    }

    return { response, error }
  }

  if (options.action === "link") {
    const { response, error } = await taskLink({ task: options.task })
    if (error) {
      handlerError(error)
    } else if (response) {
      handlerSuccess(response)
    }

    return { response, error }
  }

  if (options.action === "app") {
    const { response, error } = await taskApp({ task: options.task })
    if (error) {
      handlerError(error)
    } else if (response) {
      handlerSuccess(response)
    }

    return { response, error }
  }

  if (options.action === "integration") {
    return await handler()
  }
}

export default taskCheck
