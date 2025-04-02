import { atom } from "engine/modules/smart-data"

import { ratingGet } from "engine/api"
import { Socket } from "engine/api/module"

export const RATING_ATOM = atom<
  {
    data: Socket["rating.get"]["response"]
  },
  {}
>({
  default: {
    data: [],
  },
  onRequested: (options, key) => {
    ratingGet({})
  },
  updateIntervalMs: 60_000,
})
