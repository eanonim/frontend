import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { TASK_ATOM } from "engine/state"

const taskList = async (options: Socket["task.list"]["request"]) => {
  const { response, error } = await socketSend("task.list", options)

  if (response) {
    setter([TASK_ATOM, options.group + options.lang], response)
  }

  return { response, error }
}

export default taskList
