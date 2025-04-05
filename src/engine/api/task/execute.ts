import { getLocale } from "engine/languages"
import { Socket, socketSend } from "../module"
import taskList from "./list"
import handlerError from "../handlerError"

const taskExecute = async (
  options: Socket["task.execute"]["request"] & Socket["task.list"]["request"],
) => {
  const { response, error } = await socketSend("task.execute", options)

  if (error) {
    handlerError(error)
  }

  if (response?.result) {
    taskList({ group: options.group, lang: getLocale() })
  }

  return { response, error }
}

export default taskExecute
