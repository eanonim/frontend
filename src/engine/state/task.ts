import { atom } from "engine/modules/smart-data"

import { taskList } from "engine/api"
import { Socket } from "engine/api/module"

export const TASK_ATOM = atom<
  Partial<Socket["task.list"]["response"][""]>,
  Socket["task.list"]["request"]
>({
  onKey: (options) => {
    return options.group + options.lang
  },
  default: {},
  onRequested: (options, key) => {
    taskList(options)
  },
  updateIntervalMs: 60_000,
})
